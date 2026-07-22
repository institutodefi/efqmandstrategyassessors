-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 06
--   · Companies: estado 'success' en el CRM
--   · Formularios web: teléfono (cell, opcional) en inquiries
--   · Importación v3: teléfono incluido
-- Ejecutar DESPUÉS de migration-05. Re-ejecutable.
-- ============================================================================

-- 1) Estado 'success' para empresas
alter table public.accounts drop constraint if exists accounts_crm_status_check;
alter table public.accounts add constraint accounts_crm_status_check
  check (crm_status in ('lead','prospect','active','success','on_hold','closed'));

-- 2) Teléfono opcional en los formularios web
alter table public.inquiries
  add column if not exists phone text;

-- 3) Importación v3 — lleva también el teléfono
create or replace function public.import_inquiries_to_contacts()
returns int
language plpgsql security definer set search_path = public
as $$
declare v_count int;
begin
  if auth.uid() is not null and not public.is_admin_or_above() then
    raise exception 'Not allowed';
  end if;
  insert into public.contacts
        (first_name, last_name, email, phone, company_name, company_id,
         consent, consent_at, consent_source, notes)
  select coalesce(nullif(i.first_name,''), split_part(i.name,' ',1), '—'),
         coalesce(nullif(i.last_name,''),
                  nullif(substr(i.name, length(split_part(i.name,' ',1)) + 2),''), '—'),
         lower(i.email),
         nullif(i.phone,''),
         nullif(i.organisation,''),
         a.id,
         true, i.created_at,
         coalesce(nullif(i.source,''), 'web-form'),
         left(i.message, 500)
    from public.inquiries i
    left join public.accounts a
      on lower(a.name) = lower(i.organisation)
   where i.email is not null
  on conflict (lower(email)) do update
    set phone        = coalesce(public.contacts.phone,        excluded.phone),
        company_name = coalesce(public.contacts.company_name, excluded.company_name),
        company_id   = coalesce(public.contacts.company_id,   excluded.company_id);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- VERIFICAR:
--   select conname from pg_constraint where conname = 'accounts_crm_status_check';
--   update una empresa a 'success' desde la app y comprueba el pill verde.
