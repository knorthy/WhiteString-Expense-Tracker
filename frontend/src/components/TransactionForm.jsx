import { useState, useEffect } from 'react'
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
}

/**
 * TransactionForm — used inside Modal for create and edit
 *
 * Props:
 *   initial    — object, pre-filled values for edit mode (optional)
 *   onSubmit   — function(formData), called on save
 *   onCancel   — function, called on cancel
 *   isLoading  — boolean
 */
function TransactionForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initial || DEFAULT_FORM)
  const [errors, setErrors] = useState({})

  // Re-populate when editing a different transaction
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
      // Reset category when type changes
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
    if (!form.date) e.date = 'Date is required.'
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
      ...form,
      amount: parseFloat(form.amount),
    })
  }

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

      {/* Amount + Date side by side */}
      <div className="txn-form__row">
        <div className="txn-form__field">
          <label className="txn-form__label">Amount</label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            className={`txn-form__input${errors.amount ? ' txn-form__input--error' : ''}`}
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
          />
          {errors.amount && <span className="txn-form__error">{errors.amount}</span>}
        </div>

        <div className="txn-form__field">
          <label className="txn-form__label">Date</label>
          <input
            name="date"
            type="date"
            className={`txn-form__input${errors.date ? ' txn-form__input--error' : ''}`}
            value={form.date}
            onChange={handleChange}
          />
          {errors.date && <span className="txn-form__error">{errors.date}</span>}
        </div>
      </div>

      {/* Description */}
      <div className="txn-form__field">
        <label className="txn-form__label">Description <span className="txn-form__optional">(optional)</span></label>
        <textarea
          name="description"
          className="txn-form__textarea"
          placeholder="Notes..."
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      {/* Actions */}
      <div className="txn-form__actions">
        <button type="button" className="txn-form__cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="txn-form__save" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default TransactionForm
