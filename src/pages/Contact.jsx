import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer } from '../components/Chrome.jsx'
import { WaIcon } from '../components/ServiceActions.jsx'
import { useLang } from '../i18n.jsx'
import { SERVICES } from '../data/services.js'
import { supabase } from '../lib/supabase.js'
import { useSeo } from '../lib/seo.js'

const WA_NUMBER = '971507369400'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Unlisted contact page — reachable at /contact but deliberately not in the
 * navigation or the sitemap, and marked noindex so it does not compete with
 * /request in search. Useful as a landing page for campaigns, email
 * signatures or printed material.
 */
export default function Contact() {
  const { lang, t } = useLang()
  const S = SERVICES[lang] || SERVICES.en
  const h = S.hub
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  useSeo(
    lang === 'ar' ? 'اتصل بنا — EFQM and Strategy Assessors' : 'Contact — EFQM and Strategy Assessors',
    lang === 'ar'
      ? 'تواصلوا مع EFQM and Strategy Assessors في دبي — نموذج تواصل وواتساب.'
      : 'Get in touch with EFQM and Strategy Assessors in Dubai — contact form and WhatsApp.',
    '/contact'
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    // keep this page out of search results
    let m = document.querySelector('meta[name="robots"]')
    const previous = m ? m.getAttribute('content') : null
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'robots'); document.head.appendChild(m) }
    m.setAttribute('content', 'noindex, follow')
    return () => { if (m) m.setAttribute('content', previous || 'index, follow') }
  }, [])

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(h.waMsg)}`

  async function onSubmit(e) {
    e.preventDefault()
    const f = e.target
    const firstName = f.firstName.value.trim()
    const lastName = f.lastName.value.trim()
    const payload = {
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: f.email.value.trim(),
      organisation: f.organisation.value.trim(),
      message: f.message.value.trim(),
    }
    if (!firstName || !lastName || !payload.email || !EMAIL_RE.test(payload.email) || !payload.message) {
      setStatus({ ok: false, msg: t.contact.valMsg }); return
    }
    if (!consent) { setStatus({ ok: false, msg: t.consent.required }); return }

    if (!supabase) {
      window.location.href =
        `mailto:hello@efqmassessors.ae?subject=${encodeURIComponent('Website contact')}` +
        `&body=${encodeURIComponent(payload.message + '\n\n— ' + payload.name + ' (' + payload.email + ')')}`
      return
    }
    setSending(true)
    const { error } = await supabase.from('inquiries').insert({ ...payload, organisation: `${payload.organisation} · Contact page`.trim() })
    setSending(false)
    if (error) setStatus({ ok: false, msg: t.contact.errMsg })
    else { f.reset(); setConsent(false); setStatus({ ok: true, msg: t.contact.okMsg }) }
  }

  return (
    <div>
      <Nav />

      <section className="svc-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{t.contact.eyebrow}</span>
          <h1 className="svc-display">
            {t.contact.titleA}<strong>{t.contact.strong}</strong>{t.contact.titleB}
          </h1>
          <p className="svc-hero-lead">{h.reqLead}</p>
        </div>
      </section>

      <section className="req-body">
        <div className="wrap">
          <div className="req-grid">
            <form className="req-form" onSubmit={onSubmit} noValidate>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="c-first">{t.contact.fFirstName}</label>
                  <input id="c-first" name="firstName" autoComplete="given-name" required />
                </div>
                <div className="field">
                  <label htmlFor="c-last">{t.contact.fLastName}</label>
                  <input id="c-last" name="lastName" autoComplete="family-name" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-email">{t.contact.fEmail}</label>
                <input id="c-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="c-org">{t.contact.fOrg}</label>
                <input id="c-org" name="organisation" autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="c-msg">{t.contact.fMsg}</label>
                <textarea id="c-msg" name="message" rows="5" required />
              </div>
              <label className="consent consent-row">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span className="consent-text">{t.consent.label}<Link to="/privacy">{t.consent.privacyLink}</Link>{t.consent.and}</span>
              </label>
              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? t.contact.sending : t.contact.send}
              </button>
              {status && (
                <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>
              )}
            </form>

            <aside className="req-aside">
              <a className="btn btn-wa req-wa" href={waHref} target="_blank" rel="noopener noreferrer">
                <WaIcon /><span>{h.wa}</span>
              </a>
              <dl className="req-details">
                <div><dt>{t.contact.office}</dt><dd>{t.contact.officeVal}</dd></div>
                <div><dt>{t.contact.phone}</dt><dd><a href="tel:+971507369400">+971 50 736 9400</a></dd></div>
                <div><dt>{t.contact.email}</dt><dd><a href="mailto:hello@efqmassessors.ae">hello@efqmassessors.ae</a></dd></div>
              </dl>
              <p className="req-note">{t.contact.note}</p>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
