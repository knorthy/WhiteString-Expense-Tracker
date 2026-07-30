import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// wraps private routes in App.jsx
// redirects to /login if no user in store or no token in localStorage
function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  const token = localStorage.getItem('claro_token')

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
