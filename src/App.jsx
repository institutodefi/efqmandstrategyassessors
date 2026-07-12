import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { LangProvider } from './i18n.jsx'
import Home from './pages/Home.jsx'
import Model from './pages/Model.jsx'
import Blog from './pages/Blog.jsx'
import Post from './pages/Post.jsx'
import Login from './pages/Login.jsx'
import Portal from './pages/Portal.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model" element={<Model />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <Portal />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </LangProvider>
  )
}
