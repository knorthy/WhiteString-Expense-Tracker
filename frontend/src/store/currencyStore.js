import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// conversion rates from PHP to each supported currency
const RATES_FROM_PHP = {
  PHP: 1,
  USD: 1 / 61.36,
  EUR: 1 / 69.95,
  AUD: 1 / 42.67,
}

// list of supported currencies shown in SettingsModal.jsx currency dropdown
export const CURRENCY_OPTIONS = [
  { code: 'PHP', label: '₱ Philippine Peso (PHP)', symbol: '₱' },
  { code: 'USD', label: '$ US Dollar (USD)',        symbol: '$' },
  { code: 'EUR', label: '€ Euro (EUR)',             symbol: '€' },
  { code: 'AUD', label: 'A$ Australian Dollar (AUD)', symbol: 'A$' },
]

// global currency store, persisted to localStorage as claro-currency
// used in DashboardPage.jsx, WalletsPage.jsx, TransactionsPage.jsx, Sidebar.jsx, SettingsModal.jsx
const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'PHP',

      // updates selected currency, called in SettingsModal.jsx
      setCurrency: (code) => set({ currency: code }),

      // converts a PHP amount to the selected currency
      convert: (phpAmount) => {
        const rate = RATES_FROM_PHP[get().currency] ?? 1
        return parseFloat(phpAmount) * rate
      },

      // converts and formats a PHP amount as a currency string with symbol
      // used everywhere a money value is displayed
      format: (phpAmount) => {
        const { currency, convert } = get()
        const converted = convert(phpAmount)
        const option = CURRENCY_OPTIONS.find((c) => c.code === currency)
        const symbol = option?.symbol ?? '₱'

        return `${symbol}${converted.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      },
    }),
    {
      name: 'claro-currency',
    }
  )
)

export default useCurrencyStore
