import { useState, useEffect } from 'react'
import './CategoryForm.css'

const DEFAULT_FORM = {
  name: '',
  type: 'expense',
  color: '#a7ef9e',
}

/**
 * CategoryForm — used inside Modal for create and edit
 *
 * Props:
 *   initial    — object, pre-filled values for edit mode (optional)
 *   onSubmit   — function(formData), called on save
 *   onCancel   — function, called on cancel
 *   isLoading  — boolean
 */
function CategoryForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initial || DEFAULT_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(initial || DEFAULT_FORM)
    setErrors({})
  }, [initial])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) {
      e.name = 'Category name is required.'
    } else if (form.name.trim().length < 2) {
      e.name = 'Category name must be at least 2 characters.'
    } else if (form.name.trim().length > 50) {
      e.name = 'Category name must be 50 characters or less.'
    } else if (/[<>{}[\]\\\/]/.test(form.name)) {
      e.name = 'Category name contains invalid characters.'
    }
    if (!form.type) e.type = 'Type is required.'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(form)
  }

  return (
    <form className="cat-form" onSubmit={handleSubmit} noValidate>
      {/* Name */}
      <div className="cat-form__field">
        <label className="cat-form__label">Name</label>
        <input
          name="name"
          type="text"
          maxLength={50}
          className={`cat-form__input${errors.name ? ' cat-form__input--error' : ''}`}
          placeholder="e.g. Groceries, Side Income"
          value={form.name}
          onChange={(e) => {
            const val = e.target.value.replace(/[<>{}[\]\\\/]/g, '')
            setForm((prev) => ({ ...prev, name: val }))
            setErrors((prev) => ({ ...prev, name: '' }))
          }}
        />
        {errors.name && <span className="cat-form__error">{errors.name}</span>}
      </div>

      {/* Type */}
      <div className="cat-form__field">
        <label className="cat-form__label">Type</label>
        <select
          name="type"
          className={`cat-form__select${errors.type ? ' cat-form__input--error' : ''}`}
          value={form.type}
          onChange={handleChange}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && <span className="cat-form__error">{errors.type}</span>}
      </div>

      {/* Color */}
      <div className="cat-form__field">
        <label className="cat-form__label">Color <span className="cat-form__optional">(optional)</span></label>
        <div className="cat-form__color-wrap">
          <input
            name="color"
            type="color"
            className="cat-form__color-input"
            value={form.color}
            onChange={handleChange}
          />
          <input
            name="color"
            type="text"
            className="cat-form__color-text"
            placeholder="#a7ef9e"
            value={form.color}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="cat-form__actions">
        <button type="button" className="cat-form__cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="cat-form__save" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default CategoryForm
