import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'

const KEY = 'cookie-consent'

export default function CookieNotice() {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show only if the visitor hasn't acknowledged yet.
    let acked = null
    try { acked = localStorage.getItem(KEY) } catch { /* storage blocked */ }
    if (!acked) {
      // small delay so it doesn't compete with first paint
      const id = setTimeout(() => setShow(true), 600)
      return () => clearTimeout(id)
    }
  }, [])

  function accept() {
    try { localStorage.setItem(KEY, new Date().toISOString()) } catch { /* ignore */ }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="cookie-notice" role="dialog" aria-live="polite" aria-label={t.cookie.title}>
      <div className="cookie-inner">
        <div className="cookie-copy">
          <strong>{t.cookie.title}</strong>
          <p>
            {t.cookie.text}{' '}
            <Link to="/cookies" className="cookie-link">{t.cookie.more}</Link>
          </p>
        </div>
        <button className="btn btn-primary cookie-btn" onClick={accept}>
          {t.cookie.accept}
        </button>
      </div>
    </div>
  )
}
