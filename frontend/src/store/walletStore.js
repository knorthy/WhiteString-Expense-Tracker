import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WALLET_OPTIONS } from '../constants/wallets'

const useWalletStore = create(
  persist(
    (set) => ({
      wallets: [
        { id: 1, walletId: 'gcash', name: 'GCash', type: 'E-Wallet', balance: 5200.50, logo: WALLET_OPTIONS.find(w => w.id === 'gcash')?.logo },
        { id: 2, walletId: 'bpi',   name: 'BPI',   type: 'Bank',     balance: 12000,   logo: WALLET_OPTIONS.find(w => w.id === 'bpi')?.logo },
        { id: 3, walletId: 'maya',  name: 'Maya',  type: 'E-Wallet', balance: 1500,    logo: WALLET_OPTIONS.find(w => w.id === 'maya')?.logo },
      ],

      addWallet: (wallet) =>
        set((state) => ({
          wallets: [...state.wallets, { ...wallet, id: Date.now() }],
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
      name: 'claro-wallets', // persisted in localStorage
    }
  )
)

export default useWalletStore
