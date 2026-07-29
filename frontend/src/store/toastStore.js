import { create } from 'zustand'

const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ message, type = 'success', duration = 3500 }) => {
    const id = Date.now() + Math.random()

    set((state) => {
      // Don't add if the same message is already showing
      const alreadyShowing = state.toasts.some((t) => t.message === message && t.type === type)
      if (alreadyShowing) return state

      // Keep max 2 toasts — remove oldest if at limit
      const current = state.toasts.length >= 2
        ? state.toasts.slice(1)
        : state.toasts

      return { toasts: [...current, { id, message, type }] }
    })

    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, duration)
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// Convenience helpers — call these anywhere without needing the hook
export const toast = {
  success: (message) => useToastStore.getState().addToast({ message, type: 'success' }),
  error:   (message) => useToastStore.getState().addToast({ message, type: 'error' }),
  info:    (message) => useToastStore.getState().addToast({ message, type: 'info' }),
}

export default useToastStore
