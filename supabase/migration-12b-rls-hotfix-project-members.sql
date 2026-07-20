-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 12b · FIX DEFINITIVO + MIEMBROS DE PROYECTO
--
--   A) El INSERT de assessments fallaba incluso como superadmin → alguna
--      versión antigua de my_role()/is_admin_or_above() sobrevive en esta
--      base de datos. Solución: se recrean las funciones canónicas Y las
--      políticas críticas consultan public.profiles DIRECTAMENTE (sin
--      cadena de funciones que pueda estar rota).
--   B) Miembros por proyecto: a cada proyecto se añaden usuarios con su rol
--      (admin · manager · assessor · auditor).
-- Re-ejecutable. Ejecutar completo.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- A1) Funciones canónicas (sana cualquier resto antiguo)
-- ----------------------------------------------------------------------------
create or replace function public.my_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid(); $$;

create or replace function public.is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin');
$$;

create or replace function public.is_admin_or_above()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles
    where id = auth.uid() and role in ('superadmin','admin'));
$$;

-- ----------------------------------------------------------------------------
-- A2) Política de INSERT con chequeo DIRECTO a profiles (a prueba de todo)
-- ----------------------------------------------------------------------------
drop policy if exists "assessments insert" on public.assessments;
create policy "assessments insert" on public.assessments for insert with check (
  created_by = auth.uid()
  and (
    exists (select 1 from public.profiles p
             where p.id = auth.uid() and p.role in ('superadmin','admin'))
    or exists (
      select 1
        from public.user_product_access u
        join public.subscriptions s
          on s.account_id = u.account_id
         and s.zone_code = 'assessment'
         and s.status in ('trial','active')
       where u.user_id = auth.uid()
         and u.zone_code = 'assessment'
         and u.access_level in ('admin','manager','assessor')
         and u.account_id = assessments.company_id
    )
  )
);

-- Debug v3: muestra también el veredicto de cada condición de la política
-- (drop previo: cambia el tipo de retorno respecto a versiones anteriores)
drop function if exists public.debug_assessment_access(uuid);
create or replace function public.debug_assessment_access(p_company uuid)
returns table (auth_uid uuid, my_role text, is_admin boolean,
               has_active_subscription boolean, my_grant text, can_create boolean)
language sql stable security definer set search_path = public
as $$
  select
    auth.uid(),
    coalesce((select role::text from public.profiles where id = auth.uid()), 'NO PROFILE'),
    exists (select 1 from public.profiles
             where id = auth.uid() and role in ('superadmin','admin')),
    exists (select 1 from public.subscriptions
             where account_id = p_company and zone_code = 'assessment'
               and status in ('trial','active')),
    coalesce((select access_level from public.user_product_access
               where user_id = auth.uid() and account_id = p_company
                 and zone_code = 'assessment'), 'NONE'),
    exists (select 1 from public.profiles
             where id = auth.uid() and role in ('superadmin','admin'))
    or exists (
      select 1 from public.user_product_access u
        join public.subscriptions s
          on s.account_id = u.account_id and s.zone_code = 'assessment'
         and s.status in ('trial','active')
       where u.user_id = auth.uid() and u.zone_code = 'assessment'
         and u.access_level in ('admin','manager','assessor')
         and u.account_id = p_company);
$$;

-- ----------------------------------------------------------------------------
-- B) MIEMBROS DE PROYECTO con roles de producto
-- ----------------------------------------------------------------------------
alter table public.project_members
  drop constraint if exists project_members_member_role_check;

update public.project_members set member_role = case member_role
  when 'lead_consultant' then 'admin'
  when 'consultant'      then 'assessor'
  when 'client'          then 'manager'
  else member_role end
where member_role in ('lead_consultant','consultant','client');

alter table public.project_members
  alter column member_role set default 'assessor';
alter table public.project_members
  add constraint project_members_member_role_check
  check (member_role in ('admin','manager','assessor','auditor'));

-- Políticas de gestión de miembros: admins de plataforma y el creador del
-- proyecto gestionan; los miembros se ven a sí mismos y al resto del equipo.
alter table public.project_members enable row level security;

drop policy if exists "members read" on public.project_members;
create policy "members read" on public.project_members for select using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p
              where p.id = auth.uid() and p.role in ('superadmin','admin','account_manager'))
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
  or exists (select 1 from public.project_members m2
              where m2.project_id = project_members.project_id
                and m2.user_id = auth.uid())
);

drop policy if exists "members manage" on public.project_members;
create policy "members manage" on public.project_members for all using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role in ('superadmin','admin'))
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
) with check (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role in ('superadmin','admin'))
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
);

-- ============================================================================
-- VERIFICAR:
--   select * from public.debug_assessment_access('<uuid empresa>');
--   → is_admin=true y can_create=true para tu superadmin. Si is_admin sale
--     false con role 'superadmin', el perfil no está: ejecuta migration-09.
-- ============================================================================
