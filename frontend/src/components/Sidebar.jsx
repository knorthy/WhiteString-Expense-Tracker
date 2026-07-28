import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import claroLogo from '../assets/Claro.png'
import useAuthStore from '../store/authStore'
import useWalletStore from '../store/walletStore'
import useCurrencyStore from '../store/currencyStore'
import { logout } from '../api/auth'
import SettingsModal from './SettingsModal'
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

// UserPopup receives format as a prop so it stays in scope
function UserPopup({ user, totalBalance, initials, format, onClose, onOpenSettings }) {
  const navigate = useNavigate()
  const clearUser = useAuthStore((state) => state.clearUser)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const handleLogout = async () => {
    try { await logout() } catch (_) {}
    clearUser()
    navigate('/')
    onClose()
  }

  return (
    <div className="user-popup" ref={ref}>
      <div className="user-popup__header">
        {user?.avatar
          ? <img src={user.avatar} alt={user?.name} className="user-popup__avatar user-popup__avatar--img" />
          : <div className="user-popup__avatar">{initials}</div>
        }
        <div className="user-popup__info">
          <p className="user-popup__name">{user?.name || 'User'}</p>
          <p className="user-popup__email">{user?.email || 'No email'}</p>
          <p className="user-popup__balance">{format(totalBalance)}</p>
        </div>
      </div>

      <div className="user-popup__divider" />

      <button className="user-popup__item" onClick={() => { onOpenSettings(); onClose() }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        Settings
      </button>

      <div className="user-popup__divider" />

      <button className="user-popup__item user-popup__item--danger" onClick={handleLogout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Log out
      </button>
    </div>
  )
}

function Sidebar() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const wallets = useWalletStore((state) => state.wallets)
  const setWallets = useWalletStore((state) => state.setWallets)
  const format = useCurrencyStore((state) => state.format)
  const [popupOpen, setPopupOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const userName = user?.name || 'User'
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const totalBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0)

  // Refresh wallet balances on every page navigation
  useEffect(() => {
    if (!user) return
    import('../api/wallets').then(({ getWallets }) =>
      getWallets().then((data) => {
        import('../constants/wallets').then(({ WALLET_OPTIONS }) => {
          const enriched = data.map((w) => ({
            ...w,
            balance: parseFloat(w.balance) || 0,
            logo: WALLET_OPTIONS.find((o) => o.id === w.wallet_key)?.logo ?? null,
          }))
          setWallets(enriched)
        })
      }).catch(() => {})
    )
  }, [location.pathname, user])

  return (
    <>
      <aside className="sidebar">
        {/* Logo */}
        <Link to="#" className="sidebar__brand">
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

        {/* User card */}
        <div className="sidebar__user-wrap">
          {popupOpen && (
            <UserPopup
              user={user}
              totalBalance={totalBalance}
              initials={initials}
              format={format}
              onClose={() => setPopupOpen(false)}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          )}

          <button
            className="sidebar__user"
            onClick={() => setPopupOpen((v) => !v)}
            aria-label="User menu"
          >
            {user?.avatar
              ? <img src={user.avatar} alt={userName} className="sidebar__user-avatar sidebar__user-avatar--img" />
              : <div className="sidebar__user-avatar">{initials}</div>
            }
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{userName}</span>
              <span className="sidebar__user-balance">{format(totalBalance)}</span>
            </div>
            <svg className="sidebar__user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
            </svg>
          </button>
        </div>
      </aside>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}

export default Sidebar
