import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// reads avatar data URL from localStorage keyed by email so it survives logout
const getAvatarForEmail = (email) => {
  if (!email) return null
  try {
    const map = JSON.parse(localStorage.getItem('claro-avatars') || '{}')
    return map[email] ?? null
  } catch {
    return null
  }
}

// writes avatar data URL to localStorage keyed by email
const saveAvatarForEmail = (email, dataUrl) => {
  if (!email) return
  try {
    const map = JSON.parse(localStorage.getItem('claro-avatars') || '{}')
    map[email] = dataUrl
    localStorage.setItem('claro-avatars', JSON.stringify(map))
  } catch {
    // localStorage may be full if the image is too large
  }
}

// global auth store, persisted to localStorage as claro-auth
// used in LoginPage.jsx, RegisterPage.jsx, Sidebar.jsx, DashboardPage.jsx, SettingsModal.jsx, ProtectedRoute.jsx
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,

      // saves user to store, restores avatar from localStorage if not present, called after login and register
      setUser: (user) => {
        if (!user) { set({ user: null }); return }
        const avatar = user.avatar ?? getAvatarForEmail(user.email)
        set({ user: { ...user, avatar } })
      },

      // saves avatar data URL to localStorage and updates the store, called in SettingsModal.jsx
      setAvatar: (dataUrl) => {
        const { user } = get()
        if (!user) return
        saveAvatarForEmail(user.email, dataUrl)
        set({ user: { ...user, avatar: dataUrl } })
      },

      // clears user from store and removes token from localStorage, called in Sidebar.jsx on logout
      clearUser: () => {
        set({ user: null })
        localStorage.removeItem('claro_token')
      },

      // returns first name of logged in user, called in DashboardPage.jsx welcome message
      getFirstName: () => {
        const state = useAuthStore.getState()
        if (!state.user?.name) return 'there'
        return state.user.name.split(' ')[0]
      },
    }),
    {
      name: 'claro-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

export default useAuthStore
