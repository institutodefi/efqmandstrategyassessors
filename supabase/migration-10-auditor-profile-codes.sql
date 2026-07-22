-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 10 · AUDITOR PROFILE & CODES
-- Schema imported and translated from the source "magic" model (v4–v8).
-- Only genuinely new pieces are imported; these were already cloned in
-- migration-07 and are NOT duplicated here:
--   empresas → assessment_entities · centros → assessment_sites
--   asignaciones → assessment_assignments · auditor_items → assessment_findings
--   auditor_criterio → assessment_criterion_reviews · v7 notes → assessor_notes
-- Ejecutar DESPUÉS de migration-09b. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) AUDITOR PROFILE FOR INDIVIDUALS  (source: perfiles v4/v5/v8 → profiles)
-- ----------------------------------------------------------------------------
alter table public.profiles
  -- terms & confidentiality acceptance (with timestamps)
  add column if not exists terms_accepted               boolean not null default false,
  add column if not exists terms_accepted_at            timestamptz,
  add column if not exists confidentiality_accepted     boolean not null default false,
  add column if not exists confidentiality_accepted_at  timestamptz,
  -- new sign-ups arrive unverified; the superadmin verifies them
  add column if not exists verified                     boolean not null default false,
  -- manual client approval (via secret token link, see approve_by_token)
  add column if not exists approved                     boolean not null default false,
  add column if not exists approved_at                  timestamptz,
  add column if not exists approval_token               text,
  -- membership tier, separate from the role (null = no membership)
  add column if not exists tier                         text
      check (tier is null or tier in ('basic','pro','ultra'));

create index if not exists idx_profiles_tier on public.profiles (tier);

-- Staff roles are approved & verified ex officio
update public.profiles
   set approved = true, verified = true
 where role in ('consultant','account_manager','admin','superadmin')
   and (approved = false or verified = false);

-- Helper: is the user approved (staff always is)?
create or replace function public.is_approved(uid uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid
      and (approved = true
           or role in ('consultant','account_manager','admin','superadmin'))
  );
$$;

-- The signup trigger also issues the approval token (kept failure-proof, v3 style)
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

    insert into public.profiles
      (id, full_name, first_name, last_name, email, role, approval_token,
       approved, verified)
    values
      (new.id, nullif(v_full,''), v_first, v_last, new.email, v_role,
       encode(gen_random_bytes(18), 'hex'),
       v_role <> 'client',            -- pre-authorised staff arrive approved
       v_role <> 'client')
    on conflict (id) do update
      set email      = excluded.email,
          first_name = coalesce(excluded.first_name, public.profiles.first_name),
          last_name  = coalesce(excluded.last_name,  public.profiles.last_name),
          full_name  = coalesce(excluded.full_name,  public.profiles.full_name),
          role       = excluded.role;
  exception when others then
    raise warning 'handle_new_user: profile creation failed for %: %', new.email, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Approve via secret token (called from the approval email link; the token is
-- the only key — without a valid one the function does nothing)
create or replace function public.approve_by_token(p_token text)
returns text
language plpgsql security definer set search_path = public
as $$
declare p record;
begin
  select * into p from public.profiles where approval_token = p_token;
  if not found then return 'invalid_token'; end if;
  if p.approved then return 'already_approved'; end if;
  update public.profiles
     set approved = true, approved_at = now(), approval_token = null
   where id = p.id;
  return 'ok';
end;
$$;
grant execute on function public.approve_by_token(text) to anon, authenticated;

