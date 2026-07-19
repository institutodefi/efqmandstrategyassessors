-- ============================================================================
-- ORBITAL 360 — EFQM Assessors — FULL SCHEMA (self-contained)
-- Creates the base site tables AND the Orbital 360 layer in one run.
-- Safe to re-run: everything is IF NOT EXISTS / OR REPLACE / ON CONFLICT.
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================================

-- ════════════════════════════════════════════════════════════════════════════
-- PART A — BASE SITE TABLES (from schema.sql, now included here)
-- ════════════════════════════════════════════════════════════════════════════

-- A1) ROLES ENUM (needed by profiles below)
do $$ begin
  create type public.app_role as enum
    ('superadmin', 'admin', 'account_manager', 'consultant', 'client');
exception when duplicate_object then null;
end $$;

-- A2) PROFILES — one row per authenticated user (with role built in)
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  full_name    text,
  organisation text,
  email        text,
  role         public.app_role not null default 'client',
  locale       text not null default 'en',       -- 'en' | 'ar'
  created_at   timestamptz not null default now()
);

-- In case profiles already existed without these columns:
alter table public.profiles
  add column if not exists email  text,
  add column if not exists role   public.app_role not null default 'client',
  add column if not exists locale text not null default 'en';

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- A3) DOCUMENTS — deliverables shared with a specific client
create table if not exists public.documents (
  id           uuid primary key default gen_random_uuid(),
  owner        uuid not null references auth.users (id) on delete cascade,
  title        text not null,
  category     text not null default 'Deliverable',
  storage_path text,
  created_at   timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "Users can view own documents" on public.documents;
create policy "Users can view own documents"
  on public.documents for select using (auth.uid() = owner);

-- A4) INQUIRIES — public contact form
create table if not exists public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  organisation text,
  message      text not null,
  created_at   timestamptz not null default now()
);

alter table public.inquiries enable row level security;

drop policy if exists "Anyone can submit an inquiry" on public.inquiries;
create policy "Anyone can submit an inquiry"
  on public.inquiries for insert with check (true);

-- A5) SUBSCRIBERS — newsletter sign-ups
create table if not exists public.subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  locale     text default 'en',
  consent    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

drop policy if exists "Anyone can subscribe" on public.subscribers;
create policy "Anyone can subscribe"
  on public.subscribers for insert with check (true);

-- ════════════════════════════════════════════════════════════════════════════
-- PART B — ORBITAL 360 LAYER
-- ════════════════════════════════════════════════════════════════════════════

-- B1) HELPER FUNCTIONS (security definer → usable inside RLS policies)
create or replace function public.my_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(public.my_role() = 'superadmin', false);
$$;

create or replace function public.is_admin_or_above()
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(public.my_role() in ('superadmin','admin'), false);
$$;

-- B2) ZONES — the three Orbital 360 areas, bilingual EN / AR
create table if not exists public.zones (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name_en     text not null,
  name_ar     text not null,
  desc_en     text,
  desc_ar     text,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.zones (code, name_en, name_ar, desc_en, desc_ar, sort_order)
values
  ('assessment',
   'O360 Assessment Tool',
   'أداة التقييم O360',
   'EFQM-based organisational assessment: RADAR scoring, criteria evidence, maturity diagnosis and reports.',
   'التقييم المؤسسي وفق نموذج EFQM: تقييم رادار، أدلة المعايير، تشخيص النضج والتقارير.',
   1),
  ('governance',
   'Management and Governance System',
   'نظام الإدارة والحوكمة',
   'Policies, committees, KPIs, compliance and the governance operating rhythm of the organisation.',
   'السياسات واللجان ومؤشرات الأداء والامتثال وإيقاع تشغيل الحوكمة في المؤسسة.',
   2),
  ('transformation',
   'Project Management and Transformation Tool',
   'أداة إدارة المشاريع والتحول',
   'Portfolio, programmes and transformation projects: planning, execution, milestones and benefits tracking.',
   'المحافظ والبرامج ومشاريع التحول: التخطيط والتنفيذ والمعالم الرئيسية وتتبع المنافع.',
   3)
on conflict (code) do update
  set name_en = excluded.name_en,
      name_ar = excluded.name_ar,
      desc_en = excluded.desc_en,
      desc_ar = excluded.desc_ar,
      sort_order = excluded.sort_order;

-- B3) ROLE ↔ ZONE PERMISSION MATRIX
create table if not exists public.role_zone_access (
  role         public.app_role not null,
  zone_code    text not null references public.zones (code) on delete cascade,
  access_level text not null check (access_level in ('manage','design','view','interact')),
  primary key (role, zone_code)
);

