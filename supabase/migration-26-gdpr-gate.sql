-- ============================================================================
-- MIGRATION 26 · Circuito RGPD en el primer acceso
--   · profiles: registro de aceptación de políticas + opt-in de marketing.
--   · RPC accept_policies(marketing): graba la aceptación con fecha y versión,
--     crea/actualiza la ficha CRM del usuario y fija su consentimiento de
--     marketing — el cron brevo-sync-all la sube sola en la siguiente pasada.
-- Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

alter table public.profiles
  add column if not exists policies_accepted_at timestamptz,
  add column if not exists policies_version     text,
  add column if not exists marketing_opt_in     boolean not null default false;

create or replace function public.accept_policies(p_marketing boolean default true)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_email text;
  v_name  text;
begin
  select email, coalesce(full_name, split_part(email, '@', 1))
    into v_email, v_name
    from public.profiles where id = auth.uid();
  if v_email is null then
    raise exception 'profile not found';
  end if;

  update public.profiles
     set policies_accepted_at = now(),
         policies_version     = '2026-07-19',   -- = LEGAL_UPDATED del sitio
         marketing_opt_in     = p_marketing
   where id = auth.uid();

  -- Ficha CRM del usuario (crear si no existe; nunca tocar borrados RGPD)
  insert into public.contacts
    (first_name, last_name, email, consent, marketing_consent, consent_source)
  values
    (split_part(v_name, ' ', 1),
     nullif(trim(substr(v_name, length(split_part(v_name, ' ', 1)) + 1)), ''),
     v_email, true, p_marketing, 'signup')
  on conflict (lower(email)) do update
    set consent           = true,
        marketing_consent = case when contacts.erasure_requested then false
                                 else excluded.marketing_consent end,
        consent_source    = coalesce(contacts.consent_source, 'signup'),
        updated_at        = now();
end;
$$;

grant execute on function public.accept_policies(boolean) to authenticated;

-- Backfill opcional (comentado): dar por aceptadas las cuentas internas ya
-- existentes para no mostrarles la puerta. Recomendado NO usarlo: que cada
-- usuario acepte una vez deja el registro de consentimiento completo.
-- update public.profiles set policies_accepted_at = now(),
--        policies_version = '2026-07-19'
--  where lower(email) in ('alejandro@efqmassessors.ae');

-- Verificación
select email, policies_accepted_at, policies_version, marketing_opt_in
from public.profiles order by created_at desc limit 10;
