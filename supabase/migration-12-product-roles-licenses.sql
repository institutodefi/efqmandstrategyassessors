-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 12 · MODELO DE PERMISOS POR PRODUCTO
--
--   · Empresa cliente: 1, 2 o 3 productos (check por producto)
--   · Cada producto emite N LICENCIAS (las fija el superadmin); los accesos
--     de usuarios consumen licencias y el límite se aplica en servidor
--   · Rol POR PRODUCTO de cada usuario (4): admin · manager · assessor · auditor
--     (el 5º, superadmin, es global y lo ve todo)
--   · Capacidades en O360 Assessment:
--       admin (producto)     → ve y gestiona todo lo de su empresa
--       manager / assessor   → se autoevalúa: responde y añade evidencias
--       auditor              → puntos fuertes / áreas de mejora + puntuación
--                              corregida (no toca la autoevaluación)
--   · FIX definitivo del RLS de assessments: TODAS las políticas se
--     recrean aquí. Este script es la única fuente de verdad; puede
--     re-ejecutarse tras cualquier otra migración sin miedo.
-- Ejecutar DESPUÉS de migration-11. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) LICENCIAS POR PRODUCTO
-- ----------------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists licenses int not null default 1 check (licenses >= 1);

-- ----------------------------------------------------------------------------
-- 2) ROLES POR PRODUCTO (antes view/edit/manage → ahora 4 roles)
--    Mapeo de datos existentes: manage→admin · edit→manager · view→assessor
-- ----------------------------------------------------------------------------
alter table public.user_product_access
  drop constraint if exists user_product_access_access_level_check;

update public.user_product_access set access_level = case access_level
  when 'manage' then 'admin'
  when 'edit'   then 'manager'
  when 'view'   then 'assessor'
  else access_level end
where access_level in ('view','edit','manage');

alter table public.user_product_access
  alter column access_level set default 'assessor';
alter table public.user_product_access
  add constraint user_product_access_access_level_check
  check (access_level in ('admin','manager','assessor','auditor'));

-- Límite de licencias: no se pueden conceder más accesos que licencias
create or replace function public.enforce_license_limit()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare v_lic int; v_used int;
begin
  select max(licenses) into v_lic
    from public.subscriptions
   where account_id = new.account_id and zone_code = new.zone_code
     and status in ('trial','active');
  if v_lic is null then
    raise exception 'No active subscription for this product — activate it first';
  end if;
  select count(*) into v_used
    from public.user_product_access
   where account_id = new.account_id and zone_code = new.zone_code
     and (tg_op = 'INSERT' or user_id <> new.user_id);
  if v_used >= v_lic then
    raise exception 'License limit reached (% of %) for this product', v_used, v_lic;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_license_limit on public.user_product_access;
create trigger trg_license_limit
  before insert on public.user_product_access
  for each row execute function public.enforce_license_limit();

-- ----------------------------------------------------------------------------
-- 3) HELPERS (fuente única)
-- ----------------------------------------------------------------------------
create or replace function public.my_product_role(p_account uuid, p_zone text)
returns text
language sql stable security definer set search_path = public
as $$
  select access_level from public.user_product_access
   where user_id = auth.uid() and account_id = p_account and zone_code = p_zone;
$$;
grant execute on function public.my_product_role(uuid, text) to authenticated;

create or replace function public.has_active_sub(p_account uuid, p_zone text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.subscriptions
    where account_id = p_account and zone_code = p_zone
      and status in ('trial','active'));
$$;

-- Ver una evaluación: superadmin/admin plataforma · account_manager (lectura)
-- · consultor asignado · CUALQUIER rol de producto en esa empresa
create or replace function public.can_view_assessment(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assessments a
    where a.id = aid and (
      public.is_admin_or_above()
      or public.my_role() = 'account_manager'
      or a.created_by = auth.uid()
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or public.my_product_role(a.company_id, 'assessment') is not null
    )
  );
$$;

