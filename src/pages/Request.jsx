import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Nav, Footer } from '../components/Chrome.jsx'
import { WaIcon } from '../components/ServiceActions.jsx'
import { useLang } from '../i18n.jsx'
import { SERVICES } from '../data/services.js'
import { supabase } from '../lib/supabase.js'
import { useSeo } from '../lib/seo.js'

const WA_NUMBER = '971507369400'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Request() {
  const { lang, t } = useLang()
  const S = SERVICES[lang] || SERVICES.en
  const h = S.hub
  const [params] = useSearchParams()
  const preset = params.get('service') || ''

  const [service, setService] = useState(preset || h.reqAny)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  useSeo(
    lang === 'ar'
      ? 'اطلب خدمة — EFQM and Strategy Assessors'
      : 'Request a service — EFQM and Strategy Assessors',
    lang === 'ar'
      ? 'اطلبوا تقييم EFQM أو استشارة أو تدريباً. نردّ خلال يوم عمل واحد.'
      : 'Request an EFQM assessment, consultancy or training. We reply within one business day.',
    '/request',
    '/brand/og-image.png'
  )
  useEffect(() => { window.scrollTo(0, 0) }, [])
  useEffect(() => { if (preset) setService(preset) }, [preset])

  // every service on the site, for the dropdown
  const options = [
    h.reqAny,
    ...S.assessments.items.map((i) => i.title),
    S.consultancy.caas.title,
    S.consultancy.iso.title,
    ...S.training.programmes.map((p) => p.title),
  ]
  const list = Array.from(new Set(preset ? [preset, ...options] : options))

  const waText = h.waService.replace('{service}', service)
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`

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
      phone: f.phone.value.trim() || null,
      source: 'request',
      message: f.message.value.trim(),
    }
    if (!firstName || !lastName || !payload.organisation || !payload.email || !EMAIL_RE.test(payload.email) || !payload.message) {
      setStatus({ ok: false, msg: t.contact.valMsg }); return
    }
    if (!consent) { setStatus({ ok: false, msg: t.consent.required }); return }

    const record = { ...payload, organisation: `${payload.organisation} · ${service}`.trim() }
    if (!supabase) {
      window.location.href =
        `mailto:hello@efqmassessors.ae?subject=${encodeURIComponent('Request: ' + service)}` +
        `&body=${encodeURIComponent(payload.message + '\n\n— ' + payload.name + ' (' + payload.email + ')')}`
      return
    }
    setSending(true)
    const { error } = await supabase.from('inquiries').insert(record)
    setSending(false)
    if (error) setStatus({ ok: false, msg: t.contact.errMsg })
    else { f.reset(); setConsent(false); setStatus({ ok: true, msg: t.contact.okMsg }) }
  }

  return (
    <div>
      <Nav />

      <section className="svc-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{h.reqEyebrow}</span>
          <h1 className="svc-display">{h.reqTitleA}<strong>{h.reqStrong}</strong>{h.reqTitleB}</h1>
          <p className="svc-hero-lead">{h.reqLead}</p>
        </div>
      </section>

      <section className="req-body">
        <div className="wrap">
          <div className="req-grid">
            <form className="req-form" onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="r-service">{h.reqService}</label>
                <select id="r-service" value={service} onChange={(e) => setService(e.target.value)}>
                  {list.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="r-first">{t.contact.fFirstName}</label>
                  <input id="r-first" name="firstName" autoComplete="given-name" required />
                </div>
                <div className="field">
                  <label htmlFor="r-last">{t.contact.fLastName}</label>
                  <input id="r-last" name="lastName" autoComplete="family-name" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="r-email">{t.contact.fEmail}</label>
                <input id="r-email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="r-org">{t.contact.fOrg}</label>
                <input id="r-org" name="organisation" autoComplete="organization" required />
              </div>
              <div className="field">
                <label htmlFor="r-phone">{t.contact.fPhone}</label>
                <input id="r-phone" name="phone" autoComplete="tel" inputMode="tel" placeholder="+971 …" />
              </div>
              <div className="field">
                <label htmlFor="r-msg">{t.contact.fMsg}</label>
                <textarea id="r-msg" name="message" rows="5" required />
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
              <h2>{t.contact.titleA}<strong>{t.contact.strong}</strong>{t.contact.titleB}</h2>
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
