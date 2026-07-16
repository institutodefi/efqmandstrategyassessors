import { useEffect, useState } from 'react'
import { Nav, Footer } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { MODEL } from '../data/model.js'
import { useSeo } from '../lib/seo.js'

export default function Model() {
  const { lang, t } = useLang()
  const criteria = MODEL[lang] || MODEL.en
  useSeo(
    'The EFQM Model 2025 explained — EFQM and Strategy Assessors',
    'A clear guide to the EFQM Model 2025: three blocks, seven criteria and 32 sub-criteria, with assessor commentary. In English and Arabic.',
    '/model'
  )
  const [active, setActive] = useState('1')
  const [openSub, setOpenSub] = useState(null)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const current = criteria.find((c) => c.num === active)

  return (
    <div>
      <Nav />

      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{t.model.eyebrow}</span>
          <h1 className="display">
            {t.model.heroA}<strong>{t.model.strong}</strong>{t.model.heroB}
          </h1>
          <p className="lead">{t.model.lead}</p>
          <div className="chip-row">
            {t.model.chips.map((c) => <span className="chip" key={c}>{c}</span>)}
          </div>
        </div>
      </section>

      {/* THREE BLOCKS */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title">
              {t.model.logicTitleA}<strong>{t.model.logicStrong}</strong>{t.model.logicTitleB}
            </h2>
            <p>{t.model.logicSub}</p>
          </div>
          <div className="blocks-grid">
            {t.model.blocks.map((b) => (
              <article className="block-card" key={b.q}>
                <span className="block-tag">{b.tag}</span>
                <span className="block-q">{b.q}</span>
                <h3>{b.name}</h3>
                <p>{b.text}</p>
                <span className="block-crits">{b.crits}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CRITERIA EXPLORER */}
      <section className="section alt">
        <div className="wrap">
          <div className="section-head">
            <h2 className="section-title">
              {t.model.critTitleA}<strong>{t.model.critStrong}</strong>{t.model.critTitleB}
            </h2>
            <p>{t.model.critSub}</p>
          </div>

          <nav className="crit-tabs" aria-label="Criteria">
            {criteria.map((c) => (
              <button
                key={c.num}
                className={`crit-tab ${active === c.num ? 'on' : ''}`}
                onClick={() => { setActive(c.num); setOpenSub(null) }}
              >
                <b>{String(c.num).padStart(2, '0')}</b>
                <span>{c.title}</span>
              </button>
            ))}
          </nav>

          {current && (
            <div className="crit-panel">
              <header className="crit-head">
                <div className="crit-num">{String(current.num).padStart(2, '0')}</div>
                <div>
                  <span className="block-tag">{current.block}</span>
                  <h3>{current.title}</h3>
                  <p>{current.desc}</p>
                </div>
              </header>
              <div className="sub-list">
                {current.subs.map((s) => {
                  const isOpen = openSub === s.id
                  return (
                    <article className={`sub-item ${isOpen ? 'open' : ''}`} key={s.id}>
                      <button
                        className="sub-head"
                        aria-expanded={isOpen}
                        onClick={() => setOpenSub(isOpen ? null : s.id)}
                      >
                        <span className="sub-id">{s.id}</span>
                        <span className="sub-name">{s.name}</span>
                        <span className="sub-plus" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="sub-body">
                          <div className="sub-block">
                            <span className="sub-label">{t.model.descLabel}</span>
                            <p>{s.desc}</p>
                          </div>
                          <div className="sub-block comment">
                            <span className="sub-label">{t.model.commentLabel}</span>
                            <p>{s.comment}</p>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="zone" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
            <div>
              <h2><strong>{t.model.ctaTitle}</strong></h2>
              <p style={{ margin: '14px auto 26px', maxWidth: '38em' }}>{t.hero.lead}</p>
              <a href="/#contact" className="btn btn-primary">{t.model.cta}</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
