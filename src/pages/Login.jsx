import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'

export default function Login() {
  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLang()
  const a = t.auth

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
        const fullName = form.fullName.value.trim()
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
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
    <div className="auth-page">
      <Link to="/" className="auth-back">{a.back}</Link>
      <form className="auth-card" onSubmit={onSubmit}>
        <img className="seal" src="/brand/spiral.png" alt="" aria-hidden="true" />
        <h1>{titles[mode]}</h1>
        <p className="sub">{subs[mode]}</p>

        {mode === 'signup' && (
          <div className="field">
            <label htmlFor="a-name">{a.fullName}</label>
            <input id="a-name" name="fullName" autoComplete="name" required />
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
      </form>
    </div>
  )
}
