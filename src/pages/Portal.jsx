import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  const { user, role, profile } = useAuth()
  const { zone: zoneParam } = useParams()
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

  /* ---------- minimal KPI strip ---------- */
  const [stats, setStats] = useState(null)
  useEffect(() => {
    if (!supabase || !user) return
    const count = (table, filter) => {
      let q = supabase.from(table).select('*', { count: 'exact', head: true })
      if (filter) q = filter(q)
      return q.then(({ count: c }) => c ?? 0).catch(() => 0)
    }
    Promise.all([
      count('projects'),
      count('assessments'),
      role === 'superadmin' ? count('accounts') : Promise.resolve(null),
      role === 'superadmin' ? count('profiles') : Promise.resolve(null),
      role === 'superadmin'
        ? count('subscriptions', (q) => q.in('status', ['trial', 'active']))
        : Promise.resolve(null),
    ]).then(([pj, asmt, comp, ppl, subs]) =>
      setStats({ pj, asmt, comp, ppl, subs }))
  }, [user, role])

  /* ---------- who can open projects & where ---------- */
  const [scopes, setScopes] = useState([])
  useEffect(() => {
    if (!supabase || !user) return
    supabase.rpc('my_project_scopes').then(({ data }) => setScopes(data ?? []))
  }, [user])

  /* ---------- project members ---------- */
  const [membersFor, setMembersFor] = useState(null)
  const [members, setMembers] = useState([])
  const [memberErr, setMemberErr] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const canManageMembers = ['superadmin', 'admin', 'consultant'].includes(role)
  const canCreateDelete = ['superadmin', 'admin'].includes(role)

  useEffect(() => {
    if (!supabase || !user || projects.length === 0) return
    supabase.from('project_members')
      .select('project_id, user_id, member_role')
      .in('project_id', projects.map(p => p.id))
      .then(({ data }) => setMembers(data ?? []))
    if (canManageMembers) {
      supabase.rpc('list_people_min')
        .then(({ data }) => setAllUsers(data ?? []))
    }
  }, [user, projects, canManageMembers])

  const memberName = (id) => {
    const u = allUsers.find(x => x.id === id)
    return u ? (u.full_name || u.email) : id.slice(0, 8)
  }

  async function addMember(projectId, e) {
    e.preventDefault()
    const f = e.target
    if (!f.muser.value) return
    setMemberErr(null)
    const { error } = await supabase.from('project_members').upsert({
      project_id: projectId, user_id: f.muser.value, member_role: f.mrole.value,
    })
    if (error) { setMemberErr(error.message); return }
    f.reset()
    const { data } = await supabase.from('project_members')
      .select('project_id, user_id, member_role')
      .in('project_id', projects.map(p => p.id))
    setMembers(data ?? [])
  }

  async function setProjectStatus(projectId, newStatus) {
    const { error } = await supabase.from('projects')
      .update({ status: newStatus }).eq('id', projectId)
    if (error) setMemberErr(error.message)
    else setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p))
  }

  async function deleteProject(p) {
    if (!window.confirm(s.pjDeleteConfirm)) return
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    if (error) setMemberErr(error.message)
    else setProjects(prev => prev.filter(x => x.id !== p.id))
  }

  async function removeMember(projectId, userId) {
    await supabase.from('project_members').delete()
      .eq('project_id', projectId).eq('user_id', userId)
    setMembers(prev => prev.filter(m => !(m.project_id === projectId && m.user_id === userId)))
  }

  const projTitle = (p) => {
    const t = (isAr && p.title_ar) ? p.title_ar : p.title_en
    return p.code && t !== p.code ? `${p.code} · ${t}` : (p.code || t)
  }

  return (
    <PmShell>
      <div className="pm-content">
        <header className="dash-head">
          {zoneParam ? (
            <>
              <button className="btn btn-ghost btn-xs"
                      onClick={() => navigate('/portal')}>← {s.dashboard}</button>
              <h1>{zoneText(zones.find(z => z.code === zoneParam) || {}, lang).name || zoneParam}</h1>
            </>
          ) : (
            <h1>{s.pmWelcome}<strong>{s.pmName}</strong></h1>
          )}
        </header>

        {!zoneParam && role === 'admin' && profile?.company_id && (
          <p className="dash-company">
            {s.dsMyCompany}: <b>{accounts.find(a => a.id === profile.company_id)?.name || '…'}</b>
          </p>
        )}

        {/* ---------------- KPI STRIP (numbers first) ---------------- */}
        {!zoneParam && stats && (
          <div className="dash-stats">
            {stats.comp != null && <div className="dash-stat"><b>{stats.comp}</b><span>{s.dsCompanies}</span></div>}
            {stats.ppl != null && <div className="dash-stat"><b>{stats.ppl}</b><span>{s.dsPeople}</span></div>}
            {stats.subs != null && <div className="dash-stat"><b>{stats.subs}</b><span>{s.dsProducts}</span></div>}
            <div className="dash-stat"><b>{stats.pj}</b><span>{s.dsProjects}</span></div>
            <div className="dash-stat"><b>{stats.asmt}</b><span>{s.dsAssessments}</span></div>
          </div>
        )}

        {!zoneParam && isClient && Array.isArray(myZones) && myZones.length === 0 && (
          <section className="dash-empty">
            <p><b>{s.pmNoProducts}</b> {s.pmNoProductsHint}</p>
            <Link className="btn btn-ghost btn-xs" to="/portal/account">{s.pmMyAccount}</Link>
          </section>
        )}

        {/* ---------------- PRODUCTS AS QUIET CHIPS ---------------- */}
        {!zoneParam && <div className="dash-zones">
          {zones.map((z) => {
            const zt = zoneText(z, lang)
            return (
              <button key={z.code} className="dash-zone"
                      onClick={() => navigate(`/portal/${z.code}`)}>
                <span className="dash-zone-glyph"><Icon name={z.icon} /></span>
                <span className="dash-zone-name">{zt.name}</span>
                <span className="dash-zone-arrow">→</span>
              </button>
            )
          })}
        </div>}

        <div className="portal-panels">
          {/* ------------- CRM (superadmin / admin / account manager) ------------- */}
          {!zoneParam && canSeeCRM && (
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
                      {canManageMembers ? (
                        <select className="pj-status" value={p.status}
                                onChange={(e) => setProjectStatus(p.id, e.target.value)}>
                          {Object.entries(s.projStatus).map(([k, v]) =>
                            <option key={k} value={k}>{v}</option>)}
                        </select>
                      ) : (
                        <span className={`pill pill-${p.status}`}>
                          {s.projStatus[p.status] || p.status}
                        </span>
                      )}
                      {canCreateDelete && (
                        <button className="btn btn-ghost btn-xs"
                                onClick={() => deleteProject(p)}>{s.pjDelete}</button>
                      )}
                    </div>
                    <div className="proj-meta">
                      <span>{zoneText(zones.find(z => z.code === p.zone_code) || {}, lang).name || p.zone_code}</span>
                      {canSeeCRM && accountById[p.account_id] &&
                        <span> · {accountById[p.account_id].name}</span>}
                    </div>
                    <div className="proj-bar" aria-label={`${s.progress}: ${p.progress}%`}>
                      <span style={{ width: `${p.progress}%` }} />
                    </div>

                    <div className="proj-members">
                      <button className="btn btn-ghost btn-xs"
                              onClick={() => setMembersFor(membersFor === p.id ? null : p.id)}>
                        {s.pjMembers} ({members.filter(m => m.project_id === p.id).length})
                        {' '}{membersFor === p.id ? '▴' : '▾'}
                      </button>
                      {membersFor === p.id && (
                        <div className="cp-detail">
                          {memberErr && <p className="form-status err">{memberErr}</p>}
                          {members.filter(m => m.project_id === p.id).length === 0
                            ? <p className="proj-meta">{s.pjNoMembers}</p>
                            : members.filter(m => m.project_id === p.id).map(m => (
                              <div key={m.user_id} className="proj-top">
                                <span>
                                  <b>{memberName(m.user_id)}</b>
                                  <span className="proj-meta"> · {s.productRoles[m.member_role] || m.member_role}</span>
                                </span>
                                {canManageMembers && (
                                  <button className="btn btn-ghost btn-xs"
                                          onClick={() => removeMember(p.id, m.user_id)}>
                                    {s.pjRemove}
                                  </button>
                                )}
                              </div>
                            ))}
                          {canManageMembers && (
                            <form className="cp-inline" onSubmit={(e) => addMember(p.id, e)}>
                              <select name="muser" required>
                                <option value="">—</option>
                                {allUsers
                                  .filter(u => !members.some(m => m.project_id === p.id && m.user_id === u.id))
                                  .map(u => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
                              </select>
                              <select name="mrole" defaultValue="assessor">
                                {Object.entries(s.productRoles).map(([k, v]) =>
                                  <option key={k} value={k}>{v}</option>)}
                              </select>
                              <button className="btn btn-primary btn-xs" type="submit">{s.pjAddMember}</button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ------------- open a project (admin / superadmin only) ------------- */}
          {canCreateDelete && (
            <NewProject zones={zones} lang={lang} s={s} scopes={scopes}
              staff={true} fixedZone={zoneParam || ''}
              onCreated={(p) => setProjects(prev => [p, ...prev])} />
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
function NewProject({ zones, lang, s, scopes, staff, fixedZone, onCreated }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [zoneSel, setZoneSel] = useState(fixedZone || '')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('accounts').select('id, name').order('name')
      .then(({ data }) => {
        const all = data ?? []
        setAccounts(staff ? all
          : all.filter(a => scopes.some(sc => sc.account_id === a.id)))
      })
  }, [staff, scopes])

  const zonesFor = (accountId) => staff ? zones
    : zones.filter(z => scopes.some(sc =>
        sc.account_id === accountId && sc.zone_code === z.code))
  const [accountSel, setAccountSel] = useState('')

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
    if (error) { setStatus({ ok: false, msg: error.message || s.npError }) }
    else {
      setStatus({ ok: true, msg: s.npCreated })
      onCreated(data); f.reset()
      // the creator joins the project team as admin
      await supabase.from('project_members').upsert({
        project_id: data.id, user_id: user.id, member_role: 'admin',
      })
      // O360 project → its assessment was auto-created; open it
      if (data.zone_code === 'assessment') {
        const { data: a } = await supabase.from('assessments')
          .select('id').eq('project_id', data.id).maybeSingle()
        if (a) navigate(`/portal/assessment/${a.id}`)
      }
    }
  }

  return (
    <section className="portal-card wide">
      <h3>{s.newProject}</h3>
      <form className="np-form" onSubmit={onSubmit}>
        <p className="proj-meta">{s.npCode}</p>
        {zoneSel === 'assessment' && <p className="proj-meta">{s.npOpenO360}</p>}
        <div className="np-row">
          <div className="field">
            <label htmlFor="np-account">{s.npAccount}</label>
            <select id="np-account" name="account" required value={accountSel}
                    onChange={(e) => { setAccountSel(e.target.value); setZoneSel('') }}>
              <option value="">—</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="np-zone">{s.npZone}</label>
            <select id="np-zone" name="zone" required value={zoneSel}
                    disabled={!!fixedZone}
                    onChange={(e) => setZoneSel(e.target.value)}>
              <option value="">—</option>
              {zonesFor(accountSel).map(z => (
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
