import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Nav, Footer } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { POSTS, postDate, AUTHOR } from '../data/posts.js'

const fmt = (d, lang) =>
  d.toLocaleDateString(lang === 'ar' ? 'ar' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Post() {
  const { slug } = useParams()
  const { lang, t } = useLang()
  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  const now = new Date()
  now.setHours(23, 59, 59, 999)
  const published = POSTS.filter((p) => postDate(p.day) <= now).sort((a, b) => a.day - b.day)
  const idx = published.findIndex((p) => p.slug === slug)

  if (idx === -1) return <Navigate to="/blog" replace />

  const post = published[idx]
  const prev = published[idx - 1]
  const next = published[idx + 1]

  return (
    <div>
      <Nav />

      <article className="post-single">
        <div className="wrap-narrow">
          <Link to="/blog" className="post-back">{t.blog.backToBlog}</Link>
          <div className="post-meta">
            <span className="post-day">{t.blog.day} {post.day} <em>{t.blog.of}</em></span>
            <span className="post-ref">{post.ref}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="post-byline">{t.blog.by} <strong>{AUTHOR}</strong> · {fmt(postDate(post.day), lang)}</p>
          {lang === 'ar' && <p className="lang-note">{t.blog.langNote}</p>}

          <div className="post-body" dir="ltr">
            {post.body.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <nav className="post-nav">
            {prev
              ? <Link to={`/blog/${prev.slug}`} className="post-nav-link prev"><span>{t.blog.prev}</span><b>{prev.title}</b></Link>
              : <span />}
            {next
              ? <Link to={`/blog/${next.slug}`} className="post-nav-link next"><span>{t.blog.next}</span><b>{next.title}</b></Link>
              : <span />}
          </nav>
        </div>
      </article>

      <Footer />
    </div>
  )
}
