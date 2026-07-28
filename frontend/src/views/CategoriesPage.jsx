import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import CategoryForm from '../components/CategoryForm'
import './CategoriesPage.css'

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Salary',        type: 'income',  color: '#4ade80' },
  { id: 2, name: 'Freelance',     type: 'income',  color: '#a7ef9e' },
  { id: 3, name: 'Food',          type: 'expense', color: '#fb923c' },
  { id: 4, name: 'Transport',     type: 'expense', color: '#60a5fa' },
  { id: 5, name: 'Rent',          type: 'expense', color: '#f87171' },
  { id: 6, name: 'Utilities',     type: 'expense', color: '#facc15' },
  { id: 7, name: 'Healthcare',    type: 'expense', color: '#e879f9' },
  { id: 8, name: 'Shopping',      type: 'expense', color: '#f472b6' },
  { id: 9, name: 'Entertainment', type: 'expense', color: '#818cf8' },
  { id: 10, name: 'Education',    type: 'expense', color: '#38bdf8' },
]

function CategoriesPage() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const openCreate = () => {
    setEditTarget(null)
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    try {
      if (editTarget) {
        // TODO: PUT /api/categories/:id
        setCategories((prev) =>
          prev.map((c) => (c.id === editTarget.id ? { ...c, ...formData } : c))
        )
      } else {
        // TODO: POST /api/categories
        setCategories((prev) => [
          ...prev,
          { ...formData, id: Date.now() },
        ])
      }
      closeModal()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (id) => {
    // TODO: DELETE /api/categories/:id
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="cat-layout">
      <Sidebar />

      <main className="cat-main">
        {/* Page Header */}
        <div className="cat-page-header">
          <div>
            <h1 className="cat-page-title">Categories</h1>
            <p className="cat-page-sub">Manage categories used to group your income and expenses.</p>
          </div>
        </div>

        {/* Table Card */}
        <div className="cat-card">
          <div className="cat-card__header">
            <h2 className="cat-card__heading">Categories</h2>
            <button className="cat-card__add-btn" onClick={openCreate}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cat-card__add-icon">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Category
            </button>
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
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="cat-table__empty">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="cat-table__name">{cat.name}</td>
                      <td>
                        <span className={`cat-badge cat-badge--${cat.type}`}>
                          {cat.type}
                        </span>
                      </td>
                      <td>
                        <div className="cat-color-preview">
                          <span
                            className="cat-color-swatch"
                            style={{ background: cat.color }}
                          />
                          <span className="cat-color-hex">{cat.color}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cat-table__actions">
                          <button className="cat-table__edit-btn" onClick={() => openEdit(cat)}>
                            Edit
                          </button>
                          <button className="cat-table__delete-btn" onClick={() => handleDelete(cat.id)}>
                            Delete
                          </button>
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

      {/* Reusable Modal */}
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