-- Autoevaluación (responder, justificar, evidencias): admin plataforma o
-- rol de producto admin/manager/assessor — el auditor NO edita la autoevaluación
create or replace function public.can_edit_assessment_client(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_admin_or_above() or exists (
    select 1 from public.assessments a
    where a.id = aid
      and a.status in ('in_progress','submitted')
      and public.my_product_role(a.company_id, 'assessment')
          in ('admin','manager','assessor')
  );
$$;

-- Corrección de auditor (findings, reviews, puntuación corregida, estado):
-- admin plataforma · consultor asignado · rol de producto AUDITOR
create or replace function public.is_assessment_assessor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_admin_or_above()
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment') = 'auditor');
$$;

-- ¿Dónde puedo crear evaluaciones? admin plataforma: todas; resto: empresas
-- con suscripción activa y rol de producto admin/manager/assessor
create or replace function public.my_assessment_companies()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select u.account_id
    from public.user_product_access u
   where u.user_id = auth.uid()
     and u.zone_code = 'assessment'
     and u.access_level in ('admin','manager','assessor')
     and public.has_active_sub(u.account_id, 'assessment')
  union
  select id from public.accounts where public.is_admin_or_above();
$$;

-- Capacidades de una evaluación en una llamada (para la app)
create or replace function public.assessment_capabilities(aid uuid)
returns table (can_view boolean, can_edit_client boolean, is_assessor boolean,
               product_role text)
language sql stable security definer set search_path = public
as $$
  select public.can_view_assessment(aid),
         public.can_edit_assessment_client(aid),
         public.is_assessment_assessor(aid),
         (select public.my_product_role(a.company_id, 'assessment')
            from public.assessments a where a.id = aid);
$$;
grant execute on function public.assessment_capabilities(uuid) to authenticated;

-- Debug actualizado al nuevo modelo
create or replace function public.debug_assessment_access(p_company uuid)
returns table (my_role text, is_admin boolean, has_active_subscription boolean,
               my_grant text, can_create boolean)
language sql stable security definer set search_path = public
as $$
  select
    coalesce(public.my_role()::text, 'NO PROFILE'),
    public.is_admin_or_above(),
    public.has_active_sub(p_company, 'assessment'),
    coalesce(public.my_product_role(p_company, 'assessment'), 'NONE'),
    public.is_admin_or_above()
      or (public.has_active_sub(p_company, 'assessment')
          and public.my_product_role(p_company, 'assessment')
              in ('admin','manager','assessor'));
$$;

-- ----------------------------------------------------------------------------
-- 4) POLÍTICAS — se recrean TODAS (fuente única, machaca restos de 07/09b)
-- ----------------------------------------------------------------------------
drop policy if exists "assessments read"   on public.assessments;
drop policy if exists "assessments insert" on public.assessments;
drop policy if exists "assessments update" on public.assessments;
drop policy if exists "assessments delete" on public.assessments;

create policy "assessments read" on public.assessments for select
  using (public.can_view_assessment(id));
create policy "assessments insert" on public.assessments for insert with check (
  created_by = auth.uid() and (
    public.is_admin_or_above()
    or ( public.has_active_sub(company_id, 'assessment')
         and public.my_product_role(company_id, 'assessment')
             in ('admin','manager','assessor') )
  )
);
create policy "assessments update" on public.assessments for update using (
  public.can_edit_assessment_client(id) or public.is_assessment_assessor(id)
);
create policy "assessments delete" on public.assessments for delete
  using (public.is_admin_or_above());

-- Las demás tablas usan los helpers (recreados arriba), así que sus políticas
-- existentes quedan automáticamente alineadas al nuevo modelo. Se recrean
-- igualmente las de escritura clave por si alguna quedó de una versión vieja:
drop policy if exists "answers upsert" on public.assessment_answers;
create policy "answers upsert" on public.assessment_answers for insert with check (
  public.can_edit_assessment_client(assessment_id)
);
drop policy if exists "answers update" on public.assessment_answers;
create policy "answers update" on public.assessment_answers for update using (
  public.can_edit_assessment_client(assessment_id)
);
drop policy if exists "aud scores insert" on public.assessment_auditor_scores;
create policy "aud scores insert" on public.assessment_auditor_scores for insert
  with check (public.is_assessment_assessor(assessment_id));
drop policy if exists "aud scores update" on public.assessment_auditor_scores;
create policy "aud scores update" on public.assessment_auditor_scores for update
  using (public.is_assessment_assessor(assessment_id));

-- ============================================================================
-- VERIFICAR (con tu sesión, desde la app o el debug):
--   select * from public.debug_assessment_access('<uuid empresa>');
--   → can_create debe ser true para admin/superadmin SIEMPRE.
-- Licencias: al conceder el acceso nº (licenses+1) de un producto, el alta
-- falla con "License limit reached". Amplía licencias en la suscripción.
-- ============================================================================
