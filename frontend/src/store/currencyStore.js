import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Rates: how many PHP = 1 unit of foreign currency
// Derived from: 1 USD = ₱61.36, 1 EUR = ₱69.95, 1 AUD = ₱42.67
const RATES_FROM_PHP = {
  PHP: 1,
  USD: 1 / 61.36,   // 1 PHP = 0.01630 USD
  EUR: 1 / 69.95,   // 1 PHP = 0.01430 EUR
  AUD: 1 / 42.67,   // 1 PHP = 0.02344 AUD
}

export const CURRENCY_OPTIONS = [
  { code: 'PHP', label: '₱ Philippine Peso (PHP)', symbol: '₱' },
  { code: 'USD', label: '$ US Dollar (USD)',        symbol: '$' },
  { code: 'EUR', label: '€ Euro (EUR)',             symbol: '€' },
  { code: 'AUD', label: 'A$ Australian Dollar (AUD)', symbol: 'A$' },
]

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'PHP',

      setCurrency: (code) => set({ currency: code }),

      convert: (phpAmount) => {
        const rate = RATES_FROM_PHP[get().currency] ?? 1
        return parseFloat(phpAmount) * rate
      },

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
