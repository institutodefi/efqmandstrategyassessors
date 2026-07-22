import { Link } from 'react-router-dom'
import { Nav, Footer } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'
import { useSeo } from '../lib/seo.js'

export default function NotFound() {
  const { t } = useLang()
  useSeo(`${t.notFound.title} — EFQM and Strategy Assessors`, t.notFound.text, '/404')

  return (
    <div>
      <Nav />
      <section className="page-hero notfound-hero">
        <div className="wrap">
          <span className="notfound-code">{t.notFound.code}</span>
          <h1 className="display">{t.notFound.title}</h1>
          <p className="lead">{t.notFound.text}</p>
          <div className="hero-actions">
            <Link to="/" className="btn btn-primary">{t.notFound.home}</Link>
            <Link to="/blog" className="btn btn-ghost">{t.notFound.blog}</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
