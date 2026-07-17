import { createContext, useContext, useEffect, useState } from 'react'
import {
  BASE_CURRENCY, COUNTRY_CURRENCY, RATES, formatPrice,
} from '../lib/site.js'

const PREF_KEY = 'currency-pref'   // explicit user choice
const GEO_KEY = 'currency-geo'     // cached auto-detected currency

const CurrencyContext = createContext({
  currency: BASE_CURRENCY,
  detected: false,
  setCurrency: () => {},
  format: (e) => String(e),
})

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(BASE_CURRENCY)
  const [detected, setDetected] = useState(false)

  useEffect(() => {
    // 1) explicit choice wins
    let pref = null
    try { pref = localStorage.getItem(PREF_KEY) } catch { /* ignore */ }
    if (pref && RATES[pref]) { setCurrencyState(pref); setDetected(true); return }

    // 2) cached geo result
    let cached = null
    try { cached = localStorage.getItem(GEO_KEY) } catch { /* ignore */ }
    if (cached && RATES[cached]) { setCurrencyState(cached); setDetected(true); return }

    // 3) look up the country by IP (functional: only the currency is stored,
    //    never the IP address). Fails silently to EUR.
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('https://ipwho.is/?fields=country_code', {
          headers: { Accept: 'application/json' },
        })
        const data = await res.json()
        const cc = data && data.country_code
        const cur = (cc && COUNTRY_CURRENCY[cc]) || BASE_CURRENCY
        if (cancelled) return
        try { localStorage.setItem(GEO_KEY, cur) } catch { /* ignore */ }
        setCurrencyState(cur)
        setDetected(true)
      } catch {
        if (!cancelled) setDetected(true) // stay on EUR
      }
    })()
    return () => { cancelled = true }
  }, [])

  function setCurrency(cur) {
    if (!RATES[cur]) return
    setCurrencyState(cur)
    try { localStorage.setItem(PREF_KEY, cur) } catch { /* ignore */ }
  }

  const value = {
    currency,
    detected,
    setCurrency,
    format: (euros) => formatPrice(euros, currency),
  }
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
