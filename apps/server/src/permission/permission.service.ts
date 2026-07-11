import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PropertyCustomRole } from './entities/property-custom-role.entity';
import { User } from '../user/entities/user.entity';
import { AuthRole } from './entities/auth-role.entity';
import { AuthResource } from './entities/auth-resource.entity';
import { AuthAction } from './entities/auth-action.entity';
import { AuthRolePermission } from './entities/auth-role-permission.entity';
import { AuthUserRole } from './entities/auth-user-role.entity';
import { ROLE } from '../user/enum/role';
import {
  HOTEL_PERMISSION_CATALOG,
  DEFAULT_POLICY_SEEDS,
} from './permission-catalog';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(PropertyCustomRole)
    private readonly customRoleRepo: Repository<PropertyCustomRole>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(AuthRole)
    private readonly authRoleRepo: Repository<AuthRole>,
    @InjectRepository(AuthResource)
    private readonly authResourceRepo: Repository<AuthResource>,
    @InjectRepository(AuthAction)
    private readonly authActionRepo: Repository<AuthAction>,
    @InjectRepository(AuthRolePermission)
    private readonly authRolePermissionRepo: Repository<AuthRolePermission>,
    @InjectRepository(AuthUserRole)
    private readonly authUserRoleRepo: Repository<AuthUserRole>,
  ) {}

  // ── Seeding & Initialization ─────────────────────────────────────────────

  async onModuleInit() {
    await this.seedSystemRoles();
    await this.seedDefaultActions();
    await this.seedCatalogResources();
    await this.seedDefaultRolePermissions();
  }

  private async seedSystemRoles() {
    const rolesList = [
      { code: ROLE.ADMIN,         name: 'Quản trị hệ thống' },
      { code: ROLE.INTERNAL_USER, name: 'Nhân viên nội bộ' },
      { code: ROLE.CUSTOMER,      name: 'Khách hàng' },
    ];

    for (const r of rolesList) {
      let role = await this.authRoleRepo.findOne({ where: { code: r.code } });
      if (!role) {
        role = this.authRoleRepo.create({
          code: r.code,
          name: r.name,
          isSystem: true,
          isActive: true,
        });
      } else {
        role.name = r.name;
        role.isSystem = true;
        role.isActive = true;
      }
      await this.authRoleRepo.save(role);
    }
  }

  private async seedDefaultActions() {
    const actionsList = [
      { code: 'view',   name: 'Xem' },
      { code: 'create', name: 'Thêm mới' },
      { code: 'update', name: 'Cập nhật' },
      { code: 'delete', name: 'Xóa' },
      { code: 'export', name: 'Xuất dữ liệu' },
      { code: 'manage', name: 'Toàn quyền điều hành' },
    ];

    for (const a of actionsList) {
      let action = await this.authActionRepo.findOne({ where: { code: a.code } });
      if (!action) {
        action = this.authActionRepo.create({
          code: a.code,
          name: a.name,
          isSystem: true,
          isActive: true,
        });
      } else {
        action.name = a.name;
        action.isSystem = true;
        action.isActive = true;
      }
      await this.authActionRepo.save(action);
    }
  }

  private async seedCatalogResources() {
    for (const r of HOTEL_PERMISSION_CATALOG) {
      let resource = await this.authResourceRepo.findOne({ where: { key: r.key } });
      if (!resource) {
        resource = this.authResourceRepo.create({
          key: r.key,
          name: r.name,
          type: r.type,
          channel: 'ADMIN_WEB',
          isLocked: false,
          isActive: true,
        });
      } else {
        resource.name = r.name;
        resource.type = r.type;
      }
      await this.authResourceRepo.save(resource);
    }
  }

  private async seedDefaultRolePermissions() {
    for (const seed of DEFAULT_POLICY_SEEDS) {
      const role = await this.authRoleRepo.findOne({ where: { code: seed.role } });
      const resource = await this.authResourceRepo.findOne({ where: { key: seed.resource } });

      if (role && resource) {
        for (const actCode of seed.actions) {
          const action = await this.authActionRepo.findOne({ where: { code: actCode } });
          if (action) {
            const existing = await this.authRolePermissionRepo.findOne({
              where: {
                roleId: role.id,
                resourceId: resource.id,
                actionId: action.id,
              },
            });
            if (!existing) {
              await this.authRolePermissionRepo.save(
                this.authRolePermissionRepo.create({
                  roleId: role.id,
                  resourceId: resource.id,
                  actionId: action.id,
                  allowed: true,
                }),
              );
            }
          }
        }
      }
    }
  }

  // ── Runtime Permission Checking ──────────────────────────────────────────

  async hasPermission(params: {
    userId: string;
    jwtRole: string;
    resourceKey: string;
    actionCode: string;
  }): Promise<boolean> {
    const { userId, jwtRole, resourceKey, actionCode } = params;

    // ADMIN bypasses all permission checks
    if (jwtRole === ROLE.ADMIN) {
      return true;
    }

    // Resolve resource and action
    const resource = await this.authResourceRepo.findOne({
      where: { key: resourceKey, isActive: true },
    });
    if (!resource) return false;

    const action = await this.authActionRepo.findOne({
      where: { code: actionCode, isActive: true },
    });
    if (!action) return false;

    // Resolve all effective role codes for this user
    const roleCodes = await this.getEffectiveRoleCodes(userId, jwtRole);
    if (roleCodes.length === 0) return false;

    const roles = await this.authRoleRepo.find({
      where: { code: In(roleCodes), isActive: true },
      select: ['id'],
    });
    if (roles.length === 0) return false;

    const roleIds = roles.map((r) => r.id);

    const count = await this.authRolePermissionRepo.count({
      where: {
        roleId: In(roleIds),
        resourceId: resource.id,
        actionId: action.id,
        allowed: true,
      },
    });

    return count > 0;
  }

  async getEffectiveRoleCodes(userId: string, jwtRole: string): Promise<string[]> {
    const codes = new Set<string>();
    codes.add(jwtRole);

    // Load from auth_user_roles junction table
    const userRoles = await this.authUserRoleRepo.find({
      where: { userId, isActive: true },
      relations: ['role'],
    });
    for (const ur of userRoles) {
      if (ur.role && ur.role.isActive) {
        codes.add(ur.role.code);
      }
    }

    // Load custom role assigned directly on user
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user?.customRoleId) {
      const customRole = await this.authRoleRepo.findOne({
        where: { code: `custom_${user.customRoleId}`, isActive: true },
      });
      if (customRole) {
        codes.add(customRole.code);
      }
    }

    return Array.from(codes);
  }

  async getPermissionsForRoles(roleCodes: string[]) {
    // ADMIN gets full catalog
    if (roleCodes.includes(ROLE.ADMIN)) {
      return HOTEL_PERMISSION_CATALOG.map((r) => ({
        resourceKey: r.key,
        actions: r.defaultActions,
      }));
    }

    const roles = await this.authRoleRepo.find({
      where: { code: In(roleCodes), isActive: true },
    });
    if (roles.length === 0) return [];

    const roleIds = roles.map((r) => r.id);
    const perms = await this.authRolePermissionRepo.find({
      where: { roleId: In(roleIds), allowed: true },
      relations: ['resource', 'action'],
    });

    const map: Record<string, Set<string>> = {};
    for (const p of perms) {
      if (p.resource && p.resource.isActive && p.action && p.action.isActive) {
        if (!map[p.resource.key]) {
          map[p.resource.key] = new Set();
        }
        map[p.resource.key].add(p.action.code);
      }
    }

    return Object.entries(map).map(([resourceKey, actions]) => ({
      resourceKey,
      actions: Array.from(actions),
    }));
  }

  // ── Custom Role CRUD ──────────────────────────────────────────────────────

  async getCustomRoles(propertyId: string): Promise<any[]> {
    const roles = await this.customRoleRepo.find({ where: { propertyId }, order: { createdAt: 'ASC' } });
    const result: any[] = [];
    for (const r of roles) {
      const modules = await this.getModulesForCustomRole(`custom_${r.id}`);
      result.push({
        ...r,
        baseRole: ROLE.INTERNAL_USER,
        modules,
      });
    }
    return result;
  }

  /**
   * Create a custom role and grant it fine-grained permissions.
   * Supports both explicit permissions array and modules-to-permissions mapping.
   */
  async createCustomRole(
    propertyId: string,
    name: string,
    description: string | null,
    permissionsOrModules: { resourceKey: string; actions: string[] }[] | string[],
  ) {
    const customRole = this.customRoleRepo.create({ propertyId, name, description: description ?? null });
    const saved = await this.customRoleRepo.save(customRole);

    // Create an AuthRole entry so it participates in permission checks
    const roleCode = `custom_${saved.id}`;
    const authRole = this.authRoleRepo.create({
      code: roleCode,
      name,
      propertyId,
      isSystem: false,
      isActive: true,
    });
    await this.authRoleRepo.save(authRole);

    let permissions: { resourceKey: string; actions: string[] }[] = [];
    let modules: string[] = [];

    if (permissionsOrModules.length > 0 && typeof permissionsOrModules[0] === 'string') {
      modules = permissionsOrModules as string[];
      permissions = this.mapModulesToPermissions(modules);
    } else {
      permissions = permissionsOrModules as { resourceKey: string; actions: string[] }[];
      // Derive modules for response
      modules = permissions
        .filter((p) => p.resourceKey.startsWith('page.') && p.resourceKey !== 'page.dashboard' && p.actions.includes('view'))
        .map((p) => p.resourceKey.replace('page.', ''));
    }

    // Seed permissions for this custom role
    await this.setRolePermissions(roleCode, permissions);

    return { ...saved, baseRole: ROLE.INTERNAL_USER, modules, roleCode };
  }

  async updateCustomRole(
    id: string,
    propertyId: string,
    data: {
      name?: string;
      description?: string | null;
      permissions?: { resourceKey: string; actions: string[] }[];
      modules?: string[];
    },
  ) {
    const customRole = await this.customRoleRepo.findOne({ where: { id, propertyId } });
    if (!customRole) throw new NotFoundException('Custom role not found');

    if (data.name !== undefined) customRole.name = data.name;
    if (data.description !== undefined) customRole.description = data.description ?? null;
    const saved = await this.customRoleRepo.save(customRole);

    const roleCode = `custom_${id}`;
    const authRole = await this.authRoleRepo.findOne({ where: { code: roleCode } });
    if (authRole) {
      if (data.name !== undefined) authRole.name = data.name;
      await this.authRoleRepo.save(authRole);
    }

    if (data.modules !== undefined) {
      const permissions = this.mapModulesToPermissions(data.modules);
      await this.setRolePermissions(roleCode, permissions);
    } else if (data.permissions !== undefined) {
      await this.setRolePermissions(roleCode, data.permissions);
    }

    const modules = data.modules ?? (await this.getModulesForCustomRole(roleCode));
    return { ...saved, baseRole: ROLE.INTERNAL_USER, modules };
  }

  async deleteCustomRole(id: string, propertyId: string) {
    const customRole = await this.customRoleRepo.findOne({ where: { id, propertyId } });
    if (!customRole) throw new NotFoundException('Custom role not found');

    // Unassign from any users
    await this.userRepo.update({ customRoleId: id, propertyId }, { customRoleId: null });
    await this.customRoleRepo.delete(id);

    // Delete AuthRole (cascades to auth_role_permissions)
    const roleCode = `custom_${id}`;
    await this.authRoleRepo.delete({ code: roleCode });

    return { success: true };
  }

  /**
   * Get the fine-grained permissions granted to a custom role.
   */
  async getCustomRolePermissions(id: string, propertyId: string) {
    const customRole = await this.customRoleRepo.findOne({ where: { id, propertyId } });
    if (!customRole) throw new NotFoundException('Custom role not found');

    const roleCode = `custom_${id}`;
    return this.getPermissionsForRoles([roleCode]);
  }

  // ── Module to Permission Translation Helpers ─────────────────────────────

  private mapModulesToPermissions(modules: string[]): { resourceKey: string; actions: string[] }[] {
    const entityMap: Record<string, string> = {
      calendar: 'calendar',
      bookings: 'booking',
      tasks: 'task',
      channel_manager: 'channel_manager',
      finance: 'finance',
      reports: 'report',
      services: 'service',
      minibar: 'minibar',
      laundry: 'laundry',
      inventory: 'inventory',
      rentals: 'rental',
      rooms: 'room',
      customers: 'customer',
      website: 'website',
      invoices: 'invoice',
      e_invoices: 'e_invoice',
      users: 'user',
      permissions: 'permission',
    };

    const permissions: { resourceKey: string; actions: string[] }[] = [];
    permissions.push({ resourceKey: 'page.dashboard', actions: ['view'] });

    for (const m of modules) {
      permissions.push({ resourceKey: `page.${m}`, actions: ['view'] });
      const entityKey = entityMap[m] || m;
      permissions.push({
        resourceKey: `entity.${entityKey}`,
        actions: ['view', 'create', 'update', 'delete', 'manage', 'export'],
      });
    }
    return permissions;
  }

  private async getModulesForCustomRole(roleCode: string): Promise<string[]> {
    const permissions = await this.getPermissionsForRoles([roleCode]);
    return permissions
      .filter((p) => p.resourceKey.startsWith('page.') && p.resourceKey !== 'page.dashboard' && p.actions.includes('view'))
      .map((p) => p.resourceKey.replace('page.', ''));
  }

  // ── Internal helpers ──────────────────────────────────────────────────────

  /**
   * Completely replace the permission set for a given role code.
   */
  private async setRolePermissions(
    roleCode: string,
    permissions: { resourceKey: string; actions: string[] }[],
  ) {
    const role = await this.authRoleRepo.findOne({ where: { code: roleCode } });
    if (!role) return;

    // Clear existing permissions for this role
    await this.authRolePermissionRepo.delete({ roleId: role.id });

    const toSave: AuthRolePermission[] = [];
    for (const perm of permissions) {
      const resource = await this.authResourceRepo.findOne({ where: { key: perm.resourceKey } });
      if (!resource) continue;

      for (const actCode of perm.actions) {
        const action = await this.authActionRepo.findOne({ where: { code: actCode } });
        if (!action) continue;

        toSave.push(
          this.authRolePermissionRepo.create({
            roleId: role.id,
            resourceId: resource.id,
            actionId: action.id,
            allowed: true,
          }),
        );
      }
    }

    if (toSave.length > 0) {
      await this.authRolePermissionRepo.save(toSave);
    }
  }

  /**
   * Assign a custom role to a user (sets customRoleId on User entity).
   */
  async assignCustomRoleToUser(userId: string, customRoleId: string | null, propertyId: string) {
    if (customRoleId !== null) {
      const customRole = await this.customRoleRepo.findOne({ where: { id: customRoleId, propertyId } });
      if (!customRole) throw new NotFoundException('Custom role not found');
    }
    await this.userRepo.update({ id: userId, propertyId }, { customRoleId });
    return { success: true };
  }

  async seedDefaultRolesForProperty(propertyId: string): Promise<string> {
    const roles = [
      {
        name: 'Quản lý',
        description: 'Toàn quyền quản lý khách sạn',
        permissions: [
          { resourceKey: 'page.dashboard',    actions: ['view'] },
          { resourceKey: 'page.calendar',     actions: ['view'] },
          { resourceKey: 'page.bookings',     actions: ['view'] },
          { resourceKey: 'page.finance',      actions: ['view'] },
          { resourceKey: 'page.reports',      actions: ['view'] },
          { resourceKey: 'page.tasks',        actions: ['view'] },
          { resourceKey: 'page.services',     actions: ['view'] },
          { resourceKey: 'page.minibar',      actions: ['view'] },
          { resourceKey: 'page.laundry',      actions: ['view'] },
          { resourceKey: 'page.inventory',    actions: ['view'] },
          { resourceKey: 'page.rooms',        actions: ['view'] },
          { resourceKey: 'page.customers',    actions: ['view'] },
          { resourceKey: 'page.users',        actions: ['view'] },
          { resourceKey: 'page.permissions',  actions: ['view'] },
          { resourceKey: 'entity.booking',    actions: ['view', 'create', 'update', 'delete', 'manage'] },
          { resourceKey: 'entity.finance',    actions: ['view', 'create', 'update', 'delete', 'export'] },
          { resourceKey: 'entity.report',     actions: ['view', 'export'] },
          { resourceKey: 'entity.task',       actions: ['view', 'create', 'update', 'delete', 'manage'] },
          { resourceKey: 'entity.service',    actions: ['view', 'create', 'update', 'delete'] },
          { resourceKey: 'entity.room',       actions: ['view', 'create', 'update', 'delete', 'manage'] },
          { resourceKey: 'entity.customer',   actions: ['view', 'create', 'update', 'delete', 'export'] },
          { resourceKey: 'entity.user',       actions: ['view', 'create', 'update', 'delete', 'manage'] },
          { resourceKey: 'entity.permission', actions: ['view', 'create', 'update', 'delete', 'manage'] },
          { resourceKey: 'entity.invoice',    actions: ['view', 'create', 'update', 'delete'] },
          { resourceKey: 'entity.inventory',  actions: ['view', 'create', 'update', 'delete'] },
          { resourceKey: 'entity.laundry',    actions: ['view', 'create', 'update', 'delete'] },
          { resourceKey: 'entity.minibar',    actions: ['view', 'create', 'update', 'delete'] },
        ],
      },
      {
        name: 'Lễ tân',
        description: 'Quản lý đặt phòng, khách hàng, hóa đơn',
        permissions: [
          { resourceKey: 'page.dashboard',  actions: ['view'] },
          { resourceKey: 'page.calendar',   actions: ['view'] },
          { resourceKey: 'page.bookings',   actions: ['view'] },
          { resourceKey: 'page.customers',  actions: ['view'] },
          { resourceKey: 'page.invoices',   actions: ['view'] },
          { resourceKey: 'entity.booking',  actions: ['view', 'create', 'update'] },
          { resourceKey: 'entity.customer', actions: ['view', 'create', 'update'] },
          { resourceKey: 'entity.invoice',  actions: ['view', 'create', 'update'] },
        ],
      },
      {
        name: 'Buồng phòng',
        description: 'Xem và cập nhật nhiệm vụ dọn phòng',
        permissions: [
          { resourceKey: 'page.dashboard', actions: ['view'] },
          { resourceKey: 'page.tasks',     actions: ['view'] },
          { resourceKey: 'entity.task',    actions: ['view', 'update'] },
        ],
      },
      {
        name: 'Kỹ thuật',
        description: 'Xem và cập nhật nhiệm vụ bảo trì',
        permissions: [
          { resourceKey: 'page.dashboard', actions: ['view'] },
          { resourceKey: 'page.tasks',     actions: ['view'] },
          { resourceKey: 'entity.task',    actions: ['view', 'update'] },
        ],
      },
      {
        name: 'Giặt ủi',
        description: 'Quản lý dịch vụ giặt ủi',
        permissions: [
          { resourceKey: 'page.dashboard', actions: ['view'] },
          { resourceKey: 'page.laundry',   actions: ['view'] },
          { resourceKey: 'entity.laundry', actions: ['view', 'create', 'update'] },
        ],
      },
      {
        name: 'Kho',
        description: 'Quản lý kho hàng vật tư',
        permissions: [
          { resourceKey: 'page.dashboard',  actions: ['view'] },
          { resourceKey: 'page.inventory',  actions: ['view'] },
          { resourceKey: 'entity.inventory',actions: ['view', 'create', 'update'] },
        ],
      },
    ];

    let managerRoleId = '';
    for (const r of roles) {
      const existing = await this.customRoleRepo.findOne({
        where: { propertyId, name: r.name },
      });
      if (existing) {
        if (r.name === 'Quản lý') managerRoleId = existing.id;
        continue;
      }
      const created = await this.createCustomRole(propertyId, r.name, r.description, r.permissions);
      if (r.name === 'Quản lý') {
        managerRoleId = created.id;
      }
    }
    return managerRoleId;
  }
}
