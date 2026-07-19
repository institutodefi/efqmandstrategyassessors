import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import { useSeo } from '../lib/seo.js'

export default function Login() {
  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lang, t } = useLang()
  const a = t.auth
  useSeo(
    lang === 'ar' ? 'الدخول إلى Orbital360 — EFQM and Strategy Assessors'
                  : 'Orbital360 access — EFQM and Strategy Assessors',
    lang === 'ar' ? 'سجّلوا الدخول إلى مساحة عملكم في Orbital360.'
                  : 'Sign in to your Orbital360 workspace — the AI PMTool for management, governance and excellence systems.',
    '/login',
    '/orbital360/og-orbital360.png'
  )

  if (user) {
    navigate('/portal', { replace: true })
    return null
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!supabase) {
      setStatus({ ok: false, msg: a.notConfigured })
      return
    }
    const form = e.target
    const email = form.email.value.trim()
    const password = mode !== 'reset' ? form.password.value : null
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/portal')
      } else if (mode === 'signup') {
        const firstName = form.firstName.value.trim()
        const lastName = form.lastName.value.trim()
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`.trim(),
            },
          },
        })
        if (error) throw error
        setStatus({ ok: true, msg: a.created })
        setMode('signin')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        })
        if (error) throw error
        setStatus({ ok: true, msg: a.resetSent })
      }
    } catch (err) {
      setStatus({ ok: false, msg: err.message || a.failed })
    } finally {
      setBusy(false)
    }
  }

  const titles = {
    signin: <>{a.signinTitleA}<strong>{a.signinStrong}</strong></>,
    signup: <>{a.signupTitleA}<strong>{a.signupStrong}</strong></>,
    reset: <>{a.resetTitleA}<strong>{a.resetStrong}</strong></>,
  }
  const subs = { signin: a.signinSub, signup: a.signupSub, reset: a.resetSub }

  return (
    <div className="orb-auth">
      {/* branded panel */}
      <aside className="orb-auth-panel">
        <Link to="/" className="orb-auth-back">{a.back}</Link>
        <div className="orb-auth-panel-body">
          <img className="orb-auth-logo" src="/orbital360/logo-on-dark.svg"
               alt="Orbital360 — AI PMTool" width="300" height="300" />
          <span className="orb-auth-eyebrow">{a.eyebrow}</span>
          <h2>{a.panelTitle}</h2>
          <p>{a.panelLead}</p>
          <ul className="orb-auth-points">
            {a.panelPoints.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <p className="orb-auth-secure">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
               strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="10.5" width="16" height="10" rx="2" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
          {a.secure}
        </p>
      </aside>

      {/* form */}
      <main className="orb-auth-main">
        <form className="orb-auth-card" onSubmit={onSubmit}>
          <img className="orb-auth-mark" src="/orbital360/mark.svg" alt="" width="52" height="52" aria-hidden="true" />
          <h1>{titles[mode]}</h1>
          <p className="sub">{subs[mode]}</p>

          {mode === 'signup' && (
            <div className="field-row">
              <div className="field">
                <label htmlFor="a-first">{a.firstName}</label>
                <input id="a-first" name="firstName" autoComplete="given-name" required />
              </div>
              <div className="field">
                <label htmlFor="a-last">{a.lastName}</label>
                <input id="a-last" name="lastName" autoComplete="family-name" required />
              </div>
            </div>
          )}
          <div className="field">
            <label htmlFor="a-email">{a.email}</label>
            <input id="a-email" name="email" type="email" autoComplete="email" required />
          </div>
          {mode !== 'reset' && (
            <div className="field">
              <label htmlFor="a-pass">{a.password}</label>
              <input
                id="a-pass" name="password" type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength="8" required
              />
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? a.working : mode === 'signin' ? a.signin : mode === 'signup' ? a.signup : a.reset}
          </button>

          {status && (
            <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>
          )}

          {mode === 'signin' && (
            <>
              <p className="auth-switch">
                {a.newClient} <button type="button" onClick={() => { setMode('signup'); setStatus(null) }}>{a.createLink}</button>
              </p>
              <p className="auth-switch">
                <button type="button" onClick={() => { setMode('reset'); setStatus(null) }}>{a.forgot}</button>
              </p>
            </>
          )}
          {mode !== 'signin' && (
            <p className="auth-switch">
              <button type="button" onClick={() => { setMode('signin'); setStatus(null) }}>{a.backToSignin}</button>
            </p>
          )}

          <div className="orb-auth-foot">
            <Link to="/orbital360">{a.whatIs}</Link>
            <span aria-hidden="true">·</span>
            <Link to="/request?service=Orbital360 AI PMTool">{a.requestAccess}</Link>
          </div>
        </form>
      </main>
    </div>
  )
}
