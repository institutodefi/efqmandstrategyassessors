import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, Icon } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { priceParts, SELECTABLE } from '../lib/site.js'
import { SERVICES } from '../data/services.js'
import { useSeo } from '../lib/seo.js'

export default function Consultancy() {
  const { lang, t } = useLang()
  const { currency, setCurrency } = useCurrency()
  const c = (SERVICES[lang] || SERVICES.en).consultancy

  useSeo(c.seoTitle, c.seoDesc, '/consultancy', '/brand/og-image.png', c.keywords)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div>
      <Nav />

      {/* HERO */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{c.eyebrow}</span>
          <h1 className="display">{c.titleA}<strong>{c.strong}</strong>{c.titleB}</h1>
          <p className="lead">{c.lead}</p>
          <div className="chip-row">
            {c.chips.map((x) => <span className="chip" key={x}>{x}</span>)}
          </div>
        </div>
      </section>

      {/* SERVICE 1 — CONSULTANCY AS A SERVICE */}
      <section className="section" id="caas">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{c.caas.eyebrow}</span>
            <h2 className="section-title"><strong>{c.caas.title}</strong></h2>
          </div>
          <div className="prose">
            <p className="prose-lead">{c.caas.intro}</p>
            {c.caas.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {/* the three models */}
          <div className="models-inner">
            <div className="section-head" style={{ marginTop: '10px' }}>
              <h3 className="section-title" style={{ fontSize: '1.6rem' }}>{c.caas.modelsTitle}</h3>
              <p className="section-sub">{c.caas.modelsSub}</p>
            </div>
            <div className="model-grid">
              {t.models.tiers.map((tier) => (
                <article className={`model-card ${tier.popular ? 'featured' : ''}`} key={tier.name}>
                  {tier.popular && <span className="model-badge">{t.models.popular}</span>}
                  <h4>{tier.name}</h4>
                  <span className="model-eyebrow">{t.models.eyebrow.split('·').pop().trim()}</span>
                  <p className="model-tagline">{tier.tagline}</p>
                  <div className="model-price">
                    <span className="model-from">{t.models.from}</span>
                    <span className="model-amount">
                      {(() => {
                        const pp = priceParts(tier.price, currency)
                        return pp.position === 'prefix'
                          ? <><em>{pp.symbol}</em>{pp.amount}</>
                          : <>{pp.amount}<em>{pp.symbol}</em></>
                      })()}
                    </span>
                    <span className="model-unit">{t.models.unit}</span>
                  </div>
                  <ul className="model-feats">
                    {tier.features.map((f) => (
                      <li key={f}><Icon name="check" />{f}</li>
                    ))}
                  </ul>
                  <a href="/#contact" className={`btn ${tier.popular ? 'btn-primary' : 'btn-ghost'}`}>
                    {t.models.cta}
                  </a>
                </article>
              ))}
            </div>
            <div className="models-foot">
              <label className="currency-picker">
                <span>{t.models.priceIn}</span>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label={t.models.priceIn}>
                  {Array.from(new Set([currency, ...SELECTABLE])).map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </label>
              <p className="models-note">
                {t.models.note}{currency !== 'EUR' ? ` · ${t.models.fromEur}` : ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI ENVIRONMENT */}
      <section className="section alt" id="ai-environment">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{c.ai.eyebrow}</span>
            <h2 className="section-title"><strong>{c.ai.title}</strong></h2>
            <p className="section-sub">{c.ai.intro}</p>
          </div>
          <div className="card-grid">
            {c.ai.items.map((it) => (
              <article className="card" key={it.title}>
                <span className="card-icon"><Icon name={it.icon} /></span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </article>
            ))}
          </div>
          <p className="models-note" style={{ marginTop: '26px' }}>{c.ai.note}</p>
        </div>
      </section>

      {/* SERVICE 2 — ISO */}
      <section className="section" id="iso">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{c.iso.eyebrow}</span>
            <h2 className="section-title"><strong>{c.iso.title}</strong></h2>
          </div>
          <div className="prose">
            <p className="prose-lead">{c.iso.intro}</p>
            {c.iso.paras.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <h3 className="sub-head">{c.iso.standardsTitle}</h3>
          <div className="norms-grid">
            {t.norms.items.map((iso) => (
              <article className="norm-card" key={iso.code}>
                <div className="norm-head">
                  <span className="norm-code">ISO<b>{iso.code}</b></span>
                  <h3>{iso.name}</h3>
                </div>
                <p>{iso.text}</p>
                <div className="norm-subs">
                  <span className="norm-subs-label">{t.norms.subLabel}</span>
                  <p>{iso.subs}</p>
                </div>
              </article>
            ))}
          </div>

          <h3 className="sub-head">{c.iso.approachTitle}</h3>
          <div className="steps-grid">
            {c.iso.approach.map((s) => (
              <article className="step-card" key={s.step}>
                <span className="step-num">{s.step}</span>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section alt">
        <div className="wrap">
          <div className="zone" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
            <div>
              <h2><strong>{c.cta.title}</strong></h2>
              <p style={{ margin: '14px auto 26px', maxWidth: '42em' }}>{c.cta.text}</p>
              <Link to="/#contact" className="btn btn-primary">{c.cta.btn}</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
