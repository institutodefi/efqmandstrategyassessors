import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { LangProvider } from './i18n.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import CookieNotice from './components/CookieNotice.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import Home from './pages/Home.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Heavy / less-frequent routes are code-split so the landing page loads lean.
const Model = lazy(() => import('./pages/Model.jsx'))
const Consultancy = lazy(() => import('./pages/Consultancy.jsx'))
const Assessments = lazy(() => import('./pages/Assessments.jsx'))
const Training = lazy(() => import('./pages/Training.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const Post = lazy(() => import('./pages/Post.jsx'))
const Legal = lazy(() => import('./pages/Legal.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Portal = lazy(() => import('./pages/Portal.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function Fallback() {
  return <div className="route-loading" aria-live="polite" aria-busy="true" />
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <CurrencyProvider>
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/model" element={<Model />} />
            <Route path="/consultancy" element={<Consultancy />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/training" element={<Training />} />
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
