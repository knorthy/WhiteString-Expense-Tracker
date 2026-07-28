import { Link, useLocation } from 'react-router-dom'
import claroLogo from '../assets/Claro.png'
import useAuthStore from '../store/authStore'
import './Sidebar.css'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    label: 'Wallets',
    path: '/wallets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        <path d="M20 12a2 2 0 0 0-2-2h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 2-2z" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    path: '/categories',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
]

function Sidebar() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const userName = user?.name || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/" className="sidebar__brand">
        <img src={claroLogo} alt="Claro" className="sidebar__logo" />
        <span className="sidebar__brand-name">Claro</span>
      </Link>

      {/* Nav */}
      <nav className="sidebar__nav">
        <p className="sidebar__section-label">Platform</p>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar__nav-item${location.pathname === item.path ? ' sidebar__nav-item--active' : ''}`}
          >
            <span className="sidebar__nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar__user">
        <div className="sidebar__user-avatar">{userInitial}</div>
        <div className="sidebar__user-info">
          <span className="sidebar__user-name">{userName}</span>
          <span className="sidebar__user-balance">₱0.00</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