-- Self-service acceptance of terms & confidentiality (the user's own row only)
create or replace function public.accept_terms(p_confidentiality boolean default false)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles
     set terms_accepted = true,
         terms_accepted_at = coalesce(terms_accepted_at, now()),
         confidentiality_accepted = confidentiality_accepted or p_confidentiality,
         confidentiality_accepted_at = case
           when p_confidentiality and confidentiality_accepted_at is null
           then now() else confidentiality_accepted_at end
   where id = auth.uid();
end;
$$;
grant execute on function public.accept_terms(boolean) to authenticated;

-- ----------------------------------------------------------------------------
-- 2) AUDITOR INVITATION CODES  (source: codigos_auditor + canjear_codigo)
--    Redeeming a valid code promotes the user to `consultant` (the Orbital360
--    auditor role) and marks them verified. Codes are managed by admins.
-- ----------------------------------------------------------------------------
create table if not exists public.auditor_codes (
  code        text primary key,
  description text,                          -- e.g. "External auditors — Q1"
  max_uses    int  not null default 1,
  uses        int  not null default 0,
  expires_at  timestamptz,                   -- null = no expiry
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

alter table public.auditor_codes enable row level security;

drop policy if exists "auditor codes admin" on public.auditor_codes;
create policy "auditor codes admin" on public.auditor_codes for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

-- Secure redeem: server-side validation; an authenticated user cannot promote
-- themselves without a valid code. Bypasses the role guard for this txn only.
create or replace function public.redeem_auditor_code(p_code text)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  c record;
  uid uuid := auth.uid();
begin
  if uid is null then return 'not_authenticated'; end if;

  select * into c from public.auditor_codes where code = p_code for update;

  if not found then return 'invalid_code'; end if;
  if c.active = false then return 'inactive_code'; end if;
  if c.expires_at is not null and c.expires_at < now() then return 'expired_code'; end if;
  if c.uses >= c.max_uses then return 'exhausted_code'; end if;

  perform set_config('app.bypass_role_guard', 'on', true);
  update public.profiles
     set role = case when role in ('superadmin','admin') then role
                     else 'consultant'::public.app_role end,
         verified = true,
         approved = true
   where id = uid;

  update public.auditor_codes
     set uses = uses + 1,
         active = case when uses + 1 >= max_uses then false else active end
   where code = p_code;

  return 'ok';
end;
$$;
grant execute on function public.redeem_auditor_code(text) to authenticated;

-- ----------------------------------------------------------------------------
-- 3) Parity detail with the source: explicit ordering on entities & sites
-- ----------------------------------------------------------------------------
alter table public.assessment_entities add column if not exists sort int not null default 0;
alter table public.assessment_sites    add column if not exists sort int not null default 0;

-- ============================================================================
-- NOTES
-- · Gating: in the source model, unapproved clients cannot create
--   assessments. Orbital360 already gates creation harder (active
--   subscription + edit/manage grant), so `approved` is imported as data
--   and helper only. To ALSO require approval, uncomment:
--
--   -- drop policy if exists "assessments insert" on public.assessments;
--   -- create policy "assessments insert" on public.assessments for insert with check (
--   --   created_by = auth.uid() and public.is_approved()
--   --   and ( public.is_admin_or_above() or exists (
--   --     select 1 from public.user_product_access u
--   --       join public.subscriptions s on s.account_id = u.account_id
--   --        and s.zone_code = 'assessment' and s.status in ('trial','active')
--   --      where u.user_id = auth.uid() and u.zone_code = 'assessment'
--   --        and u.access_level in ('edit','manage')
--   --        and u.account_id = assessments.company_id ))
--   -- );
--
-- · Generate auditor codes (as superadmin, SQL Editor or app-side later):
--     insert into public.auditor_codes (code, description, max_uses, expires_at)
--     values ('O360-AUD-2026', 'External auditors 2026', 5, now() + interval '90 days');
--     insert into public.auditor_codes (code, description)
--     values ('AUD-INVITE-ABCD', 'One-off invitation');
--   Redeem from the app:  select public.redeem_auditor_code('O360-AUD-2026');
--
-- VERIFY:
--   select column_name from information_schema.columns
--    where table_name = 'profiles' and column_name in
--      ('terms_accepted','confidentiality_accepted','verified','approved','tier');
--   select * from public.auditor_codes;
-- ============================================================================
