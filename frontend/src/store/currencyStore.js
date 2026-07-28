import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Exchange rates relative to PHP (Philippine Peso as base)
// These are approximate fixed rates — swap for a live API if needed
const RATES_FROM_PHP = {
  PHP: 1,
  USD: 0.01748,   // 1 PHP = ~0.0175 USD
  EUR: 0.01607,   // 1 PHP = ~0.0161 EUR
  GBP: 0.01378,   // 1 PHP = ~0.0138 GBP
  JPY: 2.7130,    // 1 PHP = ~2.71 JPY
  SGD: 0.02349,   // 1 PHP = ~0.0235 SGD
  AUD: 0.02717,   // 1 PHP = ~0.0272 AUD
}

export const CURRENCY_OPTIONS = [
  { code: 'PHP', label: '₱ Philippine Peso (PHP)',  symbol: '₱' },
  { code: 'USD', label: '$ US Dollar (USD)',         symbol: '$' },
  { code: 'EUR', label: '€ Euro (EUR)',              symbol: '€' },
  { code: 'GBP', label: '£ British Pound (GBP)',     symbol: '£' },
  { code: 'JPY', label: '¥ Japanese Yen (JPY)',      symbol: '¥' },
  { code: 'SGD', label: 'S$ Singapore Dollar (SGD)', symbol: 'S$' },
  { code: 'AUD', label: 'A$ Australian Dollar (AUD)',symbol: 'A$' },
]

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'PHP', // default

      setCurrency: (code) => set({ currency: code }),

      // Convert a PHP-based amount to the current display currency
      convert: (phpAmount) => {
        const rate = RATES_FROM_PHP[get().currency] ?? 1
        return parseFloat(phpAmount) * rate
      },

      // Format a PHP-based amount as a display string in the current currency
      format: (phpAmount) => {
        const { currency, convert } = get()
        const converted = convert(phpAmount)
        const option = CURRENCY_OPTIONS.find((c) => c.code === currency)
        const symbol = option?.symbol ?? '₱'

        // JPY has no decimal places
        const decimals = currency === 'JPY' ? 0 : 2

        return `${symbol}${converted.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`
      },
    }),
    {
      name: 'claro-currency',
    }
  )
)

export default useCurrencyStore
