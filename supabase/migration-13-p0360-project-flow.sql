-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 13 · APERTURA DE PROYECTO O360
--
--   · Crear un proyecto O360 = New project (empresa + producto O360)
--   · Código automático  P0360-<CLIENTE 3 letras>-<NNN>  (correlativo por
--     cliente); el assessment se crea SOLO, enlazado al proyecto
--   · Solo el ADMINISTRATOR del producto en su empresa (o admin/superadmin
--     de plataforma) puede abrir proyecto — "run your company project"
--   · Equipo por assessment: se añaden usuarios con su rol
--     (admin · manager · assessor · auditor) sobre ese assessment concreto
-- Ejecutar DESPUÉS de migration-12c. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) CÓDIGO P0360-CCC-NNN para proyectos de zona assessment
-- ----------------------------------------------------------------------------
create table if not exists public.project_counters_company (
  zone_code  text not null,
  account_id uuid not null references public.accounts (id) on delete cascade,
  counter    int  not null default 0,
  primary key (zone_code, account_id)
);

create or replace function public.company_code3(p_account uuid)
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(
    nullif(upper(left(regexp_replace(name, '[^A-Za-z]', '', 'g'), 3)), ''),
    'CLI')
  from public.accounts where id = p_account;
$$;

create or replace function public.assign_project_code()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare v_n int;
begin
  if new.code is null or new.code = '' then
    if new.zone_code = 'assessment' then
      insert into public.project_counters_company (zone_code, account_id)
      values (new.zone_code, new.account_id)
      on conflict (zone_code, account_id) do nothing;
      update public.project_counters_company
         set counter = counter + 1
       where zone_code = new.zone_code and account_id = new.account_id
      returning counter into v_n;
      new.code := 'P0360-' || public.company_code3(new.account_id)
                  || '-' || lpad(v_n::text, 3, '0');
    else
      new.code := public.next_project_code(new.zone_code);
    end if;
  end if;
  if new.title_en is null or new.title_en = '' then
    new.title_en := new.code;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_project_code on public.projects;
create trigger trg_project_code
  before insert on public.projects
  for each row execute function public.assign_project_code();

-- ----------------------------------------------------------------------------
-- 2) ASSESSMENT ENLAZADO AL PROYECTO (se crea solo al abrir el proyecto)
-- ----------------------------------------------------------------------------
alter table public.assessments
  add column if not exists code text unique,
  add column if not exists project_id uuid unique references public.projects (id) on delete set null;

create or replace function public.create_assessment_for_project()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.zone_code = 'assessment' then
    insert into public.assessments (company_id, title, code, project_id, created_by)
    values (new.account_id, new.code, new.code, new.id, new.created_by)
    on conflict (project_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_project_assessment on public.projects;
create trigger trg_project_assessment
  after insert on public.projects
  for each row execute function public.create_assessment_for_project();

-- ----------------------------------------------------------------------------
-- 3) EQUIPO POR ASSESSMENT (usuarios + rol sobre ese assessment)
-- ----------------------------------------------------------------------------
create table if not exists public.assessment_members (
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  member_role   text not null default 'assessor'
                check (member_role in ('admin','manager','assessor','auditor')),
  added_by      uuid references auth.users (id),
  created_at    timestamptz not null default now(),
  primary key (assessment_id, user_id)
);
alter table public.assessment_members enable row level security;

-- ¿Puede gestionar el equipo? admin plataforma · product-admin de la empresa
-- · member admin del assessment
create or replace function public.can_manage_assessment_members(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role in ('superadmin','admin'))
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment') = 'admin')
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role = 'admin');
$$;
grant execute on function public.can_manage_assessment_members(uuid) to authenticated;

drop policy if exists "amembers read" on public.assessment_members;
create policy "amembers read" on public.assessment_members for select using (
  user_id = auth.uid() or public.can_view_assessment(assessment_id)
);
drop policy if exists "amembers manage" on public.assessment_members;
create policy "amembers manage" on public.assessment_members for all
  using (public.can_manage_assessment_members(assessment_id))
  with check (public.can_manage_assessment_members(assessment_id));

