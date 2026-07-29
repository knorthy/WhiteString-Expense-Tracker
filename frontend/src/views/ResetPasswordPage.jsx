import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import FaultyTerminal from '../components/FaultyTerminal'
import claroLogo from '../assets/Claro.png'
import { resetPassword } from '../api/auth'
import './AuthPage.css'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const emailFromUrl = searchParams.get('email') || ''

  const [form, setForm] = useState({
    email: emailFromUrl,
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.password !== form.password_confirmation)
      e.password_confirmation = 'Passwords do not match.'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      await resetPassword({ ...form, token })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired reset link.'
      setErrors({ general: msg })
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
            <Link to="/">
              <img src={claroLogo} alt="Claro" className="auth-card__logo" />
            </Link>
            <h1 className="auth-card__title">
              {done ? 'Password reset!' : 'Set new password'}
            </h1>
            <p className="auth-card__subtitle">
              {done
                ? 'Redirecting you to login…'
                : 'Enter your new password below.'}
            </p>
          </div>

          {!done && (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {errors.general && <p className="auth-form__error">{errors.general}</p>}

              {/* Email (pre-filled from URL, editable if missing) */}
              <div className="auth-form__field">
                <label htmlFor="reset-email" className="auth-form__label">Email</label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <span className="auth-form__field-error">{errors.email}</span>}
              </div>

              <div className="auth-form__field">
                <label htmlFor="reset-password" className="auth-form__label">New Password</label>
                <input
                  id="reset-password"
                  name="password"
                  type="password"
                  className={`auth-form__input${errors.password ? ' auth-form__input--error' : ''}`}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.password && <span className="auth-form__field-error">{errors.password}</span>}
              </div>

              <div className="auth-form__field">
                <label htmlFor="reset-confirm" className="auth-form__label">Confirm Password</label>
                <input
                  id="reset-confirm"
                  name="password_confirmation"
                  type="password"
                  className={`auth-form__input${errors.password_confirmation ? ' auth-form__input--error' : ''}`}
                  placeholder="••••••••"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.password_confirmation && (
                  <span className="auth-form__field-error">{errors.password_confirmation}</span>
                )}
              </div>

              <button type="submit" className="auth-form__submit" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="auth-card__footer">
            Remember it?{' '}
            <Link to="/login" className="auth-card__link">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
