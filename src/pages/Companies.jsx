import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PmShell from '../components/PmShell.jsx'
import {
  PORTAL_STRINGS, ZONE_FALLBACK, zoneText, validateCompany,
} from '../data/orbitalPortal.js'

const EMPTY = { id: null, name: '', vat: '', address: '', country: '', sector: '',
                crm_status: 'lead', primary_contact: '' }

/** /portal/companies — company profiles + product funnel + user access. */
export default function Companies() {
  const { role } = useAuth()
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const isSuper = role === 'superadmin'

  const [rows, setRows] = useState([])
  const [contacts, setContacts] = useState([])
  const [zones, setZones] = useState(ZONE_FALLBACK)
  const [subs, setSubs] = useState([])
  const [grants, setGrants] = useState([])
  const [profiles, setProfiles] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [openId, setOpenId] = useState(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    if (!supabase) return
    const [a, c, z, sb, g, p] = await Promise.all([
      supabase.from('accounts')
        .select('id, name, vat, address, country, sector, crm_status, primary_contact')
        .order('name'),
      supabase.from('contacts')
        .select('id, first_name, last_name, email, phone, position, company_id, consent, marketing_consent, erasure_requested')
        .order('last_name'),
      supabase.from('zones').select('code, name_en, name_ar, sort_order')
        .eq('is_active', true).order('sort_order'),
      supabase.from('subscriptions')
        .select('id, account_id, zone_code, status, primary_contact_id, start_date, licenses, project_limit'),
      supabase.from('user_product_access')
        .select('user_id, account_id, zone_code, access_level'),
      supabase.from('profiles')
        .select('id, full_name, email, role').order('full_name'),
    ])
    setRows(a.data ?? []); setContacts(c.data ?? [])
    if (z.data?.length) setZones(z.data)
    setSubs(sb.data ?? []); setGrants(g.data ?? []); setProfiles(p.data ?? [])
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const contactName = (id) => {
    const c = contacts.find(x => x.id === id)
    return c ? `${c.first_name} ${c.last_name}` : '—'
  }
  const userName = (id) => profiles.find(p => p.id === id)?.full_name
    || profiles.find(p => p.id === id)?.email || '—'
  const zName = (code) => zoneText(zones.find(z => z.code === code) || {}, lang).name || code

  async function save(e) {
    e.preventDefault()
    const errs = validateCompany(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus({ ok: false, msg: errs.vat && form.vat ? s.cpVatInvalid : s.cpRequiredMsg })
      return
    }
    setBusy(true); setStatus(null)
    const payload = {
      name: form.name.trim(),
      vat: form.vat.trim().toUpperCase(),
      address: form.address.trim(),
      country: form.country.trim() || null,
      sector: form.sector.trim() || null,
      crm_status: form.crm_status,
      primary_contact: form.primary_contact || null,
    }
    const q = form.id
      ? supabase.from('accounts').update(payload).eq('id', form.id)
      : supabase.from('accounts').insert(payload).select().single()
    const { data, error } = await q
    // link the primary contact to the company
    const cid = form.id || data?.id
    if (!error && cid && payload.primary_contact) {
      await supabase.from('contacts')
        .update({ company_id: cid }).eq('id', payload.primary_contact)
    }
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else { setStatus({ ok: true, msg: s.cpSaved }); setForm(EMPTY); setErrors({}); load() }
  }

  function edit(r) {
    setForm({ ...EMPTY, ...r, vat: r.vat || '', address: r.address || '',
              country: r.country || '', sector: r.sector || '',
              primary_contact: r.primary_contact || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------- funnel: subscribe product / grant access (superadmin) ---------- */
  async function subscribe(accountId, e) {
    e.preventDefault()
    const f = e.target
    setBusy(true)
    const company = rows.find(r => r.id === accountId)
    const { error } = await supabase.from('subscriptions').upsert({
      account_id: accountId,
      zone_code: f.zone.value,
      status: f.status.value,
      primary_contact_id: company?.primary_contact || null,
    }, { onConflict: 'account_id,zone_code' })
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else load()
  }

  async function setSubStatus(sub, newStatus) {
    setBusy(true)
    await supabase.from('subscriptions').update({ status: newStatus }).eq('id', sub.id)
    setBusy(false); load()
  }

  // Product check: on = active subscription; off = suspended (grants remain, access locks)
  async function toggleProduct(accountId, zoneCode, on, existing) {
    setBusy(true); setStatus(null)
    const { error } = existing
      ? await supabase.from('subscriptions')
          .update({ status: on ? 'active' : 'suspended' }).eq('id', existing.id)
      : await supabase.from('subscriptions').insert({
          account_id: accountId, zone_code: zoneCode, status: 'active', licenses: 1 })
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else load()
  }

  async function setProjectLimit(sub, n) {
    const v = Math.max(1, Number(n) || 1)
    setBusy(true)
    const { error } = await supabase.from('subscriptions')
      .update({ project_limit: v }).eq('id', sub.id)
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else load()
  }

  async function setLicenses(sub, n) {
    const v = Math.max(1, Number(n) || 1)
    setBusy(true)
    const { error } = await supabase.from('subscriptions')
      .update({ licenses: v }).eq('id', sub.id)
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else load()
  }

  async function grant(accountId, e) {
    e.preventDefault()
    const f = e.target
    setBusy(true)
    const { error } = await supabase.from('user_product_access').upsert({
      user_id: f.user.value,
      account_id: accountId,
      zone_code: f.zone.value,
      access_level: f.level.value,
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

  return (
    <PmShell>
      <h1>{s.cpTitle}</h1>
      <p className="sub">{s.cpSub}</p>
      {status && <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>}

      <div className="portal-panels">
        {/* ---------------- form ---------------- */}
        <section className="portal-card wide2">
          <h3>{form.id ? s.coEdit : s.cpNew}</h3>
          <form className="np-form" onSubmit={save} noValidate>
            <div className="np-row">
              <div className="field">
                <label htmlFor="cp-name">{s.cpName}</label>
                <input id="cp-name" value={form.name} onChange={set('name')}
                       aria-invalid={errors.name || undefined} required />
              </div>
              <div className="field">
                <label htmlFor="cp-vat">{s.cpVat}</label>
                <input id="cp-vat" value={form.vat} onChange={set('vat')}
                       aria-invalid={errors.vat || undefined} placeholder="TRN / VAT" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="cp-addr">{s.cpAddress}</label>
              <input id="cp-addr" value={form.address} onChange={set('address')}
                     aria-invalid={errors.address || undefined} required />
            </div>
            <div className="np-row">
              <div className="field">
                <label htmlFor="cp-primary">{s.cpPrimary}</label>
                <select id="cp-primary" value={form.primary_contact} onChange={set('primary_contact')}>
                  <option value="">—</option>
                  {contacts.filter(c => !c.erasure_requested).map(c => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name} · {c.email}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="cp-status">{s.cpStatus}</label>
                <select id="cp-status" value={form.crm_status} onChange={set('crm_status')}>
                  {Object.entries(s.crmStatus).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="pm-actions">
              <button className="btn btn-primary" disabled={busy} type="submit">{s.cpSave}</button>
              {form.id && (
                <button type="button" className="btn btn-ghost"
                        onClick={() => { setForm(EMPTY); setErrors({}) }}>✕</button>
              )}
            </div>
          </form>
        </section>)}

        {/* ---------------- list ---------------- */}
        <section className="portal-card wide2">
          {rows.length === 0 ? <p>{s.cpNone}</p> : rows.map(r => {
            const rSubs = subs.filter(x => x.account_id === r.id)
            const rGrants = grants.filter(x => x.account_id === r.id)
            const open = openId === r.id
            return (
              <div key={r.id} className="cp-item">
                <div className="cp-head">
                  <div>
                    <b>{r.name}</b>
                    {(!r.vat || !r.address || !r.primary_contact) &&
                      <span className="badge-partial">{s.coPartial}</span>}
                    <span className="proj-meta"> · {s.cpVat}: {r.vat || '—'} · {s.cpPrimary}: </span>
                    <span className={['active','success'].includes(r.crm_status) ? 'name-active' : ''}>
                      {contactName(r.primary_contact)}
                    </span>
                  </div>
                  <div className="pm-actions">
                    <span className={`pill pill-${r.crm_status}`}>{s.crmStatus[r.crm_status] || r.crm_status}</span>
                    {isSuper && <button className="btn btn-ghost btn-xs" onClick={() => edit(r)}>{s.coEdit}</button>}
                    <button className="btn btn-ghost btn-xs"
                            onClick={() => setOpenId(open ? null : r.id)}>
                      {s.cpProducts} {open ? '▴' : '▾'}
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="cp-detail">
                    {/* company contacts */}
                    {isSuper && <h4 className="cp-h4">{s.contacts}</h4>}
                    {isSuper && (() => {
                      const cc = contacts.filter(c => c.company_id === r.id)
                      if (cc.length === 0) return <p className="proj-meta">{s.coNone}</p>
                      return (
                        <table className="portal-table tbl-compact">
                          <thead>
                            <tr><th>{s.uName}</th><th>{s.uEmail}</th><th>{s.coCell}</th>
                                <th>GDPR</th><th>Newsletter</th></tr>
                          </thead>
                          <tbody>
                            {cc.map(c => (
                              <tr key={c.id} className={c.erasure_requested ? 'row-pending' : ''}>
                                <td>
                                  <b className={r.primary_contact === c.id ? 'name-active' : ''}>
                                    {c.first_name} {c.last_name}
                                  </b>
                                  {c.position && <span className="proj-meta"> · {c.position}</span>}
                                  {r.primary_contact === c.id && ' ★'}
                                </td>
                                <td>{c.email}</td>
                                <td>{c.phone || '—'}</td>
                                <td>{c.erasure_requested ? '✕' : c.consent ? '✓' : '—'}</td>
                                <td>{c.marketing_consent ? '✉ ✓' : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    })()}

                    {/* products: one CHECK per product + licenses (superadmin) */}
                    <ul className="proj-list cp-products">
                      {zones.map(z => {
                        const sub = rSubs.find(x => x.zone_code === z.code)
                        const on = !!sub && ['trial', 'active'].includes(sub.status)
                        const used = grants.filter(g =>
                          g.account_id === r.id && g.zone_code === z.code).length
                        return (
                          <li key={z.code}>
                            <div className="proj-top">
                              <label className="cp-check">
                                <input type="checkbox" checked={on}
                                       disabled={busy || !isSuper}
                                       onChange={(e) => toggleProduct(r.id, z.code, e.target.checked, sub)} />
                                <b>{zName(z.code)}</b>
                                {on && <span className="pill pill-active">{s.cpProductOn}</span>}
                              </label>
                              {sub && on && (
                                <span className="cp-licenses">
                                  {s.cpLicenses}:{' '}
                                  {isSuper ? (
                                    <input type="number" min="1" className="cp-lic-input"
                                           defaultValue={sub.licenses ?? 1} disabled={busy}
                                           onBlur={(e) => Number(e.target.value) !== (sub.licenses ?? 1)
                                             && setLicenses(sub, e.target.value)} />
                                  ) : <b>{sub.licenses ?? 1}</b>}
                                  <span className="proj-meta"> · {used}/{sub.licenses ?? 1} {s.cpSeats}</span>
                                  <span className="proj-meta"> · {s.cpProjLimit}: </span>
                                  {isSuper ? (
                                    <input type="number" min="1" className="cp-lic-input"
                                           defaultValue={sub.project_limit ?? 1} disabled={busy}
                                           onBlur={(e) => Number(e.target.value) !== (sub.project_limit ?? 1)
                                             && setProjectLimit(sub, e.target.value)} />
                                  ) : <b>{sub.project_limit ?? 1}</b>}
                                </span>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                    {isSuper && <p className="proj-meta">{s.cpLicenseHint}</p>}

                    {/* user access */}
                    <h4 className="cp-h4">{s.cpGrant}</h4>
                    {rGrants.length === 0 ? <p className="proj-meta">{s.cpNoUsers}</p> : (
                      <table className="portal-table">
                        <tbody>
                          {rGrants.map(g => (
                            <tr key={g.user_id + g.zone_code}>
                              <td><b>{userName(g.user_id)}</b></td>
                              <td>{zName(g.zone_code)}</td>
                              <td>{s.productRoles[g.access_level] || g.access_level}</td>
                              <td>
                                {isSuper && (
                                  <button className="btn btn-ghost btn-xs" disabled={busy}
                                          onClick={() => removeGrant(g)}>{s.cpRevokeAccess}</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {isSuper && (
                      <form className="cp-inline" onSubmit={(e) => grant(r.id, e)}>
                        <select name="user" required>
                          <option value="">{s.cpUser} —</option>
                          {profiles.map(p => (
                            <option key={p.id} value={p.id}>{p.full_name || p.email}</option>
                          ))}
                        </select>
                        <select name="zone" required>
                          {(rSubs.length ? rSubs.map(x => x.zone_code) : zones.map(z => z.code))
                            .map(code => <option key={code} value={code}>{zName(code)}</option>)}
                        </select>
                        <select name="level" defaultValue="assessor">
                          {Object.entries(s.productRoles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <button className="btn btn-primary btn-xs" disabled={busy} type="submit">
                          {s.cpGrantBtn}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </section>
      </div>
    </PmShell>
  )
}
