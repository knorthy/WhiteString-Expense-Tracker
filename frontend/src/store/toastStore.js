import { create } from 'zustand'

// global toast store, not persisted
// used across all pages and components via the toast helper below
const useToastStore = create((set) => ({
  toasts: [],

  // adds a toast to the list, max 2 at a time, auto removes after duration
  // called via toast.success / toast.error / toast.info helpers
  addToast: ({ message, type = 'success', duration = 3500 }) => {
    const id = Date.now() + Math.random()

    set((state) => {
      // skip if same message and type is already showing
      const alreadyShowing = state.toasts.some((t) => t.message === message && t.type === type)
      if (alreadyShowing) return state

      // drop oldest if already at limit of 2
      const current = state.toasts.length >= 2
        ? state.toasts.slice(1)
        : state.toasts

      return { toasts: [...current, { id, message, type }] }
    })

    // auto remove after duration ms
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, duration)
  },

  // removes a single toast by id, called by the X button in ToastContainer.jsx
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// shorthand helpers used directly in any file without needing the hook
// toast.success used in RegisterPage.jsx, LoginPage.jsx, WalletsPage.jsx, TransactionsPage.jsx, SettingsModal.jsx, CategoriesPage.jsx
// toast.error used in WalletsPage.jsx, TransactionsPage.jsx, SettingsModal.jsx
// toast.info used in SettingsModal.jsx, LoginPage.jsx
export const toast = {
  success: (message) => useToastStore.getState().addToast({ message, type: 'success' }),
  error:   (message) => useToastStore.getState().addToast({ message, type: 'error' }),
  info:    (message) => useToastStore.getState().addToast({ message, type: 'info' }),
}

export default useToastStore
