import { useEffect } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { Nav, Footer } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { LEGAL, LEGAL_UPDATED, LEGAL_ORDER } from '../data/legal.js'
import { useSeo } from '../lib/seo.js'

// Map URL slug → key inside the LEGAL dictionary.
const SLUG_TO_KEY = {
  privacy: 'privacy',
  cookies: 'cookies',
  terms: 'terms',
  'legal-notice': 'notice',
  accessibility: 'accessibility',
}

function anchor(h) {
  return h.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/(^-|-$)/g, '')
}

export default function Legal() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\/+/, '')
  const { lang, t } = useLang()
  const key = SLUG_TO_KEY[slug]

  const doc = key ? LEGAL[lang][key] : null
  useSeo(
    doc ? `${doc.title} — EFQM and Strategy Assessors` : 'Legal',
    doc ? doc.intro : '',
    `/${slug}`
  )

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!key) return <Navigate to="/404" replace />

  const updated = new Date(LEGAL_UPDATED).toLocaleDateString(
    lang === 'ar' ? 'ar-AE' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  return (
    <div>
      <Nav />

      <section className="page-hero legal-hero">
        <div className="wrap">
          <nav className="legal-tabs" aria-label={t.footer.legalHeading}>
            {LEGAL_ORDER.map((k) => {
              const s = LEGAL[lang][k].slug
              return (
                <Link key={k} to={`/${s}`} className={`legal-tab ${k === key ? 'on' : ''}`}>
                  {t.legalNav[k]}
                </Link>
              )
            })}
          </nav>
          <h1 className="display">{doc.title}</h1>
          <p className="legal-updated">{LEGAL[lang].updatedLabel}: {updated}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap legal-layout">
          <aside className="legal-toc" aria-label={LEGAL[lang].tocLabel}>
            <span className="legal-toc-title">{LEGAL[lang].tocLabel}</span>
            <ol>
              {doc.sections.map((s) => (
                <li key={s.h}><a href={`#${anchor(s.h)}`}>{s.h}</a></li>
              ))}
            </ol>
          </aside>

          <article className="legal-body">
            <p className="legal-intro">{doc.intro}</p>

            {doc.sections.map((s) => (
              <section key={s.h} id={anchor(s.h)} className="legal-section">
                <h2>{s.h}</h2>
                {s.body.map((block, i) =>
                  typeof block === 'string' ? (
                    <p key={i}>{block}</p>
                  ) : block.list ? (
                    <ul key={i}>
                      {block.list.map((li, j) => <li key={j}>{li}</li>)}
                    </ul>
                  ) : null
                )}
              </section>
            ))}

            <div className="legal-contact">
              <strong>{LEGAL[lang].contactBox.title}</strong>
              {LEGAL[lang].contactBox.lines.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  )
}