insert into public.role_zone_access (role, zone_code, access_level) values
  ('superadmin','assessment','manage'),
  ('superadmin','governance','manage'),
  ('superadmin','transformation','manage'),
  ('admin','assessment','manage'),
  ('admin','governance','manage'),
  ('admin','transformation','manage'),
  ('account_manager','assessment','view'),
  ('account_manager','governance','view'),
  ('account_manager','transformation','view'),
  ('consultant','assessment','design'),
  ('consultant','governance','design'),
  ('consultant','transformation','design'),
  ('client','assessment','interact'),
  ('client','governance','interact'),
  ('client','transformation','interact')
on conflict (role, zone_code) do update set access_level = excluded.access_level;

-- B4) ACCOUNTS (CRM) — client organisations
create table if not exists public.accounts (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  name_ar          text,
  country          text,
  sector           text,
  crm_status       text not null default 'lead'
                   check (crm_status in ('lead','prospect','active','on_hold','closed')),
  account_manager  uuid references auth.users (id) on delete set null,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.account_members (
  account_id uuid not null references public.accounts (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (account_id, user_id)
);

create or replace function public.my_account_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select account_id from public.account_members where user_id = auth.uid();
$$;

-- B5) PROJECTS — designed by consultants, per account and zone
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  account_id  uuid not null references public.accounts (id) on delete cascade,
  zone_code   text not null references public.zones (code),
  title_en    text not null,
  title_ar    text,
  brief_en    text,
  brief_ar    text,
  status      text not null default 'draft'
              check (status in ('draft','design','in_progress','review','delivered','archived')),
  progress    int  not null default 0 check (progress between 0 and 100),
  start_date  date,
  due_date    date,
  created_by  uuid not null references auth.users (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  member_role text not null default 'client'
              check (member_role in ('lead_consultant','consultant','client')),
  created_at  timestamptz not null default now(),
  primary key (project_id, user_id)
);

create or replace function public.my_project_ids()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select project_id from public.project_members where user_id = auth.uid();
$$;

-- B6) PROJECT ACTIVITY — where clients interact
create table if not exists public.project_activity (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  author     uuid not null references auth.users (id) on delete cascade,
  kind       text not null default 'comment'
             check (kind in ('comment','submission','task_update','file','decision')),
  body       text,
  payload    jsonb,
  created_at timestamptz not null default now()
);

-- B7) ROW LEVEL SECURITY — Orbital tables
alter table public.zones            enable row level security;
alter table public.role_zone_access enable row level security;
alter table public.accounts         enable row level security;
alter table public.account_members  enable row level security;
alter table public.projects         enable row level security;
alter table public.project_members  enable row level security;
alter table public.project_activity enable row level security;

drop policy if exists "zones read" on public.zones;
create policy "zones read" on public.zones for select using (auth.uid() is not null);
drop policy if exists "zones manage" on public.zones;
create policy "zones manage" on public.zones for all
  using (public.is_admin_or_above()) with check (public.is_admin_or_above());

drop policy if exists "rza read" on public.role_zone_access;
create policy "rza read" on public.role_zone_access for select using (auth.uid() is not null);
drop policy if exists "rza manage" on public.role_zone_access;
create policy "rza manage" on public.role_zone_access for all
  using (public.is_superadmin()) with check (public.is_superadmin());

drop policy if exists "accounts read" on public.accounts;
create policy "accounts read" on public.accounts for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or id in (select public.my_account_ids())
  or id in (select account_id from public.projects where id in (select public.my_project_ids()))
);
drop policy if exists "accounts insert" on public.accounts;
create policy "accounts insert" on public.accounts for insert with check (
  public.is_admin_or_above() or public.my_role() = 'account_manager'
);
drop policy if exists "accounts update" on public.accounts;
create policy "accounts update" on public.accounts for update using (
  public.is_admin_or_above()
  or (public.my_role() = 'account_manager' and account_manager = auth.uid())
);
drop policy if exists "accounts delete" on public.accounts;
create policy "accounts delete" on public.accounts for delete using (public.is_admin_or_above());

