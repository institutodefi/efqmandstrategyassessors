import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import { PORTAL_STRINGS } from '../data/orbitalPortal.js'

/** Puerta RGPD: bloquea el portal hasta aceptar las políticas (una sola vez).
 *  La aceptación se graba en profiles + ficha CRM vía RPC accept_policies. */
export default function ConsentGate() {
  const { user, profile } = useAuth()
  const { lang } = useLang()
  const s = PORTAL_STRINGS[lang] || PORTAL_STRINGS.en
  const [ok, setOk] = useState(false)
  const [mk, setMk] = useState(true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [done, setDone] = useState(false)

  // Perfil aún cargando, sin sesión, o ya aceptado → nada que mostrar
  if (!user || !profile || profile.policies_accepted_at || done) return null

  async function accept() {
    if (!ok) { setErr(s.gdprRequired); return }
    setBusy(true); setErr(null)
    const { error } = await supabase.rpc('accept_policies', { p_marketing: mk })
    setBusy(false)
    if (error) { setErr(error.message) } else { setDone(true) }
  }

  return (
    <div className="gdpr-overlay" role="dialog" aria-modal="true" aria-label={s.gdprTitle}>
      <div className="gdpr-card">
        <h2>{s.gdprTitle}</h2>
        <p className="sub">{s.gdprIntro}</p>
        <label className="gdpr-check">
          <input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />
          <span>
            {s.gdprAcceptA}
            <Link to="/legal/privacy" target="_blank">{s.gdprPrivacy}</Link>{', '}
            <Link to="/legal/terms" target="_blank">{s.gdprTerms}</Link>{' '}
            {s.gdprAnd}{' '}
            <Link to="/legal/cookies" target="_blank">{s.gdprCookies}</Link>
            {s.gdprAcceptB}
          </span>
        </label>
        <label className="gdpr-check">
          <input type="checkbox" checked={mk} onChange={e => setMk(e.target.checked)} />
          <span>{s.gdprMarketing}</span>
        </label>
        {err && <p className="form-status err" role="alert">{err}</p>}
        <button className="btn btn-primary" disabled={busy} onClick={accept}>
          {busy ? s.mgSaving : s.gdprBtn}
        </button>
        <p className="gdpr-fine">{s.gdprFine}</p>
      </div>
    </div>
  )
}
