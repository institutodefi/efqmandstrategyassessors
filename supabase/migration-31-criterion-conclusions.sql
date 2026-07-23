-- ============================================================================
-- MIGRATION 31 · Conclusiones generales por criterio (panel del auditor)
-- Sustituyen a los huecos libres de strengths/improvements (los hallazgos
-- codificados vienen ahora del cuestionario). Idempotente.
-- ============================================================================
alter table public.assessment_criterion_reviews
  add column if not exists conclusions text;

select column_name from information_schema.columns
 where table_name = 'assessment_criterion_reviews' order by ordinal_position;
