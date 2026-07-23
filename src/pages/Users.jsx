import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PmShell from '../components/PmShell.jsx'
import { PORTAL_STRINGS, ROLE_LABEL } from '../data/orbitalPortal.js'

const ROLES = ['client', 'consultant', 'account_manager', 'admin', 'superadmin']

/** /portal/users — user & contact management (superadmin / admin only). */
export default function Users() {
  const { role } = useAuth()
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const roleLabels = ROLE_LABEL[lang] || ROLE_LABEL.en
  const isSuper = role === 'superadmin'

  const [tab, setTab] = useState('users')
  const [profiles, setProfiles] = useState([])
  const [companies, setCompanies] = useState([])
  const [editing, setEditing] = useState(null)   // profile id being edited
  const [pending, setPending] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  async function loadAll() {
    if (!supabase) return
    const [p, a, q, co] = await Promise.all([
      supabase.from('profiles')
        .select('id, email, first_name, last_name, full_name, phone, company_id, role, created_at')
        .order('created_at'),
      supabase.from('authorized_users')
        .select('email, first_name, last_name, role, authorized')
        .eq('authorized', true),
      supabase.from('inquiries')
        .select('id, name, first_name, last_name, email, organisation, message, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('accounts').select('id, name').order('name'),
    ])
    setCompanies(co.data ?? [])
    const profs = p.data ?? []
    setProfiles(profs)
    const emails = new Set(profs.map(x => (x.email || '').toLowerCase()))
    setPending((a.data ?? []).filter(x => !emails.has(x.email.toLowerCase())))
    setInquiries(q.data ?? [])
  }

  useEffect(() => { loadAll() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Grantable roles: admins cannot grant admin/superadmin (RPC also enforces it)
  const grantable = ROLES.filter(r => isSuper || !['admin', 'superadmin'].includes(r))

  async function setUserRole(u, newRole) {
    const msg = (s.coRoleConfirm || 'Change role of {name} to {role}?')
      .replace('{name}', u.full_name || u.email)
      .replace('{role}', roleLabels[newRole] || newRole)
    if (!window.confirm(msg)) { loadAll(); return }
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.rpc('authorize_user', {
      p_email: u.email,
      p_first: u.first_name || '',
      p_last: u.last_name || '',
      p_role: newRole,
    })
    setBusy(false)
    setStatus(error ? { ok: false, msg: s.uError + ' ' + (error.message || '') }
                    : { ok: true, msg: data })
    if (!error) loadAll()
  }

  async function revoke(email) {
    if (!window.confirm(s.uConfirmRevoke)) return
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.rpc('revoke_user', { p_email: email })
    setBusy(false)
    setStatus(error ? { ok: false, msg: s.uError + ' ' + (error.message || '') }
                    : { ok: true, msg: data })
    if (!error) loadAll()
  }

  async function saveUserEdit(e, u) {
    e.preventDefault()
    const f = e.target
    setBusy(true); setStatus(null)
    const first = f.first.value.trim(), last = f.last.value.trim()
    const { error } = await supabase.from('profiles').update({
      first_name: first,
      last_name: last,
      full_name: `${first} ${last}`.trim(),
      phone: f.phone.value.trim() || null,
      company_id: f.company.value || null,
    }).eq('id', u.id)
    setBusy(false)
    setStatus(error ? { ok: false, msg: s.uError + ' ' + (error.message || '') }
                    : { ok: true, msg: s.accSaved })
    if (!error) { setEditing(null); loadAll() }
  }

  async function authorizeNew(e) {
    e.preventDefault()
    const f = e.target
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.rpc('authorize_user', {
      p_email: f.email.value.trim(),
      p_first: f.first.value.trim(),
      p_last: f.last.value.trim(),
      p_role: f.role.value,
    })
    setBusy(false)
    setStatus(error ? { ok: false, msg: s.uError + ' ' + (error.message || '') }
                    : { ok: true, msg: data || s.uAuthOk })
    if (!error) { f.reset(); loadAll() }
  }

  return (
    <PmShell>
      <h1>{s.usersTitle}</h1>
      <p className="sub">{s.usersSub}</p>

      <div className="tab-row" role="tablist">
        <button role="tab" aria-selected={tab === 'users'}
                className={`tab-btn ${tab === 'users' ? 'on' : ''}`}
                onClick={() => setTab('users')}>{s.tabUsers}</button>
        <button role="tab" aria-selected={tab === 'contacts'}
                className={`tab-btn ${tab === 'contacts' ? 'on' : ''}`}
                onClick={() => setTab('contacts')}>{s.tabContacts}</button>
      </div>

      {status && <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>}

      {tab === 'users' && (
        <div className="portal-panels">
          <section className="portal-card wide2">
            <h3>{s.tabUsers}</h3>
            {profiles.length === 0 ? <p>{s.uEmpty}</p> : (
              <table className="portal-table">
                <thead>
                  <tr><th>{s.uName}</th><th>{s.uEmail}</th><th>{s.coCell}</th><th>{s.coCompany}</th><th>{s.uRole}</th><th>{s.uActions}</th></tr>
                </thead>
                <tbody>
                  {profiles.map(u => (
                    <tr key={u.id}>
                      <td><b>{u.full_name || `${u.first_name || ''} ${u.last_name || ''}`}</b></td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>{companies.find(c => c.id === u.company_id)?.name || '—'}</td>
                      <td>
                        {u.email?.toLowerCase() === 'alejandro@efqmassessors.ae'
                          ? <span className="role-badge">{roleLabels.superadmin}</span>
                          : (
                          <select
                            value={u.role}
                            disabled={busy || (!isSuper && ['admin','superadmin'].includes(u.role))}
                            onChange={(e) => setUserRole(u, e.target.value)}
                          >
                            {(grantable.includes(u.role) ? grantable : [...grantable, u.role]).map(r =>
                              <option key={r} value={r}>{roleLabels[r]}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="pm-actions">
                        <button className="btn btn-ghost btn-xs" disabled={busy}
                                onClick={() => setEditing(editing === u.id ? null : u.id)}>
                          {s.coEdit}
                        </button>
                        {u.email?.toLowerCase() !== 'alejandro@efqmassessors.ae' && (
                          <button className="btn btn-ghost btn-xs" disabled={busy}
                                  onClick={() => revoke(u.email)}>{s.uRevoke}</button>
                        )}
                      </td>
                    </tr>
                  )).flatMap((row, i) => {
                    const u = profiles[i]
                    if (editing !== u.id) return [row]
                    return [row, (
                      <tr key={u.id + '-edit'}>
                        <td colSpan="6">
                          <form className="cp-inline" onSubmit={(e) => saveUserEdit(e, u)}>
                            <input name="first" defaultValue={u.first_name || ''} placeholder={s.accFirst} required />
                            <input name="last" defaultValue={u.last_name || ''} placeholder={s.accLast} required />
                            <input name="phone" defaultValue={u.phone || ''} placeholder={s.coCell} />
                            <select name="company" defaultValue={u.company_id || ''}>
                              <option value="">{s.coCompany} —</option>
                              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button className="btn btn-primary btn-xs" disabled={busy} type="submit">{s.accSave}</button>
                          </form>
                        </td>
                      </tr>
                    )]
                  })}
                  {pending.map(u => (
                    <tr key={'p-' + u.email} className="row-pending">
                      <td><b>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'}</b></td>
                      <td>{u.email}</td>
                      <td>—</td>
                      <td>—</td>
                      <td>{roleLabels[u.role]} · <em>{s.uPending}</em></td>
                      <td>
                        <button className="btn btn-ghost btn-xs" disabled={busy}
                                onClick={() => revoke(u.email)}>{s.uRevoke}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="portal-card wide2">
            <h3>{s.uAuthTitle}</h3>
            <form className="np-form" onSubmit={authorizeNew}>
              <div className="np-row">
                <div className="field">
                  <label htmlFor="au-first">{s.accFirst}</label>
                  <input id="au-first" name="first" required />
                </div>
                <div className="field">
                  <label htmlFor="au-last">{s.accLast}</label>
                  <input id="au-last" name="last" required />
                </div>
              </div>
              <div className="np-row">
                <div className="field">
                  <label htmlFor="au-email">{s.uEmail}</label>
                  <input id="au-email" name="email" type="email" required />
                </div>
                <div className="field">
                  <label htmlFor="au-role">{s.uRole}</label>
                  <select id="au-role" name="role" defaultValue="client">
                    {grantable.map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" disabled={busy} type="submit">{s.uAuthBtn}</button>
            </form>
          </section>
        </div>
      )}

      {tab === 'contacts' && (
        <div className="portal-panels">
          <section className="portal-card wide2">
            <h3>{s.tabContacts}</h3>
            {inquiries.length === 0 ? <p>{s.cEmpty}</p> : (
              <table className="portal-table">
                <thead>
                  <tr><th>{s.cWhen}</th><th>{s.uName}</th><th>{s.uEmail}</th><th>{s.cMsg}</th></tr>
                </thead>
                <tbody>
                  {inquiries.map(q => (
                    <tr key={q.id}>
                      <td>{new Date(q.created_at).toLocaleDateString(lang === 'ar' ? 'ar' : 'en-GB')}</td>
                      <td>
                        <b>{q.name || `${q.first_name || ''} ${q.last_name || ''}`}</b>
                        {q.organisation && <span className="proj-meta"> · {q.organisation}</span>}
                      </td>
                      <td><a href={`mailto:${q.email}`}>{q.email}</a></td>
                      <td className="cell-msg">{q.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}
    </PmShell>
  )
}
