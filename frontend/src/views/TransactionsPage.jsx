import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import TransactionForm from '../components/TransactionForm'
import useWalletStore from '../store/walletStore'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactions'
import { getWallets } from '../api/wallets'
import './TransactionsPage.css'

const TYPE_OPTIONS = ['All', 'income', 'expense']
const CATEGORY_OPTIONS = [
  'All',
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other Income',
  'Food', 'Transport', 'Rent', 'Utilities', 'Healthcare',
  'Shopping', 'Entertainment', 'Education', 'Other Expense',
]

function TransactionsPage() {
  const wallets = useWalletStore((state) => state.wallets)
  const setWallets = useWalletStore((state) => state.setWallets)
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Load transactions and refresh wallets on mount
  useEffect(() => {
    const load = async () => {
      setFetchLoading(true)
      try {
        const [txns, walletData] = await Promise.all([getTransactions(), getWallets()])
        setTransactions(txns)
        setWallets(walletData)
      } catch (err) {
        console.error(err)
      } finally {
        setFetchLoading(false)
      }
    }
    load()
  }, [])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (txn) => {
    setEditTarget({ ...txn, date: txn.date?.slice(0, 10) ?? '' })
    setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditTarget(null) }

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    try {
      if (editTarget) {
        const updated = await updateTransaction(editTarget.id, formData)
        setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      } else {
        const created = await createTransaction(formData)
        setTransactions((prev) => [created, ...prev])
      }
      // Refresh wallets so balance updates instantly
      const walletData = await getWallets()
      setWallets(walletData)
      closeModal()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
      const walletData = await getWallets()
      setWallets(walletData)
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = transactions.filter((t) => {
    const matchSearch =
      !search ||
      t.category?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || t.type === typeFilter
    const matchCategory = categoryFilter === 'All' || t.category === categoryFilter
    return matchSearch && matchType && matchCategory
  })

  return (
    <div className="txn-layout">
      <Sidebar />

      <main className="txn-main">
        {/* Page Header */}
        <div className="txn-page-header">
          <div>
            <h1 className="txn-page-title">Transactions</h1>
            <p className="txn-page-sub">Browse and filter your income and expenses.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="txn-filters">
          <div className="txn-filters__search-wrap">
            <svg className="txn-filters__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="txn-filters__search"
              placeholder="Description or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="txn-filters__select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o === 'All' ? 'All Types' : o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>

          <select
            className="txn-filters__select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o} value={o}>{o === 'All' ? 'All Categories' : o}</option>
            ))}
          </select>

          <div className="txn-filters__actions">
            <button className="txn-filters__clear" onClick={() => { setSearch(''); setTypeFilter('All'); setCategoryFilter('All') }}>
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="txn-results">
          <div className="txn-results__header">
            <span className="txn-results__count">Showing {filtered.length} item(s)</span>
            <button className="txn-results__add-btn" onClick={openCreate}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="txn-results__add-icon">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Transaction
            </button>
          </div>

          {filtered.length === 0 ? (
            <p className="txn-results__empty">No transactions found.</p>
          ) : (
            <div className="txn-table-wrap">
              <table className="txn-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date?.slice(0, 10)}</td>
                      <td>
                        <span className={`txn-badge txn-badge--${t.type}`}>
                          {t.type}
                        </span>
                      </td>
                      <td>{t.category}</td>
                      <td className="txn-table__desc">{t.description || '—'}</td>
                      <td className={`txn-table__amount txn-table__amount--${t.type}`}>
                        {t.type === 'expense' ? '-' : '+'}₱{Number(t.amount).toFixed(2)}
                      </td>
                      <td className="txn-table__actions">
                        <button className="txn-table__edit-btn" onClick={() => openEdit(t)}>Edit</button>
                        <button className="txn-table__delete-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Reusable Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit transaction' : 'New transaction'}
        subtitle="Record an income or expense."
      >
        <TransactionForm
          initial={editTarget}
          wallets={wallets}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  )
}

export default TransactionsPage
