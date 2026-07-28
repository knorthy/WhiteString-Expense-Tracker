import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './views/LandingPage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import DashboardPage from './views/DashboardPage'
import TransactionsPage from './views/TransactionsPage'
import WalletsPage from './views/WalletsPage'
import CategoriesPage from './views/CategoriesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/wallets" element={<WalletsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
