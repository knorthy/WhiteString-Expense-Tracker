import { useState, useEffect } from 'react'
import { formatPHP } from '../utils/currency'
import './TransactionForm.css'

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other Income',
]

const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Rent', 'Utilities', 'Healthcare',
  'Shopping', 'Entertainment', 'Education', 'Other Expense',
]

const DEFAULT_FORM = {
  type: 'expense',
  category: '',
  amount: '',
  date: '',
  description: '',
  walletId: '',
}

/**
 * TransactionForm — used inside Modal for create and edit
 *
 * Props:
 *   initial    — object, pre-filled values for edit mode (optional)
 *   wallets    — array of user's wallets [{ id, name, logo, type }]
 *   onSubmit   — function(formData)
 *   onCancel   — function
 *   isLoading  — boolean
 */
function TransactionForm({ initial, wallets = [], onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initial || DEFAULT_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(initial || DEFAULT_FORM)
    setErrors({})
  }, [initial])

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.type) e.type = 'Type is required.'
    if (!form.category) e.category = 'Category is required.'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount greater than 0.'

    // Insufficient balance check — only for expense transactions
    if (form.type === 'expense' && form.walletId && form.amount) {
      const wallet = wallets.find((w) => String(w.id) === String(form.walletId))
      if (wallet && parseFloat(form.amount) > parseFloat(wallet.balance)) {
        e.amount = `Insufficient balance. ${wallet.name} only has ${formatPHP(wallet.balance)} available.`
      }
    }

    if (!form.date) {
      e.date = 'Date is required.'
    } else if (form.date > new Date().toISOString().slice(0, 10)) {
      e.date = 'Date cannot be in the future.'
    }
    if (!form.walletId) e.walletId = 'Please select a wallet.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    // Map walletId → wallet_id for the Laravel API
    const { walletId, ...rest } = form
    onSubmit({
      ...rest,
      wallet_id: parseInt(walletId, 10),
      amount: parseFloat(form.amount),
    })
  }

  const selectedWallet = wallets.find((w) => String(w.id) === String(form.walletId))

  return (
    <form className="txn-form" onSubmit={handleSubmit} noValidate>

      {/* Type */}
      <div className="txn-form__field">
        <label className="txn-form__label">Type</label>
        <select
          name="type"
          className={`txn-form__select${errors.type ? ' txn-form__input--error' : ''}`}
          value={form.type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {errors.type && <span className="txn-form__error">{errors.type}</span>}
      </div>

      {/* Category */}
      <div className="txn-form__field">
        <label className="txn-form__label">Category</label>
        <select
          name="category"
          className={`txn-form__select${errors.category ? ' txn-form__input--error' : ''}`}
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="txn-form__error">{errors.category}</span>}
      </div>

      {/* Wallet */}
      <div className="txn-form__field">
        <label className="txn-form__label">Wallet / Bank</label>
        {wallets.length === 0 ? (
          <p className="txn-form__no-wallets">No wallets added yet. Add one in the Wallets page.</p>
        ) : (
          <div className={`txn-form__wallet-select${errors.walletId ? ' txn-form__input--error' : ''}`}>
            {selectedWallet && (
              selectedWallet.logo
                ? <img src={selectedWallet.logo} alt={selectedWallet.name} className="txn-form__wallet-logo" />
                : <span className="txn-form__wallet-cash-icon">💵</span>
            )}
            <select
              name="walletId"
              className="txn-form__wallet-native-select"
              value={form.walletId}
              onChange={handleChange}
            >
              <option value="">Select wallet</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
        )}
        {errors.walletId && <span className="txn-form__error">{errors.walletId}</span>}
      </div>

      {/* Amount + Date */}
      <div className="txn-form__row">
        <div className="txn-form__field">
          <label className="txn-form__label">
            Amount
            {form.type === 'expense' && selectedWallet && (
              <span className="txn-form__balance-hint">
                Available: {formatPHP(selectedWallet.balance)}
              </span>
            )}
          </label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            className={`txn-form__input${errors.amount ? ' txn-form__input--error' : ''}`}
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => {
              // Strip anything that isn't a digit or single decimal point
              const val = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
              handleChange({ target: { name: 'amount', value: val } })
            }}
          />
          {errors.amount && <span className="txn-form__error">{errors.amount}</span>}
        </div>

        <div className="txn-form__field">
          <label className="txn-form__label">Date</label>
          <input
            name="date"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            className={`txn-form__input${errors.date ? ' txn-form__input--error' : ''}`}
            value={form.date}
            onChange={handleChange}
          />
          {errors.date && <span className="txn-form__error">{errors.date}</span>}
        </div>
      </div>

      {/* Description */}
      <div className="txn-form__field">
        <label className="txn-form__label">
          Description <span className="txn-form__optional">(optional)</span>
        </label>
        <textarea
          name="description"
          className="txn-form__textarea"
          placeholder="Notes..."
          rows={3}
          maxLength={500}
          value={form.description}
          onChange={handleChange}
        />
        {form.description?.length > 400 && (
          <span className="txn-form__char-count">{form.description.length}/500</span>
        )}
      </div>

      {/* Actions */}
      <div className="txn-form__actions">
        <button type="button" className="txn-form__cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="txn-form__save" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
