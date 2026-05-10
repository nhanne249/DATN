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
  propertyId?: string | null;
  propertyName?: string;
  propertySlug?: string;
}

const FULL_ACCESS_ROLES: UserRole[] = ['admin', 'hotel_owner'];

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
  allowedModules: string[] | null;
  setRefreshToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setSession: (refreshToken: string | null, user?: AuthUser | null) => void;
  setActivePropertyId: (id: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setAllowedModules: (modules: string[] | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      refreshToken: null,
      activePropertyId: process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || null,
      user: null,
      hasHydrated: false,
      allowedModules: null,
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUser: (user) => set({ user }),
      setSession: (refreshToken, user) => {
        const payload = decodeJwtPayload(refreshToken);
        const tokenUserId = typeof payload?.sub === 'string' ? payload.sub : '';
        const tokenRole = typeof payload?.role === 'string' ? (payload.role as UserRole) : undefined;
        const tokenPropertyId = typeof payload?.propertyId === 'string' ? payload.propertyId : null;

        const derivedUser =
          user ||
          (tokenUserId && tokenRole
            ? {
                id: tokenUserId,
                role: tokenRole,
              }
            : null);

        const activePropertyId = user?.propertyId || tokenPropertyId;

        const resolvedRole = derivedUser?.role ?? tokenRole;
        const allowedModules = resolvedRole && FULL_ACCESS_ROLES.includes(resolvedRole) ? null : undefined;

        set({
          refreshToken,
          user: derivedUser,
          ...(activePropertyId ? { activePropertyId } : {}),
          ...(allowedModules === null ? { allowedModules: null } : {}),
        });
      },
      setActivePropertyId: (id) => set({ activePropertyId: id }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setAllowedModules: (modules) => set({ allowedModules: modules }),
      logout: () =>
        set({ refreshToken: null, activePropertyId: null, user: null, allowedModules: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        activePropertyId: state.activePropertyId,
        user: state.user,
        allowedModules: state.allowedModules,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.refreshToken && !state.user) {
          state.setSession(state.refreshToken, null);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
