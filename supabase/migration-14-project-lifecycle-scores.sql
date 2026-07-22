-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 14 · CICLO DE VIDA DE PROYECTOS + SCORES
--
--   · Proyectos: SUSPENDER (on_hold) y ELIMINAR — con permisos claros;
--     eliminar un proyecto O360 elimina también su assessment enlazado
--   · Miembros de proyecto: sección AUTOCONTENIDA (repite la parte B de la
--     12b por si quedó sin ejecutar — causa probable de "no puedo añadir")
--   · O360: resumen por assessment con avance y puntuaciones (RPC para el
--     score de colores de la lista)
-- Ejecutar DESPUÉS de migration-13. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) PROYECTOS: estados (incluye suspensión) + políticas de gestión
-- ----------------------------------------------------------------------------
alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects add constraint projects_status_check
  check (status in ('draft','design','in_progress','on_hold','review',
                    'delivered','archived'));

-- Actualizar (estado, avance…): plataforma · creador · product-admin de la
-- empresa del proyecto
drop policy if exists "projects update" on public.projects;
create policy "projects update" on public.projects for update using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid()
             and p.role in ('superadmin','admin','consultant'))
  or created_by = auth.uid()
  or public.my_product_role(account_id, zone_code) = 'admin'
);

-- Eliminar: plataforma admin/superadmin · creador del proyecto
drop policy if exists "projects delete" on public.projects;
create policy "projects delete" on public.projects for delete using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role in ('superadmin','admin'))
  or created_by = auth.uid()
);

-- Eliminar proyecto O360 → eliminar su assessment enlazado (nació de él)
do $$ begin
  alter table public.assessments drop constraint if exists assessments_project_id_fkey;
  alter table public.assessments
    add constraint assessments_project_id_fkey
    foreign key (project_id) references public.projects (id) on delete cascade;
end $$;

-- ----------------------------------------------------------------------------
-- 2) MIEMBROS DE PROYECTO — autocontenido (fix de "no puedo añadir gente")
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

alter table public.project_members enable row level security;

drop policy if exists "members read" on public.project_members;
create policy "members read" on public.project_members for select using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p
              where p.id = auth.uid()
                and p.role in ('superadmin','admin','account_manager','consultant'))
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
              where pr.id = project_id
                and (pr.created_by = auth.uid()
                     or public.my_product_role(pr.account_id, pr.zone_code) = 'admin'))
) with check (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role in ('superadmin','admin'))
  or exists (select 1 from public.projects pr
              where pr.id = project_id
                and (pr.created_by = auth.uid()
                     or public.my_product_role(pr.account_id, pr.zone_code) = 'admin'))
);

-- ----------------------------------------------------------------------------
-- 3) O360: RESUMEN CON AVANCE Y PUNTUACIONES (para el score de colores)
-- ----------------------------------------------------------------------------
drop function if exists public.my_assessment_summaries();
create or replace function public.my_assessment_summaries()
returns table (id uuid, code text, title text, status text, company_id uuid,
               updated_at timestamptz, answered int, total_questions int,
               client_score int, auditor_score int)
language sql stable security definer set search_path = public
as $$
  select a.id, a.code, a.title, a.status, a.company_id, a.updated_at,
         (select count(*)::int from public.assessment_answers x
           where x.assessment_id = a.id and x.level is not null),
         (select count(*)::int from public.assessment_questions),
         (select round(avg(x.level) * 20)::int from public.assessment_answers x
           where x.assessment_id = a.id and x.level is not null),
         (select round(avg(x.level) * 20)::int from public.assessment_auditor_scores x
           where x.assessment_id = a.id and x.level is not null)
  from public.assessments a
  where public.can_view_assessment(a.id)
  order by a.updated_at desc;
$$;
grant execute on function public.my_assessment_summaries() to authenticated;

-- VERIFICAR:
--   select * from pg_policies where tablename in ('projects','project_members');
--   Añadir un miembro desde la app → ya no falla en silencio ni por constraint.
-- ============================================================================
