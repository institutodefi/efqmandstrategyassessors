-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 20 · EL ADMIN EDITA SU PROPIA EMPRESA
--   "My company": el administrador edita los datos (nombre, VAT, dirección)
--   de SU empresa. Crear empresas sigue siendo solo del superadmin.
-- Ejecutar DESPUÉS de migration-19. Re-ejecutable.
-- ============================================================================
drop policy if exists "accounts update" on public.accounts;
create policy "accounts update" on public.accounts for update using (
  public.is_super_direct()
  or ( id = (select company_id from public.profiles where id = auth.uid())
       and exists (select 1 from public.profiles p
                    where p.id = auth.uid() and p.role = 'admin') )
);
-- VERIFICAR: un admin guarda cambios de su empresa; de otras, la BD lo rechaza.
