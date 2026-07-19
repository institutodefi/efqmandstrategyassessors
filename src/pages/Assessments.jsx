import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, Icon, RadarWheel } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { SERVICES } from '../data/services.js'
import { useSeo } from '../lib/seo.js'

export default function Assessments() {
  const { lang, t } = useLang()
  const a = (SERVICES[lang] || SERVICES.en).assessments

  useSeo(a.seoTitle, a.seoDesc, '/assessments', '/brand/og-image.png', a.keywords)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div>
      <Nav />

      {/* HERO */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{a.eyebrow}</span>
          <h1 className="display">{a.titleA}<strong>{a.strong}</strong>{a.titleB}</h1>
          <p className="lead">{a.lead}</p>
          <div className="chip-row">
            {a.chips.map((x) => <span className="chip" key={x}>{x}</span>)}
          </div>
        </div>
      </section>

      {/* FOUR SERVICES */}
      {a.items.map((it, i) => (
        <section className={`section ${i % 2 === 1 ? 'alt' : ''}`} key={it.title} id={`svc-${i + 1}`}>
          <div className="wrap">
            <div className="svc-block">
              <div className="svc-head">
                <span className="card-icon"><Icon name={it.icon} /></span>
                <h2 className="section-title"><strong>{it.title}</strong></h2>
                <p className="svc-lead">{it.lead}</p>
              </div>
              <div className="prose">
                {it.paras.map((p, j) => <p key={j}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* RADAR / METHOD REMINDER */}
      <section className="section method">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow" style={{ color: 'var(--glow)' }}>{t.method.eyebrow}</span>
            <h2 className="section-title">{t.method.titleA}<strong>{t.method.strong}</strong>{t.method.titleB}</h2>
            <p>{t.method.sub}</p>
          </div>
          <div className="method-grid">
            <RadarWheel />
            <ol className="radar-steps">
              {t.method.steps.map((s) => (
                <li className="radar-step" key={s.k}>
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

      {/* CTA */}
      <section className="section alt">
        <div className="wrap">
          <div className="zone" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
            <div>
              <h2><strong>{a.cta.title}</strong></h2>
              <p style={{ margin: '14px auto 26px', maxWidth: '42em' }}>{a.cta.text}</p>
              <Link to="/#contact" className="btn btn-primary">{a.cta.btn}</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
