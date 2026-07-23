-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 18 · REGLAS DE DASHBOARD Y PROYECTOS v2
--
--   · Superadmin ve todo (sin cambios)
--   · ADMINISTRADOR = admin de SU EMPRESA: ve los datos de su empresa
--     (perfil, productos) y sus proyectos activos
--   · Cada zona permite crear proyectos; el LÍMITE de proyectos se fija en
--     el perfil de empresa POR PRODUCTO (junto a las licencias) y se aplica
--     en servidor
--   · Admin y superadmin: crear, paralizar (on_hold) y borrar proyectos
--   · CONSULTORES (asignados) → meten evidencias y autoevaluación
--   · AUDITORES → auditan (solo ellos corrigen)
--   · Códigos: O360 = P0360-CLI-NNN · Management = MAG-#### · Project = PM-####
-- Ejecutar DESPUÉS de migration-17. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) CÓDIGOS: MAG y PM
-- ----------------------------------------------------------------------------
create or replace function public.next_project_code(p_zone text)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_n int;
  v_prefix text := case p_zone
    when 'assessment'     then 'AST'      -- (no se usa: O360 va por P0360-)
    when 'governance'     then 'MAG'
    when 'transformation' then 'PM'
    else upper(left(p_zone, 3))
  end;
begin
  insert into public.project_counters (zone_code) values (p_zone)
  on conflict (zone_code) do nothing;
  update public.project_counters
     set counter = counter + 1
   where zone_code = p_zone
  returning counter into v_n;
  return v_prefix || '-' || lpad(v_n::text, 4, '0');
end;
$$;

-- ----------------------------------------------------------------------------
-- 2) LÍMITE DE PROYECTOS POR PRODUCTO (perfil de empresa)
-- ----------------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists project_limit int not null default 1
  check (project_limit >= 1);

create or replace function public.enforce_project_limit()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare v_lim int; v_used int;
begin
  -- el superadmin no queda bloqueado por el límite
  if exists (select 1 from public.profiles
              where id = auth.uid() and role = 'superadmin') then
    return new;
  end if;
  select max(project_limit) into v_lim
    from public.subscriptions
   where account_id = new.account_id and zone_code = new.zone_code
     and status in ('trial','active');
  if v_lim is null then
    raise exception 'No active subscription for this product — activate it first';
  end if;
  select count(*) into v_used
    from public.projects
   where account_id = new.account_id and zone_code = new.zone_code
     and status not in ('archived');
  if v_used >= v_lim then
    raise exception 'Project limit reached (% of %) for this product — raise it in the company profile',
      v_used, v_lim;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_project_limit on public.projects;
create trigger trg_project_limit
  before insert on public.projects
  for each row execute function public.enforce_project_limit();

-- ----------------------------------------------------------------------------
-- 3) ADMIN = SU EMPRESA (visibilidad por profiles.company_id)
-- ----------------------------------------------------------------------------
create or replace function public.my_company()
returns uuid
language sql stable security definer set search_path = public
as $$ select company_id from public.profiles where id = auth.uid(); $$;
grant execute on function public.my_company() to authenticated;

drop policy if exists "projects read" on public.projects;
create policy "projects read" on public.projects for select using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role = 'superadmin')
  or (exists (select 1 from public.profiles p
               where p.id = auth.uid() and p.role = 'admin')
      and account_id = public.my_company())
  or created_by = auth.uid()
  or public.is_project_member(id)
  or public.my_product_role(account_id, zone_code) is not null
);

-- Empresa propia visible para su admin (datos de empresa en el dashboard)
drop policy if exists "accounts read" on public.accounts;
create policy "accounts read" on public.accounts for select using (
  public.is_super_direct()
  or id = public.my_company()
  or exists (select 1 from public.user_product_access u
              where u.user_id = auth.uid() and u.account_id = id)
  or exists (select 1 from public.projects pr
              where pr.account_id = id
                and (pr.created_by = auth.uid() or public.is_project_member(pr.id)))
);

-- Productos de su empresa visibles para su admin (con licencias y límites)
drop policy if exists "subs read" on public.subscriptions;
create policy "subs read" on public.subscriptions for select using (
  public.is_super_direct()
  or account_id = public.my_company()
  or exists (select 1 from public.user_product_access u
              where u.user_id = auth.uid()
                and u.account_id = subscriptions.account_id
                and u.zone_code = subscriptions.zone_code)
);

-- Crear proyecto: admin SOLO en su empresa; superadmin donde quiera
drop policy if exists "projects insert" on public.projects;
create policy "projects insert" on public.projects for insert with check (
  created_by = auth.uid() and (
    exists (select 1 from public.profiles p
             where p.id = auth.uid() and p.role = 'superadmin')
    or (exists (select 1 from public.profiles p
                 where p.id = auth.uid() and p.role = 'admin')
        and account_id = public.my_company())
  )
);

drop policy if exists "projects update" on public.projects;
create policy "projects update" on public.projects for update using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role = 'superadmin')
  or (exists (select 1 from public.profiles p
               where p.id = auth.uid() and p.role = 'admin')
      and account_id = public.my_company())
);

drop policy if exists "projects delete" on public.projects;
create policy "projects delete" on public.projects for delete using (
  exists (select 1 from public.profiles p
           where p.id = auth.uid() and p.role = 'superadmin')
  or (exists (select 1 from public.profiles p
               where p.id = auth.uid() and p.role = 'admin')
      and account_id = public.my_company())
);

-- El alcance del formulario acompaña: admin → su empresa; superadmin → todas
drop function if exists public.my_project_scopes();
create or replace function public.my_project_scopes()
returns table (account_id uuid, zone_code text)
language sql stable security definer set search_path = public
as $$
  select a.id, z.code
    from public.accounts a cross join public.zones z
   where z.is_active
     and exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'superadmin')
  union
  select public.my_company(), z.code
    from public.zones z
   where z.is_active
     and public.my_company() is not null
     and exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'admin');
$$;
grant execute on function public.my_project_scopes() to authenticated;

-- ----------------------------------------------------------------------------
-- 4) CONSULTORES = EVIDENCIAS · AUDITORES = AUDITAN
-- ----------------------------------------------------------------------------
-- El consultor asignado gana autoevaluación (evidencias, respuestas)…
create or replace function public.can_edit_assessment_client(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'superadmin')
      or exists (
        select 1 from public.assessments a
        where a.id = aid
          and a.status in ('in_progress','submitted')
          and ( public.my_product_role(a.company_id, 'assessment') = 'admin'
                or exists (select 1 from public.assessment_members m
                            where m.assessment_id = aid and m.user_id = auth.uid()
                              and m.member_role in ('admin','manager','assessor'))
                or exists (select 1 from public.assessment_assignments x
                            where x.assessment_id = aid
                              and x.consultant_id = auth.uid()) )
      );
$$;

-- …y DEJA de auditar: la corrección es solo de auditores (y superadmin)
create or replace function public.is_assessment_assessor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles p
                  where p.id = auth.uid() and p.role = 'superadmin')
      or exists (select 1 from public.assessment_members m
                  where m.assessment_id = aid and m.user_id = auth.uid()
                    and m.member_role = 'auditor')
      or exists (select 1 from public.assessments a
                  where a.id = aid
                    and public.my_product_role(a.company_id, 'assessment') = 'auditor');
$$;

-- VERIFICAR:
--   Códigos: proyecto Management → MAG-0001 · Project → PM-0001
--   Límite: con project_limit=1 y un proyecto activo, el 2º falla con
--   "Project limit reached" (archivar libera hueco)
--   Un admin con company_id ve su empresa, sus productos y sus proyectos
-- ============================================================================
