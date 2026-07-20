import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, Icon } from '../components/Chrome.jsx'
import ServiceActions from '../components/ServiceActions.jsx'
import { useLang } from '../i18n.jsx'
import { ORBITAL } from '../data/orbital.js'
import { useSeo, useJsonLd } from '../lib/seo.js'

export default function Orbital() {
  const { lang } = useLang()
  const o = ORBITAL[lang] || ORBITAL.en

  useSeo(o.seoTitle, o.seoDesc, '/orbital360', '/orbital360/og-orbital360.png', o.keywords)
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Orbital360 PM Tool',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'EFQM-based assessment, management & governance system and project management / transformation tool for organisations.',
    url: 'https://efqmassessors.ae/orbital360',
    image: 'https://efqmassessors.ae/orbital360/og-orbital360.png',
    inLanguage: ['en', 'ar'],
    publisher: { '@type': 'Organization', name: 'EFQM and Strategy Assessors FZCO', url: 'https://efqmassessors.ae' },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'AED',
              description: 'Demo on request' },
  })
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="orb-page">
      <Nav />

      {/* HERO */}
      <section className="orb-hero">
        <div className="wrap">
          <div className="orb-hero-grid">
            <div>
              <span className="eyebrow" style={{ color: 'var(--glow)' }}>{o.eyebrow}</span>
              <h1 className="orb-display">{o.titleA}<strong>{o.strong}</strong>{o.titleB}</h1>
              <p className="orb-lead">{o.lead}</p>
              <div className="chip-row tight">
                {o.chips.map((c) => <span className="chip" key={c}>{c}</span>)}
              </div>
              <div className="orb-hero-actions">
                <Link to="/login" className="btn btn-primary">
                  <img src="/orbital360/mark.svg" alt="" width="18" height="18" />
                  <span>{o.signIn}</span>
                </Link>
                <Link to="/request?service=Orbital360 AI PMTool" className="btn btn-ghost">{o.ask}</Link>
              </div>
              <p className="orb-signin-note">{o.signInNote}</p>
            </div>
            <div className="orb-hero-art">
              <img src="/orbital360/logo-on-dark.svg" alt="Orbital360 — AI PMTool"
                   width="440" height="440" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="orb-section">
        <div className="wrap">
          <div className="orb-what">
            <h2 className="svc-title">{o.whatTitle}</h2>
            <div className="prose-block">
              <p className="orb-what-lead">{o.whatLead}</p>
              {o.whatParas.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* FOUR PILLARS */}
      <section className="orb-section alt">
        <div className="wrap">
          <div className="svc-sub-head"><h4>{o.pillarsTitle}</h4></div>
          <div className="orb-pillars">
            {o.pillars.map((p, i) => (
              <article className="orb-pillar" key={p.key}>
                <span className="orb-pillar-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul>
                  {p.points.map((pt) => <li key={pt}><Icon name="check" />{pt}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI CAPABILITIES */}
      <section className="orb-section">
        <div className="wrap">
          <div className="svc-sub-head"><h4>{o.aiTitle}</h4></div>
          <div className="mini-grid">
            {o.aiItems.map((it) => (
              <article className="mini-card" key={it.title}>
                <span className="mini-icon"><Icon name={it.icon} /></span>
                <h5>{it.title}</h5>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHO FOR */}
      <section className="orb-section alt">
        <div className="wrap">
          <div className="svc-sub-head"><h4>{o.forTitle}</h4></div>
          <div className="orb-for">
            {o.forItems.map((f) => (
              <article key={f.title}>
                <h5>{f.title}</h5>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="orb-cta">
        <div className="wrap">
          <div className="orb-cta-inner">
            <img src="/orbital360/mark.svg" alt="" width="64" height="64" />
            <h3>{o.ctaTitle}</h3>
            <p>{o.ctaText}</p>
            <ServiceActions service="Orbital360 AI PMTool" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
