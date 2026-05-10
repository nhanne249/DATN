export const ALL_MODULE_KEYS = [
  'calendar', 'bookings', 'tasks', 'channel_manager', 'finance', 'reports',
  'services', 'minibar', 'laundry', 'inventory', 'rentals', 'rooms',
  'customers', 'website', 'invoices', 'e_invoices',
] as const;

export type ModuleKey = typeof ALL_MODULE_KEYS[number];

export const CONFIGURABLE_ROLES = [
  'hotel_manager', 'front_desk', 'housekeeping', 'maintenance', 'laundry', 'warehouse',
] as const;

export const DEFAULT_ROLE_MODULES: Record<string, string[]> = {
  hotel_manager: [...ALL_MODULE_KEYS],
  front_desk: ['calendar', 'bookings', 'customers', 'services', 'reports'],
  housekeeping: ['calendar', 'tasks'],
  maintenance: ['tasks'],
  laundry: ['tasks', 'laundry'],
  warehouse: ['services', 'inventory'],
};
