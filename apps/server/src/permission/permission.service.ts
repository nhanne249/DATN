import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyRolePermission } from './entities/property-role-permission.entity';
import { PropertyCustomRole } from './entities/property-custom-role.entity';
import { User } from '../user/entities/user.entity';
import { CONFIGURABLE_ROLES, DEFAULT_ROLE_MODULES } from './permission.constants';
import { ROLE } from '../user/enum/role';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PropertyRolePermission)
    private readonly repo: Repository<PropertyRolePermission>,
    @InjectRepository(PropertyCustomRole)
    private readonly customRoleRepo: Repository<PropertyCustomRole>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ── Built-in role permissions ─────────────────────────────────────────────

  async getMatrix(propertyId: string) {
    const rows = await this.repo.find({ where: { propertyId } });
    return CONFIGURABLE_ROLES.map((role) => {
      const found = rows.find((r) => r.role === role);
      return {
        role,
        modules: found ? found.modules : (DEFAULT_ROLE_MODULES[role] ?? []),
        isCustom: !!found,
      };
    });
  }

  async getModulesForRole(propertyId: string, role: string): Promise<string[]> {
    const row = await this.repo.findOne({ where: { propertyId, role: role as ROLE } });
    return row ? row.modules : (DEFAULT_ROLE_MODULES[role] ?? []);
  }

  async updateRoleModules(propertyId: string, role: string, modules: string[]) {
    const existing = await this.repo.findOne({ where: { propertyId, role: role as ROLE } });
    if (existing) {
      existing.modules = modules;
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ propertyId, role: role as ROLE, modules }));
  }

  async resetRoleModules(propertyId: string, role: string) {
    await this.repo.delete({ propertyId, role: role as ROLE });
    return { modules: DEFAULT_ROLE_MODULES[role] ?? [] };
  }

  // ── Custom roles ──────────────────────────────────────────────────────────

  async getCustomRoles(propertyId: string): Promise<PropertyCustomRole[]> {
    return this.customRoleRepo.find({ where: { propertyId }, order: { createdAt: 'ASC' } });
  }

  async createCustomRole(propertyId: string, name: string, baseRole: ROLE, modules: string[]) {
    const role = this.customRoleRepo.create({ propertyId, name, baseRole, modules });
    return this.customRoleRepo.save(role);
  }

  async updateCustomRole(
    id: string,
    propertyId: string,
    data: { name?: string; baseRole?: ROLE; modules?: string[] },
  ) {
    const role = await this.customRoleRepo.findOne({ where: { id, propertyId } });
    if (!role) throw new NotFoundException('Custom role not found');
    if (data.name !== undefined) role.name = data.name;
    if (data.baseRole !== undefined) role.baseRole = data.baseRole;
    if (data.modules !== undefined) role.modules = data.modules;
    return this.customRoleRepo.save(role);
  }

  async deleteCustomRole(id: string, propertyId: string) {
    const role = await this.customRoleRepo.findOne({ where: { id, propertyId } });
    if (!role) throw new NotFoundException('Custom role not found');
    // Unassign from any staff
    await this.userRepo.update({ customRoleId: id, propertyId }, { customRoleId: null });
    await this.customRoleRepo.delete(id);
    return { success: true };
  }

  // ── Module resolution for a specific user ─────────────────────────────────

  async getModulesForUser(
    propertyId: string,
    role: string,
    userId: string,
  ): Promise<string[]> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user?.customRoleId) {
      const customRole = await this.customRoleRepo.findOne({
        where: { id: user.customRoleId, propertyId },
      });
      if (customRole) return customRole.modules;
    }
    return this.getModulesForRole(propertyId, role);
  }
}
