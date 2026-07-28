import { useState, useEffect, useRef } from 'react'
import { WALLET_OPTIONS } from '../constants/wallets'
import './WalletForm.css'

const DEFAULT_FORM = {
  walletId: '',
  balance: '',
}

function WalletForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initial || DEFAULT_FORM)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState({})
  const dropdownRef = useRef(null)

  useEffect(() => {
    setForm(initial || DEFAULT_FORM)
    const found = WALLET_OPTIONS.find((w) => w.id === initial?.walletId)
    setSearch(found ? found.name : '')
    setErrors({})
  }, [initial])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = WALLET_OPTIONS.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.type.toLowerCase().includes(search.toLowerCase())
  )

  const selectedWallet = WALLET_OPTIONS.find((w) => w.id === form.walletId)

  const handleSelect = (wallet) => {
    setForm((prev) => ({ ...prev, walletId: wallet.id }))
    setSearch(wallet.name)
    setOpen(false)
    setErrors((prev) => ({ ...prev, walletId: '' }))
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setForm((prev) => ({ ...prev, walletId: '' }))
    setOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.walletId) e.walletId = 'Please select a wallet or bank.'
    if (form.balance === '' || isNaN(form.balance))
      e.balance = 'Enter a valid balance (can be 0).'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit({
      wallet_key: form.walletId,
      name: selectedWallet.name,
      type: selectedWallet.type,
      balance: parseFloat(form.balance),
    })
  }

  return (
    <form className="wallet-form" onSubmit={handleSubmit} noValidate>

      {/* Searchable Wallet Dropdown */}
      <div className="wallet-form__field" ref={dropdownRef}>
        <label className="wallet-form__label">Select Wallet / Bank</label>
        <div className="wallet-form__dropdown">
          <div className="wallet-form__dropdown-trigger" onClick={() => setOpen((v) => !v)}>
            {selectedWallet ? (
              <img src={selectedWallet.logo} alt={selectedWallet.name} className="wallet-form__selected-logo" />
            ) : (
              <svg className="wallet-form__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            )}
            <input
              type="text"
              className="wallet-form__search-input"
              placeholder="Search bank or e-wallet..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => setOpen(true)}
            />
            <svg className="wallet-form__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {open && (
            <div className="wallet-form__dropdown-list">
              {filtered.length === 0 ? (
                <div className="wallet-form__dropdown-empty">No results found.</div>
              ) : (
                filtered.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className={`wallet-form__dropdown-item${form.walletId === w.id ? ' wallet-form__dropdown-item--active' : ''}`}
                    onClick={() => handleSelect(w)}
                  >
                    <img src={w.logo} alt={w.name} className="wallet-form__dropdown-logo" />
                    <div className="wallet-form__dropdown-info">
                      <span className="wallet-form__dropdown-name">{w.name}</span>
                      <span className="wallet-form__dropdown-type">{w.type}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {errors.walletId && <span className="wallet-form__error">{errors.walletId}</span>}
      </div>

      {/* Balance */}
      <div className="wallet-form__field">
        <label className="wallet-form__label">Current Balance</label>
        <input
          name="balance"
          type="number"
          step="0.01"
          className={`wallet-form__input${errors.balance ? ' wallet-form__input--error' : ''}`}
          placeholder="0.00"
          value={form.balance}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, balance: e.target.value }))
            setErrors((prev) => ({ ...prev, balance: '' }))
          }}
        />
        {errors.balance && <span className="wallet-form__error">{errors.balance}</span>}
      </div>

      {/* Actions */}
      <div className="wallet-form__actions">
        <button type="button" className="wallet-form__cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="wallet-form__save" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default WalletForm
