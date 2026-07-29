import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import FaultyTerminal from '../components/FaultyTerminal'
import claroLogo from '../assets/Claro.png'
import { login, forgotPassword, verifyResetCode, resetPassword } from '../api/auth'
import useAuthStore from '../store/authStore'
import { toast } from '../store/toastStore'
import './AuthPage.css'

// ── Forgot Password Modal (2-step OTP) ────────────────────
function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState('email') // 'email' | 'code' | 'done'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeStatus, setCodeStatus] = useState('idle') // 'idle' | 'checking' | 'valid' | 'invalid'
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 — request OTP
  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setLoading(true)
    setError('')
    try {
      await forgotPassword(email)
      setStep('code')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — verify OTP + set new password
  const handleReset = async (e) => {
    e.preventDefault()
    if (code.length !== 6) { setError('Enter the 6-digit code from your email.'); return }
    if (codeStatus === 'invalid') { setError('Invalid or expired code. Please check and try again.'); return }
    if (codeStatus !== 'valid') { setError('Please wait for code verification.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== passwordConfirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      await resetPassword({
        email,
        code,
        password,
        password_confirmation: passwordConfirm,
      })
      setStep('done')
      toast.success('Password reset successfully. You can now sign in.')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.')
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

        {/* Done */}
        {step === 'done' && (
          <div className="forgot-modal__success">
            <div className="forgot-modal__success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="forgot-modal__title">Password reset!</h3>
            <p className="forgot-modal__text">Your password has been updated. You can now sign in with your new password.</p>
            <button className="forgot-modal__btn" onClick={onClose}>Back to Sign In</button>
          </div>
        )}

        {/* Step 1 — Email */}
        {step === 'email' && (
          <>
            <h3 className="forgot-modal__title">Forgot password?</h3>
            <p className="forgot-modal__text">
              Enter your email and we&apos;ll send a 6-digit reset code.
            </p>
            <form onSubmit={handleSendCode} noValidate>
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
                {loading ? 'Sending…' : 'Send Code'}
              </button>
            </form>
          </>
        )}

        {/* Step 2 — OTP + new password */}
        {step === 'code' && (
          <>
            <h3 className="forgot-modal__title">Enter reset code</h3>
            <p className="forgot-modal__text">
              We sent a 6-digit code to <strong>{email}</strong>. Check your Mailtrap inbox and enter it below.
            </p>
            <form onSubmit={handleReset} noValidate>
              <div className="forgot-modal__field">
                <label className="forgot-modal__label">6-digit code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`forgot-modal__input forgot-modal__input--otp${
                    codeStatus === 'invalid' ? ' forgot-modal__input--error'
                    : codeStatus === 'valid' ? ' forgot-modal__input--valid'
                    : ''
                  }`}
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={async (e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setCode(val)
                    setError('')
                    if (val.length === 6) {
                      setCodeStatus('checking')
                      try {
                        await verifyResetCode(email, val)
                        setCodeStatus('valid')
                      } catch {
                        setCodeStatus('invalid')
                        setError('Invalid or expired code. Please try again.')
                      }
                    } else {
                      setCodeStatus('idle')
                    }
                  }}
                  autoFocus
                />
                {codeStatus === 'checking' && <span className="forgot-modal__code-hint">Checking…</span>}
                {codeStatus === 'valid' && <span className="forgot-modal__code-hint forgot-modal__code-hint--valid">✓ Code verified</span>}
                {error && codeStatus === 'invalid' && <span className="forgot-modal__error">{error}</span>}
              </div>
              <div className="forgot-modal__field">
                <label className="forgot-modal__label">New password</label>
                <input
                  type="password"
                  className="forgot-modal__input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  autoComplete="new-password"
                />
              </div>
              <div className="forgot-modal__field">
                <label className="forgot-modal__label">Confirm password</label>
                <input
                  type="password"
                  className="forgot-modal__input"
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => { setPasswordConfirm(e.target.value); setError('') }}
                  autoComplete="new-password"
                />
              </div>
              {error && codeStatus !== 'invalid' && <p className="forgot-modal__error" style={{ marginBottom: 12 }}>{error}</p>}
              <button type="submit" className="forgot-modal__btn" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
              <button
                type="button"
                className="forgot-modal__back"
                onClick={() => { setStep('email'); setError('') }}
              >
                ← Use a different email
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
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  if (user && localStorage.getItem('claro_token')) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { user: loggedInUser, token } = await login(form)
      localStorage.setItem('claro_token', token)
      setUser(loggedInUser)
      toast.success(`Welcome back, ${loggedInUser.name.split(' ')[0]}!`)
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
