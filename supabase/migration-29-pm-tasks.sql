-- ============================================================================
-- MIGRATION 29 · Entorno de proyectos: tipos + tareas con fechas
--   · projects.kind: 'project' | 'action_plan' | 'transformation'
--     (pestañas "Planes de acción" y "Proyectos de transformación").
--   · project_tasks: tareas con responsable, estado y fechas (Gantt +
--     "tareas pendientes con deadline 30/15/7" del dashboard personal).
-- Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

alter table public.projects
  add column if not exists kind text not null default 'project'
  check (kind in ('project','action_plan','transformation'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

create table if not exists public.project_tasks (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title      text not null,
  assignee   uuid references auth.users (id) on delete set null,
  status     text not null default 'todo' check (status in ('todo','doing','done')),
  start_date date,
  due_date   date,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists project_tasks_project_idx  on public.project_tasks (project_id);
create index if not exists project_tasks_assignee_idx on public.project_tasks (assignee, status, due_date);

drop trigger if exists trg_ptasks_touch on public.project_tasks;
create trigger trg_ptasks_touch before update on public.project_tasks
  for each row execute function public.touch_updated_at();

alter table public.project_tasks enable row level security;

-- staff = superadmin / admin / consultant de plataforma
create or replace function public.is_pm_staff()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles
                  where id = auth.uid()
                    and role in ('superadmin','admin','consultant'));
$$;
grant execute on function public.is_pm_staff() to authenticated;

drop policy if exists "ptasks read"   on public.project_tasks;
drop policy if exists "ptasks insert" on public.project_tasks;
drop policy if exists "ptasks update" on public.project_tasks;
drop policy if exists "ptasks delete" on public.project_tasks;

create policy "ptasks read" on public.project_tasks for select
  using (public.is_pm_staff()
         or project_id in (select public.my_project_ids()));

create policy "ptasks insert" on public.project_tasks for insert
  with check (created_by = auth.uid()
              and (public.is_pm_staff()
                   or exists (select 1 from public.project_members m
                               where m.project_id = project_tasks.project_id
                                 and m.user_id = auth.uid()
                                 and m.member_role in ('admin','lead_consultant','consultant'))));

-- staff/lead editan todo; el responsable puede actualizar su tarea (estado)
create policy "ptasks update" on public.project_tasks for update
  using (public.is_pm_staff()
         or assignee = auth.uid()
         or exists (select 1 from public.project_members m
                     where m.project_id = project_tasks.project_id
                       and m.user_id = auth.uid()
                       and m.member_role in ('admin','lead_consultant','consultant')))
  with check (true);

create policy "ptasks delete" on public.project_tasks for delete
  using (public.is_pm_staff()
         or exists (select 1 from public.project_members m
                     where m.project_id = project_tasks.project_id
                       and m.user_id = auth.uid()
                       and m.member_role in ('admin','lead_consultant')));

grant select, insert, update, delete on public.project_tasks to authenticated;

-- Verificación
select column_name from information_schema.columns
 where table_name = 'projects' and column_name = 'kind';
select count(*) as project_tasks_ready from public.project_tasks;
