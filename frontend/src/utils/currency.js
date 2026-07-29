/**
 * Formats a PHP amount as a currency string.
 * Use this in non-React contexts (e.g. Chart.js callbacks)
 * where the Zustand currencyStore isn't accessible.
 *
 * For React components, use the `format` function from useCurrencyStore instead
 * so the selected currency and conversion rate are respected.
 *
 * @param {number|string} amount - The amount in PHP
 * @param {object} options
 * @param {string} options.symbol - Currency symbol (default: '₱')
 * @param {number} options.minimumFractionDigits - (default: 2)
 * @param {number} options.maximumFractionDigits - (default: 2)
 * @returns {string} e.g. "₱1,500.00"
 */
export function formatPHP(amount, { symbol = '₱', minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}) {
  const value = parseFloat(amount) || 0
  return `${symbol}${value.toLocaleString('en-PH', {
    minimumFractionDigits,
    maximumFractionDigits,
  })}`
}
