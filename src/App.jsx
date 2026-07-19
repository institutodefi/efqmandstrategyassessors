import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { LangProvider } from './i18n.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import CookieNotice, { getStoredConsent } from './components/CookieNotice.jsx'
import { initConsentDefaults, applyConsentToGTM, trackPageView } from './lib/analytics.js'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Heavy / less-frequent routes are code-split so the landing page loads lean.
const Model = lazy(() => import('./pages/Model.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const Request = lazy(() => import('./pages/Request.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const Post = lazy(() => import('./pages/Post.jsx'))
const Legal = lazy(() => import('./pages/Legal.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Portal = lazy(() => import('./pages/Portal.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function Fallback() {
  return <div className="route-loading" aria-live="polite" aria-busy="true" />
}

// Consent-gated analytics: denied by default, loaded only if the visitor agreed.
function Analytics() {
  const { pathname, search } = useLocation()
  const booted = useRef(false)

  useEffect(() => {
    if (booted.current) return
    booted.current = true
    initConsentDefaults()
    const stored = getStoredConsent()
    if (stored) applyConsentToGTM(stored)
  }, [])

  useEffect(() => { trackPageView(pathname + search) }, [pathname, search])
  return null
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <CurrencyProvider>
        <Analytics />
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/model" element={<Model />} />
            <Route path="/services" element={<Services />} />
            <Route path="/request" element={<Request />} />
            <Route path="/services/assessments" element={<Services />} />
            <Route path="/services/consultancy" element={<Services />} />
            <Route path="/services/training" element={<Services />} />
            {/* legacy paths keep working and open the matching tab */}
            <Route path="/consultancy" element={<Services />} />
            <Route path="/assessments" element={<Services />} />
            <Route path="/training" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Post />} />

            {/* Legal & compliance — one component, five documents */}
            <Route path="/privacy" element={<Legal />} />
            <Route path="/cookies" element={<Legal />} />
            <Route path="/terms" element={<Legal />} />
            <Route path="/legal-notice" element={<Legal />} />
            <Route path="/accessibility" element={<Legal />} />

            <Route path="/login" element={<Login />} />
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieNotice />
        <WhatsAppButton />
        </CurrencyProvider>
      </AuthProvider>
    </LangProvider>
  )
}
