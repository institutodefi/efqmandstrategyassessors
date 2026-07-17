import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { supabase } from '../lib/supabase.js'

// Brevo (Sendinblue) hosted-form submission URL, e.g.
//   https://sibforms.com/serve/MUIF...   (Brevo → Contacts → Forms → Share)
// Set it in your environment as VITE_BREVO_FORM_ACTION. Until then the
// form falls back to storing the address in Supabase (subscribers table)
// or opening the visitor's email client.
const BREVO_ACTION = import.meta.env.VITE_BREVO_FORM_ACTION || ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Newsletter() {
  const { t, lang } = useLang()
  const n = t.newsletter
  const formRef = useRef(null)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  async function onSubmit(e) {
    // Validation first — applies to every path.
    if (!EMAIL_RE.test(email) || !consent) {
      e.preventDefault()
      setStatus({ ok: false, msg: n.val })
      return
    }

    // Preferred path: Brevo hosted form. Let the native POST go to the
    // hidden iframe (no page navigation), then confirm optimistically.
    if (BREVO_ACTION) {
      setSending(true)
      setTimeout(() => {
        setSending(false)
        setStatus({ ok: true, msg: n.ok })
        setEmail(''); setConsent(false)
      }, 600)
      return // do NOT preventDefault — the form submits to the iframe
    }

    // Fallbacks when Brevo isn't configured yet.
    e.preventDefault()
    setSending(true)
    if (supabase) {
      const { error } = await supabase
        .from('subscribers')
        .insert({ email, locale: lang, consent: true })
      setSending(false)
      if (error) setStatus({ ok: false, msg: n.err })
      else { setStatus({ ok: true, msg: n.ok }); setEmail(''); setConsent(false) }
    } else {
      setSending(false)
      window.location.href = `mailto:hello@efqmassessors.ae?subject=${encodeURIComponent(
        'Newsletter signup'
      )}&body=${encodeURIComponent('Please add me to the newsletter: ' + email)}`
    }
  }

  return (
    <section className="section newsletter" id="newsletter">
      <div className="wrap">
        <div className="newsletter-card reveal">
          <div className="newsletter-copy">
            <span className="eyebrow" style={{ color: 'var(--glow)' }}>{n.eyebrow}</span>
            <h2>{n.titleA}<strong>{n.strong}</strong>{n.titleB}</h2>
            <p>{n.text}</p>
          </div>

          {/* Hidden iframe target keeps the Brevo POST from navigating away */}
          <iframe name="brevo_iframe" title="newsletter" style={{ display: 'none' }} />

          <form
            ref={formRef}
            className="newsletter-form"
            action={BREVO_ACTION || undefined}
            method={BREVO_ACTION ? 'post' : undefined}
            target={BREVO_ACTION ? 'brevo_iframe' : undefined}
            onSubmit={onSubmit}
            noValidate
          >
            <div className="newsletter-row">
              <label htmlFor="nl-email" className="sr-only">{n.placeholder}</label>
              <input
                id="nl-email"
                name="EMAIL"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={n.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* Brevo honeypot + locale */}
              <input type="text" name="email_address_check" defaultValue="" tabIndex="-1"
                autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
              <input type="hidden" name="locale" value={lang} />
              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? n.sending : n.button}
              </button>
            </div>

            <label className="consent">
              <input
                type="checkbox"
                name="OPT_IN"
                value="1"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>{n.consentA}<Link to="/privacy">{n.privacyLink}</Link>{n.consentB}</span>
            </label>

            {status && (
              <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
