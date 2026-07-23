-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 09b · FIX RLS "assessments"
--   Causa probable: migration-07 se detuvo a mitad (las políticas sobre
--   storage.objects fallan por permisos en algunos proyectos y el editor
--   SQL corta ahí, dejando sin ejecutar lo que venía después).
--   Este script:
--     1) Reescribe la política de INSERT en línea (sin función anidada)
--     2) Recrea my_assessment_companies (por si no llegó a crearse)
--     3) Crea las políticas de Storage de forma TOLERANTE (no rompe el script)
--     4) Diagnóstico final
-- Re-ejecutable. Ejecutar completo en el SQL Editor.
-- ============================================================================

-- 1) RPC del selector de empresas (idéntica lógica que la política)
create or replace function public.my_assessment_companies()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select s.account_id
    from public.subscriptions s
    join public.user_product_access u
      on u.account_id = s.account_id and u.zone_code = 'assessment'
   where s.zone_code = 'assessment'
     and s.status in ('trial','active')
     and u.user_id = auth.uid()
     and u.access_level in ('edit','manage')
  union
  select id from public.accounts where public.is_admin_or_above();
$$;

-- 2) Política de INSERT reescrita EN LÍNEA (misma lógica, sin depender de
--    que la función exista ni de su planificación dentro de la política)
drop policy if exists "assessments insert" on public.assessments;
create policy "assessments insert" on public.assessments for insert with check (
  created_by = auth.uid()
  and (
    public.is_admin_or_above()
    or exists (
      select 1
        from public.user_product_access u
        join public.subscriptions s
          on s.account_id = u.account_id
         and s.zone_code = 'assessment'
         and s.status in ('trial','active')
       where u.user_id = auth.uid()
         and u.zone_code = 'assessment'
         and u.access_level in ('edit','manage')
         and u.account_id = assessments.company_id
    )
  )
);

-- 3) Políticas de Storage con tolerancia a permisos (si el rol del editor no
--    puede tocar storage.objects, avisa y sigue en vez de abortar el script)
do $$
begin
  begin
    drop policy if exists "evidence read" on storage.objects;
    create policy "evidence read" on storage.objects for select using (
      bucket_id = 'assessment-evidence'
      and public.can_view_assessment((split_part(name, '/', 1))::uuid)
    );
    drop policy if exists "evidence insert" on storage.objects;
    create policy "evidence insert" on storage.objects for insert with check (
      bucket_id = 'assessment-evidence'
      and public.can_edit_assessment_client((split_part(name, '/', 1))::uuid)
    );
    drop policy if exists "evidence delete" on storage.objects;
    create policy "evidence delete" on storage.objects for delete using (
      bucket_id = 'assessment-evidence'
      and public.can_edit_assessment_client((split_part(name, '/', 1))::uuid)
    );
    raise notice 'Storage policies OK';
  exception when insufficient_privilege then
    raise warning 'Sin permisos sobre storage.objects desde el editor. '
      'Crea las 3 políticas del bucket assessment-evidence desde '
      'Dashboard → Storage → assessment-evidence → Policies (usando las '
      'expresiones de este script).';
  end;
end $$;

insert into storage.buckets (id, name, public)
values ('assessment-evidence', 'assessment-evidence', false)
on conflict (id) do nothing;

-- 4) RPC de diagnóstico — llamable desde la app o la consola del navegador:
--    const { data } = await supabase.rpc('debug_assessment_access',
--                                        { p_company: '<uuid de la empresa>' })
create or replace function public.debug_assessment_access(p_company uuid)
returns table (my_role text, is_admin boolean, has_active_subscription boolean,
               my_grant text, can_create boolean)
language sql stable security definer set search_path = public
as $$
  select
    coalesce(public.my_role()::text, 'NO PROFILE'),
    public.is_admin_or_above(),
    exists (select 1 from public.subscriptions s
             where s.account_id = p_company and s.zone_code = 'assessment'
               and s.status in ('trial','active')),
    coalesce((select u.access_level from public.user_product_access u
               where u.account_id = p_company and u.zone_code = 'assessment'
                 and u.user_id = auth.uid()), 'NONE'),
    public.is_admin_or_above() or exists (
      select 1 from public.user_product_access u
        join public.subscriptions s
          on s.account_id = u.account_id and s.zone_code = 'assessment'
         and s.status in ('trial','active')
       where u.user_id = auth.uid() and u.zone_code = 'assessment'
         and u.access_level in ('edit','manage') and u.account_id = p_company);
$$;

-- ============================================================================
-- DIAGNÓSTICO — ejecutar y revisar:
--   select count(*) as criterios from public.assessment_criteria;   → 7
--   select count(*) as preguntas from public.assessment_questions;  → 10
--   ⚠️ Si dan 0: la migration-07 se cortó ANTES del seed. Vuelve a
--      ejecutar migration-07 completa DESPUÉS de este script (ya no se
--      cortará: la sección de storage aquí queda tolerada) — el seed es
--      idempotente.
--   select polname from pg_policies
--    where tablename = 'assessments';   → debe incluir "assessments insert"
--
-- Y en la app (F12 → consola), con la sesión que falla:
--   const { data } = await window.supabase?.rpc?.(...)  — o simplemente
--   reintenta crear la evaluación: si sigue fallando, el debug RPC dirá
--   exactamente qué condición no se cumple (rol, suscripción o grant).
-- Recordatorio: el grant del usuario debe ser EDIT o MANAGE (view no crea),
-- y la empresa necesita subscription 'active' del producto assessment.
-- ============================================================================
