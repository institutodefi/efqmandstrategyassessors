-- ============================================================================
-- MIGRATION 28 · FIX: no se podían añadir findings
-- Causa: is_assessment_assessor (escritura) incluye al rol de plataforma
-- 'admin' y a los consultores asignados (assessment_assignments), pero
-- can_view_auditor (lectura, migración-19) no — el INSERT devolvía RETURNING
-- vacío y el finding "desaparecía".
-- Arreglo: quien puede escribir como assessor puede ver el material de auditor.
-- Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

create or replace function public.can_view_auditor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_assessment_assessor(aid)          -- superadmin, admin,
                                                     -- consultores asignados,
                                                     -- miembros/product 'auditor'
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role in ('admin','assessor','auditor'))
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment')
                        in ('admin','assessor','auditor'));
$$;
grant execute on function public.can_view_auditor(uuid) to authenticated;

-- Verificación (con tu sesión): debe devolver true en una evaluación tuya
-- select public.can_view_auditor('<assessment_id>');
