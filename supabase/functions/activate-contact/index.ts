// ============================================================================
// Orbital360 PM Tool — Edge Function: activate-contact
// Turns a CRM contact into a platform user:
//   1) pre-authorises the email with the requested role (authorized_users)
//   2) invites the user via email (Supabase Auth invite → your Brevo template)
//   3) copies phone/company from the contact into the new profile
// Caller must be admin/superadmin; only superadmin can grant admin roles.
// Deploy:  supabase functions deploy activate-contact
// (SUPABASE_SERVICE_ROLE_KEY is injected automatically — never expose it.)
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    // Caller identity (anon client with the user's JWT)
    const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);
    const { data: prof } = await caller.from("profiles").select("role").eq("id", user.id).single();
    const callerRole = prof?.role ?? "";
    if (!["superadmin", "admin"].includes(callerRole)) return json({ error: "forbidden" }, 403);

    const { contact_id, role = "client", redirect_to } = await req.json();
    if (!contact_id) return json({ error: "contact_id required" }, 400);
    if (["superadmin", "admin"].includes(role) && callerRole !== "superadmin") {
      return json({ error: "Only the superadministrator can grant admin roles" }, 403);
    }

    // Admin client (service role) — full access, server-side only
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: c, error: cErr } = await admin.from("contacts")
      .select("id, first_name, last_name, email, phone, company_id, erasure_requested")
      .eq("id", contact_id).single();
    if (cErr || !c) return json({ error: "contact not found" }, 404);
    if (c.erasure_requested) return json({ error: "contact was GDPR-erased" }, 400);
    const email = String(c.email).toLowerCase();

    // 1) pre-authorise with the requested role (drives the signup trigger)
    await admin.from("authorized_users").upsert({
      email, first_name: c.first_name, last_name: c.last_name,
      role, authorized: true, created_by: user.id,
    });

    // Already a user? → just apply role + data, no invite
    const { data: existing } = await admin.from("profiles")
      .select("id").ilike("email", email).maybeSingle();
    if (existing) {
      await admin.from("profiles").update({
        role,
        phone: c.phone ?? undefined,
        company_id: c.company_id ?? undefined,
        first_name: c.first_name, last_name: c.last_name,
        full_name: `${c.first_name} ${c.last_name}`.trim(),
      }).eq("id", existing.id);
      return json({ ok: true, existed: true, user_id: existing.id });
    }

    // 2) invite → sends the "Invite user" email (your Orbital360 template)
    const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
      data: {
        first_name: c.first_name, last_name: c.last_name,
        full_name: `${c.first_name} ${c.last_name}`.trim(),
      },
      redirectTo: redirect_to || undefined,
    });
    if (invErr) return json({ error: invErr.message }, 400);

    // 3) enrich the profile created by the trigger
    await admin.from("profiles").update({
      phone: c.phone ?? null,
      company_id: c.company_id ?? null,
      role,
    }).eq("id", invited.user.id);

    return json({ ok: true, invited: true, user_id: invited.user.id });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
