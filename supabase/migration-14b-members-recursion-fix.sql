-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 14b · FIX RECURSIÓN RLS project_members
--   La política de lectura consultaba la propia tabla → recursión infinita.
--   El "¿soy miembro?" pasa a una función SECURITY DEFINER (bypassa RLS
--   internamente y rompe el ciclo).
-- Re-ejecutable.
-- ============================================================================

create or replace function public.is_project_member(pid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.project_members
                  where project_id = pid and user_id = auth.uid());
$$;
grant execute on function public.is_project_member(uuid) to authenticated;

drop policy if exists "members read" on public.project_members;
create policy "members read" on public.project_members for select using (
  user_id = auth.uid()
  or exists (select 1 from public.profiles p
              where p.id = auth.uid()
                and p.role in ('superadmin','admin','account_manager','consultant'))
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
  or public.is_project_member(project_id)
);

-- La política de gestión no se auto-referencia (mira projects/profiles),
-- pero se recrea igual por consistencia:
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

-- Mismo patrón preventivo en assessment_members (su "read" usa una función
-- definer, así que no recursa — pero dejamos el helper disponible):
create or replace function public.is_assessment_member(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.assessment_members
                  where assessment_id = aid and user_id = auth.uid());
$$;
grant execute on function public.is_assessment_member(uuid) to authenticated;

-- VERIFICAR: abrir Members ▾ en un proyecto y añadir un usuario — sin error.
-- ============================================================================
