import { UserRole } from '@/store/use-auth-store';

const FULL_ACCESS_ROLES: UserRole[] = ['admin', 'hotel_owner', 'hotel_manager'];

const ROLE_ROUTE_PREFIXES: Record<Exclude<UserRole, 'admin' | 'hotel_owner' | 'hotel_manager'>, string[]> = {
  front_desk: [
    '/dashboard',
    '/dashboard/bookings',
    '/dashboard/calendar',
    '/dashboard/customers',
    '/dashboard/services',
    '/dashboard/reports',
    '/dashboard/account',
    '/dashboard/help',
  ],
  housekeeping: [
    '/dashboard',
    '/dashboard/calendar',
    '/dashboard/calendar/housekeeping',
    '/dashboard/tasks',
    '/dashboard/help',
  ],
  maintenance: ['/dashboard', '/dashboard/tasks', '/dashboard/help'],
  laundry: ['/dashboard', '/dashboard/tasks', '/dashboard/help'],
  warehouse: [
    '/dashboard',
    '/dashboard/services',
    '/dashboard/finance/expenses',
    '/dashboard/help',
  ],
  customer: ['/dashboard/account', '/dashboard/help'],
};

type LimitedRole = keyof typeof ROLE_ROUTE_PREFIXES;

const isLimitedRole = (role: UserRole): role is LimitedRole => {
  return role in ROLE_ROUTE_PREFIXES;
};

export const canAccessPath = (role: UserRole | undefined, pathname: string): boolean => {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.includes(role)) return true;
  if (!isLimitedRole(role)) return false;

  const prefixes = ROLE_ROUTE_PREFIXES[role];

  return prefixes.some((prefix: string) => {
    if (prefix === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
};

export const getDefaultPathForRole = (role: UserRole | undefined): string => {
  if (!role) return '/login';
  if (FULL_ACCESS_ROLES.includes(role)) return '/dashboard';
  if (!isLimitedRole(role)) return '/dashboard';

  const prefixes = ROLE_ROUTE_PREFIXES[role];
  if (!prefixes?.length) return '/dashboard';
  return prefixes[0];
};
