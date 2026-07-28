import { useState, useEffect, useRef } from 'react'
import useAuthStore from '../store/authStore'
import useCurrencyStore, { CURRENCY_OPTIONS } from '../store/currencyStore'
import { getTransactions } from '../api/transactions'
import './SettingsModal.css'

const SECTIONS = [
  {
    id: 'general',
    label: 'General',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'security',
    label: 'Account Security',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other Income']
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Healthcare', 'Shopping', 'Entertainment', 'Education', 'Other Expense']

// ── Section: General ──────────────────────────────────────
function GeneralSection() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const currency = useCurrencyStore((state) => state.currency)
  const setCurrency = useCurrencyStore((state) => state.setCurrency)
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null)
  const fileInputRef = useRef(null)

  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target.result
      setAvatarUrl(url)
      setUser({ ...user, avatar: url })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setUser({ ...user, name, avatar: avatarUrl })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings-section">
      <h2 className="settings-section__title">General</h2>
      <p className="settings-section__desc">Manage your profile information.</p>

      {/* Avatar — clickable to change */}
      <div className="settings-row settings-row--avatar">
        <span className="settings-row__label">Avatar</span>
        <div className="settings-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="settings-avatar settings-avatar--img" />
          ) : (
            <div className="settings-avatar">{initials}</div>
          )}
          <div className="settings-avatar-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="settings-avatar-input"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-row">
        <label className="settings-row__label" htmlFor="settings-name">Full Name</label>
        <input
          id="settings-name"
          className="settings-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
      </div>

      <div className="settings-divider" />

      <div className="settings-row">
        <label className="settings-row__label">Email</label>
        <input
          className="settings-input settings-input--readonly"
          type="email"
          value={email}
          readOnly
          tabIndex={-1}
        />
      </div>

      <div className="settings-divider" />

      <div className="settings-row">
        <label className="settings-row__label" htmlFor="settings-currency">Currency</label>
        <select
          id="settings-currency"
          className="settings-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c.code} value={c.code}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="settings-actions">
        <button className="settings-save-btn" onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

// ── Section: Account Security ─────────────────────────────
function SecuritySection() {
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('New password must be at least 8 characters.'); return }
    if (form.password !== form.password_confirmation) { setError('Passwords do not match.'); return }
    // TODO: PATCH /api/user/password
    setSaved(true)
    setForm({ current_password: '', password: '', password_confirmation: '' })
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="settings-section">
      <h2 className="settings-section__title">Account Security</h2>
      <p className="settings-section__desc">Update your password to keep your account secure.</p>
      <form onSubmit={handleSubmit}>
        <div className="settings-row">
          <label className="settings-row__label" htmlFor="current-pw">Current Password</label>
          <input id="current-pw" name="current_password" className="settings-input" type="password" placeholder="••••••••" value={form.current_password} onChange={handleChange} autoComplete="current-password" />
        </div>
        <div className="settings-divider" />
        <div className="settings-row">
          <label className="settings-row__label" htmlFor="new-pw">New Password</label>
          <input id="new-pw" name="password" className="settings-input" type="password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} autoComplete="new-password" />
        </div>
        <div className="settings-divider" />
        <div className="settings-row">
          <label className="settings-row__label" htmlFor="confirm-pw">Confirm Password</label>
          <input id="confirm-pw" name="password_confirmation" className="settings-input" type="password" placeholder="••••••••" value={form.password_confirmation} onChange={handleChange} autoComplete="new-password" />
        </div>
        {error && <p className="settings-error">{error}</p>}
        {saved && <p className="settings-success">Password updated successfully.</p>}
        <div className="settings-divider" />
        <div className="settings-info-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="settings-info-card__icon"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          <p>Changing your password will log you out of all other active sessions.</p>
        </div>
        <div className="settings-actions">
          <button type="submit" className="settings-save-btn">Update Password</button>
        </div>
      </form>
    </div>
  )
}

