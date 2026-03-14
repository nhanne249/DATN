import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  refreshToken: string | null;
  activePropertyId: string | null;
  setRefreshToken: (token: string | null) => void;
  setActivePropertyId: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      refreshToken: null,
      activePropertyId: process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || null,
      setRefreshToken: (token) => set({ refreshToken: token }),
      setActivePropertyId: (id) => set({ activePropertyId: id }),
      logout: () => set({ refreshToken: null, activePropertyId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
