-- ============================================================================
-- MIGRATION 25 · Sincronización automática con Brevo cada 10 minutos
--   1) Trigger que mantiene contacts.updated_at al día (para detectar cambios).
--   2) pg_cron + pg_net invocando la Edge Function brevo-sync-all cada 10 min.
--
-- ANTES DE EJECUTAR, sustituye los 2 marcadores:
--   __PROJECT_REF__   → la referencia del proyecto (Settings → General → Reference ID)
--   __CRON_SECRET__   → la misma cadena que pongas en:
--                       supabase secrets set CRON_SECRET=...
-- Y despliega la función:  supabase functions deploy brevo-sync-all --no-verify-jwt
-- ============================================================================

-- 1) updated_at automático en contacts -------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_contacts_touch on public.contacts;
create trigger trg_contacts_touch
  before update on public.contacts
  for each row execute function public.touch_updated_at();

-- 2) extensiones de programación --------------------------------------------
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;

-- 3) job cada 10 minutos -----------------------------------------------------
-- (re-ejecutable: borra el job previo si existe)
do $$
begin
  perform cron.unschedule('brevo-sync-10m');
exception when others then null;
end $$;

select cron.schedule(
  'brevo-sync-10m',
  '*/10 * * * *',
  $$
  select net.http_post(
    url     := 'https://__PROJECT_REF__.supabase.co/functions/v1/brevo-sync-all',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', '__CRON_SECRET__'
    ),
    body    := '{}'::jsonb
  );
  $$
);

-- 4) VERIFICACIÓN ------------------------------------------------------------
-- Job programado:
select jobid, jobname, schedule, active from cron.job where jobname = 'brevo-sync-10m';
-- Tras 10-20 min, historial de ejecuciones:
--   select * from cron.job_run_details order by start_time desc limit 5;
-- Y en la tabla: contacts.brevo_synced_at debe avanzar solo.
