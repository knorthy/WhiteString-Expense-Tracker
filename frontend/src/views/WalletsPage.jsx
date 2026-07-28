import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import WalletForm from '../components/WalletForm'
import useWalletStore from '../store/walletStore'
import { WALLET_OPTIONS } from '../constants/wallets'
import { getWallets, createWallet, updateWalletBalance, deleteWallet } from '../api/wallets'
import { getTransactions } from '../api/transactions'
import './WalletsPage.css'

// 3-dot context menu per card
function WalletMenu({ wallet, onAdjust, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="wallet-menu" ref={ref}>
      <button
        className="wallet-card__menu-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Wallet options"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5"  r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="wallet-menu__dropdown">
          <button
            className="wallet-menu__item"
            onClick={() => { setOpen(false); onAdjust(wallet) }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Adjust Balance
          </button>
          <button
            className="wallet-menu__item wallet-menu__item--danger"
            onClick={() => { setOpen(false); onDelete(wallet.id) }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// Balance-only form for adjust modal
function AdjustBalanceForm({ wallet, onSubmit, onCancel, isLoading }) {
  const [balance, setBalance] = useState(String(wallet?.balance ?? ''))
  const [error, setError] = useState('')

  useEffect(() => {
    setBalance(String(wallet?.balance ?? ''))
    setError('')
  }, [wallet])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (balance === '' || isNaN(balance)) {
      setError('Enter a valid balance.')
      return
    }
    onSubmit(parseFloat(balance))
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {wallet && (
        <div className="adjust-wallet-info">
          <img src={wallet.logo} alt={wallet.name} className="adjust-wallet-logo" />
          <div>
            <p className="adjust-wallet-name">{wallet.name}</p>
            <p className="adjust-wallet-type">{wallet.type}</p>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label className="wallet-form__label">New Balance</label>
        <input
          type="number"
          step="0.01"
          className={`wallet-form__input${error ? ' wallet-form__input--error' : ''}`}
          placeholder="0.00"
          value={balance}
          onChange={(e) => { setBalance(e.target.value); setError('') }}
          autoFocus
        />
        {error && <span style={{ fontSize: 12, color: '#f87171', fontFamily: 'Poppins, sans-serif' }}>{error}</span>}
      </div>
      <div className="wallet-form__actions">
        <button type="button" className="wallet-form__cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="wallet-form__save" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

function WalletsPage() {
  const wallets = useWalletStore((state) => state.wallets)
  const setWallets = useWalletStore((state) => state.setWallets)

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [adjustTarget, setAdjustTarget] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recentTxns, setRecentTxns] = useState([])

  const totalBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0)

  // Load wallets and recent transactions from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [walletData, txnData] = await Promise.all([
          getWallets(),
          getTransactions(),
        ])
        // Attach logo from local constants since backend doesn't store images
        const enriched = walletData.map((w) => ({
          ...w,
          logo: WALLET_OPTIONS.find((o) => o.id === w.wallet_key)?.logo ?? null,
        }))
        setWallets(enriched)
        setRecentTxns(txnData.slice(0, 5)) // show last 5
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const handleAdd = async (formData) => {
    setIsLoading(true)
    try {
      const created = await createWallet(formData)
      const enriched = {
        ...created,
        logo: WALLET_OPTIONS.find((o) => o.id === created.wallet_key)?.logo ?? null,
      }
      setWallets([...wallets, enriched])
      setAddModalOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdjustBalance = async (newBalance) => {
    setIsLoading(true)
    try {
      const updated = await updateWalletBalance(adjustTarget.id, newBalance)
      setWallets(wallets.map((w) => w.id === updated.id ? { ...w, balance: updated.balance } : w))
      setAdjustTarget(null)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteWallet(id)
      setWallets(wallets.filter((w) => w.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="wallets-layout">
      <Sidebar />

      <main className="wallets-main">
        <div className="wallets-page-header">
          <div>
            <h1 className="wallets-page-title">Wallets</h1>
            <p className="wallets-page-sub">Manage your banks, e-wallets, and cash accounts.</p>
          </div>
        </div>

        {/* Top Row */}
        <div className="wallets-top-row">
          <div className="wallets-total">
            <div className="wallets-total__label">Total Balance</div>
            <div className="wallets-total__amount">
              ₱{totalBalance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="wallets-total__sub">Across {wallets.length} wallet(s)</p>
          </div>

          <div className="wallets-recent">
            <div className="wallets-recent__header">
              <h3 className="wallets-recent__title">Recent Transactions</h3>
            </div>
            <div className="wallets-recent__body">
              {recentTxns.length === 0 ? (
                <p className="wallets-recent__empty">No transactions yet.</p>
              ) : (
                <ul className="wallets-recent__list">
                  {recentTxns.map((t) => (
                    <li key={t.id} className="wallets-recent__item">
                      <div className="wallets-recent__item-left">
                        <span className={`wallets-recent__badge wallets-recent__badge--${t.type}`}>
                          {t.type}
                        </span>
                        <span className="wallets-recent__category">{t.category}</span>
                      </div>
                      <span className={`wallets-recent__amount wallets-recent__amount--${t.type}`}>
                        {t.type === 'expense' ? '-' : '+'}₱{parseFloat(t.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="wallets-section">
          <div className="wallets-section__header">
            <h2 className="wallets-section__title">Your Wallets</h2>
            <button className="wallets-section__add-btn" onClick={() => setAddModalOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="wallets-section__add-icon">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Wallet
            </button>
          </div>

          {wallets.length === 0 ? (
            <p className="wallets-empty">No wallets added yet. Create one to get started.</p>
          ) : (
            <div className="wallets-grid">
              {wallets.map((w) => (
                <div key={w.id} className="wallet-card">
                  <div className="wallet-card__top">
                    <img src={w.logo} alt={w.name} className="wallet-card__logo" />
                    <WalletMenu
                      wallet={w}
                      onAdjust={setAdjustTarget}
                      onDelete={handleDelete}
                    />
                  </div>
                  <div className="wallet-card__body">
                    <h3 className="wallet-card__name">{w.name}</h3>
                    <span className="wallet-card__type">{w.type}</span>
                  </div>
                  <div className="wallet-card__footer">
                    <div className="wallet-card__balance">
                      ₱{w.balance.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Wallet Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add wallet"
        subtitle="Choose your bank or e-wallet and set the balance."
      >
        <WalletForm
          onSubmit={handleAdd}
          onCancel={() => setAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Adjust Balance Modal */}
      <Modal
        isOpen={!!adjustTarget}
        onClose={() => setAdjustTarget(null)}
        title="Adjust Balance"
        subtitle="Update the current balance for this wallet."
      >
        <AdjustBalanceForm
          wallet={adjustTarget}
          onSubmit={handleAdjustBalance}
          onCancel={() => setAdjustTarget(null)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  )
}

export default WalletsPage
