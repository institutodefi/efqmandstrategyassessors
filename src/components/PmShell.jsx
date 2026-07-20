import { Component, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import { PORTAL_STRINGS, ROLE_LABEL, ZONE_FALLBACK, zoneText } from '../data/orbitalPortal.js'

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
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const isAr = lang === 'ar'
  const isStaff = ['superadmin', 'admin', 'account_manager', 'consultant'].includes(role)
  const isAdmin = ['superadmin', 'admin'].includes(role)

  const [zones, setZones] = useState(ZONE_FALLBACK)
  const [myZones, setMyZones] = useState(null)   // null = unknown yet

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

          {isAdmin && (
            <>
              <p className="pm-sec">{s.administration}</p>
              <NavLink to="/portal/contacts" className="pm-link"><span className="pm-dot" />{s.contacts}</NavLink>
              <NavLink to="/portal/companies" className="pm-link"><span className="pm-dot" />{s.companies}</NavLink>
            </>
          )}
        </nav>

        <div className="pm-foot">
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
