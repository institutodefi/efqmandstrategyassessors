-- ============================================================================
-- MIGRATION 27 · Nota explicativa en los documentos de evidencia
--   · assessment_documents.note: el cliente puede explicar qué demuestra
--     cada documento subido.
--   · Política RLS de UPDATE (antes solo había read/insert/delete).
-- Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

alter table public.assessment_documents
  add column if not exists note text;

drop policy if exists "docs update" on public.assessment_documents;
create policy "docs update" on public.assessment_documents for update
  using (public.can_edit_assessment_client(assessment_id))
  with check (public.can_edit_assessment_client(assessment_id));

-- Verificación
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'assessment_documents'
order by ordinal_position;
