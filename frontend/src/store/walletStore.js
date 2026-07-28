import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWalletStore = create(
  persist(
    (set) => ({
      wallets: [],

      // Replace entire wallet list (from API response)
      setWallets: (wallets) => set({ wallets }),

      addWallet: (wallet) =>
        set((state) => ({
          wallets: [...state.wallets, wallet],
        })),

      updateBalance: (id, balance) =>
        set((state) => ({
          wallets: state.wallets.map((w) =>
            w.id === id ? { ...w, balance } : w
          ),
        })),

      removeWallet: (id) =>
        set((state) => ({
          wallets: state.wallets.filter((w) => w.id !== id),
        })),
    }),
    {
      name: 'claro-wallets',
    }
  )
)

export default useWalletStore
