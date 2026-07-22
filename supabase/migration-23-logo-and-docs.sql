-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 23 · COMPANY LOGO + MANAGEMENT DOCUMENTS
--   1) accounts.logo_url — el logo vive en la zona de empresa (Companies)
--   2) Bucket público `company-logos` (el logo se sirve por URL pública)
--   3) Bucket privado `management-docs` — documentos de titulaciones de las
--      personas de la fase Management (ruta: <project_id>/titles/<archivo>);
--      lectura y escritura solo para staff, creador o miembros del proyecto,
--      servido con URLs firmadas desde el front.
--   Las políticas de storage van en bloques tolerantes (patrón migración-09b):
--   si el rol del SQL Editor no puede tocar storage.objects, avisa y sigue.
-- Re-ejecutable. Ejecutar completo en el SQL Editor.
-- ============================================================================

-- 1) Columna de logo en accounts ---------------------------------------------
alter table public.accounts add column if not exists logo_url text;

-- 2) Buckets ------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('company-logos', 'company-logos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('management-docs', 'management-docs', false)
on conflict (id) do nothing;

-- 3) Políticas de storage (tolerantes) ---------------------------------------
do $$
begin
  -- ---- company-logos: lectura pública, escritura de staff (super/admin) ----
  begin
    drop policy if exists "logos read" on storage.objects;
    create policy "logos read" on storage.objects for select using (
      bucket_id = 'company-logos'
    );
    drop policy if exists "logos insert" on storage.objects;
    create policy "logos insert" on storage.objects for insert with check (
      bucket_id = 'company-logos' and public.is_admin_or_above()
    );
    drop policy if exists "logos update" on storage.objects;
    create policy "logos update" on storage.objects for update using (
      bucket_id = 'company-logos' and public.is_admin_or_above()
    );
    drop policy if exists "logos delete" on storage.objects;
    create policy "logos delete" on storage.objects for delete using (
      bucket_id = 'company-logos' and public.is_admin_or_above()
    );
  exception when insufficient_privilege then
    raise notice 'storage.objects: sin permisos para políticas de company-logos — créalas desde el dashboard';
  end;

  -- ---- management-docs: por proyecto (carpeta 1 = project_id) --------------
  begin
    drop policy if exists "mgdocs read" on storage.objects;
    create policy "mgdocs read" on storage.objects for select using (
      bucket_id = 'management-docs' and exists (
        select 1 from public.projects pr
         where pr.id::text = (storage.foldername(name))[1]
           and (public.is_admin_or_above()
                or pr.created_by = auth.uid()
                or public.is_project_member(pr.id))
      )
    );
    drop policy if exists "mgdocs insert" on storage.objects;
    create policy "mgdocs insert" on storage.objects for insert with check (
      bucket_id = 'management-docs' and exists (
        select 1 from public.projects pr
         where pr.id::text = (storage.foldername(name))[1]
           and (public.is_admin_or_above()
                or pr.created_by = auth.uid()
                or public.my_member_role(pr.id) in ('admin','manager','assessor')
                or (public.my_role() = 'consultant' and public.is_project_member(pr.id)))
      )
    );
    drop policy if exists "mgdocs delete" on storage.objects;
    create policy "mgdocs delete" on storage.objects for delete using (
      bucket_id = 'management-docs' and exists (
        select 1 from public.projects pr
         where pr.id::text = (storage.foldername(name))[1]
           and (public.is_admin_or_above()
                or pr.created_by = auth.uid()
                or public.my_member_role(pr.id) in ('admin','manager','assessor')
                or (public.my_role() = 'consultant' and public.is_project_member(pr.id)))
      )
    );
  exception when insufficient_privilege then
    raise notice 'storage.objects: sin permisos para políticas de management-docs — créalas desde el dashboard';
  end;
end $$;

-- 4) Comprobación ------------------------------------------------------------
--   select id, public from storage.buckets where id in ('company-logos','management-docs');
--   select policyname from pg_policies where tablename = 'objects'
--    and policyname in ('logos read','mgdocs read');
