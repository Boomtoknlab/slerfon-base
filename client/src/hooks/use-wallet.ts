import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  userId: number | null; // Mapped from backend for simplicity in this demo
  connect: () => void;
  disconnect: () => void;
  setUserId: (id: number) => void;
}

// Mock wallet implementation
export const useWallet = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      address: null,
      userId: null,
      connect: () => {
        // Mock connection delay
        setTimeout(() => {
          set({ 
            isConnected: true, 
            address: "0x71C...9A2",
            // In a real app, we'd fetch or create the user here via API
            // For now, we assume a user ID of 1 exists (from seed)
            userId: 1 
          });
        }, 500);
      },
      disconnect: () => set({ isConnected: false, address: null, userId: null }),
      setUserId: (id) => set({ userId: id }),
    }),
    {
      name: 'slerf-wallet-storage',
    }
  )
);
