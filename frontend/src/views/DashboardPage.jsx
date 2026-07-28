import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import useAuthStore from '../store/authStore'
import './DashboardPage.css'

function SummaryCard({ label, value, type, icon }) {
  return (
    <div className={`summary-card summary-card--${type}`}>
      <div className="summary-card__header">
        <span className="summary-card__label">{label}</span>
        <span className="summary-card__icon">{icon}</span>
      </div>
      <p className="summary-card__value">{value}</p>
    </div>
  )
}

function DashboardPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const firstName = useAuthStore((state) =>
    state.user?.name ? state.user.name.split(' ')[0] : 'there'
  )

  const handleApply = () => {
    console.log('Filter:', dateFrom, dateTo)
  }

  const handleClear = () => {
    setDateFrom('')
    setDateTo('')
  }

  return (
    <>
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-header__title">Dashboard</h1>
            </div>
          </div>

          {/* Welcome */}
          <div className="dashboard-welcome">
            <h2 className="dashboard-welcome__title">Welcome back, {firstName}!</h2>
            <p className="dashboard-welcome__sub">
              Here&apos;s an overview of your finances. Use the date range to focus your reporting.
            </p>
          </div>

          {/* Date Range Filter */}
          <div className="date-filter">
            <p className="date-filter__label">Date Range</p>
            <div className="date-filter__row">
              <div className="date-filter__field">
                <label className="date-filter__field-label">From</label>
                <div className="date-filter__input-wrap">
                  <svg className="date-filter__cal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <input
                    type="date"
                    className="date-filter__input"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
              </div>

              <div className="date-filter__field">
                <label className="date-filter__field-label">To</label>
                <div className="date-filter__input-wrap">
                  <svg className="date-filter__cal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <input
                    type="date"
                    className="date-filter__input"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="date-filter__actions">
                <button className="date-filter__apply" onClick={handleApply}>Apply</button>
                <button className="date-filter__clear" onClick={handleClear}>Clear</button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <SummaryCard
              label="Current Balance"
              value="₱0.00"
              type="balance"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              }
            />
            <SummaryCard
              label="Total Income"
              value="₱0.00"
              type="income"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
              }
            />
            <SummaryCard
              label="Total Expenses"
              value="₱0.00"
              type="expense"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 18l-9.5-9.5-5 5L1 6" />
                  <path d="M17 18h6v-6" />
                </svg>
              }
            />
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-card chart-card--wide">
              <h3 className="chart-card__title">Income &amp; Expenses</h3>
              <p className="chart-card__sub">Historical overview of your financial activity</p>
              <div className="chart-card__empty">
                <p>No data yet. Add a transaction to get started.</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card__top-row">
                <div>
                  <h3 className="chart-card__title">Breakdown</h3>
                  <p className="chart-card__sub">By category color</p>
                </div>
                <div className="chart-card__toggle">
                  <button className="chart-card__toggle-btn chart-card__toggle-btn--active">Expense</button>
                  <button className="chart-card__toggle-btn">Income</button>
                </div>
              </div>
              <div className="chart-card__empty">
                <p>No expense categories found.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default DashboardPage
