import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FaultyTerminal from '../components/FaultyTerminal'
import claroLogo from '../assets/Claro.png'
import { register } from '../api/auth'
import useAuthStore from '../store/authStore'
import './AuthPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.password !== form.password_confirmation)
      e.password_confirmation = 'Passwords do not match.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const { user, token } = await register(form)
      localStorage.setItem('claro_token', token)
      setUser(user)
      navigate('/dashboard')
    } catch (err) {
      const serverErrors = err.response?.data?.errors || {}
      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors)
      } else {
        setErrors({ general: err.response?.data?.message || 'Registration failed.' })
      }
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
            <h1 className="auth-card__title">Create account</h1>
            <p className="auth-card__subtitle">Start tracking your finances with Claro</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {errors.general && <p className="auth-form__error">{errors.general}</p>}

            <div className="auth-form__field">
              <label htmlFor="name" className="auth-form__label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className={`auth-form__input${errors.name ? ' auth-form__input--error' : ''}`}
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <span className="auth-form__field-error">{errors.name}</span>}
            </div>

            <div className="auth-form__field">
              <label htmlFor="email" className="auth-form__label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`auth-form__input${errors.email ? ' auth-form__input--error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="auth-form__field-error">{errors.email}</span>}
            </div>

            <div className="auth-form__field">
              <label htmlFor="password" className="auth-form__label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className={`auth-form__input${errors.password ? ' auth-form__input--error' : ''}`}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <span className="auth-form__field-error">{errors.password}</span>}
            </div>

            <div className="auth-form__field">
              <label htmlFor="password_confirmation" className="auth-form__label">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                className={`auth-form__input${errors.password_confirmation ? ' auth-form__input--error' : ''}`}
                placeholder="••••••••"
                value={form.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && (
                <span className="auth-form__field-error">{errors.password_confirmation}</span>
              )}
            </div>

            <button type="submit" className="auth-form__submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-card__footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-card__link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
