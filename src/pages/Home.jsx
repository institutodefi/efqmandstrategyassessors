import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, HeroWave, RadarWheel, Icon, ExcellenceOrbit, BrandIcon, SocialIcon } from '../components/Chrome.jsx'
import Newsletter from '../components/Newsletter.jsx'
import { supabase } from '../lib/supabase.js'
import { useLang } from '../i18n.jsx'
import { useSeo } from '../lib/seo.js'

export default function Home() {
  const { t } = useLang()
  useSeo(
    'EFQM Assessment & ISO Consultancy in Dubai | EFQM and Strategy Assessors',
    'Certified EFQM Model 2025 assessment, management consultancy and ISO certification support in Dubai — ISO 9001, 14001, 27001, 45001, 42001, 56001 — plus strategic consulting, executive coaching and training across the UAE, MENA, Europe and the Americas.',
    '/',
    '/brand/og-image.png',
    'EFQM Dubai, EFQM Model 2025, EFQM assessment UAE, EFQM certified assessor, organisational excellence Dubai, business excellence MENA, management consultancy Dubai, ISO consultancy UAE, ISO 9001 Dubai, ISO 27001 UAE, quality management consultant Dubai, strategic consulting UAE, executive coaching Dubai, EFQM training Dubai, RADAR logic, consultancy as a service'
  )

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })

  return (
    <div id="top">
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{t.hero.eyebrow}</span>
            <h1 className="display">
              {t.hero.titleA}<strong>{t.hero.titleStrong1}</strong>{t.hero.titleB}<strong>{t.hero.titleStrong2}</strong>
            </h1>
            <p className="lead">{t.hero.lead}</p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">{t.hero.cta1}</a>
              <a href="#services" className="btn btn-ghost">{t.hero.cta2}</a>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/brand/spiral.png" alt="EFQM and Strategy Assessors spiral emblem" />
          </div>
        </div>
        <HeroWave />
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="wrap stats-grid">
          {t.stats.map(([n, plus, label]) => (
            <div className="stat reveal" key={label}>
              <b>{n}<em>{plus}</em></b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="wrap about-grid">
          <div className="reveal">
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2 className="section-title" style={{ margin: '16px 0 20px' }}>
              {t.about.titleA}<strong>{t.about.strong}</strong>{t.about.titleB}
            </h2>
            <p className="lead" style={{ color: 'var(--muted)' }}>{t.about.lead}</p>
            <ul className="about-list">
              {t.about.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div className="about-card reveal">
            <ExcellenceOrbit />
            <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)' }}>
              {t.about.visualCaption}
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section alt" id="services">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">{t.services.eyebrow}</span>
            <h2 className="section-title">{t.services.titleA}<strong>{t.services.strong}</strong>{t.services.titleB}</h2>
            <p>{t.services.sub}</p>
          </div>
          <div className="hub-grid">
            {t.services.hub.map((s) => (
              <Link className="hub-card reveal" to={s.href} key={s.title}>
                <div className="hub-glyph"><BrandIcon name={s.icon} /></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="hub-link">{t.services.more} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD / RADAR */}
      <section className="section method" id="method">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow" style={{ color: 'var(--glow)' }}>{t.method.eyebrow}</span>
            <h2 className="section-title">{t.method.titleA}<strong>{t.method.strong}</strong>{t.method.titleB}</h2>
            <p>{t.method.sub}</p>
          </div>
          <div className="method-grid">
            <RadarWheel />
            <ol className="radar-steps">
              {t.method.steps.map((s) => (
                <li className="radar-step reveal" key={s.k}>
                  <span className="k">{s.k}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* RECOGNITION PATH */}
      <section className="section path" id="recognition">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">{t.path.eyebrow}</span>
            <h2 className="section-title">{t.path.titleA}<strong>{t.path.strong}</strong>{t.path.titleB}</h2>
            <p>{t.path.sub}</p>
          </div>
          <div className="path-track">
            {t.path.milestones.map((m) => (
              <div className="milestone reveal" key={m.title}>
                <div className="dot">{m.dot}</div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section alt" id="team">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">{t.team.eyebrow}</span>
            <h2 className="section-title">{t.team.titleA}<strong>{t.team.strong}</strong>{t.team.titleB}</h2>
          </div>
          <div className="team-grid solo">
            {[t.team.alex].map((p) => (
              <article className="person reveal" key={p.name}>
                <span className="role">{p.role}</span>
                <h3>{p.name}</h3>
                <p>{p.bio}</p>
                <div className="creds">
                  {p.creds.map((c) => <span key={c}>{c}</span>)}
                </div>
                {p.linkedin && (
                  <a className="person-li" href={p.linkedin} target="_blank" rel="noopener noreferrer">
                    <SocialIcon name="linkedin" />
                    <span>{t.team.liLabel}</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT ZONE TEASER */}
      <section className="section">
        <div className="wrap">
          <div className="zone reveal">
            <div>
              <h2>{t.zone.titleA}<strong>{t.zone.strong}</strong>{t.zone.titleB}</h2>
              <p>{t.zone.sub}</p>
              <Link to="/login" className="btn btn-primary">{t.zone.cta}</Link>
            </div>
            <ul className="zone-features">
              {t.zone.features.map((f) => (
                <li key={f}><Icon name="check" />{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Newsletter />
      <ContactSection />
      <Footer />
    </div>
  )
}

function ContactSection() {
  const { t } = useLang()
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [consent, setConsent] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.target
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      organisation: form.organisation.value.trim(),
      message: form.message.value.trim(),
    }
    if (!payload.name || !payload.email || !payload.message) {
      setStatus({ ok: false, msg: t.contact.valMsg })
      return
    }
    if (!consent) {
      setStatus({ ok: false, msg: t.consent.required })
      return
    }
    if (!supabase) {
      window.location.href = `mailto:hello@efqmassessors.ae?subject=${encodeURIComponent(
        'Inquiry from ' + payload.name
      )}&body=${encodeURIComponent(payload.message + '\n\n' + payload.organisation)}`
      return
    }
    setSending(true)
    const { error } = await supabase.from('inquiries').insert(payload)
    setSending(false)
    if (error) {
      setStatus({ ok: false, msg: t.contact.errMsg })
    } else {
      form.reset()
      setConsent(false)
      setStatus({ ok: true, msg: t.contact.okMsg })
    }
  }

  return (
    <section className="section alt" id="contact">
      <div className="wrap contact-grid">
        <div className="reveal">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 className="section-title" style={{ margin: '16px 0 10px' }}>
            {t.contact.titleA}<strong>{t.contact.strong}</strong>{t.contact.titleB}
          </h2>
          <div className="contact-item">
            <span>{t.contact.office}</span>
            <p>{t.contact.officeVal}</p>
          </div>
          <div className="contact-item">
            <span>{t.contact.phone}</span>
            <a href="tel:+971507369400" dir="ltr">+971 50 736 9400</a>
          </div>
          <div className="contact-item">
            <span>{t.contact.email}</span>
            <a href="mailto:hello@efqmassessors.ae">hello@efqmassessors.ae</a>
          </div>
        </div>
        <form className="form-card reveal" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="c-name">{t.contact.fName}</label>
            <input id="c-name" name="name" autoComplete="name" required />
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
            <textarea id="c-msg" name="message" rows="4" required />
          </div>
          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              {t.consent.label}
              <Link to="/privacy">{t.consent.privacyLink}</Link>
              {t.consent.and}
            </span>
          </label>
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? t.contact.sending : t.contact.send}
          </button>
          {status && (
            <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>
          )}
        </form>
      </div>
    </section>
  )
}
