import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// global wallet store, persisted to localStorage as claro-wallets
// used in WalletsPage.jsx, TransactionsPage.jsx, DashboardPage.jsx, Sidebar.jsx
const useWalletStore = create(
  persist(
    (set) => ({
      wallets: [],

      // replaces entire wallet list with fresh data from API, called after getWallets
      setWallets: (wallets) => set({ wallets }),

      // appends a new wallet to the list, called after createWallet in WalletsPage.jsx
      addWallet: (wallet) =>
        set((state) => ({
          wallets: [...state.wallets, wallet],
        })),

      // updates balance of a single wallet by id, called after updateWalletBalance in WalletsPage.jsx
      updateBalance: (id, balance) =>
        set((state) => ({
          wallets: state.wallets.map((w) =>
            w.id === id ? { ...w, balance } : w
          ),
        })),

      // removes a wallet from the list by id, called after deleteWallet in WalletsPage.jsx
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
