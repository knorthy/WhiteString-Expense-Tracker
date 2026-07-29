import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Avatar is stored separately keyed by email so it survives logout
const AVATAR_KEY = 'claro-avatars'

const getAvatarForEmail = (email) => {
  if (!email) return null
  try {
    const map = JSON.parse(localStorage.getItem(AVATAR_KEY) || '{}')
    return map[email] ?? null
  } catch {
    return null
  }
}

const saveAvatarForEmail = (email, dataUrl) => {
  if (!email) return
  try {
    const map = JSON.parse(localStorage.getItem(AVATAR_KEY) || '{}')
    map[email] = dataUrl
    localStorage.setItem(AVATAR_KEY, JSON.stringify(map))
  } catch {
    // localStorage may be full if the image is too large
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { id, name, email }

      setUser: (user) => {
        if (!user) { set({ user: null }); return }
        // Restore avatar from persistent storage if not already on user
        const avatar = user.avatar ?? getAvatarForEmail(user.email)
        set({ user: { ...user, avatar } })
      },

      setAvatar: (dataUrl) => {
        const { user } = get()
        if (!user) return
        saveAvatarForEmail(user.email, dataUrl)
        set({ user: { ...user, avatar: dataUrl } })
      },

      clearUser: () => {
        // Keep avatar in localStorage — only clear auth
        set({ user: null })
        localStorage.removeItem('claro_token')
      },

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
