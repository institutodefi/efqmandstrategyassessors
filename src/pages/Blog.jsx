import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { POSTS, postDate, AUTHOR, AUTHOR_AR, localisePost } from '../data/posts.js'
import { POSTS_AR } from '../data/posts_ar.js'
import { useSeo } from '../lib/seo.js'

const fmt = (d, lang) =>
  d.toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Blog() {
  const { lang, t } = useLang()
  useSeo(
    'The 90-day EFQM excellence programme — Blog',
    'A daily post by Alejandro San Nicolás explaining one concept of the EFQM Model 2025 in plain language. In English and Arabic.',
    '/blog'
  )
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const author = lang === 'ar' ? AUTHOR_AR : AUTHOR
  const now = new Date()
  now.setHours(23, 59, 59, 999)

  const published = POSTS
    .filter((p) => postDate(p.day) <= now)
    .sort((a, b) => b.day - a.day)
    .map((p) => localisePost(p, lang, POSTS_AR))

  const nextRaw = POSTS.filter((p) => postDate(p.day) > now).sort((a, b) => a.day - b.day)[0]
  const next = nextRaw ? localisePost(nextRaw, lang, POSTS_AR) : null

  return (
    <div>
      <Nav />

      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow" style={{ color: 'var(--glow)' }}>{t.blog.eyebrow}</span>
          <h1 className="display">{t.blog.titleA}<strong>{t.blog.strong}</strong>{t.blog.titleB}</h1>
          <p className="lead">{t.blog.sub}</p>
          <a className="rss-link" href="/rss.xml" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><circle cx="5" cy="19" r="2" fill="currentColor"/><path d="M4 11a9 9 0 019 9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M4 4a16 16 0 0116 16" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>
            {t.blog.rss}
          </a>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {published.length === 0 ? (
            <p className="blog-empty">{t.blog.empty}</p>
          ) : (
            <div className="post-list">
              {published.map((p) => (
                <article className="post-card" key={p.slug}>
                  <Link to={`/blog/${p.slug}`} className="post-thumb" aria-hidden="true" tabIndex="-1">
                    <img src={`/blog/${p.slug}.png`} width="1200" height="630" alt="" loading="lazy" />
                  </Link>
                  <div className="post-meta">
                    <span className="post-day">{t.blog.day} {p.day} <em>{t.blog.of}</em></span>
                    <span className="post-ref">{p.ref}</span>
                  </div>
                  <h2><Link to={`/blog/${p.slug}`}>{p.title}</Link></h2>
                  <p>{p.body.split('\n\n')[0]}</p>
                  <div className="post-foot">
                    <span>{t.blog.by} {author} · {fmt(postDate(p.day), lang)}</span>
                    <Link to={`/blog/${p.slug}`} className="post-link">
                      {t.blog.readMore} {lang === 'ar' ? '←' : '→'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {next && (
            <div className="upcoming">
              <span className="eyebrow">{t.blog.upcoming}</span>
              <h3>{t.blog.day} {next.day} · {next.title}</h3>
              <p>{t.blog.upcomingSub} — {fmt(postDate(next.day), lang)}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
