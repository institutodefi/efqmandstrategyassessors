-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 08
--   · Proyectos: creación solo con cliente + tipo (zona) y CÓDIGO AUTOMÁTICO
--     AST-0001 (assessment) · MGS-0001 (governance) · PMT-0001 (transformation)
-- Ejecutar DESPUÉS de migration-07. Re-ejecutable.
-- ============================================================================

alter table public.projects
  add column if not exists code text unique;

alter table public.projects
  alter column title_en drop not null;

-- Contador por zona (con bloqueo de fila → códigos únicos también en concurrencia)
create table if not exists public.project_counters (
  zone_code text primary key references public.zones (code),
  counter   int not null default 0
);
insert into public.project_counters (zone_code)
select code from public.zones
on conflict (zone_code) do nothing;

create or replace function public.next_project_code(p_zone text)
returns text
language plpgsql security definer set search_path = public
as $$
declare
  v_n int;
  v_prefix text := case p_zone
    when 'assessment'     then 'AST'
    when 'governance'     then 'MGS'
    when 'transformation' then 'PMT'
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

create or replace function public.assign_project_code()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.code is null or new.code = '' then
    new.code := public.next_project_code(new.zone_code);
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

-- Backfill de códigos para proyectos existentes sin código
do $$
declare r record;
begin
  for r in select id, zone_code from public.projects where code is null order by created_at loop
    update public.projects set code = public.next_project_code(r.zone_code) where id = r.id;
  end loop;
end $$;

-- VERIFICAR:
--   insert de prueba desde la app → code AST-0001 / MGS-0001 / PMT-0001
--   select code, title_en, zone_code from public.projects order by created_at;
