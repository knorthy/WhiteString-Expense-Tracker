import client from './client'

export const getTransactions = (filters = {}) =>
  client.get('/transactions', { params: filters }).then((r) => r.data)

export const getTransaction = (id) =>
  client.get(`/transactions/${id}`).then((r) => r.data)

export const createTransaction = (data) =>
  client.post('/transactions', data).then((r) => r.data)

export const updateTransaction = (id, data) =>
  client.put(`/transactions/${id}`, data).then((r) => r.data)

export const deleteTransaction = (id) =>
  client.delete(`/transactions/${id}`).then((r) => r.data)

export const getSummary = (filters = {}) =>
  client.get('/transactions/summary', { params: filters }).then((r) => r.data)

export const getCategories = (type) =>
  client.get('/categories', { params: type ? { type } : {} }).then((r) => r.data)
