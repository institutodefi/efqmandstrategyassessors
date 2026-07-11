import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user) {
    navigate('/portal', { replace: true })
    return null
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!supabase) {
      setStatus({ ok: false, msg: 'The client zone is not configured yet. Please contact hello@efqmassessors.ae.' })
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
        setStatus({ ok: true, msg: 'Account created. Check your inbox to confirm your email, then sign in.' })
        setMode('signin')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        })
        if (error) throw error
        setStatus({ ok: true, msg: 'Password reset link sent. Check your inbox.' })
      }
    } catch (err) {
      setStatus({ ok: false, msg: err.message || 'Sign-in failed. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  const titles = {
    signin: <>Client <strong>zone</strong></>,
    signup: <>Create your <strong>account</strong></>,
    reset: <>Reset <strong>password</strong></>,
  }
  const subs = {
    signin: 'Sign in to access your engagement workspace.',
    signup: 'Request access to your private engagement workspace.',
    reset: 'We will email you a secure reset link.',
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back">← Back to efqmassessors.ae</Link>
      <form className="auth-card" onSubmit={onSubmit}>
        <img className="seal" src="/brand/spiral.png" alt="" aria-hidden="true" />
        <h1>{titles[mode]}</h1>
        <p className="sub">{subs[mode]}</p>

        {mode === 'signup' && (
          <div className="field">
            <label htmlFor="a-name">Full name</label>
            <input id="a-name" name="fullName" autoComplete="name" required />
          </div>
        )}
        <div className="field">
          <label htmlFor="a-email">Email</label>
          <input id="a-email" name="email" type="email" autoComplete="email" required />
        </div>
        {mode !== 'reset' && (
          <div className="field">
            <label htmlFor="a-pass">Password</label>
            <input
              id="a-pass" name="password" type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength="8" required
            />
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
        </button>

        {status && (
          <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>
        )}

        {mode === 'signin' && (
          <>
            <p className="auth-switch">
              New client? <button type="button" onClick={() => { setMode('signup'); setStatus(null) }}>Create an account</button>
            </p>
            <p className="auth-switch">
              <button type="button" onClick={() => { setMode('reset'); setStatus(null) }}>Forgot your password?</button>
            </p>
          </>
        )}
        {mode !== 'signin' && (
          <p className="auth-switch">
            <button type="button" onClick={() => { setMode('signin'); setStatus(null) }}>Back to sign in</button>
          </p>
        )}
      </form>
    </div>
  )
}
