import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'

const KEY = 'cookie-consent-v2'
const OPEN_EVENT = 'open-cookie-settings'

// Non-necessary categories the visitor can toggle. "necessary" is always on.
const OPTIONAL = ['preferences', 'analytics', 'marketing']

function readConsent() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeConsent(obj) {
  try { localStorage.setItem(KEY, JSON.stringify({ ...obj, ts: new Date().toISOString() })) }
  catch { /* storage blocked */ }
}

// Footer (or anywhere) can reopen the manager by dispatching this event.
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export default function CookieNotice() {
  const { t } = useLang()
  const c = t.cookie
  const [decided, setDecided] = useState(true)   // has the visitor chosen yet?
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState({ preferences: false, analytics: false, marketing: false })

  useEffect(() => {
    const existing = readConsent()
    if (!existing) {
      const id = setTimeout(() => setDecided(false), 500)
      return () => clearTimeout(id)
    } else {
      setPrefs({
        preferences: !!existing.preferences,
        analytics: !!existing.analytics,
        marketing: !!existing.marketing,
      })
    }
  }, [])

  useEffect(() => {
    const open = () => {
      const existing = readConsent()
      if (existing) {
        setPrefs({
          preferences: !!existing.preferences,
          analytics: !!existing.analytics,
          marketing: !!existing.marketing,
        })
      }
      setShowPrefs(true)
      setDecided(true)
    }
    window.addEventListener(OPEN_EVENT, open)
    return () => window.removeEventListener(OPEN_EVENT, open)
  }, [])

  function acceptAll() {
    const all = { necessary: true, preferences: true, analytics: true, marketing: true }
    writeConsent(all); setPrefs(all); setDecided(true); setShowPrefs(false)
  }
  function rejectAll() {
    const none = { necessary: true, preferences: false, analytics: false, marketing: false }
    writeConsent(none); setPrefs({ preferences: false, analytics: false, marketing: false })
    setDecided(true); setShowPrefs(false)
  }
  function savePrefs() {
    writeConsent({ necessary: true, ...prefs })
    setDecided(true); setShowPrefs(false)
  }

  // While the first-choice banner is visible, mark the body so other
  // fixed elements (e.g. the WhatsApp button) can move out of the way.
  const bannerVisible = !decided && !showPrefs
  useEffect(() => {
    document.body.classList.toggle('consent-banner-open', bannerVisible)
    return () => document.body.classList.remove('consent-banner-open')
  }, [bannerVisible])

  // Nothing to show: visitor already decided and the modal is closed.
  if (decided && !showPrefs) return null

  return (
    <>
      {/* Banner (only before a first choice) */}
      {!decided && !showPrefs && (
        <div className="consent-banner" role="dialog" aria-live="polite" aria-label={c.title}>
          <div className="consent-inner">
            <div className="consent-copy">
              <strong>{c.title}</strong>
              <p>{c.intro} <Link to="/cookies" className="consent-link">{c.more}</Link></p>
            </div>
            <div className="consent-actions">
              <button className="btn btn-ghost consent-sm" onClick={() => setShowPrefs(true)}>{c.customize}</button>
              <button className="btn btn-ghost consent-sm" onClick={rejectAll}>{c.rejectAll}</button>
              <button className="btn btn-primary consent-sm" onClick={acceptAll}>{c.acceptAll}</button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences modal */}
      {showPrefs && (
        <div className="consent-modal-overlay" onClick={() => decided && setShowPrefs(false)}>
          <div className="consent-modal" role="dialog" aria-modal="true" aria-label={c.prefsTitle}
            onClick={(e) => e.stopPropagation()}>
            <div className="consent-modal-head">
              <h3>{c.prefsTitle}</h3>
              <button className="consent-close" aria-label={c.close || 'Close'}
                onClick={() => { if (!readConsent()) rejectAll(); setShowPrefs(false); if (readConsent()) setDecided(true) }}>×</button>
            </div>
            <p className="consent-modal-intro">{c.intro}</p>

            <ul className="consent-cats">
              <li>
                <div className="consent-cat-top">
                  <span className="consent-cat-name">{c.cats.necessary.name}</span>
                  <span className="consent-always">{c.alwaysOn}</span>
                </div>
                <p>{c.cats.necessary.desc}</p>
              </li>
              {OPTIONAL.map((cat) => (
                <li key={cat}>
                  <div className="consent-cat-top">
                    <span className="consent-cat-name">{c.cats[cat].name}</span>
                    <label className="consent-switch">
                      <input
                        type="checkbox"
                        checked={prefs[cat]}
                        onChange={(e) => setPrefs((p) => ({ ...p, [cat]: e.target.checked }))}
                      />
                      <span className="consent-slider" />
                    </label>
                  </div>
                  <p>{c.cats[cat].desc}</p>
                </li>
              ))}
            </ul>

            <div className="consent-modal-actions">
              <button className="btn btn-ghost consent-sm" onClick={rejectAll}>{c.rejectAll}</button>
              <button className="btn btn-ghost consent-sm" onClick={savePrefs}>{c.save}</button>
              <button className="btn btn-primary consent-sm" onClick={acceptAll}>{c.acceptAll}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
