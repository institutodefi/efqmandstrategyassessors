-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 11 · AUDITOR SCORING (dual report)
--   El auditor puntúa cada pregunta en paralelo al cliente → dos barras y
--   dos informes: score de cliente y score de auditor.
-- Ejecutar DESPUÉS de migration-10. Re-ejecutable.
-- ============================================================================

create table if not exists public.assessment_auditor_scores (
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  question_code text not null references public.assessment_questions (code),
  level         int  check (level between 0 and 5),   -- score = level*20
  note          text,                                  -- auditor rationale
  auditor_id    uuid references auth.users (id),
  updated_at    timestamptz not null default now(),
  primary key (assessment_id, question_code)
);

alter table public.assessment_auditor_scores enable row level security;

-- Ver: quien puede ver la evaluación. Escribir: SOLO assessor asignado o admin.
drop policy if exists "aud scores read" on public.assessment_auditor_scores;
create policy "aud scores read" on public.assessment_auditor_scores for select
  using (public.can_view_assessment(assessment_id));

drop policy if exists "aud scores insert" on public.assessment_auditor_scores;
create policy "aud scores insert" on public.assessment_auditor_scores for insert
  with check (public.is_assessment_assessor(assessment_id));

drop policy if exists "aud scores update" on public.assessment_auditor_scores;
create policy "aud scores update" on public.assessment_auditor_scores for update
  using (public.is_assessment_assessor(assessment_id));

drop policy if exists "aud scores delete" on public.assessment_auditor_scores;
create policy "aud scores delete" on public.assessment_auditor_scores for delete
  using (public.is_assessment_assessor(assessment_id));

drop trigger if exists trg_touch_aud_scores on public.assessment_auditor_scores;
create trigger trg_touch_aud_scores before update on public.assessment_auditor_scores
  for each row execute function public.touch_updated_at();

-- VERIFICAR:
--   select polname from pg_policies where tablename = 'assessment_auditor_scores';
