import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole =
  | 'admin'
  | 'internal_user'
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

interface AuthState {
  activePropertyId: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  allowedModules: string[] | null;
  permissionsMap: Record<string, string[]>;
  /** @deprecated refreshToken is now stored in httpOnly cookie; kept only for backward-compat reads during migration */
  refreshToken?: string | null;
  setUser: (user: AuthUser | null) => void;
  setSession: (user: AuthUser | null) => void;
  setActivePropertyId: (id: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setAllowedModules: (modules: string[] | null) => void;
  setPermissionsMap: (map: Record<string, string[]>) => void;
  hasPermission: (resource: string, action: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      activePropertyId: process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || null,
      user: null,
      hasHydrated: false,
      allowedModules: null,
      permissionsMap: {},
      refreshToken: null, // kept for backward-compat — will be removed after migration
      setUser: (user) => set({ user }),
      setSession: (user) => {
        const activePropertyId = user?.propertyId || null;
        const resolvedRole = user?.role;
        const allowedModules =
          resolvedRole === 'admin' ? null : undefined;

        set({
          user,
          refreshToken: null, // clear any legacy stored token
          ...(activePropertyId ? { activePropertyId } : {}),
          ...(allowedModules === null ? { allowedModules: null } : {}),
        });
      },
      setActivePropertyId: (id) => set({ activePropertyId: id }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setAllowedModules: (modules) => set({ allowedModules: modules }),
      setPermissionsMap: (map) => set({ permissionsMap: map }),
      hasPermission: (resource, action) => {
        const state = get();
        const user = state.user;
        if (!user) return false;
        if (user.role === 'admin') return true;
        return state.permissionsMap?.[resource]?.includes(action) ?? false;
      },
      logout: () =>
        set({
          refreshToken: null,
          activePropertyId: null,
          user: null,
          allowedModules: null,
          permissionsMap: {},
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        activePropertyId: state.activePropertyId,
        user: state.user,
        allowedModules: state.allowedModules,
        permissionsMap: state.permissionsMap,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
