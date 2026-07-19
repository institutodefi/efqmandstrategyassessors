import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, Icon } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { SERVICES } from '../data/services.js'
import { useSeo } from '../lib/seo.js'

export default function Training() {
  const { lang } = useLang()
  const w = (SERVICES[lang] || SERVICES.en).training

  useSeo(w.seoTitle, w.seoDesc, '/training', '/brand/og-image.png', w.keywords)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div>
      <Nav />

      {/* HERO */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{w.eyebrow}</span>
          <h1 className="display">{w.titleA}<strong>{w.strong}</strong>{w.titleB}</h1>
          <p className="lead">{w.lead}</p>
          <div className="chip-row">
            {w.chips.map((x) => <span className="chip" key={x}>{x}</span>)}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title"><strong>{w.approach.title}</strong></h2>
          </div>
          <div className="card-grid">
            {w.approach.items.map((it) => (
              <article className="card" key={it.title}>
                <span className="card-icon"><Icon name={it.icon} /></span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="section alt" id="programmes">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title"><strong>{w.programmesTitle}</strong></h2>
          </div>
          <div className="prog-grid">
            {w.programmes.map((p) => (
              <article className="prog-card" key={p.title}>
                <h3>{p.title}</h3>
                <div className="prog-meta">
                  <span className="prog-dur"><Icon name="radar" />{p.dur}</span>
                  <span className="prog-who">{p.who}</span>
                </div>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="zone" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
            <div>
              <h2><strong>{w.cta.title}</strong></h2>
              <p style={{ margin: '14px auto 26px', maxWidth: '42em' }}>{w.cta.text}</p>
              <Link to="/#contact" className="btn btn-primary">{w.cta.btn}</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
