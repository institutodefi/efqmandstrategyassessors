-- ============================================================================
-- ORBITAL 360 — Migration 03
--   · Alejandro alta con contraseña definida (alejandro@efqmassessors.ae)
--   · Guard de roles v2 (sin ALTER TABLE, apto para llamadas desde la app)
--   · authorize_user / revoke_user v2
--   · Permisos para el portal de gestión de usuarios y contactos
-- Ejecutar DESPUÉS de migration-02. Re-ejecutable sin peligro.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) GUARD DE ROLES v2 — bypass interno por set_config (transacción local)
-- ----------------------------------------------------------------------------
create or replace function public.guard_role_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null                          -- SQL Editor pasa
     and coalesce(current_setting('app.bypass_role_guard', true), '') <> 'on'
     and not public.is_superadmin() then
    raise exception 'Only the superadministrator can change roles';
  end if;
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2) authorize_user / revoke_user v2 — usan el bypass, sin locks de tabla
-- ----------------------------------------------------------------------------
create or replace function public.authorize_user(
  p_email text, p_first text, p_last text, p_role public.app_role default 'client'
) returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid;
begin
  if auth.uid() is not null and not public.is_admin_or_above() then
    raise exception 'Not allowed';
  end if;
  if auth.uid() is not null and p_role in ('superadmin','admin')
     and not public.is_superadmin() then
    raise exception 'Only the superadministrator can grant admin roles';
  end if;

  insert into public.authorized_users (email, first_name, last_name, role, authorized, created_by)
  values (lower(p_email), p_first, p_last, p_role, true, auth.uid())
  on conflict (email) do update
    set first_name = excluded.first_name,
        last_name  = excluded.last_name,
        role       = excluded.role,
        authorized = true;

  select id into v_uid from auth.users where lower(email) = lower(p_email);
  if v_uid is not null then
    perform set_config('app.bypass_role_guard', 'on', true);   -- solo esta tx
    insert into public.profiles (id, email, first_name, last_name, full_name, role)
    values (v_uid, lower(p_email), p_first, p_last,
            trim(coalesce(p_first,'') || ' ' || coalesce(p_last,'')), p_role)
    on conflict (id) do update
      set role       = excluded.role,
          first_name = coalesce(public.profiles.first_name, excluded.first_name),
          last_name  = coalesce(public.profiles.last_name,  excluded.last_name);
    return 'Authorized and role applied: ' || p_email || ' → ' || p_role;
  end if;
  return 'Authorized (pending signup): ' || p_email || ' → ' || p_role;
end;
$$;

create or replace function public.revoke_user(p_email text)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid;
begin
  if auth.uid() is not null and not public.is_admin_or_above() then
    raise exception 'Not allowed';
  end if;
  if lower(p_email) = 'alejandro@efqmassessors.ae' then
    raise exception 'The superadministrator cannot be revoked';
  end if;

  update public.authorized_users set authorized = false where lower(email) = lower(p_email);

  select id into v_uid from auth.users where lower(email) = lower(p_email);
  if v_uid is not null then
    perform set_config('app.bypass_role_guard', 'on', true);
    update public.profiles set role = 'client' where id = v_uid;
    return 'Revoked and demoted to client: ' || p_email;
  end if;
  return 'Revoked: ' || p_email;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3) ALEJANDRO — ALTA DEFINITIVA con contraseña  *Slt2023#
-- ----------------------------------------------------------------------------
-- Crea la cuenta si no existe; si existe, fija la contraseña y confirma email.
-- ⚠️ Cambiad esta contraseña tras el primer acceso (Login → Forgot password
--    o desde la nueva zona de usuario /portal/account).
do $$
declare
  v_uid  uuid;
  v_pass text := '*Slt2023#';
begin
  select id into v_uid from auth.users
   where lower(email) = 'alejandro@efqmassessors.ae';

  if v_uid is null then
    v_uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', v_uid,
      'authenticated', 'authenticated',
      'alejandro@efqmassessors.ae',
      crypt(v_pass, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Alejandro","last_name":"EFQM Assessors","full_name":"Alejandro EFQM Assessors"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_uid, v_uid::text,
      jsonb_build_object('sub', v_uid::text, 'email', 'alejandro@efqmassessors.ae',
                         'email_verified', true),
      'email', now(), now(), now()
    );
    raise notice 'Cuenta creada para alejandro@efqmassessors.ae';
  else
    update auth.users
       set encrypted_password = crypt(v_pass, gen_salt('bf')),
           email_confirmed_at = coalesce(email_confirmed_at, now()),
           banned_until = null,
           updated_at = now()
     where id = v_uid;
    raise notice 'Contraseña actualizada y email confirmado para alejandro@efqmassessors.ae';
  end if;

  -- Perfil superadmin garantizado
  perform set_config('app.bypass_role_guard', 'on', true);
  insert into public.profiles (id, email, first_name, last_name, full_name, role)
  values (v_uid, 'alejandro@efqmassessors.ae', 'Alejandro', 'EFQM Assessors',
          'Alejandro EFQM Assessors', 'superadmin')
  on conflict (id) do update set role = 'superadmin';
end $$;

select public.authorize_user('alejandro@efqmassessors.ae', 'Alejandro', 'EFQM Assessors', 'superadmin');

-- ----------------------------------------------------------------------------
-- 4) PERMISOS para el portal de gestión (usuarios + contactos)
-- ----------------------------------------------------------------------------
-- Admins pueden actualizar perfiles (nombres, organización). El cambio de rol
-- sigue protegido por el guard: solo superadmin (o vía authorize_user).
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
  for update using (public.is_admin_or_above());

-- Contactos (inquiries): lectura para superadmin/admin/gestor de cuenta,
-- borrado solo admins. (Hasta ahora nadie podía leerlas desde la app.)
drop policy if exists "inquiries admin read" on public.inquiries;
create policy "inquiries admin read" on public.inquiries
  for select using (public.is_admin_or_above() or public.my_role() = 'account_manager');

drop policy if exists "inquiries admin delete" on public.inquiries;
create policy "inquiries admin delete" on public.inquiries
  for delete using (public.is_admin_or_above());

-- El propio usuario puede insertar su perfil si faltara (resiliencia)
drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================================================
-- VERIFICAR:
--   select email, role from public.profiles
--    where email = 'alejandro@efqmassessors.ae';      → superadmin
--   Entrar en /login con alejandro@efqmassessors.ae · *Slt2023#
-- ============================================================================
