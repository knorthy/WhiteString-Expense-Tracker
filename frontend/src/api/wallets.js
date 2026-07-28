import client from './client'

export const getWallets = () =>
  client.get('/wallets').then((r) => r.data)

export const createWallet = (data) =>
  client.post('/wallets', data).then((r) => r.data)

export const updateWalletBalance = (id, balance) =>
  client.put(`/wallets/${id}`, { balance }).then((r) => r.data)

export const deleteWallet = (id) =>
  client.delete(`/wallets/${id}`).then((r) => r.data)
