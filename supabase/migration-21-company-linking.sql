-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 21 · VINCULACIÓN A EMPRESA + EDICIÓN ADMIN
--
--   · El usuario elige su empresa: si ya está registrada → se vincula al
--     momento; si no existe → solicita crearla y la APRUEBA el superadmin
--   · El admin edita los datos de su empresa (por company_id O por membresía)
-- Ejecutar DESPUÉS de migration-20. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) EDICIÓN: admin sobre su empresa (company_id o membresía de producto)
-- ----------------------------------------------------------------------------
drop policy if exists "accounts update" on public.accounts;
create policy "accounts update" on public.accounts for update using (
  public.is_super_direct()
  or ( exists (select 1 from public.profiles p
                where p.id = auth.uid() and p.role = 'admin')
       and ( id = (select company_id from public.profiles where id = auth.uid())
             or exists (select 1 from public.user_product_access u
                         where u.user_id = auth.uid() and u.account_id = id) ) )
);

-- ----------------------------------------------------------------------------
-- 2) PICKER: nombres de empresas registradas (datos mínimos)
-- ----------------------------------------------------------------------------
drop function if exists public.list_companies_min();
create or replace function public.list_companies_min()
returns table (id uuid, name text)
language sql stable security definer set search_path = public
as $$ select id, name from public.accounts order by name; $$;
grant execute on function public.list_companies_min() to authenticated;

-- ----------------------------------------------------------------------------
-- 3) SOLICITUDES DE VINCULACIÓN / ALTA DE EMPRESA
-- ----------------------------------------------------------------------------
create table if not exists public.company_link_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  company_id   uuid references public.accounts (id) on delete set null,
  company_name text not null,
  status       text not null default 'pending'
               check (status in ('pending','approved','rejected')),
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz,
  resolved_by  uuid references auth.users (id)
);
alter table public.company_link_requests enable row level security;

drop policy if exists "clr own read" on public.company_link_requests;
create policy "clr own read" on public.company_link_requests for select using (
  user_id = auth.uid() or public.is_super_direct()
);
drop policy if exists "clr super manage" on public.company_link_requests;
create policy "clr super manage" on public.company_link_requests for all
  using (public.is_super_direct()) with check (public.is_super_direct());

-- Vincular / solicitar: empresa existente → vínculo inmediato;
-- inexistente → solicitud pendiente para el superadmin
create or replace function public.request_company(p_company uuid, p_name text)
returns text
language plpgsql security definer set search_path = public
as $$
declare v_name text := trim(coalesce(p_name, ''));
begin
  if auth.uid() is null then return 'not_authenticated'; end if;

  if p_company is not null then
    -- ya registrada → vínculo directo + registro de auditoría
    update public.profiles set company_id = p_company where id = auth.uid();
    insert into public.company_link_requests
      (user_id, company_id, company_name, status, resolved_at, resolved_by)
    select auth.uid(), p_company, a.name, 'approved', now(), auth.uid()
      from public.accounts a where a.id = p_company;
    return 'linked';
  end if;

  if v_name = '' then return 'name_required'; end if;

  -- coincidencia exacta por nombre → también vínculo directo
  if exists (select 1 from public.accounts where lower(name) = lower(v_name)) then
    update public.profiles
       set company_id = (select id from public.accounts
                          where lower(name) = lower(v_name) limit 1)
     where id = auth.uid();
    return 'linked';
  end if;

  -- nueva → pendiente de aprobación (una pendiente por usuario)
  if exists (select 1 from public.company_link_requests
              where user_id = auth.uid() and status = 'pending') then
    return 'already_pending';
  end if;
  insert into public.company_link_requests (user_id, company_name)
  values (auth.uid(), v_name);
  return 'pending';
end;
$$;
grant execute on function public.request_company(uuid, text) to authenticated;

-- Resolución del superadmin: aprobar crea la empresa (si era nueva) y vincula
create or replace function public.resolve_company_request(p_id uuid, p_approve boolean)
returns text
language plpgsql security definer set search_path = public
as $$
declare r record; v_company uuid;
begin
  if not public.is_super_direct() then
    raise exception 'Only the superadministrator can resolve requests';
  end if;
  select * into r from public.company_link_requests
   where id = p_id and status = 'pending';
  if not found then return 'not_found'; end if;

  if not p_approve then
    update public.company_link_requests
       set status = 'rejected', resolved_at = now(), resolved_by = auth.uid()
     where id = p_id;
    return 'rejected';
  end if;

  v_company := r.company_id;
  if v_company is null then
    insert into public.accounts (name, crm_status)
    values (r.company_name, 'lead') returning id into v_company;
  end if;
  update public.profiles set company_id = v_company where id = r.user_id;
  update public.company_link_requests
     set status = 'approved', company_id = v_company,
         resolved_at = now(), resolved_by = auth.uid()
   where id = p_id;
  return 'approved';
end;
$$;
grant execute on function public.resolve_company_request(uuid, boolean) to authenticated;

-- Pendientes con contexto para el panel del superadmin
drop function if exists public.pending_company_requests();
create or replace function public.pending_company_requests()
returns table (id uuid, company_name text, requester text, email text,
               created_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select r.id, r.company_name,
         coalesce(p.full_name, p.email), p.email, r.created_at
    from public.company_link_requests r
    join public.profiles p on p.id = r.user_id
   where r.status = 'pending' and public.is_super_direct()
   order by r.created_at;
$$;
grant execute on function public.pending_company_requests() to authenticated;

-- VERIFICAR:
--   Usuario → My data → elige empresa registrada → vínculo inmediato.
--   Usuario → escribe empresa nueva → aparece en Companies (super) como
--   solicitud pendiente; Approve la crea como lead y vincula al usuario.
-- ============================================================================
