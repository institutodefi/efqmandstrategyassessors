-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 12c · RESET TOTAL DE POLÍTICAS + PRUEBA
--
-- ⚠️ ANTES DE EJECUTAR — VERIFICA EL PROYECTO:
--    Settings → API → Project URL debe ser EXACTAMENTE el mismo que la
--    variable VITE_SUPABASE_URL de Netlify (wiraonfdufycdcqgurpx.supabase.co).
--    Con varias pestañas de Supabase abiertas es fácil ejecutar SQL en un
--    proyecto y que la app hable con otro — y encaja con los síntomas.
--
-- Este script:
--   1) Muestra las políticas actuales de assessments (foto del estado real)
--   2) BORRA TODAS las políticas de assessments, se llamen como se llamen
--   3) Recrea las 4 canónicas con chequeo directo a profiles
--   4) Te da una función de prueba determinista (sin depender de la sesión)
-- Re-ejecutable.
-- ============================================================================

-- 1) FOTO ANTES (apunta lo que salga si vuelve a fallar)
select policyname, cmd, qual, with_check
  from pg_policies
 where schemaname = 'public' and tablename = 'assessments';

-- 2) BORRADO DINÁMICO DE TODAS LAS POLÍTICAS DE LA TABLA
do $$
declare r record;
begin
  for r in select policyname from pg_policies
            where schemaname = 'public' and tablename = 'assessments'
  loop
    execute format('drop policy %I on public.assessments', r.policyname);
    raise notice 'dropped policy: %', r.policyname;
  end loop;
end $$;

alter table public.assessments enable row level security;

-- 3) LAS 4 POLÍTICAS CANÓNICAS (todo con chequeo directo a profiles)
create policy "assessments read" on public.assessments for select using (
  created_by = auth.uid()
  or exists (select 1 from public.profiles p
              where p.id = auth.uid()
                and p.role in ('superadmin','admin','account_manager'))
  or exists (select 1 from public.assessment_assignments x
              where x.assessment_id = id and x.consultant_id = auth.uid())
  or exists (select 1 from public.user_product_access u
              where u.user_id = auth.uid() and u.zone_code = 'assessment'
                and u.account_id = assessments.company_id)
);

create policy "assessments insert" on public.assessments for insert with check (
  created_by = auth.uid()
  and (
    exists (select 1 from public.profiles p
             where p.id = auth.uid() and p.role in ('superadmin','admin'))
    or exists (
      select 1
        from public.user_product_access u
        join public.subscriptions s
          on s.account_id = u.account_id
         and s.zone_code = 'assessment'
         and s.status in ('trial','active')
       where u.user_id = auth.uid()
         and u.zone_code = 'assessment'
         and u.access_level in ('admin','manager','assessor')
         and u.account_id = assessments.company_id
    )
  )
);

create policy "assessments update" on public.assessments for update using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role in ('superadmin','admin'))
  or public.can_edit_assessment_client(id)
  or public.is_assessment_assessor(id)
);

create policy "assessments delete" on public.assessments for delete using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role in ('superadmin','admin'))
);

-- 4) PRUEBA DETERMINISTA — evalúa cada condición con un uid EXPLÍCITO,
--    sin depender de la sesión del editor (auth.uid() aquí suele ser null)
drop function if exists public.test_assessment_insert(uuid, uuid);
create or replace function public.test_assessment_insert(p_uid uuid, p_company uuid)
returns table (condition text, passes boolean)
language sql stable security definer set search_path = public
as $$
  values
    ('profile exists', exists (select 1 from public.profiles where id = p_uid)),
    ('profile role is superadmin/admin',
      exists (select 1 from public.profiles
               where id = p_uid and role in ('superadmin','admin'))),
    ('active subscription (assessment)',
      exists (select 1 from public.subscriptions
               where account_id = p_company and zone_code = 'assessment'
                 and status in ('trial','active'))),
    ('product role admin/manager/assessor',
      exists (select 1 from public.user_product_access
               where user_id = p_uid and account_id = p_company
                 and zone_code = 'assessment'
                 and access_level in ('admin','manager','assessor'))),
    ('WITH CHECK verdict (as this uid)',
      exists (select 1 from public.profiles
               where id = p_uid and role in ('superadmin','admin'))
      or exists (select 1 from public.user_product_access u
                  join public.subscriptions s
                    on s.account_id = u.account_id and s.zone_code = 'assessment'
                   and s.status in ('trial','active')
                 where u.user_id = p_uid and u.zone_code = 'assessment'
                   and u.access_level in ('admin','manager','assessor')
                   and u.account_id = p_company));
$$;

-- 5) FOTO DESPUÉS + PRUEBA con tu superadmin sobre cada empresa:
select policyname, cmd from pg_policies
 where schemaname = 'public' and tablename = 'assessments';

select a.name as company, t.condition, t.passes
from auth.users u,
     public.accounts a,
     lateral public.test_assessment_insert(u.id, a.id) t
where lower(u.email) = 'alejandro@efqmassessors.ae'
order by a.name, t.condition;

-- Con "WITH CHECK verdict = true", el insert desde la app YA NO PUEDE fallar
-- en este proyecto. Si la app sigue fallando, la app apunta a OTRO proyecto:
-- compara Settings → API → Project URL con VITE_SUPABASE_URL en Netlify.
-- ============================================================================
