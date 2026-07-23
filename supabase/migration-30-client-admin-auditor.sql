-- ============================================================================
-- MIGRATION 30 · El administrador del cliente actúa de auditor por defecto
-- is_assessment_assessor (escritura de puntuación de auditor y findings)
-- incluye ahora también:
--   · miembros de la evaluación con rol 'admin'
--   · rol de producto 'admin' del cliente en la empresa de la evaluación
-- (antes solo superadmin/admin de plataforma, consultores asignados y 'auditor')
-- Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

create or replace function public.is_assessment_assessor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid()
                    and p.role in ('superadmin','admin'))
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role in ('admin','auditor'))
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment')
                        in ('admin','auditor'));
$$;
grant execute on function public.is_assessment_assessor(uuid) to authenticated;

-- can_view_auditor (migración-28) ya delega en esta función, así que la
-- lectura queda alineada automáticamente.

-- Verificación (sesión de un admin del cliente): debe devolver true
-- select public.is_assessment_assessor('<assessment_id>');
