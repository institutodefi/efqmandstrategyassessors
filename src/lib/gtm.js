// ------------------------------------------------------------------
// Google Tag Manager, loaded only after the visitor consents.
//
// GTM is not injected at all until analytics (or marketing) consent is
// given, and Google Consent Mode defaults are set to "denied" first, so
// nothing is measured before the visitor agrees. Revoking consent updates
// the signals immediately (a reload fully clears the container).
// ------------------------------------------------------------------

export const GTM_ID = 'GTM-MGHZNN9K'

let injected = false

function dl() {
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

// Consent Mode expects the classic `arguments` object, not an array.
function gtag() {
  dl().push(arguments)
}

/** Set Consent Mode defaults to denied. Safe to call before GTM loads. */
export function initConsentDefaults() {
  if (typeof window === 'undefined') return
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  })
}

/** Push the visitor's choices into Consent Mode. */
export function updateConsent(consent) {
  if (typeof window === 'undefined' || !consent) return
  const granted = (v) => (v ? 'granted' : 'denied')
  gtag('consent', 'update', {
    analytics_storage: granted(consent.analytics),
    ad_storage: granted(consent.marketing),
    ad_user_data: granted(consent.marketing),
    ad_personalization: granted(consent.marketing),
    functionality_storage: granted(consent.preferences),
    personalization_storage: granted(consent.preferences),
    security_storage: 'granted',
  })
}

/** Inject the GTM container. Runs once, and only when consent allows it. */
export function loadGTM() {
  if (injected || typeof window === 'undefined') return
  if (document.getElementById('gtm-script')) { injected = true; return }
  injected = true

  dl().push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.id = 'gtm-script'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(s)
}

/**
 * Apply a consent object: always update the signals, and load the
 * container the first time analytics or marketing is allowed.
 */
export function applyConsentToGTM(consent) {
  if (!consent) return
  updateConsent(consent)
  if (consent.analytics || consent.marketing) loadGTM()
}

/** SPA page view — GTM sees one page load, so route changes are pushed. */
export function trackPageView(path, title) {
  if (!injected) return
  dl().push({ event: 'page_view', page_path: path, page_title: title || document.title })
}
