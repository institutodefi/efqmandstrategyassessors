-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 18b · CÓDIGOS CON CLIENTE EN TODAS LAS ZONAS
--   O360      → P0360-CLIENTE-NNN   (como hasta ahora)
--   Management → MAG-CLIENTE-NNN
--   Project    → PM-CLIENTE-NNN
--   CLIENTE = 3 letras del nombre de la empresa · NNN correlativo POR CLIENTE
-- Ejecutar DESPUÉS de migration-18. Re-ejecutable.
-- ============================================================================

create or replace function public.assign_project_code()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_n int;
  v_prefix text := case new.zone_code
    when 'assessment'     then 'P0360'
    when 'governance'     then 'MAG'
    when 'transformation' then 'PM'
    else upper(left(new.zone_code, 3))
  end;
begin
  if new.code is null or new.code = '' then
    insert into public.project_counters_company (zone_code, account_id)
    values (new.zone_code, new.account_id)
    on conflict (zone_code, account_id) do nothing;
    update public.project_counters_company
       set counter = counter + 1
     where zone_code = new.zone_code and account_id = new.account_id
    returning counter into v_n;
    new.code := v_prefix || '-' || public.company_code3(new.account_id)
                || '-' || lpad(v_n::text, 3, '0');
  end if;
  if new.title_en is null or new.title_en = '' then
    new.title_en := new.code;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_project_code on public.projects;
create trigger trg_project_code
  before insert on public.projects
  for each row execute function public.assign_project_code();

-- Recodificar proyectos existentes de MAG/PM al formato con cliente
-- (solo los que siguen en formato antiguo MAG-#### / PM-####)
with numbered as (
  select id,
         case zone_code when 'governance' then 'MAG' when 'transformation' then 'PM' end
         || '-' || public.company_code3(account_id) || '-' ||
         lpad((row_number() over (partition by account_id, zone_code order by created_at))::text, 3, '0')
         as new_code
  from public.projects
  where zone_code in ('governance','transformation')
    and (code is null or code ~ '^(MAG|PM|MGS|PMT)-[0-9]{4}$')
)
update public.projects p
   set code = n.new_code,
       title_en = case when p.title_en = p.code then n.new_code else p.title_en end
  from numbered n
 where p.id = n.id;

-- Sincronizar contadores por cliente con lo recodificado
insert into public.project_counters_company (zone_code, account_id, counter)
select zone_code, account_id, count(*)
  from public.projects
 where zone_code in ('governance','transformation')
 group by zone_code, account_id
on conflict (zone_code, account_id) do update
  set counter = greatest(project_counters_company.counter, excluded.counter);

-- VERIFICAR:
--   Nuevo proyecto Management de TuConsultor → MAG-TUC-001
--   Nuevo proyecto Project    de TuConsultor → PM-TUC-001
--   select code, zone_code from public.projects order by created_at;
-- ============================================================================
