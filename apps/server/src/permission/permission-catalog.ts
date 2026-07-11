import { ROLE } from '../user/enum/role';

export interface CatalogResource {
  key: string;
  name: string;
  type: 'ENTITY' | 'PAGE';
  defaultActions: string[];
}

export const DEFAULT_ACTIONS = ['view', 'create', 'update', 'delete', 'export', 'manage'] as const;

export const HOTEL_PERMISSION_CATALOG: CatalogResource[] = [
  // ENTITY Resources (full action set each)
  { key: 'entity.calendar',        name: 'Lịch khách sạn',           type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.booking',         name: 'Đặt phòng',                type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.task',            name: 'Công việc / Nhiệm vụ',     type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.channel_manager', name: 'Quản lý kênh bán phòng',  type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.finance',         name: 'Tài chính / Doanh thu',    type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.report',          name: 'Báo cáo hoạt động',        type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.service',         name: 'Dịch vụ đi kèm',           type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.minibar',         name: 'Minibar',                  type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.laundry',         name: 'Giặt ủi',                  type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.inventory',       name: 'Kho hàng / Vật tư',        type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.rental',          name: 'Thuê xe / Tiện ích khác',  type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.room',            name: 'Danh mục phòng / Sơ đồ',  type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.customer',        name: 'Hồ sơ khách hàng',         type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.website',         name: 'Website / Kênh quảng bá',  type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.invoice',         name: 'Hóa đơn thanh toán',       type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.e_invoice',       name: 'Hóa đơn điện tử',          type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.user',            name: 'Tài khoản nhân viên',       type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },
  { key: 'entity.permission',      name: 'Quản trị phân quyền',       type: 'ENTITY', defaultActions: [...DEFAULT_ACTIONS] },

  // PAGE Resources (only 'view' action)
  { key: 'page.dashboard',       name: 'Trang chủ / Tổng quan',       type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.calendar',        name: 'Trang sơ đồ lịch',            type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.bookings',        name: 'Trang danh sách đặt hẹn',     type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.tasks',           name: 'Trang quản lý công việc',      type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.channel_manager', name: 'Trang OTA Channel Manager',   type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.finance',         name: 'Trang doanh thu và chi phí',   type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.reports',         name: 'Trang báo cáo & phân tích',   type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.services',        name: 'Trang quản lý dịch vụ',       type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.minibar',         name: 'Trang minibar phòng',          type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.laundry',         name: 'Trang dịch vụ giặt ủi',       type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.inventory',       name: 'Trang quản lý kho',            type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.rentals',         name: 'Trang thuê xe',                type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.rooms',           name: 'Trang cấu hình buồng phòng',  type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.customers',       name: 'Trang quản lý khách hàng',     type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.website',         name: 'Trang quản lý website',        type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.invoices',        name: 'Trang quản lý hóa đơn',       type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.e_invoices',      name: 'Trang hóa đơn điện tử',       type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.permissions',     name: 'Trang thiết lập phân quyền',   type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.users',           name: 'Trang quản lý nhân sự',        type: 'PAGE', defaultActions: ['view'] },
  { key: 'page.settings',        name: 'Trang cấu hình khách sạn',    type: 'PAGE', defaultActions: ['view'] },
];

/**
 * Default permission seeds seeded on module init.
 *
 * ADMIN        → bypasses all permission checks at runtime. No seed needed.
 * INTERNAL_USER → NO default permissions. Access must be granted explicitly
 *                 via PropertyCustomRole assignment or auth_user_roles.
 * CUSTOMER      → minimal read-only access to dashboard only.
 */
export interface DefaultPolicySeed {
  role: ROLE;
  resource: string;
  actions: string[];
}

export const DEFAULT_POLICY_SEEDS: DefaultPolicySeed[] = [
  // CUSTOMER — minimal access
  { role: ROLE.CUSTOMER, resource: 'page.dashboard', actions: ['view'] },
];
