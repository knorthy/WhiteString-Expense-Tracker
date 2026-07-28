import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './views/LandingPage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import DashboardPage from './views/DashboardPage'
import TransactionsPage from './views/TransactionsPage'
import WalletsPage from './views/WalletsPage'
import CategoriesPage from './views/CategoriesPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — requires login */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute><TransactionsPage /></ProtectedRoute>
        } />
        <Route path="/wallets" element={
          <ProtectedRoute><WalletsPage /></ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute><CategoriesPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
