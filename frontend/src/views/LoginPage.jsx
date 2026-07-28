import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FaultyTerminal from '../components/FaultyTerminal'
import claroLogo from '../assets/Claro.png'
import { login, forgotPassword } from '../api/auth'
import useAuthStore from '../store/authStore'
import './AuthPage.css'

// ── Forgot Password Modal ─────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-backdrop" onClick={onClose}>
      <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
        <button className="forgot-modal__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {sent ? (
          <div className="forgot-modal__success">
            <div className="forgot-modal__success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16l.19.92z" />
              </svg>
            </div>
            <h3 className="forgot-modal__title">Check your email</h3>
            <p className="forgot-modal__text">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. Check your inbox.
            </p>
            <button className="forgot-modal__btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <h3 className="forgot-modal__title">Reset your password</h3>
            <p className="forgot-modal__text">
              Enter the email address linked to your account and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="forgot-modal__field">
                <label className="forgot-modal__label" htmlFor="forgot-email">Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  className={`forgot-modal__input${error ? ' forgot-modal__input--error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  autoComplete="email"
                  autoFocus
                />
                {error && <span className="forgot-modal__error">{error}</span>}
              </div>

              <button type="submit" className="forgot-modal__btn" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ── Login Page ────────────────────────────────────────────
function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { user, token } = await login(form)
      localStorage.setItem('claro_token', token)
      setUser(user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
              <Link to="/">
                <img src={claroLogo} alt="Claro" className="auth-card__logo" />
              </Link>
              <h1 className="auth-card__title">Welcome back</h1>
              <p className="auth-card__subtitle">Sign in to your Claro account</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {error && <p className="auth-form__error">{error}</p>}

              <div className="auth-form__field">
                <label htmlFor="email" className="auth-form__label">Email</label>
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
                <div className="auth-form__label-row">
                  <label htmlFor="password" className="auth-form__label">Password</label>
                  <button
                    type="button"
                    className="auth-form__forgot-link"
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot password?
                  </button>
                </div>
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

              <button type="submit" className="auth-form__submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="auth-card__footer">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="auth-card__link">Create one</Link>
            </p>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  )
}

export default LoginPage
