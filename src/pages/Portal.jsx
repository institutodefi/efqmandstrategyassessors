import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Icon } from '../components/Chrome.jsx'

export default function Portal() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])

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
          <span className="who">Signed in as <b>{name}</b></span>
          <button className="btn btn-ghost" onClick={signOut} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Sign out
          </button>
        </div>
      </nav>

      <main className="portal-main">
        <h1>Welcome to your <strong>client zone</strong></h1>
        <p className="sub">
          Your private engagement workspace — documents, assessment progress
          and direct contact with your assessor team.
        </p>

        <div className="portal-grid">
          <section className="portal-card">
            <div className="glyph"><Icon name="doc" /></div>
            <h3>Documents</h3>
            {docs.length === 0 ? (
              <p>No documents shared yet. Deliverables from your engagement will appear here.</p>
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
            <span className="tag">Deliverables</span>
          </section>

          <section className="portal-card">
            <div className="glyph"><Icon name="radar" /></div>
            <h3>Assessment progress</h3>
            <p>
              Track your RADAR scoring by criterion as the assessment advances,
              from baseline diagnosis to verified recognition score.
            </p>
            <span className="tag">RADAR scoring</span>
          </section>

          <section className="portal-card">
            <div className="glyph"><Icon name="chat" /></div>
            <h3>Contact your assessors</h3>
            <p>
              Questions between sessions? Write to your engagement team at{' '}
              <a href="mailto:hello@efqmassessors.ae" style={{ color: 'var(--glow)' }}>
                hello@efqmassessors.ae
              </a>{' '}
              — we reply within one business day.
            </p>
            <span className="tag">Support</span>
          </section>
        </div>
      </main>
    </div>
  )
}
