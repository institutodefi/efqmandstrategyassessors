import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PortalShell from '../components/PortalShell.jsx'
import { PORTAL_STRINGS } from '../data/orbitalPortal.js'

/** /portal/account — every user's personal zone. */
export default function Account() {
  const { user, profile, refreshProfile } = useAuth()
  const { lang, setLang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en

  const [form, setForm] = useState({ first_name: '', last_name: '', organisation: '', locale: 'en' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(null)
  const [passStatus, setPassStatus] = useState(null)
  const [passBusy, setPassBusy] = useState(false)

  useEffect(() => {
    if (!profile) return
    setForm({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      organisation: profile.organisation || '',
      locale: profile.locale || lang,
    })
  }, [profile]) // eslint-disable-line react-hooks/exhaustive-deps

  function set(k) { return (e) => setForm(f => ({ ...f, [k]: e.target.value })) }

  async function save(e) {
    e.preventDefault()
    if (!supabase || !user) return
    setSaving(true); setSaved(null)
    const full = `${form.first_name} ${form.last_name}`.trim()
    const { error } = await supabase.from('profiles').update({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      full_name: full,
      organisation: form.organisation.trim() || null,
      locale: form.locale,
    }).eq('id', user.id)
    if (!error) {
      await supabase.auth.updateUser({
        data: { first_name: form.first_name, last_name: form.last_name, full_name: full },
      })
      refreshProfile()
      if (form.locale !== lang && typeof setLang === 'function') setLang(form.locale)
    }
    setSaving(false)
    setSaved(error ? { ok: false, msg: s.accError } : { ok: true, msg: s.accSaved })
  }

  async function changePass(e) {
    e.preventDefault()
    const f = e.target
    const p1 = f.pass1.value, p2 = f.pass2.value
    if (p1.length < 8) { setPassStatus({ ok: false, msg: s.accPassShort }); return }
    if (p1 !== p2) { setPassStatus({ ok: false, msg: s.accPassMismatch }); return }
    setPassBusy(true); setPassStatus(null)
    const { error } = await supabase.auth.updateUser({ password: p1 })
    setPassBusy(false)
    if (error) setPassStatus({ ok: false, msg: error.message })
    else { f.reset(); setPassStatus({ ok: true, msg: s.accPassOk }) }
  }

  return (
    <PortalShell>
      <h1>{s.accTitle}</h1>
      <p className="sub">{s.accSub} · <b>{user?.email}</b></p>

      <div className="portal-panels">
        <section className="portal-card wide">
          <form className="np-form" onSubmit={save}>
            <div className="np-row">
              <div className="field">
                <label htmlFor="ac-first">{s.accFirst}</label>
                <input id="ac-first" value={form.first_name} onChange={set('first_name')} required />
              </div>
              <div className="field">
                <label htmlFor="ac-last">{s.accLast}</label>
                <input id="ac-last" value={form.last_name} onChange={set('last_name')} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="ac-org">{s.accOrg}</label>
              <input id="ac-org" value={form.organisation} onChange={set('organisation')} />
            </div>
            <div className="field">
              <label htmlFor="ac-lang">{s.accLang}</label>
              <select id="ac-lang" value={form.locale} onChange={set('locale')}>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <button className="btn btn-primary" disabled={saving} type="submit">{s.accSave}</button>
            {saved && <p className={`form-status ${saved.ok ? 'ok' : 'err'}`}>{saved.msg}</p>}
          </form>
        </section>

        <section className="portal-card wide">
          <h3>{s.accPassTitle}</h3>
          <form className="np-form" onSubmit={changePass}>
            <div className="field">
              <label htmlFor="ac-pass1">{s.accNewPass}</label>
              <input id="ac-pass1" name="pass1" type="password" autoComplete="new-password" minLength="8" required />
            </div>
            <div className="field">
              <label htmlFor="ac-pass2">{s.accRepeatPass}</label>
              <input id="ac-pass2" name="pass2" type="password" autoComplete="new-password" minLength="8" required />
            </div>
            <button className="btn btn-primary" disabled={passBusy} type="submit">{s.accPassBtn}</button>
            {passStatus && <p className={`form-status ${passStatus.ok ? 'ok' : 'err'}`}>{passStatus.msg}</p>}
          </form>
        </section>
      </div>
    </PortalShell>
  )
}
