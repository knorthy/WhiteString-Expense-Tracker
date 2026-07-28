import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

/**
 * Wraps any route that requires authentication.
 * If no user is in the store, redirects to /login.
 */
function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  const token = localStorage.getItem('claro_token')

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
