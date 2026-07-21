import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PmShell from '../components/PmShell.jsx'
import { PORTAL_STRINGS, ROLE_LABEL, ZONE_FALLBACK, zoneText, validateContact } from '../data/orbitalPortal.js'
import { brevoUpsert, brevoDelete } from '../lib/brevo.js'

const EMPTY = { id: null, first_name: '', last_name: '', email: '', phone: '',
                company_id: '', position: '', consent: false, marketing_consent: false,
                consent_source: 'manual' }
const ROLES_GRANTABLE = ['client', 'consultant', 'account_manager']

/**
 * /portal/contacts — ONE list for every individual.
 * Merges CRM contacts + platform users (matched by email). For users, role
 * and product permits are managed inline. Pending invitations show as rows.
 */
export default function Contacts() {
  const { user, role } = useAuth()
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const roleLabels = ROLE_LABEL[lang] || ROLE_LABEL.en
  const isSuper = role === 'superadmin'

  const [contacts, setContacts] = useState([])
  const [profiles, setProfiles] = useState([])
  const [pending, setPending] = useState([])
  const [companies, setCompanies] = useState([])
  const [zones, setZones] = useState(ZONE_FALLBACK)
  const [grants, setGrants] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editUserId, setEditUserId] = useState(null)   // editing a user-only row
  const [newCompany, setNewCompany] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [activating, setActivating] = useState(null)
  const [permitsFor, setPermitsFor] = useState(null)    // user_id with permits open

  async function load() {
    if (!supabase) return
    const [c, p, a, au, z, g] = await Promise.all([
      supabase.from('contacts')
        .select('id, first_name, last_name, email, phone, company_id, company_name, position, consent, marketing_consent, consent_source, brevo_synced_at, erasure_requested, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('profiles')
        .select('id, email, first_name, last_name, full_name, phone, company_id, role, design_permit'),
      supabase.from('accounts').select('id, name, crm_status').order('name'),
      supabase.from('authorized_users')
        .select('email, first_name, last_name, role, authorized').eq('authorized', true),
      supabase.from('zones').select('code, name_en, name_ar, sort_order')
        .eq('is_active', true).order('sort_order'),
      supabase.from('user_product_access')
        .select('user_id, account_id, zone_code, access_level'),
    ])
    setContacts(c.data ?? []); setProfiles(p.data ?? [])
    setCompanies(a.data ?? []); setGrants(g.data ?? [])
    if (z.data?.length) setZones(z.data)
    const emails = new Set([
      ...(c.data ?? []).map(x => x.email.toLowerCase()),
      ...(p.data ?? []).map(x => (x.email || '').toLowerCase()),
    ])
    setPending((au.data ?? []).filter(x => !emails.has(x.email.toLowerCase())))
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- merged rows: one per individual ---------- */
  const profByEmail = Object.fromEntries(
    profiles.map(p => [(p.email || '').toLowerCase(), p]))
  const contactEmails = new Set(contacts.map(c => c.email.toLowerCase()))
  const rows = [
    ...contacts.map(c => ({ ...c, kind: 'contact', profile: profByEmail[c.email.toLowerCase()] || null })),
    ...profiles
      .filter(p => p.email && !contactEmails.has(p.email.toLowerCase()))
      .map(p => ({
        id: 'u-' + p.id, kind: 'user-only', profile: p,
        first_name: p.first_name || '', last_name: p.last_name || '',
        email: p.email, phone: p.phone, company_id: p.company_id,
      })),
  ]

  const companyName = (id, raw) => companies.find(c => c.id === id)?.name || raw || '—'
  const companyActive = (id) =>
    ['active', 'success'].includes(companies.find(c => c.id === id)?.crm_status)
  const isPartial = (r) => r.kind === 'contact' && (!r.company_id || !r.phone || !r.position)
  const zName = (code) => zoneText(zones.find(z => z.code === code) || {}, lang).name || code
  const set = (k) => (e) => setForm(f => ({
    ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
  }))

  /* ---------- save (contact, user-only, or both) ---------- */
  async function save(e) {
    e.preventDefault()
    const errs = validateContact(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus({ ok: false, msg: errs.email ? s.coEmailInvalid : errs.phone ? s.coPhoneInvalid : s.coRequired })
      return
    }
    setBusy(true); setStatus(null)
    let companyId = form.company_id || null
    if (form.company_id === '__new__') {
      const name = newCompany.trim()
      if (!name) { setBusy(false); setStatus({ ok: false, msg: s.coRequired }); return }
      const { data: acc, error: accErr } = await supabase.from('accounts')
        .insert({ name, crm_status: 'lead' }).select().single()
      if (accErr) { setBusy(false); setStatus({ ok: false, msg: accErr.message }); return }
      companyId = acc.id
    }
    const base = {
      first_name: form.first_name.trim(), last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(), phone: form.phone.trim() || null,
      company_id: companyId,
    }
    let error = null
    if (editUserId && !form.id) {
      // user-only row → update the profile
      ;({ error } = await supabase.from('profiles').update({
        ...base, full_name: `${base.first_name} ${base.last_name}`.trim(),
      }).eq('id', editUserId))
    } else {
      const payload = {
        ...base,
        position: form.position.trim() || null,
        consent: form.consent,
        consent_at: form.consent ? new Date().toISOString() : null,
        consent_source: form.consent_source || 'manual',
        marketing_consent: form.marketing_consent,
      }
      ;({ error } = form.id
        ? await supabase.from('contacts').update(payload).eq('id', form.id)
        : await supabase.from('contacts').insert({ ...payload, created_by: user.id }))
      // keep the linked profile in sync
      const prof = profByEmail[base.email]
      if (!error && prof) {
        await supabase.from('profiles').update({
          ...base, full_name: `${base.first_name} ${base.last_name}`.trim(),
        }).eq('id', prof.id)
      }
    }
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else {
      setStatus({ ok: true, msg: s.coSaved })
      setForm(EMPTY); setErrors({}); setNewCompany(''); setEditUserId(null); load()
    }
  }

  function edit(r) {
    if (r.kind === 'user-only') {
      setEditUserId(r.profile.id)
      setForm({ ...EMPTY, first_name: r.first_name, last_name: r.last_name,
                email: r.email, phone: r.phone || '', company_id: r.company_id || '' })
    } else {
      setEditUserId(null)
      setForm({ ...EMPTY, ...r, phone: r.phone || '', company_id: r.company_id || '',
                position: r.position || '' })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function gdprErase(r) {
    if (!window.confirm(s.coEraseConfirm)) return
    setBusy(true)
    const { error } = await supabase.rpc('gdpr_erase_contact', { p_contact: r.id })
    if (!error) await brevoDelete(r.email)
    setBusy(false)
    if (!error) load()
  }

  async function importInquiries() {
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.rpc('import_inquiries_to_contacts')
    setBusy(false)
    setStatus(error ? { ok: false, msg: error.message } : { ok: true, msg: `${data} ${s.coImported}` })
    if (!error) load()
  }

  /* ---------- Brevo ---------- */
  async function syncOne(r) {
    setBusy(true); setStatus(null)
    const res = await brevoUpsert({
      email: r.email, first_name: r.first_name, last_name: r.last_name,
      phone: r.phone, company: companyName(r.company_id, r.company_name),
    })
    if (res.ok) {
      await supabase.from('contacts')
        .update({ brevo_synced_at: new Date().toISOString() }).eq('id', r.id)
      setStatus({ ok: true, msg: s.coSyncOk }); load()
    } else setStatus({ ok: false, msg: `${s.coSyncErr} ${res.error || res.detail || res.status}` })
    setBusy(false)
  }

  async function syncAll() {
    const list = contacts.filter(r => r.marketing_consent && !r.erasure_requested)
    setBusy(true); setStatus(null)
    let okCount = 0
    for (const r of list) {
      const res = await brevoUpsert({
        email: r.email, first_name: r.first_name, last_name: r.last_name,
        phone: r.phone, company: companyName(r.company_id, r.company_name),
      })
      if (res.ok) okCount++
    }
    if (okCount) await supabase.from('contacts')
      .update({ brevo_synced_at: new Date().toISOString() })
      .in('id', list.map(r => r.id))
    setStatus({ ok: okCount === list.length,
                msg: `${okCount}/${list.length} · ${okCount === list.length ? s.coSyncOk : s.coSyncErr}` })
    setBusy(false); load()
  }

  async function exportBrevo() {
    const list = contacts.filter(r => r.marketing_consent && !r.erasure_requested)
    if (!list.length) return
    const head = 'EMAIL;FIRSTNAME;LASTNAME;SMS;COMPANY'
    const csv = [head, ...list.map(r =>
      [r.email, r.first_name, r.last_name, r.phone || '', companyName(r.company_id, r.company_name)]
        .map(v => String(v).replaceAll(';', ',')).join(';'))].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'orbital360-contacts-brevo.csv'
    a.click(); URL.revokeObjectURL(a.href)
    await supabase.from('contacts')
      .update({ brevo_synced_at: new Date().toISOString() }).in('id', list.map(r => r.id))
    load()
  }

  /* ---------- user management on the same row ---------- */
  async function activate(r, chosenRole) {
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.functions.invoke('activate-contact', {
      body: { contact_id: r.id, role: chosenRole,
              redirect_to: `${window.location.origin}/login` },
    })
    setBusy(false); setActivating(null)
    if (error || data?.error) setStatus({ ok: false, msg: (data?.error || error.message) })
    else {
      setStatus({ ok: true, msg: data.existed ? s.coActivatedExisting : s.coActivated })
      load()
    }
  }

  async function setUserRole(r, newRole) {
    const msg = (s.coRoleConfirm || 'Change role of {name} to {role}?')
      .replace('{name}', `${r.first_name} ${r.last_name}`.trim() || r.email)
      .replace('{role}', roleLabels[newRole] || newRole)
    if (!window.confirm(msg)) { load(); return }
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.rpc('authorize_user', {
      p_email: r.email, p_first: r.first_name || '', p_last: r.last_name || '',
      p_role: newRole,
    })
    setBusy(false)
    setStatus(error ? { ok: false, msg: s.uError + ' ' + (error.message || '') }
                    : { ok: true, msg: data })
    if (!error) load()
  }

  async function revoke(email) {
    if (!window.confirm(s.uConfirmRevoke)) return
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.rpc('revoke_user', { p_email: email })
    setBusy(false)
    setStatus(error ? { ok: false, msg: s.uError + ' ' + (error.message || '') }
                    : { ok: true, msg: data })
    if (!error) load()
  }

  async function setDesign(userId, permit) {
    setBusy(true); setStatus(null)
    const { error } = await supabase.rpc('set_design_permit',
      { p_user: userId, p_permit: permit })
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else load()
  }

  async function addGrant(userId, e) {
    e.preventDefault()
    const f = e.target
    setBusy(true)
    const { error } = await supabase.from('user_product_access').upsert({
      user_id: userId, account_id: f.gcompany.value,
      zone_code: f.gzone.value, access_level: f.glevel.value,
    })
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else load()
  }

  async function removeGrant(g) {
    setBusy(true)
    await supabase.from('user_product_access').delete()
      .eq('user_id', g.user_id).eq('account_id', g.account_id).eq('zone_code', g.zone_code)
    setBusy(false); load()
  }

  const roleOptions = ROLES_GRANTABLE.concat(isSuper ? ['admin'] : [])
  const isAlejandro = (r) => (r.email || '').toLowerCase() === 'alejandro@efqmassessors.ae'

  return (
    <PmShell>
      <h1>{s.coTitle}</h1>
      <p className="sub">{s.coMergedSub}</p>

      <div className="pm-actions">
        <button className="btn btn-ghost btn-xs" disabled={busy} onClick={importInquiries}>{s.coImport}</button>
        <button className="btn btn-primary btn-xs" disabled={busy} onClick={syncAll}
                title={s.coExportNote}>{s.coSyncAll}</button>
        <button className="btn btn-ghost btn-xs" disabled={busy} onClick={exportBrevo}
                title={s.coExportNote}>{s.coExportBrevo}</button>
      </div>
      {status && <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>}

      <div className="portal-panels">
        {/* ---------------- form ---------------- */}
        <section className="portal-card wide2">
          <h3>{(form.id || editUserId) ? s.coEdit : s.coNew}
              {editUserId && <span className="proj-meta"> · {s.peUserOnly}</span>}</h3>
          <form className="np-form" onSubmit={save} noValidate>
            <div className="np-row">
              <div className="field">
                <label htmlFor="ct-first">{s.accFirst}</label>
                <input id="ct-first" value={form.first_name} onChange={set('first_name')}
                       aria-invalid={errors.first_name || undefined} required />
              </div>
              <div className="field">
                <label htmlFor="ct-last">{s.accLast}</label>
                <input id="ct-last" value={form.last_name} onChange={set('last_name')}
                       aria-invalid={errors.last_name || undefined} required />
              </div>
            </div>
            <div className="np-row">
              <div className="field">
                <label htmlFor="ct-email">{s.uEmail}</label>
                <input id="ct-email" type="email" value={form.email} onChange={set('email')}
                       aria-invalid={errors.email || undefined} required disabled={!!editUserId} />
              </div>
              <div className="field">
                <label htmlFor="ct-phone">{s.coCell}</label>
                <input id="ct-phone" value={form.phone} onChange={set('phone')}
                       aria-invalid={errors.phone || undefined} placeholder="+971 …" />
              </div>
            </div>
            <div className="np-row">
              <div className="field">
                <label htmlFor="ct-company">{s.coCompany}</label>
                <select id="ct-company" value={form.company_id} onChange={set('company_id')}>
                  <option value="">—</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="__new__">{s.coNewCompanyOpt}</option>
                </select>
                {form.company_id === '__new__' && (
                  <input aria-label={s.coNewCompanyName} placeholder={s.coNewCompanyName}
                         value={newCompany} onChange={(e) => setNewCompany(e.target.value)}
                         style={{ marginTop: 8 }} required />
                )}
              </div>
              {!editUserId && (
                <div className="field">
                  <label htmlFor="ct-pos">{s.coPosition}</label>
                  <input id="ct-pos" value={form.position} onChange={set('position')} />
                </div>
              )}
            </div>
            {!editUserId && (
              <>
                <div className="field">
                  <label htmlFor="ct-source">{s.coSourceLbl}</label>
                  <select id="ct-source" value={form.consent_source} onChange={set('consent_source')}>
                    {Object.entries(s.coSources).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <label className="consent-row">
                  <input type="checkbox" checked={form.consent} onChange={set('consent')} />
                  <span className="consent-text">{s.coConsent}</span>
                </label>
                <label className="consent-row">
                  <input type="checkbox" checked={form.marketing_consent} onChange={set('marketing_consent')} />
                  <span className="consent-text">{s.coMarketing}</span>
                </label>
              </>
            )}
            <div className="pm-actions">
              <button className="btn btn-primary" disabled={busy} type="submit">{s.coSave}</button>
              {(form.id || editUserId) && (
                <button type="button" className="btn btn-ghost"
                        onClick={() => { setForm(EMPTY); setErrors({}); setEditUserId(null) }}>✕</button>
              )}
            </div>
          </form>
        </section>

        {/* ---------------- ONE merged list ---------------- */}
        <section className="portal-card wide2">
          {rows.length === 0 && pending.length === 0 ? <p>{s.coNone}</p> : (
            <table className="portal-table">
              <thead>
                <tr>
                  <th>{s.uName}</th><th>{s.uEmail}</th><th>{s.coCell}</th>
                  <th>{s.coCompany}</th><th>GDPR</th><th>{s.uRole}</th><th>{s.uActions}</th>
                </tr>
              </thead>
              <tbody>
                {rows.flatMap(r => {
                  const prof = r.profile
                  const rowEls = [(
                    <tr key={r.id} className={r.erasure_requested ? 'row-pending' : ''}>
                      <td>
                        <b className={companyActive(r.company_id) ? 'name-active' : ''}>
                          {r.first_name} {r.last_name}
                        </b>
                        {r.position && <span className="proj-meta"> · {r.position}</span>}
                        {isPartial(r) && !r.erasure_requested &&
                          <span className="badge-partial">{s.coPartial}</span>}
                      </td>
                      <td>{r.email}</td>
                      <td>{r.phone || '—'}</td>
                      <td>{companyName(r.company_id, r.company_name)}</td>
                      <td>
                        {r.kind === 'contact'
                          ? <>{r.consent ? '✓' : '—'}{r.marketing_consent ? ' ✉' : ''}
                              {r.brevo_synced_at ? ' ⇄' : ''}</>
                          : '—'}
                      </td>
                      <td>
                        {prof ? (
                          isAlejandro(r)
                            ? <span className="role-badge">{roleLabels.superadmin}</span>
                            : (
                            <span className="ct-role-stack">
                              <select value={prof.role}
                                      disabled={busy || (!isSuper && ['admin','superadmin'].includes(prof.role))}
                                      onChange={(e) => setUserRole(r, e.target.value)}>
                                {(roleOptions.includes(prof.role) ? roleOptions : [...roleOptions, prof.role])
                                  .map(rr => <option key={rr} value={rr}>{roleLabels[rr]}</option>)}
                              </select>
                              {isSuper && (
                                <select value={prof.design_permit || 'none'} disabled={busy}
                                        title={s.designPermit}
                                        onChange={(e) => setDesign(prof.id, e.target.value)}>
                                  {Object.entries(s.designPermits).map(([k, v]) =>
                                    <option key={k} value={k}>{s.designPermit}: {v}</option>)}
                                </select>
                              )}
                            </span>
                          )
                        ) : r.kind === 'contact' && !r.erasure_requested ? (
                          activating === r.id ? (
                            <span className="pm-actions">
                              <select defaultValue="client" id={`act-role-${r.id}`}>
                                {roleOptions.map(rr => <option key={rr} value={rr}>{roleLabels[rr]}</option>)}
                              </select>
                              <button className="btn btn-primary btn-xs" disabled={busy}
                                      onClick={() => activate(r, document.getElementById(`act-role-${r.id}`).value)}>✓</button>
                              <button className="btn btn-ghost btn-xs" onClick={() => setActivating(null)}>✕</button>
                            </span>
                          ) : (
                            <button className="btn btn-ghost btn-xs" disabled={busy}
                                    onClick={() => setActivating(r.id)}>{s.coActivate}</button>
                          )
                        ) : '—'}
                      </td>
                      <td className="pm-actions">
                        {prof && isSuper && !isAlejandro(r) && (
                          <button className="btn btn-ghost btn-xs"
                                  onClick={() => setPermitsFor(permitsFor === prof.id ? null : prof.id)}>
                            {s.pePermits} {permitsFor === prof.id ? '▴' : '▾'}
                          </button>
                        )}
                        <button className="btn btn-ghost btn-xs" onClick={() => edit(r)}>{s.coEdit}</button>
                        {r.kind === 'contact' && !r.erasure_requested && (
                          <>
                            <button className="btn btn-ghost btn-xs" disabled={busy}
                                    onClick={() => syncOne(r)}>{s.coSyncOne}</button>
                            <button className="btn btn-ghost btn-xs" disabled={busy}
                                    onClick={() => gdprErase(r)}>{s.coErase}</button>
                          </>
                        )}
                        {prof && !isAlejandro(r) && (
                          <button className="btn btn-ghost btn-xs" disabled={busy}
                                  onClick={() => revoke(r.email)}>{s.uRevoke}</button>
                        )}
                      </td>
                    </tr>
                  )]

                  if (prof && permitsFor === prof.id) {
                    const uGrants = grants.filter(g => g.user_id === prof.id)
                    rowEls.push(
                      <tr key={r.id + '-permits'}>
                        <td colSpan="7">
                          <div className="cp-detail">
                            <h4 className="cp-h4">{s.pePermits}</h4>
                            {uGrants.length === 0 ? <p className="proj-meta">{s.peNoGrants}</p> : (
                              <table className="portal-table tbl-compact">
                                <tbody>
                                  {uGrants.map(g => (
                                    <tr key={g.account_id + g.zone_code}>
                                      <td><b>{companyName(g.account_id)}</b></td>
                                      <td>{zName(g.zone_code)}</td>
                                      <td>{s.productRoles[g.access_level] || s.accessLevels?.[g.access_level] || g.access_level}</td>
                                      <td>
                                        <button className="btn btn-ghost btn-xs" disabled={busy}
                                                onClick={() => removeGrant(g)}>{s.cpRevokeAccess}</button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                            <form className="cp-inline" onSubmit={(e) => addGrant(prof.id, e)}>
                              <select name="gcompany" required>
                                <option value="">{s.coCompany} —</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                              <select name="gzone" required>
                                {zones.map(z => <option key={z.code} value={z.code}>{zName(z.code)}</option>)}
                              </select>
                              <select name="glevel" defaultValue="assessor">
                                {Object.entries(s.productRoles).map(([k, v]) =>
                                  <option key={k} value={k}>{v}</option>)}
                              </select>
                              <button className="btn btn-primary btn-xs" disabled={busy} type="submit">
                                {s.cpGrantBtn}
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                  return rowEls
                })}

                {pending.map(u => (
                  <tr key={'p-' + u.email} className="row-pending">
                    <td><b>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—'}</b></td>
                    <td>{u.email}</td>
                    <td>—</td><td>—</td><td>—</td>
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
      </div>
    </PmShell>
  )
}
