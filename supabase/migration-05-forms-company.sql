-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 05
--   · Web forms → CRM: company en inquiries y contacts, con origen (source)
--   · Importación mejorada: enlaza empresa existente por nombre
-- Ejecutar DESPUÉS de migration-04. Re-ejecutable.
-- ============================================================================

-- inquiries: procedencia del mensaje (blog, contact, request…)
alter table public.inquiries
  add column if not exists source text;

-- contacts: nombre de empresa "en bruto" cuando aún no está enlazada a una
-- ficha de accounts (los formularios web no traen VAT ni dirección).
alter table public.contacts
  add column if not exists company_name text;

-- Importación v2: lleva la empresa y el origen; si el nombre coincide
-- exactamente con una empresa ya dada de alta, la enlaza (company_id).
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
         null,
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
    set company_name = coalesce(public.contacts.company_name, excluded.company_name),
        company_id   = coalesce(public.contacts.company_id,   excluded.company_id);
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- VERIFICAR:
--   select name, organisation, source from public.inquiries order by created_at desc limit 5;
--   select first_name, last_name, company_name, company_id from public.contacts limit 5;