drop policy if exists "acct members read" on public.account_members;
create policy "acct members read" on public.account_members for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or user_id = auth.uid()
);
drop policy if exists "acct members manage" on public.account_members;
create policy "acct members manage" on public.account_members for all using (
  public.is_admin_or_above() or public.my_role() = 'account_manager'
) with check (
  public.is_admin_or_above() or public.my_role() = 'account_manager'
);

drop policy if exists "projects read" on public.projects;
create policy "projects read" on public.projects for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or id in (select public.my_project_ids())
  or created_by = auth.uid()
);
drop policy if exists "projects insert" on public.projects;
create policy "projects insert" on public.projects for insert with check (
  public.is_admin_or_above()
  or (public.my_role() = 'consultant' and created_by = auth.uid())
);
drop policy if exists "projects update" on public.projects;
create policy "projects update" on public.projects for update using (
  public.is_admin_or_above()
  or (public.my_role() = 'consultant'
      and (created_by = auth.uid() or id in (select public.my_project_ids())))
);
drop policy if exists "projects delete" on public.projects;
create policy "projects delete" on public.projects for delete using (public.is_admin_or_above());

drop policy if exists "proj members read" on public.project_members;
create policy "proj members read" on public.project_members for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or project_id in (select public.my_project_ids())
);
drop policy if exists "proj members manage" on public.project_members;
create policy "proj members manage" on public.project_members for all using (
  public.is_admin_or_above()
  or (public.my_role() = 'consultant'
      and project_id in (select id from public.projects where created_by = auth.uid()))
) with check (
  public.is_admin_or_above()
  or (public.my_role() = 'consultant'
      and project_id in (select id from public.projects where created_by = auth.uid()))
);

drop policy if exists "activity read" on public.project_activity;
create policy "activity read" on public.project_activity for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or project_id in (select public.my_project_ids())
);
drop policy if exists "activity insert" on public.project_activity;
create policy "activity insert" on public.project_activity for insert with check (
  author = auth.uid()
  and (public.is_admin_or_above()
       or project_id in (select public.my_project_ids()))
);
drop policy if exists "activity delete" on public.project_activity;
create policy "activity delete" on public.project_activity for delete using (
  public.is_admin_or_above() or author = auth.uid()
);

-- Admins & account managers can read every profile
drop policy if exists "profiles admin read" on public.profiles;
create policy "profiles admin read" on public.profiles for select using (
  public.is_admin_or_above() or public.my_role() = 'account_manager'
);

-- B8) GUARD — only superadmin can change roles
create or replace function public.guard_role_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_superadmin() then
    raise exception 'Only the superadministrator can change roles';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_guard_role_change on public.profiles;
create trigger trg_guard_role_change
  before update on public.profiles
  for each row execute function public.guard_role_change();

-- B9) SIGNUP TRIGGER + SUPERADMIN SEED — alejandro@efqmassessors.ae
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    case when lower(new.email) = 'alejandro@efqmassessors.ae'
         then 'superadmin'::public.app_role
         else 'client'::public.app_role
    end
  )
  on conflict (id) do update
    set email = excluded.email,
        role  = case when lower(excluded.email) = 'alejandro@efqmassessors.ae'
                     then 'superadmin'::public.app_role
                     else public.profiles.role end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: create profiles for any users that signed up BEFORE this schema,
-- and promote Alejandro if his account already exists.
alter table public.profiles disable trigger trg_guard_role_change;

insert into public.profiles (id, full_name, email, role)
select
  u.id,
  u.raw_user_meta_data ->> 'full_name',
  u.email,
  case when lower(u.email) = 'alejandro@efqmassessors.ae'
       then 'superadmin'::public.app_role
       else 'client'::public.app_role
  end
from auth.users u
on conflict (id) do update
  set email = excluded.email,
      role  = case when lower(excluded.email) = 'alejandro@efqmassessors.ae'
                   then 'superadmin'::public.app_role
                   else public.profiles.role end;

alter table public.profiles enable trigger trg_guard_role_change;

-- B10) updated_at housekeeping
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_touch_accounts on public.accounts;
create trigger trg_touch_accounts before update on public.accounts
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_projects on public.projects;
create trigger trg_touch_projects before update on public.projects
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- VERIFICATION — run these after; each should return rows / true:
--   select code, name_en, name_ar from public.zones order by sort_order;
--   select role, zone_code, access_level from public.role_zone_access;
--   select email, role from public.profiles;   -- Alejandro → superadmin
-- ============================================================================
