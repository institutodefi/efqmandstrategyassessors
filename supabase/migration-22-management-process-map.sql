-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 22 · MANAGEMENT & GOVERNANCE · PROCESS MAP
--   Un documento jsonb por proyecto de la zona `governance` con el mapa de
--   procesos (bandas → procesos → subprocesos), al estilo Mas Camarena:
--   codificación automática, columnas Pre/Ongoing/Post y drag & drop en front.
--   El documento vive entero en `data`; el front lo guarda con upsert.
-- Re-ejecutable. Ejecutar completo en el SQL Editor.
-- ============================================================================

-- 1) Tabla ------------------------------------------------------------------
create table if not exists public.management_maps (
  project_id  uuid primary key references public.projects(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_by  uuid references auth.users(id),
  updated_at  timestamptz not null default now()
);

alter table public.management_maps enable row level security;

drop trigger if exists trg_management_maps_touch on public.management_maps;
create trigger trg_management_maps_touch
  before update on public.management_maps
  for each row execute function public.touch_updated_at();

-- 2) Helper: mi rol de miembro en un proyecto (SECURITY DEFINER, sin ciclos) -
create or replace function public.my_member_role(pid uuid)
returns text
language sql stable security definer set search_path = public
as $$
  select member_role from public.project_members
   where project_id = pid and user_id = auth.uid()
   limit 1;
$$;
grant execute on function public.my_member_role(uuid) to authenticated;

-- 3) Políticas ---------------------------------------------------------------
--   Leer: staff (superadmin/admin), account manager, creador del proyecto o
--         cualquier miembro del proyecto.
--   Escribir: staff, creador, consultores miembros, y miembros con rol de
--         producto admin/manager/assessor. Los auditores solo leen.
drop policy if exists "mgmaps read" on public.management_maps;
create policy "mgmaps read" on public.management_maps for select using (
  public.is_admin_or_above()
  or public.my_role() = 'account_manager'
  or public.is_project_member(project_id)
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
);

drop policy if exists "mgmaps insert" on public.management_maps;
create policy "mgmaps insert" on public.management_maps for insert with check (
  public.is_admin_or_above()
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
  or (public.my_role() = 'consultant' and public.is_project_member(project_id))
  or public.my_member_role(project_id) in ('admin','manager','assessor')
);

drop policy if exists "mgmaps update" on public.management_maps;
create policy "mgmaps update" on public.management_maps for update using (
  public.is_admin_or_above()
  or exists (select 1 from public.projects pr
              where pr.id = project_id and pr.created_by = auth.uid())
  or (public.my_role() = 'consultant' and public.is_project_member(project_id))
  or public.my_member_role(project_id) in ('admin','manager','assessor')
);

drop policy if exists "mgmaps delete" on public.management_maps;
create policy "mgmaps delete" on public.management_maps for delete
  using (public.is_admin_or_above());

-- 4) Comprobación ------------------------------------------------------------
--   select * from pg_policies where tablename = 'management_maps';
--   → mgmaps read / insert / update / delete
