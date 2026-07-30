import client from './client'

// POST to /api/register, inserts new user into users table, used in RegisterPage.jsx
export const register = (data) =>
  client.post('/register', data).then((r) => r.data)

// POST to /api/login, reads users table, returns token, used in LoginPage.jsx
export const login = (data) =>
  client.post('/login', data).then((r) => r.data)

// POST to /api/logout, deletes current token from personal_access_tokens table, used in Sidebar.jsx
export const logout = () =>
  client.post('/logout').then((r) => r.data)

// GET /api/user, reads logged in user from users table, used to rehydrate auth state
export const getMe = () =>
  client.get('/user').then((r) => r.data)

// POST to /api/forgot-password, inserts OTP into password_reset_codes table, used in LoginPage.jsx
export const forgotPassword = (email) =>
  client.post('/forgot-password', { email }).then((r) => r.data)

// POST to /api/verify-reset-code, reads password_reset_codes table to validate OTP, used in LoginPage.jsx
export const verifyResetCode = (email, code) =>
  client.post('/verify-reset-code', { email, code }).then((r) => r.data)

// POST to /api/reset-password, updates password in users table, deletes OTP row, used in LoginPage.jsx and ResetPasswordPage.jsx
export const resetPassword = (data) =>
  client.post('/reset-password', data).then((r) => r.data)