// ── Section: Privacy + Export ─────────────────────────────
function PrivacySection() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Export state
  const [exportType, setExportType] = useState('all')       // all | income | expense | category
  const [exportCategory, setExportCategory] = useState('')
  const [exportDateFrom, setExportDateFrom] = useState('')
  const [exportDateTo, setExportDateTo] = useState('')
  const [exporting, setExporting] = useState(false)

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
  const categoryOptions = exportType === 'income'
    ? INCOME_CATEGORIES
    : exportType === 'expense'
      ? EXPENSE_CATEGORIES
      : allCategories

  const handleExport = async () => {
    setExporting(true)
    try {
      const filters = {}
      if (exportType === 'income') filters.type = 'income'
      if (exportType === 'expense') filters.type = 'expense'
      if (exportType === 'category' && exportCategory) filters.category = exportCategory
      if (exportDateFrom) filters.date_from = exportDateFrom
      if (exportDateTo) filters.date_to = exportDateTo

      const data = await getTransactions(filters)

      // Build CSV
      const headers = ['Date', 'Type', 'Category', 'Amount', 'Description']
      const rows = data.map((t) => [
        t.date?.slice(0, 10) ?? '',
        t.type,
        t.category,
        parseFloat(t.amount).toFixed(2),
        `"${(t.description || '').replace(/"/g, '""')}"`,
      ])

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `claro-transactions-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="settings-section">
      <h2 className="settings-section__title">Privacy</h2>
      <p className="settings-section__desc">Control your data and privacy preferences.</p>

      {/* Analytics */}
      <div className="settings-row settings-row--toggle">
        <div>
          <p className="settings-row__label">Usage Analytics</p>
          <p className="settings-row__hint">Help improve Claro by sharing anonymous usage data.</p>
        </div>
        <button className={`settings-toggle${analyticsEnabled ? ' settings-toggle--on' : ''}`} onClick={() => setAnalyticsEnabled((v) => !v)} role="switch" aria-checked={analyticsEnabled}>
          <span className="settings-toggle__thumb" />
        </button>
      </div>

      <div className="settings-divider" />

      {/* Export Data */}
      <div className="settings-export">
        <p className="settings-row__label">Export My Data</p>
        <p className="settings-row__hint" style={{ marginBottom: 16 }}>
          Download your transactions as a CSV file. Filter by type, category, or date range.
        </p>

        <div className="settings-export__grid">
          {/* Filter type */}
          <div className="settings-export__field">
            <label className="settings-export__label">Filter By</label>
            <select
              className="settings-select settings-select--full"
              value={exportType}
              onChange={(e) => { setExportType(e.target.value); setExportCategory('') }}
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
              <option value="category">By Category</option>
            </select>
          </div>

          {/* Category (only if type = category) */}
          {exportType === 'category' && (
            <div className="settings-export__field">
              <label className="settings-export__label">Category</label>
              <select
                className="settings-select settings-select--full"
                value={exportCategory}
                onChange={(e) => setExportCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date From */}
          <div className="settings-export__field">
            <label className="settings-export__label">From Date</label>
            <input
              type="date"
              className="settings-input settings-input--full"
              value={exportDateFrom}
              onChange={(e) => setExportDateFrom(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="settings-export__field">
            <label className="settings-export__label">To Date</label>
            <input
              type="date"
              className="settings-input settings-input--full"
              value={exportDateTo}
              onChange={(e) => setExportDateTo(e.target.value)}
            />
          </div>
        </div>

        <div className="settings-export__actions">
          <button className="settings-save-btn" onClick={handleExport} disabled={exporting}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 6 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting ? 'Exporting…' : 'Download CSV'}
          </button>
        </div>
      </div>

      <div className="settings-divider" />

      {/* Delete account */}
      <div className="settings-row settings-row--toggle">
        <div>
          <p className="settings-row__label settings-row__label--danger">Delete Account</p>
          <p className="settings-row__hint">Permanently delete your account and all data. This cannot be undone.</p>
        </div>
        <button className="settings-danger-btn" onClick={() => setDeleteConfirm(true)}>Delete</button>
      </div>

      {deleteConfirm && (
        <div className="settings-danger-confirm">
          <p>Are you sure? This will permanently delete your account and all transactions.</p>
          <div className="settings-danger-confirm__actions">
            <button className="settings-outline-btn" onClick={() => setDeleteConfirm(false)}>Cancel</button>
            <button className="settings-danger-btn" onClick={() => setDeleteConfirm(false)}>Yes, delete my account</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main SettingsModal ────────────────────────────────────
function SettingsModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('general')

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const renderSection = () => {
    switch (activeSection) {
      case 'general':  return <GeneralSection />
      case 'security': return <SecuritySection />
      case 'privacy':  return <PrivacySection />
      default:         return <GeneralSection />
    }
  }

  return (
    <div className="settings-backdrop" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <aside className="settings-nav">
          <p className="settings-nav__heading">Settings</p>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`settings-nav__item${activeSection === s.id ? ' settings-nav__item--active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="settings-nav__icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </aside>

        <div className="settings-content">
          <button className="settings-close" onClick={onClose} aria-label="Close settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="settings-content__scroll">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
