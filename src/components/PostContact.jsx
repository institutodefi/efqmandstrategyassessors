import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { supabase } from '../lib/supabase.js'

const WA_NUMBER = '971507369400'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Contact form + WhatsApp CTA shown at the foot of every blog post.
 * The WhatsApp message and the inquiry both reference the article title
 * so the assessor has context. Submits to the Supabase `inquiries`
 * table (with a source), falling back to a mailto link.
 */
export default function PostContact({ title }) {
  const { t } = useLang()
  const b = t.blog
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const waText = b.ctaWaPrefill.replace('{title}', title)
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.target
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    }
    if (!payload.name || !payload.email || !EMAIL_RE.test(payload.email) || !payload.message) {
      setStatus({ ok: false, msg: t.contact.valMsg }); return
    }
    if (!consent) { setStatus({ ok: false, msg: t.consent.required }); return }

    const record = { ...payload, organisation: `Blog: ${title}` }
    if (!supabase) {
      window.location.href = `mailto:hello@efqmassessors.ae?subject=${encodeURIComponent(
        'Blog enquiry: ' + title
      )}&body=${encodeURIComponent(payload.message + '\n\n— ' + payload.name + ' (' + payload.email + ')')}`
      return
    }
    setSending(true)
    const { error } = await supabase.from('inquiries').insert(record)
    setSending(false)
    if (error) setStatus({ ok: false, msg: t.contact.errMsg })
    else { form.reset(); setConsent(false); setStatus({ ok: true, msg: b.ctaSent }) }
  }

  return (
    <section className="post-cta">
      <div className="post-cta-head">
        <span className="eyebrow">{b.ctaEyebrow}</span>
        <h2>{b.ctaTitle}</h2>
        <p>{b.ctaText}</p>
        <a className="btn wa-inline" href={waHref} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.7c1.7.9 3.6 1.4 5.6 1.4h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.3.9.9-4.2-.3-.4c-1-1.6-1.5-3.4-1.5-5.3C5.4 9.6 10.2 4.8 16 4.8S26.6 9.6 26.6 15.4 21.8 24.8 16 24.8zm5.9-7.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3s0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5s.1-.4 0-.6-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5s-.3-.2-.6-.3z" />
          </svg>
          {b.ctaWa}
        </a>
      </div>

      <form className="post-cta-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="pc-name">{t.contact.fName}</label>
          <input id="pc-name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="pc-email">{t.contact.fEmail}</label>
          <input id="pc-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="pc-msg">{t.contact.fMsg}</label>
          <textarea id="pc-msg" name="message" rows="3" required />
        </div>
        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>{t.consent.label}<Link to="/privacy">{t.consent.privacyLink}</Link>{t.consent.and}</span>
        </label>
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? t.contact.sending : t.contact.send}
        </button>
        {status && (
          <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>
        )}
      </form>
    </section>
  )
}
