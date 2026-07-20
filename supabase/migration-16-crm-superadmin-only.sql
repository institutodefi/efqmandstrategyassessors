-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 16 · CRM SOLO SUPERADMIN
--   Contacts, Companies, suscripciones, licencias, permisos de producto,
--   inquiries y gestión de usuarios: SOLO el superadmin.
--   (Los admins conservan su trabajo de proyectos/assessments según la
--    jerarquía de la migration-15.)
-- Ejecutar DESPUÉS de migration-15. Re-ejecutable.
-- ============================================================================

-- Helper directo (sin cadenas de funciones)
create or replace function public.is_super_direct()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin');
$$;

-- ----------------------------------------------------------------------------
-- 1) CONTACTS (CRM)
-- ----------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in select policyname from pg_policies
            where schemaname = 'public' and tablename = 'contacts'
  loop execute format('drop policy %I on public.contacts', r.policyname); end loop;
end $$;

create policy "contacts super" on public.contacts for all
  using (public.is_super_direct()) with check (public.is_super_direct());

-- ----------------------------------------------------------------------------
-- 2) ACCOUNTS (empresas): gestión solo super; LECTURA también para quien
--    tiene rol de producto en la empresa (necesaria para ver el nombre de
--    su empresa en proyectos/assessments) y para consultores asignados
-- ----------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in select policyname from pg_policies
            where schemaname = 'public' and tablename = 'accounts'
  loop execute format('drop policy %I on public.accounts', r.policyname); end loop;
end $$;

create policy "accounts read" on public.accounts for select using (
  public.is_super_direct()
  or exists (select 1 from public.user_product_access u
              where u.user_id = auth.uid() and u.account_id = id)
  or exists (select 1 from public.projects pr
              where pr.account_id = id
                and (pr.created_by = auth.uid() or public.is_project_member(pr.id)))
);
create policy "accounts write" on public.accounts for insert
  with check (public.is_super_direct());
create policy "accounts update" on public.accounts for update
  using (public.is_super_direct());
create policy "accounts delete" on public.accounts for delete
  using (public.is_super_direct());

-- ----------------------------------------------------------------------------
-- 3) SUBSCRIPTIONS (productos y licencias): solo super; lectura para los
--    usuarios con acceso al producto (la app comprueba suscripción activa)
-- ----------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in select policyname from pg_policies
            where schemaname = 'public' and tablename = 'subscriptions'
  loop execute format('drop policy %I on public.subscriptions', r.policyname); end loop;
end $$;

create policy "subs read" on public.subscriptions for select using (
  public.is_super_direct()
  or exists (select 1 from public.user_product_access u
              where u.user_id = auth.uid()
                and u.account_id = subscriptions.account_id
                and u.zone_code = subscriptions.zone_code)
);
create policy "subs manage" on public.subscriptions for insert
  with check (public.is_super_direct());
create policy "subs update" on public.subscriptions for update
  using (public.is_super_direct());
create policy "subs delete" on public.subscriptions for delete
  using (public.is_super_direct());

-- ----------------------------------------------------------------------------
-- 4) USER_PRODUCT_ACCESS (permisos de producto): gestiona solo super;
--    cada usuario LEE los suyos (la app los usa para candados y scopes)
-- ----------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in select policyname from pg_policies
            where schemaname = 'public' and tablename = 'user_product_access'
  loop execute format('drop policy %I on public.user_product_access', r.policyname); end loop;
end $$;

create policy "upa read" on public.user_product_access for select using (
  public.is_super_direct() or user_id = auth.uid()
);
create policy "upa manage" on public.user_product_access for insert
  with check (public.is_super_direct());
create policy "upa update" on public.user_product_access for update
  using (public.is_super_direct());
create policy "upa delete" on public.user_product_access for delete
  using (public.is_super_direct());

-- ----------------------------------------------------------------------------
-- 5) INQUIRIES (formularios web) y AUTHORIZED_USERS: solo super
-- ----------------------------------------------------------------------------
do $$
declare r record; t text;
begin
  foreach t in array array['inquiries','authorized_users'] loop
    for r in select policyname from pg_policies
              where schemaname = 'public' and tablename = t
    loop execute format('drop policy %I on public.%I', r.policyname, t); end loop;
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%s super" on public.%I for all using (public.is_super_direct()) with check (public.is_super_direct())',
      t, t);
  end loop;
end $$;

-- El formulario público inserta inquiries como anon: conservar ese INSERT
drop policy if exists "inquiries public insert" on public.inquiries;
create policy "inquiries public insert" on public.inquiries for insert
  to anon, authenticated with check (true);

-- ----------------------------------------------------------------------------
-- 6) PROFILES: cada uno el suyo; listado/gestión global solo super.
--    Los gestores de equipos necesitan ver nombres para añadir miembros →
--    RPC segura con datos mínimos (id, nombre, email) en vez de abrir la tabla
-- ----------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in select policyname from pg_policies
            where schemaname = 'public' and tablename = 'profiles'
  loop execute format('drop policy %I on public.profiles', r.policyname); end loop;
end $$;

create policy "profiles self read" on public.profiles for select using (
  id = auth.uid() or public.is_super_direct()
);
create policy "profiles self update" on public.profiles for update using (
  id = auth.uid() or public.is_super_direct()
);
create policy "profiles super insert" on public.profiles for insert
  with check (public.is_super_direct());
create policy "profiles super delete" on public.profiles for delete
  using (public.is_super_direct());

drop function if exists public.list_people_min();
create or replace function public.list_people_min()
returns table (id uuid, full_name text, email text)
language sql stable security definer set search_path = public
as $$
  select id, full_name, email from public.profiles order by full_name;
$$;
grant execute on function public.list_people_min() to authenticated;

-- Nota RPCs de gestión (authorize_user, revoke_user, import_inquiries…):
-- ya validan superadmin internamente; las tablas ahora también lo exigen.
-- Edge functions (brevo-sync, activate-contact) usan service_role → intactas.
-- VERIFICAR: un admin ya no ve /portal/contacts ni /portal/companies con
-- datos; el superadmin, todo como siempre.
-- ============================================================================
