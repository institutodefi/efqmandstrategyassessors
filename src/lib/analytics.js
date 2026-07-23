// ------------------------------------------------------------------
// Google Tag Manager, loaded only after the visitor consents.
//
// GTM is not injected at all until analytics (or marketing) consent is
// given, and Google Consent Mode defaults are set to "denied" first, so
// nothing is measured before the visitor agrees. Revoking consent updates
// the signals immediately (a reload fully clears the container).
// ------------------------------------------------------------------

export const GTM_ID = 'GTM-MGHZNN9K'
export const GA4_ID = 'G-VJ8ZCVTKG8'

// IMPORTANT — avoid double counting.
// GA4 is currently loaded directly via gtag.js. If you also add a GA4
// Configuration tag for G-VJ8ZCVTKG8 inside the GTM container, every hit is
// counted twice. In that case set this to true: gtag.js is then not injected
// and GTM owns the measurement.
export const GA4_HANDLED_BY_GTM = false

let gtmInjected = false
// GA4 (gtag.js) is now hard-coded in index.html so Google's tag verification
// can detect it. Consent Mode defaults there are "denied", so nothing is
// stored until the visitor agrees — see updateConsent below.
const GA4_IN_HTML = true
let ga4Injected = GA4_IN_HTML

function dl() {
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

// Consent Mode expects the classic `arguments` object, not an array.
function gtag() {
  dl().push(arguments)
}

/**
 * Consent Mode defaults are set inline in index.html (they must run before
 * gtag.js). This stays as a safety net for any page that does not include
 * that snippet, and is a no-op when the defaults are already present.
 */
export function initConsentDefaults() {
  if (typeof window === 'undefined') return
  const already = (window.dataLayer || []).some(
    (x) => x && x.length && x[0] === 'consent' && x[1] === 'default'
  )
  if (already) return
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
  if (gtmInjected || typeof window === 'undefined') return
  if (document.getElementById('gtm-script')) { gtmInjected = true; return }
  gtmInjected = true

  dl().push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.id = 'gtm-script'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(s)
}

/**
 * Inject GA4 (gtag.js) directly. Page views are sent manually from
 * trackPageView, because a single-page app only fires one real page load.
 */
export function loadGA4() {
  // gtag.js ships in index.html, so there is nothing to inject. Kept for the
  // case where GA4_IN_HTML is turned off and the tag must be added lazily.
  if (GA4_IN_HTML || GA4_HANDLED_BY_GTM) return
  if (ga4Injected || typeof window === 'undefined') return
  if (document.getElementById('ga4-script')) { ga4Injected = true; return }
  ga4Injected = true

  const s = document.createElement('script')
  s.id = 'ga4-script'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  document.head.appendChild(s)

  gtag('js', new Date())
  gtag('config', GA4_ID, { send_page_view: false, anonymize_ip: true })
  sendPageView(window.location.pathname + window.location.search)
}

/**
 * Apply a consent object: always update the signals, and load the
 * container the first time analytics or marketing is allowed.
 */
export function applyConsentToGTM(consent) {
  if (!consent) return
  updateConsent(consent)
  if (consent.analytics || consent.marketing) {
    loadGTM()
    if (consent.analytics) loadGA4()
  }
}

/** Send one page view to GA4 (and anything listening in GTM). */
function sendPageView(path, title) {
  const t = title || document.title
  if (ga4Injected) {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: t,
      page_location: window.location.origin + path,
    })
  }
  dl().push({ event: 'page_view', page_path: path, page_title: t })
}

/** SPA page view — the browser only reports one real load, so routes are pushed. */
export function trackPageView(path, title) {
  if (!gtmInjected && !ga4Injected) return
  sendPageView(path, title)
}

/** Send the first page view once the tag is present (called on boot). */
export function trackInitialPageView() {
  sendPageView(window.location.pathname + window.location.search)
}


/**
 * Conversion / interaction events. Names follow GA4 recommended events where
 * one exists (generate_lead, sign_up) so GA4 reporting picks them up natively.
 * Mark these as Key Events in GA4 Admin:
 *   generate_lead · contact_whatsapp · newsletter_signup · sign_up
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  dl().push({ event: name, ...params })
  if (ga4Injected) gtag('event', name, params)
}