-- ----------------------------------------------------------------------------
-- 4) CAPACIDADES v2 — los miembros del assessment cuentan
-- ----------------------------------------------------------------------------
create or replace function public.can_view_assessment(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assessments a
    where a.id = aid and (
      a.created_by = auth.uid()
      or exists (select 1 from public.profiles p
                  where p.id = auth.uid()
                    and p.role in ('superadmin','admin','account_manager'))
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid())
      or public.my_product_role(a.company_id, 'assessment') is not null
    )
  );
$$;

-- Autoevaluación: admin plataforma · product-admin de la empresa ·
-- member admin/manager/assessor del assessment (el auditor NO)
create or replace function public.can_edit_assessment_client(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role in ('superadmin','admin'))
      or exists (
        select 1 from public.assessments a
        where a.id = aid
          and a.status in ('in_progress','submitted')
          and ( public.my_product_role(a.company_id, 'assessment') = 'admin'
                or exists (select 1 from public.assessment_members m
                            where m.assessment_id = aid and m.user_id = auth.uid()
                              and m.member_role in ('admin','manager','assessor')) )
      );
$$;

-- Auditor: admin plataforma · consultor asignado · product-auditor de la
-- empresa · member auditor del assessment
create or replace function public.is_assessment_assessor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role in ('superadmin','admin'))
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role = 'auditor')
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment') = 'auditor');
$$;

drop function if exists public.assessment_capabilities(uuid);
create or replace function public.assessment_capabilities(aid uuid)
returns table (can_view boolean, can_edit_client boolean, is_assessor boolean,
               can_manage_members boolean, product_role text)
language sql stable security definer set search_path = public
as $$
  select public.can_view_assessment(aid),
         public.can_edit_assessment_client(aid),
         public.is_assessment_assessor(aid),
         public.can_manage_assessment_members(aid),
         (select public.my_product_role(a.company_id, 'assessment')
            from public.assessments a where a.id = aid);
$$;
grant execute on function public.assessment_capabilities(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 5) APERTURA SOLO PRODUCT-ADMIN (además de plataforma)
-- ----------------------------------------------------------------------------
-- Proyectos: el product-admin abre proyecto de SU empresa y SU producto
drop policy if exists "projects insert" on public.projects;
create policy "projects insert" on public.projects for insert with check (
  created_by = auth.uid() and (
    exists (select 1 from public.profiles p
             where p.id = auth.uid()
               and p.role in ('superadmin','admin','consultant'))
    or ( public.my_product_role(account_id, zone_code) = 'admin'
         and public.has_active_sub(account_id, zone_code) )
  )
);

-- Assessments directos: solo plataforma (el resto nace del proyecto)
drop policy if exists "assessments insert" on public.assessments;
create policy "assessments insert" on public.assessments for insert with check (
  created_by = auth.uid() and (
    exists (select 1 from public.profiles p
             where p.id = auth.uid() and p.role in ('superadmin','admin'))
    or ( public.my_product_role(company_id, 'assessment') = 'admin'
         and public.has_active_sub(company_id, 'assessment') )
  )
);

-- Alcance de "New project" para cada usuario (RPC para la app)
drop function if exists public.my_project_scopes();
create or replace function public.my_project_scopes()
returns table (account_id uuid, zone_code text)
language sql stable security definer set search_path = public
as $$
  select a.id, z.code
    from public.accounts a cross join public.zones z
   where z.is_active
     and exists (select 1 from public.profiles p
                  where p.id = auth.uid()
                    and p.role in ('superadmin','admin','consultant'))
  union
  select u.account_id, u.zone_code
    from public.user_product_access u
   where u.user_id = auth.uid()
     and u.access_level = 'admin'
     and public.has_active_sub(u.account_id, u.zone_code);
$$;
grant execute on function public.my_project_scopes() to authenticated;

-- Backfill: código para assessments existentes sin él (numeración por cliente,
-- calculada en subconsulta — las funciones ventana no se permiten en UPDATE)
with numbered as (
  select id,
         'P0360-' || public.company_code3(company_id) || '-' ||
         lpad((row_number() over (partition by company_id order by created_at))::text, 3, '0')
         as new_code
  from public.assessments
  where code is null
)
update public.assessments a
   set code = n.new_code
  from numbered n
 where a.id = n.id;

-- VERIFICAR:
--   Nuevo proyecto O360 desde la app → código P0360-XXX-001 y assessment
--   creado automáticamente con el mismo código.
--   select code, title, project_id from public.assessments order by created_at;
-- ============================================================================
