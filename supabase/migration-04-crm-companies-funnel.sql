-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 04
--   · COMPANIES: accounts ampliadas → NAME, VAT, Address, Primary contact
--   · CONTACTS (CRM) con GDPR + enlace Brevo
--   · FUNNEL: subscriptions (empresa compra producto) + user_product_access
--   · profiles: cell (phone) + company
-- Ejecutar DESPUÉS de migration-03. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) COMPANIES — la tabla accounts se amplía a ficha de empresa completa
-- ----------------------------------------------------------------------------
alter table public.accounts
  add column if not exists vat             text,
  add column if not exists address         text,
  add column if not exists city            text,
  add column if not exists website         text,
  add column if not exists primary_contact uuid;    -- FK a contacts (se añade abajo)

create unique index if not exists accounts_vat_uq
  on public.accounts (lower(vat)) where vat is not null and vat <> '';

-- ----------------------------------------------------------------------------
-- 2) CONTACTS — CRM con cumplimiento GDPR y enlace a Brevo
-- ----------------------------------------------------------------------------
create table if not exists public.contacts (
  id                uuid primary key default gen_random_uuid(),
  first_name        text not null,
  last_name         text not null,
  email             text not null,
  phone             text,                                   -- cell (optional)
  company_id        uuid references public.accounts (id) on delete set null,
  position          text,
  -- GDPR
  consent           boolean not null default false,          -- base legal: consentimiento
  consent_at        timestamptz,
  consent_source    text,                                    -- p.ej. 'web-form', 'import', 'event'
  marketing_consent boolean not null default false,          -- newsletter / comercial
  erasure_requested boolean not null default false,          -- derecho de supresión
  -- Brevo
  brevo_synced_at   timestamptz,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users (id)
);

create unique index if not exists contacts_email_uq on public.contacts (lower(email));

-- FK del contacto principal de la empresa (ya existe la columna)
do $$ begin
  alter table public.accounts
    add constraint accounts_primary_contact_fk
    foreign key (primary_contact) references public.contacts (id) on delete set null;
exception when duplicate_object then null;
end $$;

-- Los mensajes web (inquiries) se convierten en contactos con un clic desde la
-- app, o en bloque con esta función:
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
        (first_name, last_name, email, consent, consent_at, consent_source, notes)
  select coalesce(nullif(i.first_name,''), split_part(i.name,' ',1), '—'),
         coalesce(nullif(i.last_name,''),
                  nullif(substr(i.name, length(split_part(i.name,' ',1)) + 2),''), '—'),
         lower(i.email),
         true, i.created_at, 'web-form',
         left(i.message, 500)
    from public.inquiries i
   where i.email is not null
  on conflict (lower(email)) do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3) FUNNEL — la empresa compra un producto (zona) y se asigna acceso
-- ----------------------------------------------------------------------------
-- Paso 1 del funnel: suscripción del producto a la empresa + contacto principal
create table if not exists public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  account_id         uuid not null references public.accounts (id) on delete cascade,
  zone_code          text not null references public.zones (code),
  status             text not null default 'active'
                     check (status in ('trial','active','suspended','expired','cancelled')),
  primary_contact_id uuid references public.contacts (id) on delete set null,
  start_date         date not null default current_date,
  end_date           date,
  seats              int,                       -- nº de usuarios contratados (opcional)
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (account_id, zone_code)
);

-- Paso 2 del funnel: usuarios con permisos dentro del producto de la empresa
create table if not exists public.user_product_access (
  user_id      uuid not null references auth.users (id) on delete cascade,
  account_id   uuid not null references public.accounts (id) on delete cascade,
  zone_code    text not null references public.zones (code),
  access_level text not null default 'view'
               check (access_level in ('view','edit','manage')),
  granted_by   uuid references auth.users (id),
  created_at   timestamptz not null default now(),
  primary key (user_id, account_id, zone_code)
);

