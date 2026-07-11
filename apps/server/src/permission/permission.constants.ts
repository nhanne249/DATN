/**
 * All resource module keys available in the permission catalog.
 * Used as reference when assigning permissions to custom roles.
 */
export const ALL_MODULE_KEYS = [
  'calendar', 'bookings', 'tasks', 'channel_manager', 'finance', 'reports',
  'services', 'minibar', 'laundry', 'inventory', 'rentals', 'rooms',
  'customers', 'website', 'invoices', 'e_invoices',
] as const;

export type ModuleKey = typeof ALL_MODULE_KEYS[number];
