import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PmShell from '../components/PmShell.jsx'
import { PORTAL_STRINGS, validateContact } from '../data/orbitalPortal.js'

const EMPTY = { id: null, first_name: '', last_name: '', email: '', phone: '',
                company_id: '', position: '', consent: false, marketing_consent: false,
                consent_source: 'manual' }

/** /portal/contacts — CRM contacts, GDPR-compliant, Brevo export. */
export default function Contacts() {
  const { user } = useAuth()
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en

  const [rows, setRows] = useState([])
  const [companies, setCompanies] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    if (!supabase) return
    const [c, a] = await Promise.all([
      supabase.from('contacts')
        .select('id, first_name, last_name, email, phone, company_id, company_name, position, consent, marketing_consent, brevo_synced_at, erasure_requested, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('accounts').select('id, name').order('name'),
    ])
    setRows(c.data ?? [])
    setCompanies(a.data ?? [])
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const companyName = (id, raw) => companies.find(c => c.id === id)?.name || raw || '—'
  const set = (k) => (e) => setForm(f => ({
    ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
  }))

  async function save(e) {
    e.preventDefault()
    const errs = validateContact(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus({ ok: false, msg: errs.email ? s.coEmailInvalid : errs.phone ? s.coPhoneInvalid : s.coRequired })
      return
    }
    setBusy(true); setStatus(null)
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      company_id: form.company_id || null,
      position: form.position.trim() || null,
      consent: form.consent,
      consent_at: form.consent ? new Date().toISOString() : null,
      consent_source: form.consent_source || 'manual',
      marketing_consent: form.marketing_consent,
    }
    const q = form.id
      ? supabase.from('contacts').update(payload).eq('id', form.id)
      : supabase.from('contacts').insert({ ...payload, created_by: user.id })
    const { error } = await q
    setBusy(false)
    if (error) setStatus({ ok: false, msg: error.message })
    else { setStatus({ ok: true, msg: s.coSaved }); setForm(EMPTY); setErrors({}); load() }
  }

  function edit(r) {
    setForm({ ...EMPTY, ...r, phone: r.phone || '', company_id: r.company_id || '', position: r.position || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function gdprErase(r) {
    if (!window.confirm(s.coEraseConfirm)) return
    setBusy(true)
    const { error } = await supabase.rpc('gdpr_erase_contact', { p_contact: r.id })
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

  /* Brevo linking: CSV in Brevo import format, only marketing-consented,
     then mark exported rows as synced. */
  async function exportBrevo() {
    const list = rows.filter(r => r.marketing_consent && !r.erasure_requested)
    if (!list.length) return
    const head = 'EMAIL;FIRSTNAME;LASTNAME;SMS;COMPANY'
    const csv = [head, ...list.map(r =>
      [r.email, r.first_name, r.last_name, r.phone || '', companyName(r.company_id, r.company_name)]
        .map(v => String(v).replaceAll(';', ',')).join(';')
    )].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'orbital360-contacts-brevo.csv'
    a.click()
    URL.revokeObjectURL(a.href)
    await supabase.from('contacts')
      .update({ brevo_synced_at: new Date().toISOString() })
      .in('id', list.map(r => r.id))
    load()
  }

  return (
    <PmShell>
      <h1>{s.coTitle}</h1>
      <p className="sub">{s.coSub}</p>

      <div className="pm-actions">
        <button className="btn btn-ghost btn-xs" disabled={busy} onClick={importInquiries}>{s.coImport}</button>
        <button className="btn btn-ghost btn-xs" disabled={busy} onClick={exportBrevo}
                title={s.coExportNote}>{s.coExportBrevo}</button>
      </div>
      {status && <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>}

      <div className="portal-panels">
        <section className="portal-card wide2">
          <h3>{form.id ? s.coEdit : s.coNew}</h3>
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
                       aria-invalid={errors.email || undefined} required />
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
                </select>
              </div>
              <div className="field">
                <label htmlFor="ct-pos">{s.coPosition}</label>
                <input id="ct-pos" value={form.position} onChange={set('position')} />
              </div>
            </div>
            <label className="consent-row">
              <input type="checkbox" checked={form.consent} onChange={set('consent')} />
              <span className="consent-text">{s.coConsent}</span>
            </label>
            <label className="consent-row">
              <input type="checkbox" checked={form.marketing_consent} onChange={set('marketing_consent')} />
              <span className="consent-text">{s.coMarketing}</span>
            </label>
            <div className="pm-actions">
              <button className="btn btn-primary" disabled={busy} type="submit">{s.coSave}</button>
              {form.id && (
                <button type="button" className="btn btn-ghost"
                        onClick={() => { setForm(EMPTY); setErrors({}) }}>✕</button>
              )}
            </div>
          </form>
        </section>

        <section className="portal-card wide2">
          {rows.length === 0 ? <p>{s.coNone}</p> : (
            <table className="portal-table">
              <thead>
                <tr>
                  <th>{s.uName}</th><th>{s.uEmail}</th><th>{s.coCell}</th>
                  <th>{s.coCompany}</th><th>GDPR</th><th>Brevo</th><th>{s.uActions}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className={r.erasure_requested ? 'row-pending' : ''}>
                    <td><b>{r.first_name} {r.last_name}</b>
                        {r.position && <span className="proj-meta"> · {r.position}</span>}</td>
                    <td>{r.email}</td>
                    <td>{r.phone || '—'}</td>
                    <td>{companyName(r.company_id, r.company_name)}</td>
                    <td>{r.consent ? '✓' : '—'}{r.marketing_consent ? ' ✉' : ''}</td>
                    <td>{r.brevo_synced_at ? '✓' : '—'}</td>
                    <td>
                      {!r.erasure_requested && (
                        <>
                          <button className="btn btn-ghost btn-xs" onClick={() => edit(r)}>{s.coEdit}</button>{' '}
                          <button className="btn btn-ghost btn-xs" disabled={busy}
                                  onClick={() => gdprErase(r)}>{s.coErase}</button>
                        </>
                      )}
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
