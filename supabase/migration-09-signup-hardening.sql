-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 09
--   · handle_new_user BLINDADO: el alta en Auth NUNCA falla por el perfil.
--     Si algo va mal creando el perfil, se registra el aviso y el usuario
--     se crea igualmente (el perfil se completa después con el backfill).
--   · Diagnóstico al final para verificar el estado real del proyecto.
-- Ejecutar en el SQL Editor. Re-ejecutable. Independiente del resto
-- (funciona aunque falte alguna migración intermedia).
-- ============================================================================

-- Asegurar prerequisitos mínimos por si faltara alguna migración
do $$ begin
  create type public.app_role as enum
    ('superadmin','admin','account_manager','consultant','client');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  organisation text,
  email      text,
  role       public.app_role not null default 'client',
  locale     text not null default 'en',
  created_at timestamptz not null default now()
);
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name  text,
  add column if not exists phone      text;

create table if not exists public.authorized_users (
  email      text primary key,
  first_name text,
  last_name  text,
  role       public.app_role not null default 'client',
  authorized boolean not null default true,
  notes      text,
  created_at timestamptz not null default now(),
  created_by uuid
);

-- ----------------------------------------------------------------------------
-- TRIGGER v3 — a prueba de fallos
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
  v_role  public.app_role := 'client';
begin
  begin
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
  exception when others then
    -- NUNCA bloquear el alta en Auth por un problema del perfil
    raise warning 'handle_new_user: profile creation failed for %: %', new.email, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: perfiles para usuarios de Auth que se quedaron sin perfil
insert into public.profiles (id, full_name, first_name, last_name, email, role)
select u.id,
       u.raw_user_meta_data ->> 'full_name',
       u.raw_user_meta_data ->> 'first_name',
       u.raw_user_meta_data ->> 'last_name',
       u.email,
       case when lower(u.email) = 'alejandro@efqmassessors.ae'
            then 'superadmin'::public.app_role else 'client'::public.app_role end
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- ============================================================================
-- DIAGNÓSTICO — ejecuta estos SELECT y revisa el resultado:
-- ============================================================================
-- 1) ¿Usuarios de Auth sin perfil? (debe devolver 0 tras el backfill)
--    select count(*) from auth.users u
--      left join public.profiles p on p.id = u.id where p.id is null;
--
-- 2) ¿Se creó ya el usuario que estás probando?
--    select email, created_at, email_confirmed_at from auth.users
--     where email ilike '%tuconsultor%';
--    · Si SÍ aparece → el alta anterior funcionó a medias: el error del
--      formulario era "user already exists" o el trigger. Prueba a INICIAR
--      SESIÓN con ese email en vez de registrarte, o bórralo en
--      Authentication → Users y repite el registro.
--
-- 3) ¿Qué migraciones están aplicadas? (todas deben devolver true)
--    select
--      to_regclass('public.authorized_users')  is not null as m02,
--      to_regclass('public.contacts')          is not null as m04,
--      to_regclass('public.subscriptions')     is not null as m04b,
--      to_regclass('public.assessment_questions') is not null as m07,
--      to_regclass('public.project_counters')  is not null as m08;
--
-- 4) El error REAL del registro está en:
--    Dashboard → Logs → Auth  (busca el POST /signup con status 4xx/5xx)
-- ============================================================================
