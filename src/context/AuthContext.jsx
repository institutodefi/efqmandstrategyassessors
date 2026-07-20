import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

/**
 * AuthContext — now role-aware for Orbital 360.
 * Loads the Supabase session AND the user's profile row
 * (role, full_name, locale) so any component can gate by role.
 *
 * Roles: superadmin | admin | account_manager | consultant | client
 */
const AuthContext = createContext({
  user: null,
  profile: null,      // { id, full_name, role, locale, email }
  role: null,
  loading: true,
  refreshProfile: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(u) {
    if (!supabase || !u) { setProfile(null); return }
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, first_name, last_name, role, locale, email, company_id')
      .eq('id', u.id)
      .maybeSingle()
    setProfile(data ?? null)
  }

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      await loadProfile(u)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null
      setUser(u)
      await loadProfile(u)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    user,
    profile,
    role: profile?.role ?? null,
    loading,
    refreshProfile: () => loadProfile(user),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
