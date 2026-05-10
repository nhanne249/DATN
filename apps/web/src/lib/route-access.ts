import { getModuleKeyForPath, MODULES } from './modules';
import { UserRole } from '@/store/use-auth-store';

const FULL_ACCESS_ROLES: UserRole[] = ['admin', 'hotel_owner'];

// Always accessible regardless of modules
const ALWAYS_ALLOWED: string[] = ['/dashboard', '/dashboard/account', '/dashboard/help'];

// Only accessible to roles that can manage the property
const MANAGER_ONLY_PATHS: string[] = ['/dashboard/settings'];

export const canAccessPath = (
  role: UserRole | undefined,
  pathname: string,
  allowedModules: string[] | null = null,
): boolean => {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.includes(role)) return true;

  // hotel_manager also gets settings access
  if (
    role === 'hotel_manager' &&
    MANAGER_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  ) {
    return true;
  }

  // Always allowed paths
  if (
    ALWAYS_ALLOWED.some((p) => {
      if (p === '/dashboard') return pathname === '/dashboard';
      return pathname === p || pathname.startsWith(p + '/');
    })
  ) {
    return true;
  }

  if (allowedModules === null) return true; // full access

  const moduleKey = getModuleKeyForPath(pathname);
  if (!moduleKey) return false;
  return allowedModules.includes(moduleKey);
};

export const getDefaultPathForRole = (
  role: UserRole | undefined,
  allowedModules?: string[] | null,
): string => {
  if (!role) return '/login';
  if (FULL_ACCESS_ROLES.includes(role) || role === 'hotel_manager') return '/dashboard';
  if (!allowedModules?.length) return '/dashboard';
  const first = MODULES.find((m) => allowedModules.includes(m.key));
  return first ? first.route : '/dashboard';
};
