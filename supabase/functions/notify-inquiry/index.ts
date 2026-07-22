// ============================================================================
// Orbital360 PM Tool — Edge Function: notify-inquiry
// Sends an email to hello@efqmassessors.ae every time a web form inquiry
// is inserted, using Brevo's transactional API.
//
// Deploy (JWT off — it is called by a Database Webhook, not by users):
//   supabase functions deploy notify-inquiry --no-verify-jwt
//   supabase secrets set WEBHOOK_SECRET=<random-long-string>
//   (BREVO_API_KEY is already set for brevo-sync)
//
// Then create the webhook in the Dashboard:
//   Database → Webhooks → Create:
//     Table: public.inquiries · Events: INSERT
//     Type: Supabase Edge Function → notify-inquiry
//     HTTP Header:  x-webhook-secret: <the same random string>
// ============================================================================

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

Deno.serve(async (req) => {
  try {
    // shared-secret check — rejects anything that is not our webhook
    const secret = Deno.env.get("WEBHOOK_SECRET");
    if (secret && req.headers.get("x-webhook-secret") !== secret) {
      return json({ error: "forbidden" }, 403);
    }

    const payload = await req.json();
    const r = payload?.record;
    if (payload?.type !== "INSERT" || !r) return json({ ok: true, skipped: true });

    const key = Deno.env.get("BREVO_API_KEY");
    if (!key) return json({ error: "BREVO_API_KEY not set" }, 500);

    const name = r.name || `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || "—";
    const subject = `New inquiry — ${name}${r.organisation ? " · " + r.organisation : ""}`;

    const html = `
      <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#0b2530">
        <h2 style="margin:0 0 12px">New website inquiry</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          <tr><td><b>Name</b></td><td>${esc(name)}</td></tr>
          <tr><td><b>Email</b></td><td><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td></tr>
          <tr><td><b>Phone</b></td><td>${esc(r.phone || "—")}</td></tr>
          <tr><td><b>Company</b></td><td>${esc(r.organisation || "—")}</td></tr>
          <tr><td><b>Source</b></td><td>${esc(r.source || "web-form")}</td></tr>
          <tr><td valign="top"><b>Message</b></td><td>${esc(r.message)}</td></tr>
        </table>
        <p style="margin:16px 0 0;color:#7c8f97;font-size:12px">
          Reply directly to this email to answer the sender.
          The inquiry is also in Orbital360 → Users → Contacts, ready to import to the CRM.
        </p>
      </div>`;

    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { name: "EFQM Assessors Website", email: "hello@efqmassessors.ae" },
        to: [{ email: "hello@efqmassessors.ae", name: "EFQM & Strategy Assessors" }],
        replyTo: { email: r.email, name },
        subject,
        htmlContent: html,
      }),
    });

    const ok = resp.status === 201 || resp.ok;
    return json({ ok, status: resp.status, detail: ok ? null : await resp.text() });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
