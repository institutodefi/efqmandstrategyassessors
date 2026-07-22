import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Nav, Footer } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { POSTS, postDate, AUTHOR, AUTHOR_AR, localisePost } from '../data/posts.js'
import { POSTS_AR } from '../data/posts_ar.js'
import { useSeo } from '../lib/seo.js'
import PostContact from '../components/PostContact.jsx'
import ShareBar from '../components/ShareBar.jsx'

const fmt = (d, lang) =>
  d.toLocaleDateString(lang === 'ar' ? 'ar-AE' : lang === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Post() {
  const { slug } = useParams()
  const { lang, t } = useLang()
  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  const author = lang === 'ar' ? AUTHOR_AR : AUTHOR
  const now = new Date()
  now.setHours(23, 59, 59, 999)

  const published = POSTS
    .filter((p) => postDate(p.day) <= now)
    .sort((a, b) => a.day - b.day)
    .map((p) => localisePost(p, lang, POSTS_AR))

  const idx = published.findIndex((p) => p.slug === slug)
  const found = idx !== -1 ? published[idx] : null
  useSeo(
    found ? `${found.title} — EFQM Blog` : 'EFQM Blog',
    found ? found.body.split('\n\n')[0].slice(0, 155) : '',
    `/blog/${slug}`,
    found ? `/blog/${slug}.png` : null
  )
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
          <p className="post-byline">{t.blog.by} <strong>{author}</strong> · {fmt(postDate(post.day), lang)}</p>

          <img className="post-hero-img" src={`/blog/${post.slug}.png`} width="1200" height="630"
               alt={post.title} loading="lazy" />

          <ShareBar slug={post.slug} title={post.title} />

          <div className="post-body">
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

          <PostContact title={post.title} />
        </div>
      </article>

      <Footer />
    </div>
  )
}
