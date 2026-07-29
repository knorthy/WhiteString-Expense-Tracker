import { useEffect, useRef, useState } from 'react'
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { formatPHP } from '../utils/currency'
import './BreakdownChart.css'

Chart.register(PieController, ArcElement, Tooltip, Legend)

// Fixed colors per category so they're consistent across views
const CATEGORY_COLORS = {
  // Income
  'Salary':       '#4ade80',
  'Freelance':    '#a7ef9e',
  'Business':     '#34d399',
  'Investment':   '#6ee7b7',
  'Gift':         '#86efac',
  'Other Income': '#bbf7d0',
  // Expense
  'Food':          '#fb923c',
  'Transport':     '#60a5fa',
  'Rent':          '#f87171',
  'Utilities':     '#facc15',
  'Healthcare':    '#e879f9',
  'Shopping':      '#f472b6',
  'Entertainment': '#818cf8',
  'Education':     '#38bdf8',
  'Other Expense': '#94a3b8',
}

function getFallbackColor(index) {
  const fallbacks = ['#a7ef9e', '#60a5fa', '#f87171', '#facc15', '#e879f9', '#fb923c', '#818cf8']
  return fallbacks[index % fallbacks.length]
}

function buildPieData(transactions, type) {
  const filtered = transactions.filter((t) => t.type === type)
  const totals = {}

  filtered.forEach((t) => {
    const cat = t.category || 'Other'
    totals[cat] = (totals[cat] || 0) + (parseFloat(t.amount) || 0)
  })

  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1])

  return {
    labels: entries.map(([cat]) => cat),
    data:   entries.map(([, val]) => val),
    colors: entries.map(([cat], i) => CATEGORY_COLORS[cat] || getFallbackColor(i)),
  }
}

function BreakdownChart({ transactions = [] }) {
  const [activeType, setActiveType] = useState('expense')
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const { labels, data, colors } = buildPieData(transactions, activeType)

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    if (data.length === 0) return

    chartRef.current = new Chart(canvasRef.current, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.map((c) => c + 'cc'), // slight transparency
          borderColor: colors,
          borderWidth: 1.5,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'rgba(255,255,255,0.7)',
              font: { family: 'Poppins', size: 11 },
              boxWidth: 10,
              boxHeight: 10,
              borderRadius: 3,
              useBorderRadius: true,
              padding: 12,
            },
          },
          tooltip: {
            backgroundColor: '#1a1b1e',
            borderColor: 'rgba(167, 239, 158, 0.2)',
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: 'rgba(255,255,255,0.7)',
            padding: 12,
            cornerRadius: 8,
            titleFont: { family: 'Poppins', size: 13, weight: '600' },
            bodyFont: { family: 'Poppins', size: 12 },
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0
                return ` ${formatPHP(ctx.parsed)} (${pct}%)`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [transactions, activeType])

  const { data } = buildPieData(transactions, activeType)
  const hasData = data.length > 0

  return (
    <div className="breakdown-chart">
      {/* Toggle */}
      <div className="breakdown-chart__toggle">
        <button
          className={`breakdown-chart__btn${activeType === 'expense' ? ' breakdown-chart__btn--active' : ''}`}
          onClick={() => setActiveType('expense')}
        >
          Expense
        </button>
        <button
          className={`breakdown-chart__btn${activeType === 'income' ? ' breakdown-chart__btn--active' : ''}`}
          onClick={() => setActiveType('income')}
        >
          Income
        </button>
      </div>

      {/* Chart or empty state */}
      <div className="breakdown-chart__canvas-wrap">
        {hasData ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="breakdown-chart__empty">
            <p>No {activeType} categories found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BreakdownChart
