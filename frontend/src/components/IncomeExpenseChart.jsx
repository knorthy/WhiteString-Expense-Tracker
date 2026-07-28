import { useEffect, useRef } from 'react'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import './IncomeExpenseChart.css'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

/**
 * Groups transactions by month and returns labels + income/expense totals.
 * Shows the last 6 months.
 */
function buildChartData(transactions) {
  const now = new Date()
  const months = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      income: 0,
      expense: 0,
    })
  }

  transactions.forEach((t) => {
    const month = t.date?.slice(0, 7) // "YYYY-MM"
    const bucket = months.find((m) => m.key === month)
    if (!bucket) return
    if (t.type === 'income') bucket.income += parseFloat(t.amount) || 0
    else bucket.expense += parseFloat(t.amount) || 0
  })

  return {
    labels: months.map((m) => m.label),
    income: months.map((m) => m.income),
    expense: months.map((m) => m.expense),
  }
}

function IncomeExpenseChart({ transactions = [] }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const { labels, income, expense } = buildChartData(transactions)

    // Destroy previous instance before re-creating
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: income,
            backgroundColor: 'rgba(74, 222, 128, 0.7)',
            borderColor: 'rgba(74, 222, 128, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Expenses',
            data: expense,
            backgroundColor: 'rgba(248, 113, 113, 0.7)',
            borderColor: 'rgba(248, 113, 113, 1)',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: 'rgba(255,255,255,0.7)',
              font: { family: 'Poppins', size: 12 },
              boxWidth: 12,
              boxHeight: 12,
              borderRadius: 3,
              useBorderRadius: true,
              padding: 16,
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
              label: (ctx) =>
                ` ${ctx.dataset.label}: ₱${ctx.parsed.y.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: 'rgba(255,255,255,0.5)',
              font: { family: 'Poppins', size: 12 },
            },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: 'rgba(255,255,255,0.5)',
              font: { family: 'Poppins', size: 12 },
              callback: (v) => `₱${v.toLocaleString('en-PH')}`,
            },
            beginAtZero: true,
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
  }, [transactions])

  return (
    <div className="income-expense-chart">
      {transactions.length === 0 ? (
        <div className="income-expense-chart__empty">
          <p>No data yet. Add a transaction to get started.</p>
        </div>
      ) : (
        <canvas ref={canvasRef} />
      )}
    </div>
  )
}

export default IncomeExpenseChart
