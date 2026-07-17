// ------------------------------------------------------------------
// Central site configuration the owner can edit in one place.
// ------------------------------------------------------------------

// Social profiles. UPDATE these URLs with the real handles.
// Icons map to entries in the Icon component (Chrome.jsx).
export const SOCIAL = [
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/efqm-strategy-assessors' },
  { name: 'X', icon: 'x', url: 'https://x.com/efqmassessors' },
  { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/efqmassessors' },
  { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/efqmassessors' },
]

// ------------------------------------------------------------------
// Currency — base is EUR (the prices in i18n are in euros).
// Rates are EUR -> currency, indicative, edit as needed.
// GCC pegs are stable; EUR/USD floats. Rate as of Jul 2026 ≈ 4.20 AED.
// ------------------------------------------------------------------
export const BASE_CURRENCY = 'EUR'

export const RATES = {
  EUR: 1,
  AED: 4.20,
  USD: 1.14,
  GBP: 0.86,
  CHF: 0.93,
  SAR: 4.29,
  QAR: 4.16,
  KWD: 0.35,
  BHD: 0.43,
  OMR: 0.44,
}

// How each currency is displayed: symbol prefix, or code suffix.
export const CURRENCY_FORMAT = {
  EUR: { symbol: '€', position: 'prefix' },
  USD: { symbol: '$', position: 'prefix' },
  GBP: { symbol: '£', position: 'prefix' },
  CHF: { symbol: 'CHF', position: 'prefix', space: true },
  AED: { symbol: 'AED', position: 'suffix' },
  SAR: { symbol: 'SAR', position: 'suffix' },
  QAR: { symbol: 'QAR', position: 'suffix' },
  KWD: { symbol: 'KWD', position: 'suffix' },
  BHD: { symbol: 'BHD', position: 'suffix' },
  OMR: { symbol: 'OMR', position: 'suffix' },
}

// Country (ISO-3166 alpha-2) -> currency. Unlisted countries fall back to EUR.
export const COUNTRY_CURRENCY = {
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR',
  US: 'USD', GB: 'GBP', CH: 'CHF',
  // euro-zone (explicit, though EUR is the default anyway)
  ES: 'EUR', PT: 'EUR', FR: 'EUR', DE: 'EUR', IT: 'EUR', IE: 'EUR', NL: 'EUR',
}

// Currencies offered in the manual selector (deduped with the detected one).
export const SELECTABLE = ['EUR', 'AED', 'USD', 'GBP', 'SAR']

// Round a converted amount to a clean, human "from" price.
function niceRound(n) {
  if (n >= 1000) return Math.round(n / 50) * 50
  if (n >= 100) return Math.round(n / 10) * 10
  return Math.round(n / 5) * 5
}

// Format an amount given in EUR into the target currency string.
export function formatPrice(euros, currency) {
  const cur = RATES[currency] ? currency : BASE_CURRENCY
  const value =
    cur === BASE_CURRENCY ? Number(euros) : niceRound(Number(euros) * RATES[cur])
  const withSep = value.toLocaleString('en-US')
  const f = CURRENCY_FORMAT[cur] || { symbol: cur, position: 'suffix' }
  if (f.position === 'prefix') return `${f.symbol}${f.space ? ' ' : ''}${withSep}`
  return `${withSep} ${f.symbol}`
}

// Same conversion, split into parts so the amount and symbol can be styled.
export function priceParts(euros, currency) {
  const cur = RATES[currency] ? currency : BASE_CURRENCY
  const value =
    cur === BASE_CURRENCY ? Number(euros) : niceRound(Number(euros) * RATES[cur])
  const f = CURRENCY_FORMAT[cur] || { symbol: cur, position: 'suffix' }
  return { amount: value.toLocaleString('en-US'), symbol: f.symbol, position: f.position }
}