-- ¿Qué productos ve un usuario cliente? Los de sus grants activos:
create or replace function public.my_product_zones()
returns setof text
language sql stable security definer set search_path = public
as $$
  select distinct upa.zone_code
    from public.user_product_access upa
    join public.subscriptions s
      on s.account_id = upa.account_id
     and s.zone_code  = upa.zone_code
     and s.status in ('trial','active')
   where upa.user_id = auth.uid();
$$;

-- ----------------------------------------------------------------------------
-- 4) PROFILES — cell (optional) + company, coherente con contacts
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists phone      text,
  add column if not exists company_id uuid references public.accounts (id) on delete set null;

-- ----------------------------------------------------------------------------
-- 5) RLS
-- ----------------------------------------------------------------------------
alter table public.contacts            enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.user_product_access enable row level security;

-- CONTACTS: superadmin/admin todo; gestor de cuenta lee y edita; nadie más.
drop policy if exists "contacts read" on public.contacts;
create policy "contacts read" on public.contacts for select using (
  public.is_admin_or_above() or public.my_role() = 'account_manager'
);
drop policy if exists "contacts write" on public.contacts;
create policy "contacts write" on public.contacts for insert with check (
  public.is_admin_or_above() or public.my_role() = 'account_manager'
);
drop policy if exists "contacts update" on public.contacts;
create policy "contacts update" on public.contacts for update using (
  public.is_admin_or_above() or public.my_role() = 'account_manager'
);
drop policy if exists "contacts delete" on public.contacts;
create policy "contacts delete" on public.contacts for delete using (
  public.is_admin_or_above()
);

-- SUBSCRIPTIONS: superadmin/admin gestionan; gestor lee; cliente ve las suyas.
drop policy if exists "subs read" on public.subscriptions;
create policy "subs read" on public.subscriptions for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or account_id in (select public.my_account_ids())
  or exists (select 1 from public.user_product_access u
              where u.account_id = subscriptions.account_id
                and u.zone_code  = subscriptions.zone_code
                and u.user_id    = auth.uid())
);
drop policy if exists "subs manage" on public.subscriptions;
create policy "subs manage" on public.subscriptions for all using (
  public.is_admin_or_above()
) with check (public.is_admin_or_above());

-- USER PRODUCT ACCESS: superadmin/admin gestionan; cada uno ve lo suyo.
drop policy if exists "upa read" on public.user_product_access;
create policy "upa read" on public.user_product_access for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or user_id = auth.uid()
);
drop policy if exists "upa manage" on public.user_product_access;
create policy "upa manage" on public.user_product_access for all using (
  public.is_admin_or_above()
) with check (public.is_admin_or_above());

-- updated_at
drop trigger if exists trg_touch_contacts on public.contacts;
create trigger trg_touch_contacts before update on public.contacts
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_subs on public.subscriptions;
create trigger trg_touch_subs before update on public.subscriptions
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- 6) GDPR — derecho de supresión: anonimiza sin romper integridad referencial
-- ----------------------------------------------------------------------------
create or replace function public.gdpr_erase_contact(p_contact uuid)
returns text
language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin_or_above() then
    raise exception 'Not allowed';
  end if;
  update public.contacts
     set first_name = 'Erased', last_name = 'Contact',
         email = 'erased-' || left(id::text, 8) || '@gdpr.invalid',
         phone = null, position = null, notes = null,
         consent = false, marketing_consent = false,
         erasure_requested = true, brevo_synced_at = null
   where id = p_contact;
  return 'Contact anonymised (GDPR erasure)';
end;
$$;

-- ============================================================================
-- FUNNEL — guía rápida para el superadmin (todo se hace también desde la app):
--   1. Alta de empresa (accounts: name + VAT + address) y de sus contactos.
--   2. Marcar el contacto principal de la empresa.
--   3. La empresa compra un producto → insert en subscriptions
--      (empresa + zona + contacto principal + estado active).
--   4. Autorizar usuarios (authorize_user) y concederles permisos en el
--      producto → insert en user_product_access (view/edit/manage).
-- VERIFICAR:
--   select * from public.contacts limit 5;
--   select * from public.subscriptions;
--   select public.import_inquiries_to_contacts();  -- importa los mensajes web
-- ============================================================================
