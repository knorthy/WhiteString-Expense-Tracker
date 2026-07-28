import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import './CategoriesPage.css'

const INCOME_CATEGORIES = [
  { name: 'Salary',       type: 'income',  color: '#4ade80' },
  { name: 'Freelance',    type: 'income',  color: '#a7ef9e' },
  { name: 'Business',     type: 'income',  color: '#34d399' },
  { name: 'Investment',   type: 'income',  color: '#6ee7b7' },
  { name: 'Gift',         type: 'income',  color: '#86efac' },
  { name: 'Other Income', type: 'income',  color: '#bbf7d0' },
]

const EXPENSE_CATEGORIES = [
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

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'income' | 'expense'

  const filtered = ALL_CATEGORIES.filter((c) => {
    if (activeTab === 'all') return true
    return c.type === activeTab
  })

  return (
    <div className="cat-layout">
      <Sidebar />

      <main className="cat-main">
        {/* Page Header */}
        <div className="cat-page-header">
          <div>
            <h1 className="cat-page-title">Categories</h1>
            <p className="cat-page-sub">Default categories used to group your income and expenses.</p>
          </div>
        </div>

        {/* Table Card */}
        <div className="cat-card">
          <div className="cat-card__header">
            <h2 className="cat-card__heading">Categories</h2>
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
          </div>

          <div className="cat-table-wrap">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Color</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.name}>
                    <td className="cat-table__name">{cat.name}</td>
                    <td>
                      <span className={`cat-badge cat-badge--${cat.type}`}>
                        {cat.type}
                      </span>
                    </td>
                    <td>
                      <div className="cat-color-preview">
                        <span className="cat-color-swatch" style={{ background: cat.color }} />
                        <span className="cat-color-hex">{cat.color}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CategoriesPage
