import client from './client'

// GET /api/wallets, reads wallets table for the logged in user, used in WalletsPage.jsx, DashboardPage.jsx, Sidebar.jsx, TransactionsPage.jsx
export const getWallets = () =>
  client.get('/wallets').then((r) => r.data)

// POST to /api/wallets, inserts row into wallets table, used in WalletsPage.jsx
export const createWallet = (data) =>
  client.post('/wallets', data).then((r) => r.data)

// PUT to /api/wallets/:id, updates balance column in wallets table, used in WalletsPage.jsx
export const updateWalletBalance = (id, balance) =>
  client.put(`/wallets/${id}`, { balance }).then((r) => r.data)

// DELETE /api/wallets/:id, removes row from wallets table, used in WalletsPage.jsx
export const deleteWallet = (id) =>
  client.delete(`/wallets/${id}`).then((r) => r.data)
