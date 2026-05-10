export const MODULES = [
  { key: 'calendar', label: 'Lịch', route: '/dashboard/calendar' },
  { key: 'bookings', label: 'Đặt phòng', route: '/dashboard/bookings' },
  { key: 'tasks', label: 'Công việc', route: '/dashboard/tasks' },
  { key: 'channel_manager', label: 'Quản lý kênh', route: '/dashboard/channel-manager' },
  { key: 'finance', label: 'Tài chính', route: '/dashboard/finance' },
  { key: 'reports', label: 'Báo cáo', route: '/dashboard/reports' },
  { key: 'services', label: 'Dịch vụ', route: '/dashboard/services' },
  { key: 'minibar', label: 'Minibar', route: '/dashboard/minibar' },
  { key: 'laundry', label: 'Giặt ủi', route: '/dashboard/laundry' },
  { key: 'inventory', label: 'Kho hàng', route: '/dashboard/inventory' },
  { key: 'rentals', label: 'Thuê xe', route: '/dashboard/rentals' },
  { key: 'rooms', label: 'Quản lý phòng', route: '/dashboard/rooms' },
  { key: 'customers', label: 'Khách hàng', route: '/dashboard/customers' },
  { key: 'website', label: 'Website', route: '/dashboard/website' },
  { key: 'invoices', label: 'Hóa đơn', route: '/dashboard/invoices' },
  { key: 'e_invoices', label: 'Hóa đơn điện tử', route: '/dashboard/e-invoices' },
] as const;

export type ModuleKey = typeof MODULES[number]['key'];

export const CONFIGURABLE_ROLES = [
  { value: 'hotel_manager', label: 'Quản lý' },
  { value: 'front_desk', label: 'Lễ tân' },
  { value: 'housekeeping', label: 'Buồng phòng' },
  { value: 'maintenance', label: 'Kỹ thuật' },
  { value: 'laundry', label: 'Giặt ủi' },
  { value: 'warehouse', label: 'Kho' },
] as const;

export const DEFAULT_ROLE_MODULES: Record<string, string[]> = {
  hotel_manager: MODULES.map((m) => m.key),
  front_desk: ['calendar', 'bookings', 'customers', 'services', 'reports'],
  housekeeping: ['calendar', 'tasks'],
  maintenance: ['tasks'],
  laundry: ['tasks', 'laundry'],
  warehouse: ['services', 'inventory'],
};

export function getModuleKeyForPath(pathname: string): string | null {
  for (const m of MODULES) {
    if (pathname === m.route || pathname.startsWith(m.route + '/')) {
      return m.key;
    }
  }
  return null;
}
