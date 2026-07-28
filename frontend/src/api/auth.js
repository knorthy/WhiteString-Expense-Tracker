import client from './client'

export const register = (data) =>
  client.post('/register', data).then((r) => r.data)

export const login = (data) =>
  client.post('/login', data).then((r) => r.data)

export const logout = () =>
  client.post('/logout').then((r) => r.data)

export const getMe = () =>
  client.get('/user').then((r) => r.data)
