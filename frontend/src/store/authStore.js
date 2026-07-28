import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, email }

      setUser: (user) => set({ user }),

      clearUser: () => {
        set({ user: null })
        localStorage.removeItem('claro_token')
      },

      // Helper — returns just the first name
      getFirstName: () => {
        const state = useAuthStore.getState()
        if (!state.user?.name) return 'there'
        return state.user.name.split(' ')[0]
      },
    }),
    {
      name: 'claro-auth', // key in localStorage
      partialize: (state) => ({ user: state.user }), // only persist user
    }
  )
)

export default useAuthStore
