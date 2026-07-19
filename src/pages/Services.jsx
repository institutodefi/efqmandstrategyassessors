import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Nav, Footer, Icon, SocialIcon } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { priceParts, SELECTABLE } from '../lib/site.js'
import { SERVICES } from '../data/services.js'
import { useSeo } from '../lib/seo.js'

// tab key -> canonical path (legacy paths are mapped below)
const TAB_PATH = {
  assessments: '/services/assessments',
  consultancy: '/services/consultancy',
  training: '/services/training',
}
const PATH_TAB = {
  '/services': 'assessments',
  '/services/assessments': 'assessments',
  '/services/consultancy': 'consultancy',
  '/services/training': 'training',
  '/assessments': 'assessments',
  '/consultancy': 'consultancy',
  '/training': 'training',
}

export default function Services() {
  const { lang, t } = useLang()
  const { currency, setCurrency } = useCurrency()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const S = SERVICES[lang] || SERVICES.en
  const tab = PATH_TAB[pathname.replace(/\/$/, '')] || 'assessments'
  const meta = S[tab]

  useSeo(meta.seoTitle, meta.seoDesc, TAB_PATH[tab], '/brand/og-image.png', meta.keywords)
  useEffect(() => { window.scrollTo(0, 0) }, [tab])

  const TABS = ['assessments', 'consultancy', 'training']

  return (
    <div className="svc-page">
      <Nav />

      {/* COMPACT PAGE HEAD */}
      <section className="svc-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{S.hub.eyebrow}</span>
          <h1 className="svc-display">
            {S.hub.titleA}<strong>{S.hub.strong}</strong>{S.hub.titleB}
          </h1>
          <p className="svc-hero-lead">{S.hub.lead}</p>
        </div>
      </section>

      {/* SUBTABS */}
      <div className="svc-tabbar">
        <div className="wrap">
          <div className="svc-tabs" role="tablist">
            {TABS.map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                className={`svc-tab ${tab === k ? 'active' : ''}`}
                onClick={() => navigate(TAB_PATH[k])}
              >
                {S.tabs[k]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PANEL INTRO */}
      <section className="svc-intro">
        <div className="wrap">
          <div className="svc-intro-grid">
            <div>
              <span className="eyebrow">{meta.eyebrow}</span>
              <h2 className="svc-title">{meta.titleA}<strong>{meta.strong}</strong>{meta.titleB}</h2>
            </div>
            <p className="svc-lead">{meta.lead}</p>
          </div>
          <div className="chip-row tight">
            {meta.chips.map((x) => <span className="chip" key={x}>{x}</span>)}
          </div>
        </div>
      </section>

      {/* ---------------- ASSESSMENTS ---------------- */}
      {tab === 'assessments' && (
        <>
          <section className="svc-body">
            <div className="wrap">
              {meta.items.map((it, i) => (
                <article className="svc-item" key={it.title}>
                  <div className="svc-item-head">
                    <span className="svc-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svc-icon"><Icon name={it.icon} /></span>
                    <h3>{it.title}</h3>
                    <p className="svc-item-lead">{it.lead}</p>
                  </div>
                  <div className="svc-item-body">
                    {it.paras.map((p, j) => <p key={j}>{p}</p>)}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <SvcCta meta={meta} hub={S.hub} />
        </>
      )}

      {/* ---------------- CONSULTANCY AS A SERVICE ---------------- */}
      {tab === 'consultancy' && (
        <>
          <section className="svc-body">
            <div className="wrap">
              {/* service one — CaaS */}
              <article className="svc-item">
                <div className="svc-item-head">
                  <span className="svc-num">01</span>
                  <span className="svc-icon"><Icon name="layers" /></span>
                  <h3>{meta.caas.title}</h3>
                  <p className="svc-item-lead">{meta.caas.intro}</p>
                </div>
                <div className="svc-item-body">
                  {meta.caas.paras.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </article>

              {/* pricing models */}
              <div className="svc-models">
                <div className="svc-sub-head">
                  <h4>{meta.caas.modelsTitle}</h4>
                  <p>{meta.caas.modelsSub}</p>
                </div>
                <div className="model-rows">
                  {t.models.tiers.map((tier) => (
                    <article className={`model-row ${tier.popular ? 'featured' : ''}`} key={tier.name}>
                      <div className="mr-id">
                        <h5 className="mr-name">{tier.name}</h5>
                        <p className="mr-tagline">{tier.tagline}</p>
                        {tier.popular && <span className="mr-badge">{t.models.popular}</span>}
                      </div>
                      <div className="mr-price">
                        <span className="mr-from">{t.models.from}</span>
                        <span className="mr-amount">
                          {(() => {
                            const pp = priceParts(tier.price, currency)
                            return pp.position === 'prefix'
                              ? <><em>{pp.symbol}</em>{pp.amount}</>
                              : <>{pp.amount}<em>{pp.symbol}</em></>
                          })()}
                        </span>
                        <span className="mr-unit">{t.models.unit}</span>
                      </div>
                      <ul className="mr-feats">
                        {tier.features.map((f) => <li key={f}><Icon name="check" />{f}</li>)}
                      </ul>
                      <div className="mr-cta">
                        <Link to="/#contact" className={`btn ${tier.popular ? 'btn-primary' : 'btn-ghost'}`}>
                          {t.models.cta}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
                <CurrencyFoot t={t} currency={currency} setCurrency={setCurrency} />
              </div>

              {/* AI environment */}
              <div className="svc-ai">
                <div className="svc-sub-head">
                  <span className="eyebrow">{meta.ai.eyebrow}</span>
                  <h4>{meta.ai.title}</h4>
                  <p>{meta.ai.intro}</p>
                </div>
                <div className="mini-grid">
                  {meta.ai.items.map((it) => (
                    <article className="mini-card" key={it.title}>
                      <span className="mini-icon"><Icon name={it.icon} /></span>
                      <h5>{it.title}</h5>
                      <p>{it.text}</p>
                    </article>
                  ))}
                </div>
                <p className="svc-note">{meta.ai.note}</p>
              </div>

              {/* service two — ISO */}
              <article className="svc-item">
                <div className="svc-item-head">
                  <span className="svc-num">02</span>
                  <span className="svc-icon"><Icon name="shield" /></span>
                  <h3>{meta.iso.title}</h3>
                  <p className="svc-item-lead">{meta.iso.intro}</p>
                </div>
                <div className="svc-item-body">
                  {meta.iso.paras.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </article>

              <div className="svc-sub-head compact"><h4>{meta.iso.standardsTitle}</h4></div>
              <div className="mini-grid">
                {t.norms.items.map((iso) => (
                  <article className="mini-card norm" key={iso.code}>
                    <span className="mini-code">ISO<b>{iso.code}</b></span>
                    <h5>{iso.name}</h5>
                    <p>{iso.text}</p>
                    <p className="mini-subs">{iso.subs}</p>
                  </article>
                ))}
              </div>

              <div className="svc-sub-head compact"><h4>{meta.iso.approachTitle}</h4></div>
              <ol className="flow">
                {meta.iso.approach.map((s) => (
                  <li key={s.step}>
                    <span className="flow-num">{s.step}</span>
                    <div><h5>{s.title}</h5><p>{s.text}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <SvcCta meta={meta} hub={S.hub} />
        </>
      )}

      {/* ---------------- TRAINING ---------------- */}
      {tab === 'training' && (
        <>
          <section className="svc-body">
            <div className="wrap">
              <div className="svc-sub-head compact"><h4>{meta.approach.title}</h4></div>
              <div className="mini-grid">
                {meta.approach.items.map((it) => (
                  <article className="mini-card" key={it.title}>
                    <span className="mini-icon"><Icon name={it.icon} /></span>
                    <h5>{it.title}</h5>
                    <p>{it.text}</p>
                  </article>
                ))}
              </div>

              <div className="svc-sub-head compact"><h4>{meta.programmesTitle}</h4></div>
              <div className="prog-list">
                {meta.programmes.map((p) => (
                  <article className="prog-row" key={p.title}>
                    <div className="prog-row-main">
                      <h5>{p.title}</h5>
                      <p>{p.text}</p>
                    </div>
                    <div className="prog-row-meta">
                      <span className="prog-dur">{p.dur}</span>
                      <span className="prog-who">{p.who}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <SvcCta meta={meta} hub={S.hub} />
        </>
      )}

      <Footer />
    </div>
  )
}

/* ---- small helpers kept in-file ---- */

function CurrencyFoot({ t, currency, setCurrency }) {
  return (
    <div className="svc-currency">
      <label className="currency-picker">
        <span>{t.models.priceIn}</span>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label={t.models.priceIn}>
          {Array.from(new Set([currency, ...SELECTABLE])).map((x) => (
            <option key={x} value={x}>{x}</option>
          ))}
        </select>
      </label>
      <p className="svc-note">
        {t.models.note}{currency !== 'EUR' ? ` · ${t.models.fromEur}` : ''}
      </p>
    </div>
  )
}

function SvcCta({ meta, hub }) {
  const waHref = `https://wa.me/971507369400?text=${encodeURIComponent(hub.waMsg)}`
  const liHref = 'https://www.linkedin.com/in/alejandrosnicolas/'
  return (
    <section className="svc-cta">
      <div className="wrap">
        <div className="svc-cta-inner">
          <div>
            <h3>{meta.cta.title}</h3>
            <p>{meta.cta.text}</p>
          </div>
          <div className="svc-cta-actions">
            <Link to="/#contact" className="btn btn-primary">{meta.cta.btn}</Link>
            <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.7c1.7.9 3.6 1.4 5.6 1.4h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.3.9.9-4.2-.3-.4c-1-1.6-1.5-3.4-1.5-5.3C5.4 9.6 10.2 4.8 16 4.8S26.6 9.6 26.6 15.4 21.8 24.8 16 24.8zm5.9-7.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3s0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5s.1-.4 0-.6-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5s-.3-.2-.6-.3z" />
              </svg>
              {hub.wa}
            </a>
            <a className="btn btn-li" href={liHref} target="_blank" rel="noopener noreferrer">
              <SocialIcon name="linkedin" />
              {hub.li}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
