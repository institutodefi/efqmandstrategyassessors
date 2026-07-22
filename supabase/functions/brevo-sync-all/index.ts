// ============================================================================
// Orbital360 PM Tool — Edge Function: brevo-sync-all
// Sincronización AUTOMÁTICA con Brevo (invocada por pg_cron cada 10 min).
// Sube todos los contactos con marketing_consent cuya última edición sea
// posterior a su última sincronización (o nunca sincronizados).
//
// Deploy:   supabase functions deploy brevo-sync-all --no-verify-jwt
// Secrets:  supabase secrets set BREVO_API_KEY=xkeysib-...
//           supabase secrets set CRON_SECRET=<cadena-larga-aleatoria>
//           (BREVO_LIST_ID opcional, compartido con brevo-sync)
// Seguridad: sin JWT; exige cabecera x-cron-secret == CRON_SECRET.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  try {
    const secret = Deno.env.get("CRON_SECRET");
    if (!secret || req.headers.get("x-cron-secret") !== secret) {
      return json({ error: "forbidden" }, 403);
    }
    const key = Deno.env.get("BREVO_API_KEY");
    if (!key) return json({ error: "BREVO_API_KEY not set" }, 500);

    // Service role: lectura/escritura directa, sin sesión de usuario.
    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Pendientes: consentimiento de marketing, sin borrado RGPD, y
    // nunca sincronizados o editados después de la última sincronización.
    const { data: rows, error } = await db
      .from("contacts")
      .select("id, first_name, last_name, email, phone, company_name, brevo_synced_at, updated_at")
      .eq("marketing_consent", true)
      .eq("erasure_requested", false)
      .or("brevo_synced_at.is.null,updated_at.gt.brevo_synced_at")
      .limit(200); // lote por ejecución; el cron drena la cola en pasadas
    if (error) return json({ error: error.message }, 500);
    if (!rows?.length) return json({ ok: true, synced: 0, pending: 0 });

    const listId = Number(Deno.env.get("BREVO_LIST_ID") || "");
    const okIds: string[] = [];
    let firstErr: string | null = null;

    for (const r of rows) {
      const body: Record<string, unknown> = {
        email: r.email,
        updateEnabled: true,
        attributes: {
          FIRSTNAME: r.first_name ?? "",
          LASTNAME: r.last_name ?? "",
          COMPANY: r.company_name ?? "",
          ...(r.phone ? { SMS: r.phone } : {}),
        },
      };
      if (listId) body.listIds = [listId];
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // 201 creado · 204 actualizado · "duplicate" también es éxito de upsert
      if (res.ok || res.status === 204) okIds.push(r.id);
      else {
        const detail = await res.text().catch(() => "");
        if (res.status === 400 && detail.includes("duplicate")) okIds.push(r.id);
        else if (!firstErr) firstErr = `${res.status} ${detail.slice(0, 160)}`;
      }
    }

    if (okIds.length) {
      await db.from("contacts")
        .update({ brevo_synced_at: new Date().toISOString() })
        .in("id", okIds);
    }
    return json({
      ok: !firstErr,
      synced: okIds.length,
      failed: rows.length - okIds.length,
      firstErr,
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
