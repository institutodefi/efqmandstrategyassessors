import { Component, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import { PORTAL_STRINGS, ROLE_LABEL, ZONE_FALLBACK, zoneText } from '../data/orbitalPortal.js'

/** Catches render crashes in the content area — the sidebar always survives. */
class ContentBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { console.error('[pm-content]', error, info) }
  render() {
    if (!this.state.error) return this.props.children
    const { s } = this.props
    return (
      <div className="portal-card wide2">
        <h3>{s.pmError}</h3>
        <p className="proj-meta">{String(this.state.error?.message || this.state.error)}</p>
        <p className="sub">{s.pmErrorHint}</p>
        <button className="btn btn-primary btn-xs" onClick={() => window.location.reload()}>
          {s.pmReload}
        </button>
      </div>
    )
  }
}

/**
 * PmShell — Orbital360 PM Tool layout: sidebar (logo, products,
 * administration, account) + content area. RTL-aware.
 *
 * Products (zones) show a lock for client users without an active
 * subscription grant; staff roles see everything.
 */
export default function PmShell({ children }) {
  const { user, profile, role } = useAuth()
  const navigate = useNavigate()
  const { lang, setLang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const isAr = lang === 'ar'
  const isStaff = ['superadmin', 'admin', 'account_manager', 'consultant'].includes(role)
  useEffect(() => {
    if (!supabase || !user || role === 'superadmin') return
    supabase.rpc('my_companies').then(({ data }) => {
      const list = data ?? []
      setMyCompanies(list)
      if (list.length && !list.some(c => c.account_id === localStorage.getItem('o360.company'))) {
        localStorage.setItem('o360.company', list[0].account_id)
        setActiveCompany(list[0].account_id)
      }
    }).catch(() => {})
  }, [user, role])

  function pickCompany(id) {
    localStorage.setItem('o360.company', id)
    setActiveCompany(id)
    window.location.reload()   // simplest way to re-scope every list
  }

  const isAdmin = role === 'superadmin'   // CRM/administration: superadmin only (migration-16)

  const [zones, setZones] = useState(ZONE_FALLBACK)
  const [myZones, setMyZones] = useState(null)
  const [myCompanies, setMyCompanies] = useState([])
  const [activeCompany, setActiveCompany] = useState(
    () => localStorage.getItem('o360.company') || '')   // null = unknown yet

  useEffect(() => {
    if (!supabase || !user) return
    supabase.from('zones')
      .select('code, name_en, name_ar, sort_order')
      .eq('is_active', true).order('sort_order')
      .then(({ data }) => { if (data?.length) setZones(data) })
    if (!isStaff) {
      supabase.rpc('my_product_zones')
        .then(({ data }) => setMyZones((data ?? []).map(r => r.my_product_zones ?? r)))
    }
  }, [user, isStaff])

  async function signOut() {
    await supabase?.auth.signOut()
    navigate('/')
  }

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email
  const roleLabel = role ? (ROLE_LABEL[lang] || ROLE_LABEL.en)[role] : ''
  const hasZone = (code) => isStaff || myZones === null || myZones.includes(code)

  return (
    <div className="pm" dir={isAr ? 'rtl' : 'ltr'}>
      <aside className="pm-side">
        <Link to="/portal" className="pm-logo">
          <img src="/orbital360/logo-on-dark.svg" alt="Orbital360 PM Tool" />
        </Link>

        <nav className="pm-nav">
          <NavLink to="/portal" end className="pm-link">
            <span className="pm-dot" />{s.dashboard}
          </NavLink>

          <p className="pm-sec">{s.products}</p>
          {zones.map(z => (
            <NavLink
              key={z.code}
              to={`/portal/${z.code}`}
              className={`pm-link ${hasZone(z.code) ? '' : 'pm-locked'}`}
              onClick={(e) => { if (!hasZone(z.code)) e.preventDefault() }}
              title={hasZone(z.code) ? undefined : s.locked}
            >
              <span className="pm-dot" />
              <span className="pm-link-txt">{zoneText(z, lang).name}</span>
              {!hasZone(z.code) && <span className="pm-lock">🔒</span>}
            </NavLink>
          ))}

          {role === 'admin' && (
            <NavLink to="/portal/companies" className="pm-link">
              <span className="pm-dot" />{s.navMyCompany}
            </NavLink>
          )}
          {isAdmin && (
            <>
              <p className="pm-sec">{s.administration}</p>
              <NavLink to="/portal/contacts" className="pm-link"><span className="pm-dot" />{s.contacts}</NavLink>
              <NavLink to="/portal/companies" className="pm-link"><span className="pm-dot" />{s.companies}</NavLink>
            </>
          )}
        </nav>

        <div className="pm-foot">
          {myCompanies.length > 1 && (
            <select className="pm-company" value={activeCompany}
                    aria-label={s.pmCompanyCtx}
                    onChange={(e) => pickCompany(e.target.value)}>
              {myCompanies.map(c => (
                <option key={c.account_id} value={c.account_id}>{c.name}</option>
              ))}
            </select>
          )}
          <div className="pm-langs">
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'ar' ? 'on' : ''} onClick={() => setLang('ar')}>ع</button>
          </div>
          <Link to="/portal/account" className="pm-user">
            <b>{name}</b>
            {roleLabel && <span className="role-badge">{roleLabel}</span>}
          </Link>
          <button className="btn btn-ghost portal-signout" onClick={signOut}>{s.signOut}</button>
        </div>
      </aside>

      <main className="pm-main"><ContentBoundary s={s}>{children}</ContentBoundary></main>
    </div>
  )
}
