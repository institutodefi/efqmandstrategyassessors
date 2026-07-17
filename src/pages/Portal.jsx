import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Icon } from '../components/Chrome.jsx'
import { useLang } from '../i18n.jsx'

export default function Portal() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const { t } = useLang()
  const p = t.portal

  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('documents')
      .select('id, title, category, created_at')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setDocs(data ?? []))
  }, [user])

  async function signOut() {
    await supabase?.auth.signOut()
    navigate('/')
  }

  const name = user?.user_metadata?.full_name || user?.email

  return (
    <div className="portal">
      <nav className="portal-nav">
        <img src="/brand/wordmark-white.png" alt="EFQM and Strategy Assessors" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span className="who">{p.signedInAs} <b>{name}</b></span>
          <button className="btn btn-ghost" onClick={signOut} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            {p.signOut}
          </button>
        </div>
      </nav>

      <main className="portal-main">
        <h1>{p.welcomeA}<strong>{p.strong}</strong></h1>
        <p className="sub">{p.sub}</p>

        <div className="portal-grid">
          <section className="portal-card">
            <div className="glyph"><Icon name="doc" /></div>
            <h3>{p.docs}</h3>
            {docs.length === 0 ? (
              <p>{p.docsEmpty}</p>
            ) : (
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10, marginTop: 6 }}>
                {docs.map((d) => (
                  <li key={d.id} style={{ fontSize: '0.9rem' }}>
                    <b style={{ fontWeight: 500 }}>{d.title}</b>
                    <span style={{ color: 'var(--muted-on-dark)' }}> · {d.category}</span>
                  </li>
                ))}
              </ul>
            )}
            <span className="tag">{p.docsTag}</span>
          </section>

          <section className="portal-card">
            <div className="glyph"><Icon name="radar" /></div>
            <h3>{p.radar}</h3>
            <p>{p.radarText}</p>
            <span className="tag">{p.radarTag}</span>
          </section>

          <section className="portal-card">
            <div className="glyph"><Icon name="chat" /></div>
            <h3>{p.support}</h3>
            <p>
              {p.supportTextA}{' '}
              <a href="mailto:hello@efqmassessors.ae" style={{ color: 'var(--glow)' }}>
                hello@efqmassessors.ae
              </a>{' '}
              {p.supportTextB}
            </p>
            <span className="tag">{p.supportTag}</span>
          </section>
        </div>
      </main>
    </div>
  )
}
