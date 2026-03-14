import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole =
  | 'admin'
  | 'hotel_owner'
  | 'hotel_manager'
  | 'front_desk'
  | 'housekeeping'
  | 'maintenance'
  | 'laundry'
  | 'warehouse'
  | 'customer';

export interface AuthUser {
  id: string;
  role: UserRole;
  name?: string;
  phone?: string;
}

const decodeJwtPayload = (token: string | null): Record<string, unknown> | null => {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

    if (typeof window === 'undefined' || typeof window.atob !== 'function') {
      return null;
    }

    return JSON.parse(window.atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

interface AuthState {
  refreshToken: string | null;
  activePropertyId: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setSession: (refreshToken: string | null, user?: AuthUser | null) => void;
  setActivePropertyId: (id: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      refreshToken: null,
      activePropertyId: process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || null,
      user: null,
      hasHydrated: false,
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUser: (user) => set({ user }),
      setSession: (refreshToken, user) => {
        const payload = decodeJwtPayload(refreshToken);
        const tokenUserId = typeof payload?.sub === 'string' ? payload.sub : '';
        const tokenRole = typeof payload?.role === 'string' ? (payload.role as UserRole) : undefined;

        const derivedUser =
          user ||
          (tokenUserId && tokenRole
            ? {
                id: tokenUserId,
                role: tokenRole,
              }
            : null);

        set({
          refreshToken,
          user: derivedUser,
        });
      },
      setActivePropertyId: (id) => set({ activePropertyId: id }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      logout: () => set({ refreshToken: null, activePropertyId: null, user: null }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.refreshToken && !state.user) {
          state.setSession(state.refreshToken, null);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
