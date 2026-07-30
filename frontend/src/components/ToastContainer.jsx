import useToastStore from '../store/toastStore'
import './ToastContainer.css'

// maps toast type to border color, icon background, svg icon, and title label
const CONFIG = {
  success: {
    borderColor: '#22c55e',
    iconBg: '#22c55e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    title: 'Success',
  },
  error: {
    borderColor: '#f59e0b',
    iconBg: '#f59e0b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
        <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Error',
  },
  info: {
    borderColor: '#3b82f6',
    iconBg: '#3b82f6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" />
        <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Info',
  },
}

// single toast item, reads removeToast from toastStore to handle the X button
function Toast({ id, message, type }) {
  const removeToast = useToastStore((state) => state.removeToast)
  const cfg = CONFIG[type] || CONFIG.info

  return (
    <div className="toast" style={{ borderLeftColor: cfg.borderColor }} role="alert">
      <div className="toast__icon-circle" style={{ background: cfg.iconBg }}>
        {cfg.icon}
      </div>
      <div className="toast__body">
        <p className="toast__title">{cfg.title}</p>
        <p className="toast__message">{message}</p>
      </div>
      {/* X button calls removeToast to dismiss early */}
      <button className="toast__close" onClick={() => removeToast(id)} aria-label="Dismiss">
        ×
      </button>
    </div>
  )
}

// renders all active toasts from toastStore, mounted once in App.jsx
function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  )
}

export default ToastContainer
