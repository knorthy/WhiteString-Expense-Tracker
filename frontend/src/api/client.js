import axios from 'axios'

// shared axios instance used by all api files
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// runs before every request, attaches the bearer token stored after login
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('claro_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// runs after every response, redirects to login on 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('claro_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
