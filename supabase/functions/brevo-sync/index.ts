// ============================================================================
// Orbital360 PM Tool — Edge Function: brevo-sync
// Live sync of CRM contacts with Brevo (upsert / delete).
// Deploy:   supabase functions deploy brevo-sync
// Secrets:  supabase secrets set BREVO_API_KEY=xkeysib-...
//           supabase secrets set BREVO_LIST_ID=3        (optional)
// The Brevo API key NEVER touches the browser — it lives here.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    // ---- authn + authz: only staff roles may sync ----
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);
    const { data: prof } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    if (!["superadmin", "admin", "account_manager"].includes(prof?.role ?? "")) {
      return json({ error: "forbidden" }, 403);
    }

    const { action, contact } = await req.json();
    const key = Deno.env.get("BREVO_API_KEY");
    if (!key) return json({ error: "BREVO_API_KEY not set" }, 500);
    if (!contact?.email) return json({ error: "email required" }, 400);

    // ---- GDPR delete ----
    if (action === "delete") {
      const r = await fetch(
        `https://api.brevo.com/v3/contacts/${encodeURIComponent(contact.email)}`,
        { method: "DELETE", headers: { "api-key": key } },
      );
      return json({ ok: r.ok || r.status === 404, status: r.status });
    }

    // ---- upsert (create or update) ----
    const listId = Number(Deno.env.get("BREVO_LIST_ID") || "");
    const attributes: Record<string, string> = {
      FIRSTNAME: contact.first_name ?? "",
      LASTNAME: contact.last_name ?? "",
      COMPANY: contact.company ?? "",
    };
    // SMS must be E.164 (+9715xxxxxxxx); send it only if it looks valid
    if (contact.phone && /^\+\d{8,15}$/.test(contact.phone.replace(/[\s()-]/g, ""))) {
      attributes.SMS = contact.phone.replace(/[\s()-]/g, "");
    }
    const body: Record<string, unknown> = {
      email: String(contact.email).toLowerCase(),
      updateEnabled: true,
      attributes,
    };
    if (Number.isFinite(listId) && listId > 0) body.listIds = [listId];

    let r = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    // If Brevo rejects the SMS (duplicate/invalid), retry without it
    if (!r.ok && r.status !== 204 && attributes.SMS) {
      delete attributes.SMS;
      r = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    const ok = r.ok || r.status === 204;
    const detail = ok ? null : await r.text();
    if (!ok) console.log("brevo-fail", r.status, detail);   // visible in Logs
    return json({ ok, status: r.status, detail });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
