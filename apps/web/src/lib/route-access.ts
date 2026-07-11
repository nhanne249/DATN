import { getModuleKeyForPath, MODULES } from './modules';
import { UserRole } from '@/store/use-auth-store';

const FULL_ACCESS_ROLES: UserRole[] = ['admin'];

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

  // Let internal_user access settings subpaths if they have users or permissions permission
  if (role === 'internal_user' && pathname.startsWith('/dashboard/settings')) {
    if (pathname.startsWith('/dashboard/settings/users')) {
      return allowedModules ? allowedModules.includes('users') : true;
    }
    if (pathname.startsWith('/dashboard/settings/permissions')) {
      return allowedModules ? allowedModules.includes('permissions') : true;
    }
    // Allow general settings if they have either user or permission management access
    return allowedModules ? (allowedModules.includes('users') || allowedModules.includes('permissions')) : true;
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
  if (FULL_ACCESS_ROLES.includes(role)) return '/dashboard';
  if (!allowedModules?.length) return '/dashboard';
  const first = MODULES.find((m) => allowedModules.includes(m.key));
  return first ? first.route : '/dashboard';
};
