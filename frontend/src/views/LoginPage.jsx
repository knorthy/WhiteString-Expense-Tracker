import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FaultyTerminal from '../components/FaultyTerminal'
import './AuthPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: replace with real API call when Laravel auth is ready
      // const response = await login(form.email, form.password)
      // useAuthStore.getState().setUser(response.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={0.5}
        scanlineIntensity={0.5}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        curvature={0.1}
        tint="#A7EF9E"
        mouseReact
        mouseStrength={0.5}
        pageLoadAnimation
        brightness={0.5}
      />

      <div className="auth-overlay">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">WhiteString</h1>
            <p className="auth-card__subtitle">Sign in to your account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && <p className="auth-form__error">{error}</p>}

            <div className="auth-form__field">
              <label htmlFor="email" className="auth-form__label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="auth-form__input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-form__field">
              <label htmlFor="password" className="auth-form__label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="auth-form__input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="auth-form__submit"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-card__footer">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="auth-card__link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
