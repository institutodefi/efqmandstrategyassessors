-- ============================================================================
-- ORBITAL 360 — Migration 02: USER AUTHORIZATION
--   · first_name / last_name split (profiles + inquiries)
--   · authorized_users allowlist with role pre-assignment
--   · authorize_user() / revoke_user() admin functions
--   · Alejandro's first access (alejandro@efqmassessors.ae)
-- Run AFTER orbital360_full_schema.sql, in the Supabase SQL Editor.
-- Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) NAME SPLIT — profiles & inquiries get first_name / last_name
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name  text;

alter table public.inquiries
  add column if not exists first_name text,
  add column if not exists last_name  text;

-- Backfill existing rows: split full_name / name on the first space
update public.profiles
   set first_name = coalesce(first_name, split_part(full_name, ' ', 1)),
       last_name  = coalesce(last_name,
                    nullif(substr(full_name, length(split_part(full_name,' ',1)) + 2), ''))
 where full_name is not null and first_name is null;

update public.inquiries
   set first_name = coalesce(first_name, split_part(name, ' ', 1)),
       last_name  = coalesce(last_name,
                    nullif(substr(name, length(split_part(name,' ',1)) + 2), ''))
 where name is not null and first_name is null;

-- ----------------------------------------------------------------------------
-- 2) AUTHORIZED USERS — allowlist with pre-assigned role
-- ----------------------------------------------------------------------------
-- A person on this list gets their role automatically the moment they sign
-- up (or immediately, if their auth account already exists).
create table if not exists public.authorized_users (
  email       text primary key,
  first_name  text,
  last_name   text,
  role        public.app_role not null default 'client',
  authorized  boolean not null default true,
  notes       text,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

alter table public.authorized_users enable row level security;

drop policy if exists "authorized read" on public.authorized_users;
create policy "authorized read" on public.authorized_users
  for select using (public.is_admin_or_above() or public.my_role() = 'account_manager');

drop policy if exists "authorized manage" on public.authorized_users;
create policy "authorized manage" on public.authorized_users
  for all using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

-- ----------------------------------------------------------------------------
-- 3) SIGNUP TRIGGER v2 — names split + role from the allowlist
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_first text := new.raw_user_meta_data ->> 'first_name';
  v_last  text := new.raw_user_meta_data ->> 'last_name';
  v_full  text := coalesce(
                    new.raw_user_meta_data ->> 'full_name',
                    trim(coalesce(v_first,'') || ' ' || coalesce(v_last,'')));
  v_role  public.app_role;
begin
  -- Role: Alejandro → superadmin; else the allowlist; else client.
  if lower(new.email) = 'alejandro@efqmassessors.ae' then
    v_role := 'superadmin';
  else
    select role into v_role
      from public.authorized_users
     where lower(email) = lower(new.email) and authorized;
    v_role := coalesce(v_role, 'client');
  end if;

  insert into public.profiles (id, full_name, first_name, last_name, email, role)
  values (new.id, nullif(v_full,''), v_first, v_last, new.email, v_role)
  on conflict (id) do update
    set email      = excluded.email,
        first_name = coalesce(excluded.first_name, public.profiles.first_name),
        last_name  = coalesce(excluded.last_name,  public.profiles.last_name),
        full_name  = coalesce(excluded.full_name,  public.profiles.full_name),
        role       = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4) ADMIN FUNCTIONS — authorize / revoke
-- ----------------------------------------------------------------------------
-- Callable from the SQL Editor (postgres) or by superadmin/admin in-app.
--
--   select public.authorize_user('maria@cliente.com', 'María', 'García', 'client');
--   select public.authorize_user('omar@efqmassessors.ae', 'Omar', 'Hassan', 'consultant');
--   select public.revoke_user('ex@cliente.com');

create or replace function public.authorize_user(
  p_email text, p_first text, p_last text, p_role public.app_role default 'client'
) returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid;
begin
  -- Only superadmin/admin in-app; the SQL Editor (auth.uid() is null) always may.
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

  -- If the auth account already exists, apply the role right now
  select id into v_uid from auth.users where lower(email) = lower(p_email);
  if v_uid is not null then
    alter table public.profiles disable trigger trg_guard_role_change;
    insert into public.profiles (id, email, first_name, last_name, full_name, role)
    values (v_uid, lower(p_email), p_first, p_last,
            trim(coalesce(p_first,'') || ' ' || coalesce(p_last,'')), p_role)
    on conflict (id) do update
      set role       = excluded.role,
          first_name = coalesce(public.profiles.first_name, excluded.first_name),
          last_name  = coalesce(public.profiles.last_name,  excluded.last_name);
    alter table public.profiles enable trigger trg_guard_role_change;
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
    alter table public.profiles disable trigger trg_guard_role_change;
    update public.profiles set role = 'client' where id = v_uid;   -- demote
    alter table public.profiles enable trigger trg_guard_role_change;
    return 'Revoked and demoted to client: ' || p_email;
  end if;
  return 'Revoked: ' || p_email;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5) ALEJANDRO — FIRST ACCESS  (alejandro@efqmassessors.ae)
-- ----------------------------------------------------------------------------
-- Put him on the allowlist as superadmin (idempotent):
select public.authorize_user('alejandro@efqmassessors.ae', 'Alejandro', 'EFQM Assessors', 'superadmin');

-- Create his auth account with a TEMPORARY password if it does not exist yet.
-- ⚠️ CHANGE THE PASSWORD below before running, and change it again after the
--    first sign-in (Login → "Forgot your password?" also works).
do $$
declare
  v_uid uuid;
  v_pass text := 'Orbital360.Temp!2026';   -- ← TEMPORARY, change it
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
    raise notice 'Auth account created for alejandro@efqmassessors.ae';
  else
    raise notice 'Auth account already exists — role enforced via authorize_user.';
  end if;

  -- Ensure the profile exists and is superadmin either way
  alter table public.profiles disable trigger trg_guard_role_change;
  insert into public.profiles (id, email, first_name, last_name, full_name, role)
  values (v_uid, 'alejandro@efqmassessors.ae', 'Alejandro', 'EFQM Assessors',
          'Alejandro EFQM Assessors', 'superadmin')
  on conflict (id) do update set role = 'superadmin';
  alter table public.profiles enable trigger trg_guard_role_change;
end $$;

-- ============================================================================
-- VERIFY:
--   select email, role, authorized from public.authorized_users;
--   select email, first_name, last_name, role from public.profiles;
--   → alejandro@efqmassessors.ae must show role = superadmin
--
-- SIGN IN: /login with alejandro@efqmassessors.ae + the temporary password,
-- then change it immediately.
--
-- ALTERNATIVE (no direct insert into auth.users): create him from the
-- Dashboard → Authentication → Users → "Add user" (email + password,
-- auto-confirm ON). The signup trigger will make him superadmin.
-- ============================================================================
