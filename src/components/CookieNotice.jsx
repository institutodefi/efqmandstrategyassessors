import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { applyConsentToGTM, initConsentDefaults } from '../lib/gtm.js'

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
  // Push the decision to Consent Mode and load GTM if now allowed.
  applyConsentToGTM(obj)
}

// Read the stored decision (used on boot).
export function getStoredConsent() { return readConsent() }

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
      const id = setTimeout(() => setDecided(false), 300)
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
      {/* First-visit consent — centred pop-up with backdrop */}
      {!decided && !showPrefs && (
        <div className="consent-popup-overlay" role="dialog" aria-modal="true" aria-label={c.title}>
          <div className="consent-popup">
            <div className="consent-popup-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30">
                <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 00-2.7-19.6 2.6 2.6 0 003.2 3.4 2.6 2.6 0 002.2 2.9A2.6 2.6 0 0018 8.4 10 10 0 0012 2z" opacity="0.18"/>
                <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M20.8 11.3a10 10 0 11-8.1-9.1"/>
                <circle cx="9" cy="10" r="1.3" fill="currentColor"/>
                <circle cx="14" cy="14" r="1.3" fill="currentColor"/>
                <circle cx="10.5" cy="16" r="1" fill="currentColor"/>
                <circle cx="15.5" cy="8.5" r="1" fill="currentColor"/>
              </svg>
            </div>
            <strong>{c.title}</strong>
            <p>{c.intro} <Link to="/cookies" className="consent-link">{c.more}</Link></p>
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
