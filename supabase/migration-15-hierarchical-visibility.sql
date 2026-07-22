-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 15 · VISIBILIDAD JERÁRQUICA
--   · SOLO el superadmin ve TODOS los proyectos y assessments
--   · Los administradores (y el resto) ven solo LO SUYO: lo que crearon,
--     donde son miembros / asignados, o lo de su empresa por rol de producto
--   · Las capacidades de edición/auditoría dejan de ser globales para
--     admin: actúan según su implicación (miembro, asignado, product-role);
--     el superadmin conserva poderes plenos
-- Ejecutar DESPUÉS de migration-14b. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) PROYECTOS: lectura jerárquica
-- ----------------------------------------------------------------------------
drop policy if exists "projects read" on public.projects;
create policy "projects read" on public.projects for select using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role = 'superadmin')
  or created_by = auth.uid()
  or public.is_project_member(id)
  or public.my_product_role(account_id, zone_code) is not null
);

-- ----------------------------------------------------------------------------
-- 2) ASSESSMENTS: misma jerarquía (superadmin todo; resto, lo suyo)
-- ----------------------------------------------------------------------------
create or replace function public.can_view_assessment(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assessments a
    where a.id = aid and (
      exists (select 1 from public.profiles p
               where p.id = auth.uid() and p.role = 'superadmin')
      or a.created_by = auth.uid()
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or public.is_assessment_member(aid)
      or public.my_product_role(a.company_id, 'assessment') is not null
    )
  );
$$;

-- Autoevaluación: superadmin · product-admin de la empresa ·
-- member admin/manager/assessor (el admin de plataforma, según implicación)
create or replace function public.can_edit_assessment_client(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'superadmin')
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

-- Auditoría: superadmin · consultor asignado · member auditor ·
-- product-auditor de la empresa
create or replace function public.is_assessment_assessor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'superadmin')
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role = 'auditor')
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment') = 'auditor');
$$;

-- Gestión de equipo del assessment: superadmin · product-admin · member admin
create or replace function public.can_manage_assessment_members(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'superadmin')
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment') = 'admin')
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role = 'admin');
$$;

-- ----------------------------------------------------------------------------
-- 3) Miembros de proyecto: lectura alineada (fuera el pase global de admin)
-- ----------------------------------------------------------------------------
drop policy if exists "members read" on public.project_members;
create policy "members read" on public.project_members for select using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p
              where p.id = auth.uid() and p.role = 'superadmin')
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
  or public.is_project_member(project_id)
);

-- Nota: los admins de plataforma conservan intactas sus zonas de gestión
-- (Contacts, Companies, CRM). Esta migración solo jerarquiza la visibilidad
-- de proyectos y assessments en el dashboard y el O360.
-- VERIFICAR: con un usuario admin, el dashboard lista solo sus proyectos;
-- con el superadmin, todos.
-- ============================================================================
