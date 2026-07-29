import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import CategoryForm from '../components/CategoryForm'
import { toast } from '../store/toastStore'
import './CategoriesPage.css'

const DEFAULT_INCOME = [
  { name: 'Salary',       type: 'income',  color: '#4ade80' },
  { name: 'Freelance',    type: 'income',  color: '#a7ef9e' },
  { name: 'Business',     type: 'income',  color: '#34d399' },
  { name: 'Investment',   type: 'income',  color: '#6ee7b7' },
  { name: 'Gift',         type: 'income',  color: '#86efac' },
  { name: 'Other Income', type: 'income',  color: '#bbf7d0' },
]

const DEFAULT_EXPENSE = [
  { name: 'Food',          type: 'expense', color: '#fb923c' },
  { name: 'Transport',     type: 'expense', color: '#60a5fa' },
  { name: 'Rent',          type: 'expense', color: '#f87171' },
  { name: 'Utilities',     type: 'expense', color: '#facc15' },
  { name: 'Healthcare',    type: 'expense', color: '#e879f9' },
  { name: 'Shopping',      type: 'expense', color: '#f472b6' },
  { name: 'Entertainment', type: 'expense', color: '#818cf8' },
  { name: 'Education',     type: 'expense', color: '#38bdf8' },
  { name: 'Other Expense', type: 'expense', color: '#94a3b8' },
]

function CategoriesPage() {
  const [categories, setCategories] = useState([
    ...DEFAULT_INCOME.map((c, i) => ({ ...c, id: `default-income-${i}` })),
    ...DEFAULT_EXPENSE.map((c, i) => ({ ...c, id: `default-expense-${i}` })),
  ])
  const [activeTab, setActiveTab] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const filtered = categories.filter((c) => {
    if (activeTab === 'all') return true
    return c.type === activeTab
  })

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (cat) => { setEditTarget(cat); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditTarget(null) }

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    try {
      if (editTarget) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editTarget.id ? { ...c, ...formData } : c))
        )
        toast.success('Category updated.')
      } else {
        setCategories((prev) => [
          ...prev,
          { ...formData, id: `custom-${Date.now()}` },
        ])
        toast.success('Category added.')
      }
      closeModal()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast.success('Category deleted.')
  }

  return (
    <div className="cat-layout">
      <Sidebar />

      <main className="cat-main">
        <div className="cat-page-header">
          <div>
            <h1 className="cat-page-title">Categories</h1>
            <p className="cat-page-sub">Manage categories used to group your income and expenses.</p>
          </div>
        </div>

        <div className="cat-card">
          <div className="cat-card__header">
            <h2 className="cat-card__heading">Categories</h2>

            <div className="cat-card__header-right">
              <div className="cat-card__tabs">
                {['all', 'income', 'expense'].map((tab) => (
                  <button
                    key={tab}
                    className={`cat-card__tab${activeTab === tab ? ' cat-card__tab--active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <button className="cat-card__add-btn" onClick={openCreate}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cat-card__add-icon">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Category
              </button>
            </div>
          </div>

          <div className="cat-table-wrap">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Color</th>
                  <th className="cat-table__actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="cat-table__empty">No categories found.</td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <tr key={cat.id}>
                      <td className="cat-table__name">{cat.name}</td>
                      <td>
                        <span className={`cat-badge cat-badge--${cat.type}`}>{cat.type}</span>
                      </td>
                      <td>
                        <div className="cat-color-preview">
                          <span className="cat-color-swatch" style={{ background: cat.color }} />
                          <span className="cat-color-hex">{cat.color}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cat-table__actions">
                          <button className="cat-table__edit-btn" onClick={() => openEdit(cat)}>Edit</button>
                          {!cat.id.startsWith('default-') && (
                            <button className="cat-table__delete-btn" onClick={() => handleDelete(cat.id)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? 'Edit category' : 'Add category'}
        subtitle="Group your transactions by category."
      >
        <CategoryForm
          initial={editTarget}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  )
}

export default CategoriesPage
