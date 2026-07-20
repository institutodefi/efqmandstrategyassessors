import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Icon } from '../components/Chrome.jsx'
import PmShell from '../components/PmShell.jsx'
import { useLang } from '../i18n.jsx'
import { ZONE_FALLBACK, PORTAL_STRINGS, zoneText } from '../data/orbitalPortal.js'

/**
 * Orbital 360 portal — role-aware hub.
 *
 *  superadmin / admin  → everything (zones + CRM + all projects)
 *  account_manager     → CRM + status of all projects (read)
 *  consultant          → designs projects (list + quick create)
 *  client              → interacts with their projects (progress + activity)
 */
export default function Portal() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const isAr = lang === 'ar'

  const [zones, setZones] = useState(ZONE_FALLBACK)
  const [myZones, setMyZones] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [projects, setProjects] = useState([])
  const [activity, setActivity] = useState([])

  const canSeeCRM = ['superadmin', 'admin', 'account_manager'].includes(role)
  const isConsultant = role === 'consultant'
  const isClient = role === 'client' || !role

  /* ---------- data ---------- */
  useEffect(() => {
    if (!supabase || !user) return

    if (!canSeeCRM && role !== 'consultant') {
      supabase.rpc('my_product_zones')
        .then(({ data }) => setMyZones((data ?? []).map(r => r?.my_product_zones ?? r)))
        .catch(() => setMyZones([]))
    }

    supabase.from('zones')
      .select('code, name_en, name_ar, desc_en, desc_ar, sort_order')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data?.length) {
          const icons = Object.fromEntries(ZONE_FALLBACK.map(z => [z.code, z.icon]))
          setZones(data.map(z => ({ ...z, icon: icons[z.code] || 'doc' })))
        }
      })

    // Projects: RLS already limits rows to what this role may see.
    supabase.from('projects')
      .select('id, code, title_en, title_ar, zone_code, status, progress, due_date, account_id')
      .order('updated_at', { ascending: false })
      .limit(12)
      .then(({ data }) => setProjects(data ?? []))

    if (canSeeCRM) {
      supabase.from('accounts')
        .select('id, name, name_ar, crm_status, country')
        .order('updated_at', { ascending: false })
        .limit(12)
        .then(({ data }) => setAccounts(data ?? []))
    }
  }, [user, role]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!supabase || !user || !isClient || projects.length === 0) return
    supabase.from('project_activity')
      .select('id, project_id, kind, body, created_at')
      .in('project_id', projects.map(p => p.id))
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setActivity(data ?? []))
  }, [user, isClient, projects])

  const accountById = useMemo(
    () => Object.fromEntries(accounts.map(a => [a.id, a])), [accounts])

  const projTitle = (p) => {
    const t = (isAr && p.title_ar) ? p.title_ar : p.title_en
    return p.code && t !== p.code ? `${p.code} · ${t}` : (p.code || t)
  }

  return (
    <PmShell>
      <div className="pm-content">
        <h1>{s.pmWelcome}<strong>{s.pmName}</strong></h1>
        <p className="sub">{s.sub}</p>

        {/* ---------------- THE THREE ZONES ---------------- */}
        {isClient && Array.isArray(myZones) && myZones.length === 0 && (
          <section className="portal-card wide2 pm-empty">
            <h3>{s.pmNoProducts}</h3>
            <p className="sub">{s.pmNoProductsHint}</p>
            <Link className="btn btn-primary btn-xs" to="/portal/account">{s.pmMyAccount}</Link>
          </section>
        )}

        <h2 className="portal-sec-title">{s.zonesTitle}</h2>
        <div className="zone-grid">
          {zones.map((z) => {
            const zt = zoneText(z, lang)
            return (
              <button
                key={z.code}
                className="zone-card"
                onClick={() => navigate(`/portal/${z.code}`)}
              >
                <div className="glyph"><Icon name={z.icon} /></div>
                <h3>{zt.name}</h3>
                <p>{zt.desc}</p>
                <span className="zone-open">{s.open} →</span>
              </button>
            )
          })}
        </div>

        <div className="portal-panels">
          {/* ------------- CRM (superadmin / admin / account manager) ------------- */}
          {canSeeCRM && (
            <section className="portal-card wide">
              <h3>{s.crmTitle}</h3>
              {accounts.length === 0 ? <p>{s.crmEmpty}</p> : (
                <table className="portal-table">
                  <tbody>
                    {accounts.map(a => (
                      <tr key={a.id}>
                        <td><b>{(isAr && a.name_ar) || a.name}</b></td>
                        <td>{a.country || '—'}</td>
                        <td><span className={`pill pill-${a.crm_status}`}>
                          {s.crmStatus[a.crm_status] || a.crm_status}
                        </span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {/* ------------- PROJECT STATUS (everyone; content filtered by RLS) ------------- */}
          <section className="portal-card wide">
            <h3>
              {canSeeCRM ? s.statusTitle : isConsultant ? s.myProjects : s.clientProjects}
            </h3>
            {projects.length === 0 ? <p>{s.projEmpty}</p> : (
              <ul className="proj-list">
                {projects.map(p => (
                  <li key={p.id}>
                    <div className="proj-top">
                      <b>{projTitle(p)}</b>
                      <span className={`pill pill-${p.status}`}>
                        {s.projStatus[p.status] || p.status}
                      </span>
                    </div>
                    <div className="proj-meta">
                      <span>{zoneText(zones.find(z => z.code === p.zone_code) || {}, lang).name || p.zone_code}</span>
                      {canSeeCRM && accountById[p.account_id] &&
                        <span> · {accountById[p.account_id].name}</span>}
                    </div>
                    <div className="proj-bar" aria-label={`${s.progress}: ${p.progress}%`}>
                      <span style={{ width: `${p.progress}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ------------- CONSULTANT: quick create ------------- */}
          {(isConsultant || role === 'superadmin' || role === 'admin') && (
            <NewProject zones={zones} lang={lang} s={s} onCreated={
              (p) => setProjects(prev => [p, ...prev])
            } />
          )}

          {/* ------------- CLIENT: activity ------------- */}
          {isClient && projects.length > 0 && (
            <ClientActivity
              projects={projects} activity={activity} s={s} isAr={isAr}
              projTitle={projTitle}
              onPosted={(row) => setActivity(prev => [row, ...prev])}
            />
          )}
        </div>
      </div>
    </PmShell>
  )
}

/* ======================= Consultant: new project ======================= */
function NewProject({ zones, lang, s, onCreated }) {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('accounts').select('id, name').order('name')
      .then(({ data }) => setAccounts(data ?? []))
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    const f = e.target
    if (!supabase || !f.account.value) return
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.from('projects').insert({
      account_id: f.account.value,
      zone_code: f.zone.value,
      created_by: user.id,
      status: 'design',
    }).select().single()
    setBusy(false)
    if (error) { setStatus({ ok: false, msg: s.npError }) }
    else {
      setStatus({ ok: true, msg: s.npCreated })
      onCreated(data); f.reset()
      // the creator joins the project team as lead consultant
      await supabase.from('project_members').insert({
        project_id: data.id, user_id: user.id, member_role: 'lead_consultant',
      })
    }
  }

  return (
    <section className="portal-card wide">
      <h3>{s.newProject}</h3>
      <form className="np-form" onSubmit={onSubmit}>
        <p className="proj-meta">{s.npCode}</p>
        <div className="np-row">
          <div className="field">
            <label htmlFor="np-account">{s.npAccount}</label>
            <select id="np-account" name="account" required>
              <option value="">—</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="np-zone">{s.npZone}</label>
            <select id="np-zone" name="zone" required>
              {zones.map(z => (
                <option key={z.code} value={z.code}>{zoneText(z, lang).name}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary" disabled={busy} type="submit">{s.npCreate}</button>
        {status && <p className={`form-status ${status.ok ? 'ok' : 'err'}`}>{status.msg}</p>}
      </form>
    </section>
  )
}

/* ======================= Client: activity + comment ======================= */
function ClientActivity({ projects, activity, s, isAr, projTitle, onPosted }) {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)

  async function post(e) {
    e.preventDefault()
    const f = e.target
    const body = f.body.value.trim()
    if (!supabase || !body) return
    setBusy(true)
    const { data, error } = await supabase.from('project_activity').insert({
      project_id: f.project.value, author: user.id, kind: 'comment', body,
    }).select().single()
    setBusy(false)
    if (!error) { onPosted(data); f.reset() }
  }

  const byId = Object.fromEntries(projects.map(p => [p.id, p]))

  return (
    <section className="portal-card wide">
      <h3>{s.activity}</h3>
      {activity.length === 0 ? <p>{s.activityEmpty}</p> : (
        <ul className="act-list">
          {activity.map(a => (
            <li key={a.id}>
              <span className="act-proj">{byId[a.project_id] ? projTitle(byId[a.project_id]) : ''}</span>
              <p>{a.body}</p>
              <time>{new Date(a.created_at).toLocaleDateString(isAr ? 'ar' : 'en-GB')}</time>
            </li>
          ))}
        </ul>
      )}
      <form className="act-form" onSubmit={post}>
        <select name="project" required>
          {projects.map(p => <option key={p.id} value={p.id}>{projTitle(p)}</option>)}
        </select>
        <textarea name="body" rows="2" placeholder={s.commentPh} required />
        <button className="btn btn-primary" disabled={busy} type="submit">{s.send}</button>
      </form>
    </section>
  )
}
