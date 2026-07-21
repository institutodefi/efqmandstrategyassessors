-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 19 · DOS EJES DE PERMISOS + MULTIEMPRESA
--
-- EJE 1 · DISEÑO DE LA PLATAFORMA (profiles.design_permit):
--   superadmin → todo (implícito) · admin → edita diseño/cuestionarios ·
--   manager → solo ver el diseño · none → sin acceso (clientes por defecto)
--
-- EJE 2 · DENTRO DE LA EMPRESA (user_product_access.access_level):
--   admin    → añade usuarios y roles (y opera)
--   manager  → escribe lado cliente · SIN acceso a la vista de auditor
--   assessor → como manager · vista de auditor SOLO LECTURA
--   auditor  → lado cliente solo lectura · vista de auditor con escritura
--
-- Además: un usuario puede pertenecer a VARIAS empresas (memberships) y el
-- admin de plataforma crea proyectos en las empresas donde está asignado.
-- Ejecutar DESPUÉS de migration-18b. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) PERMISO DE DISEÑO
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists design_permit text not null default 'none'
  check (design_permit in ('admin','manager','none'));

-- Arranque razonable: los admins de plataforma existentes → diseño admin
update public.profiles set design_permit = 'admin'
 where role in ('admin') and design_permit = 'none';

create or replace function public.my_design_permit()
returns text
language sql stable security definer set search_path = public
as $$
  select case
    when exists (select 1 from public.profiles
                  where id = auth.uid() and role = 'superadmin') then 'admin'
    else coalesce((select design_permit from public.profiles
                    where id = auth.uid()), 'none')
  end;
$$;
grant execute on function public.my_design_permit() to authenticated;

-- El modelo (criterios/preguntas) lo editan superadmin y diseño-admin;
-- lectura: cualquier autenticado (el cuestionario la necesita)
drop policy if exists "criteria manage" on public.assessment_criteria;
create policy "criteria manage" on public.assessment_criteria for all
  using (public.my_design_permit() = 'admin')
  with check (public.my_design_permit() = 'admin');
drop policy if exists "questions manage" on public.assessment_questions;
create policy "questions manage" on public.assessment_questions for all
  using (public.my_design_permit() = 'admin')
  with check (public.my_design_permit() = 'admin');

-- Solo el superadmin concede permisos de diseño
create or replace function public.set_design_permit(p_user uuid, p_permit text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.profiles
                  where id = auth.uid() and role = 'superadmin') then
    raise exception 'Only the superadministrator can set design permits';
  end if;
  if p_permit not in ('admin','manager','none') then
    raise exception 'Invalid permit';
  end if;
  update public.profiles set design_permit = p_permit where id = p_user;
end;
$$;
grant execute on function public.set_design_permit(uuid, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 2) MEMBRESÍAS MULTIEMPRESA (para el selector "estoy dentro de…")
-- ----------------------------------------------------------------------------
drop function if exists public.my_companies();
create or replace function public.my_companies()
returns table (account_id uuid, name text)
language sql stable security definer set search_path = public
as $$
  select distinct a.id, a.name
    from public.user_product_access u
    join public.accounts a on a.id = u.account_id
   where u.user_id = auth.uid()
  union
  select a.id, a.name
    from public.accounts a
   where a.id = (select company_id from public.profiles where id = auth.uid())
  order by 2;
$$;
grant execute on function public.my_companies() to authenticated;

-- ----------------------------------------------------------------------------
-- 3) CAPACIDADES v3 — vista de auditor separada de su escritura
-- ----------------------------------------------------------------------------
-- ¿Puede VER la vista de auditor? superadmin · rol admin/assessor/auditor
-- (member o producto). El MANAGER queda fuera.
create or replace function public.can_view_auditor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'superadmin')
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role in ('admin','assessor','auditor'))
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment')
                        in ('admin','assessor','auditor'));
$$;
grant execute on function public.can_view_auditor(uuid) to authenticated;

-- Escribir lado cliente: admin/manager/assessor (member o producto) —
-- el AUDITOR queda en solo lectura del lado cliente (ya era así)
-- [sin cambios en can_edit_assessment_client / is_assessment_assessor]

drop function if exists public.assessment_capabilities(uuid);
create or replace function public.assessment_capabilities(aid uuid)
returns table (can_view boolean, can_edit_client boolean, is_assessor boolean,
               can_view_auditor boolean, can_manage_members boolean,
               product_role text, design_permit text)
language sql stable security definer set search_path = public
as $$
  select public.can_view_assessment(aid),
         public.can_edit_assessment_client(aid),
         public.is_assessment_assessor(aid),
         public.can_view_auditor(aid),
         public.can_manage_assessment_members(aid),
         (select public.my_product_role(a.company_id, 'assessment')
            from public.assessments a where a.id = aid),
         public.my_design_permit();
$$;
grant execute on function public.assessment_capabilities(uuid) to authenticated;

-- Lectura de findings / reviews / puntuaciones de auditor: solo quien puede
-- ver la vista de auditor (los managers dejan de verlas)
drop policy if exists "findings read" on public.assessment_findings;
create policy "findings read" on public.assessment_findings for select
  using (public.can_view_auditor(assessment_id));
drop policy if exists "reviews read" on public.assessment_criterion_reviews;
create policy "reviews read" on public.assessment_criterion_reviews for select
  using (public.can_view_auditor(assessment_id));
drop policy if exists "aud scores read" on public.assessment_auditor_scores;
create policy "aud scores read" on public.assessment_auditor_scores for select
  using (public.can_view_auditor(assessment_id));

-- ----------------------------------------------------------------------------
-- 4) ADMIN MULTIEMPRESA: crea/gestiona proyectos donde está asignado
-- ----------------------------------------------------------------------------
create or replace function public.admin_can_touch(p_account uuid, p_zone text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'admin')
     and ( p_account = (select company_id from public.profiles where id = auth.uid())
           or exists (select 1 from public.user_product_access u
                       where u.user_id = auth.uid()
                         and u.account_id = p_account
                         and u.zone_code = p_zone) );
$$;

drop policy if exists "projects insert" on public.projects;
create policy "projects insert" on public.projects for insert with check (
  created_by = auth.uid() and (
    exists (select 1 from public.profiles p
             where p.id = auth.uid() and p.role = 'superadmin')
    or public.admin_can_touch(account_id, zone_code)
  )
);
drop policy if exists "projects update" on public.projects;
create policy "projects update" on public.projects for update using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role = 'superadmin')
  or public.admin_can_touch(account_id, zone_code)
);
drop policy if exists "projects delete" on public.projects;
create policy "projects delete" on public.projects for delete using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role = 'superadmin')
  or public.admin_can_touch(account_id, zone_code)
);

-- VERIFICAR:
--   select public.my_design_permit();                    → admin/manager/none
--   select * from public.my_companies();                 → tus empresas
--   Manager de producto: no ve chips/paneles ámbar; assessor los ve grises;
--   auditor escribe en ámbar y el lado cliente le queda bloqueado.
-- ============================================================================
