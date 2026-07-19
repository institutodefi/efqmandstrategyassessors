-- ============================================================
-- EFQM and Strategy Assessors — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1) PROFILES — one row per authenticated user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  organisation text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) DOCUMENTS — deliverables shared with a specific client
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text not null default 'Deliverable',
  storage_path text,           -- optional: path in Supabase Storage
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = owner);

-- (Inserts are done by your team via the Supabase dashboard or a
--  service-role key — clients only read their own documents.)

-- 3) INQUIRIES — public contact form on the home page
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organisation text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- Anyone (anonymous visitors) may submit an inquiry…
create policy "Anyone can submit an inquiry"
  on public.inquiries for insert
  with check (true);

-- …but nobody can read them through the anon key.
-- Read inquiries in the Supabase dashboard (Table Editor) or with the
-- service-role key from a trusted backend.

-- 4) OPTIONAL — private storage bucket for client documents
-- Dashboard → Storage → New bucket: "client-docs" (private)
-- Then add a policy so users can read files under a folder named
-- after their user id:
--
-- create policy "Users read own folder"
--   on storage.objects for select
--   using (bucket_id = 'client-docs' and (storage.foldername(name))[1] = auth.uid()::text);

-- 5) SUBSCRIBERS — newsletter sign-ups (fallback when Brevo isn't wired yet)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text default 'en',
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- Anyone may subscribe (insert only)…
create policy "Anyone can subscribe"
  on public.subscribers for insert
  with check (true);

-- …but nobody can read the list through the anon key.
-- Read it in the Supabase dashboard or with the service-role key.
