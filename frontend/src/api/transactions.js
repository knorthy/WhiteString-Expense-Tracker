import client from './client'

// GET /api/transactions, reads transactions table with optional filters, used in TransactionsPage.jsx, DashboardPage.jsx, WalletsPage.jsx, SettingsModal.jsx
export const getTransactions = (filters = {}) =>
  client.get('/transactions', { params: filters }).then((r) => r.data)

// GET /api/transactions/:id, reads single row from transactions table, not currently called in views
export const getTransaction = (id) =>
  client.get(`/transactions/${id}`).then((r) => r.data)

// POST to /api/transactions, inserts row into transactions table and adjusts wallet balance, used in TransactionsPage.jsx
export const createTransaction = (data) =>
  client.post('/transactions', data).then((r) => r.data)

// PUT to /api/transactions/:id, updates row in transactions table and recalculates wallet balance, used in TransactionsPage.jsx
export const updateTransaction = (id, data) =>
  client.put(`/transactions/${id}`, data).then((r) => r.data)

// DELETE /api/transactions/:id, removes row from transactions table and reverses wallet balance, used in TransactionsPage.jsx
export const deleteTransaction = (id) =>
  client.delete(`/transactions/${id}`).then((r) => r.data)

// GET /api/transactions/summary, reads transactions table and returns totals grouped by type, used in DashboardPage.jsx
export const getSummary = (filters = {}) =>
  client.get('/transactions/summary', { params: filters }).then((r) => r.data)

// GET /api/categories, reads distinct category values from transactions table, used in SettingsModal.jsx
export const getCategories = (type) =>
  client.get('/categories', { params: type ? { type } : {} }).then((r) => r.data)
