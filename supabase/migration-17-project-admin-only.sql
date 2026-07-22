-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 17 · PROYECTOS: SOLO ADMIN/SUPERADMIN
--   · CREAR proyecto: únicamente administrador o superadministrador
--   · BORRAR proyecto: únicamente administrador o superadministrador
--   · (El código automático y el cuelgue en su zona ya los pone el trigger;
--      el assessment enlazado nace igual que hasta ahora)
-- Ejecutar DESPUÉS de migration-16. Re-ejecutable.
-- ============================================================================

drop policy if exists "projects insert" on public.projects;
create policy "projects insert" on public.projects for insert with check (
  created_by = auth.uid()
  and exists (select 1 from public.profiles p
               where p.id = auth.uid() and p.role in ('superadmin','admin'))
);

drop policy if exists "projects delete" on public.projects;
create policy "projects delete" on public.projects for delete using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role in ('superadmin','admin'))
);

-- El alcance del formulario "New project" acompaña a la política:
drop function if exists public.my_project_scopes();
create or replace function public.my_project_scopes()
returns table (account_id uuid, zone_code text)
language sql stable security definer set search_path = public
as $$
  select a.id, z.code
    from public.accounts a cross join public.zones z
   where z.is_active
     and exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role in ('superadmin','admin'));
$$;
grant execute on function public.my_project_scopes() to authenticated;

-- VERIFICAR: un consultant o product-admin NO ve "New project" ni puede
-- insertar por API; admin/superadmin crean y borran con normalidad.
-- ============================================================================
