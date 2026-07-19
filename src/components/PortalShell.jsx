import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import { PORTAL_STRINGS, ROLE_LABEL } from '../data/orbitalPortal.js'

/** Shared chrome for inner portal pages (Account, Users, zones…). */
export default function PortalShell({ children }) {
  const { user, profile, role } = useAuth()
  const navigate = useNavigate()
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const isAr = lang === 'ar'

  async function signOut() {
    await supabase?.auth.signOut()
    navigate('/')
  }

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email
  const roleLabel = role ? (ROLE_LABEL[lang] || ROLE_LABEL.en)[role] : ''

  return (
    <div className="portal" dir={isAr ? 'rtl' : 'ltr'}>
      <nav className="portal-nav">
        <Link to="/portal" className="portal-back">
          <img src="/brand/wordmark-white.png" alt="EFQM and Strategy Assessors" />
          <span>← {s.backToPortal}</span>
        </Link>
        <div className="portal-nav-right">
          <span className="who">
            <b>{name}</b>
            {roleLabel && <span className="role-badge">{roleLabel}</span>}
          </span>
          <button className="btn btn-ghost portal-signout" onClick={signOut}>{s.signOut}</button>
        </div>
      </nav>
      <main className="portal-main">{children}</main>
    </div>
  )
}
