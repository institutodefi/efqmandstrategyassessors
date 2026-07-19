import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * ProtectedRoute — optionally restricted to specific roles.
 *
 *   <ProtectedRoute>…</ProtectedRoute>                        → any signed-in user
 *   <ProtectedRoute roles={['superadmin','admin']}>…</…>      → only those roles
 *
 * superadmin always passes every gate (universal access).
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, role, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (roles && role !== 'superadmin' && !roles.includes(role)) {
    return <Navigate to="/portal" replace />
  }
  return children
}
