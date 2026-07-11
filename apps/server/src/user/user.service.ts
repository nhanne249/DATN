import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateInternalUserDto } from './dto/create-internal-user.dto';
import { UpdateInternalUserDto } from './dto/update-internal-user.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';
import { UserPasswordHistory } from './entities/user-password-history.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ROLE } from './enum/role';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public readonly repo: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly addressRepo: Repository<UserAddress>,
    @InjectRepository(UserPasswordHistory)
    private readonly passwordHistoryRepo: Repository<UserPasswordHistory>,
    private readonly auditLogService: AuditLogService,
  ) {}

  // ── Admin-level user management (ADMIN role only) ─────────────────────────

  /**
   * Create a user — for admin use only. Role defaults to CUSTOMER unless
   * the caller explicitly sets it (admin bypass enforced at controller level).
   */
  async create(dto: CreateUserDto, assignedRole: ROLE = ROLE.CUSTOMER) {
    if (dto.phone) {
      const existing = await this.repo.findOne({ where: { phone: dto.phone } });
      if (existing) throw new ConflictException('Phone already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      ...(dto.username ? { username: dto.username } : {}),
      ...(dto.phone ? { phone: dto.phone } : {}),
      name: dto.name,
      password: passwordHash,
      role: assignedRole,
      propertyId: dto.propertyId ?? null,
      customRoleId: dto.customRoleId ?? null,
    });
    const saved = await this.repo.save(user);
    await this.addToPasswordHistory(saved.id, passwordHash);
    return this.stripSensitive(saved);
  }

  async findAll() {
    const users = await this.repo.find();
    return users.map((u) => this.stripSensitive(u));
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.stripSensitive(user);
  }

  async findOneRaw(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByPhone(phone: string) {
    return this.repo.findOne({ where: { phone } });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return this.repo.findOne({ where: { googleId } });
  }

  async findByUsernameAndProperty(username: string, propertyId: string) {
    return this.repo.findOne({ where: { username, propertyId } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.name) user.name = dto.name;
    const saved = await this.repo.save(user);
    return this.stripSensitive(saved);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.repo.delete(id);
    return { success: true };
  }

  // ── Internal user (staff) management scoped to a property ────────────────

  async findInternalUsersByProperty(propertyId: string) {
    const users = await this.repo.find({
      where: { propertyId, role: ROLE.INTERNAL_USER },
      order: { createdAt: 'ASC' },
    });
    return users.map((u) => this.stripSensitive(u));
  }

  async createInternalUser(propertyId: string, dto: CreateInternalUserDto) {
    // Check username uniqueness within property
    const existingUsername = await this.repo.findOne({
      where: { username: dto.username, propertyId },
    });
    if (existingUsername) throw new ConflictException('Tên đăng nhập đã tồn tại trong property này');

    if (dto.phone) {
      const existingPhone = await this.repo.findOne({ where: { phone: dto.phone } });
      if (existingPhone) throw new ConflictException('Số điện thoại đã được đăng ký');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repo.create({
      username: dto.username,
      name: dto.name,
      password: passwordHash,
      role: ROLE.INTERNAL_USER,
      propertyId,
      customRoleId: dto.customRoleId ?? null,
      ...(dto.phone ? { phone: dto.phone } : {}),
    });
    const saved = await this.repo.save(user);
    await this.addToPasswordHistory(saved.id, passwordHash);
    return this.stripSensitive(saved);
  }

  async updateInternalUser(userId: string, propertyId: string, dto: UpdateInternalUserDto) {
    const user = await this.repo.findOne({ where: { id: userId, propertyId, role: ROLE.INTERNAL_USER } });
    if (!user) throw new NotFoundException('Không tìm thấy nhân viên');

    if (dto.name) user.name = dto.name;
    if (dto.phone) user.phone = dto.phone;
    if (dto.customRoleId !== undefined) user.customRoleId = dto.customRoleId ?? null;

    if (dto.newPassword) {
      const passwordHash = await bcrypt.hash(dto.newPassword, 10);
      user.password = passwordHash;
      await this.addToPasswordHistory(userId, passwordHash);
    }

    const saved = await this.repo.save(user);
    return this.stripSensitive(saved);
  }

  async removeInternalUser(userId: string, propertyId: string) {
    const user = await this.repo.findOne({ where: { id: userId, propertyId, role: ROLE.INTERNAL_USER } });
    if (!user) throw new NotFoundException('Không tìm thấy nhân viên');
    await this.repo.delete(userId);
    return { success: true };
  }

  async toggleInternalUserLock(userId: string, propertyId: string) {
    const user = await this.repo.findOne({ where: { id: userId, propertyId, role: ROLE.INTERNAL_USER } });
    if (!user) throw new NotFoundException('Không tìm thấy nhân viên');
    user.isLocked = !user.isLocked;
    if (!user.isLocked) {
      user.failCount = 0;
      user.lockedAt = null;
    }
    await this.repo.save(user);
    return { isLocked: user.isLocked };
  }

  // ── Auth helpers ──────────────────────────────────────────────────────────

  async createOrUpdateGoogleUser(googleProfile: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }) {
    let user = await this.findByGoogleId(googleProfile.googleId);
    if (!user && googleProfile.email) {
      user = await this.findByEmail(googleProfile.email);
    }

    const fullName =
      `${googleProfile.firstName || ''} ${googleProfile.lastName || ''}`.trim();

    if (user) {
      user.googleId = googleProfile.googleId;
      user.email = googleProfile.email;
      user.picture = googleProfile.picture || user.picture;
      if (!user.name || user.name.length === 0) {
        user.name = fullName;
      }
      return await this.repo.save(user);
    } else {
      const newUser = this.repo.create({
        googleId: googleProfile.googleId,
        email: googleProfile.email,
        name: fullName || 'Google User',
        picture: googleProfile.picture,
        role: ROLE.CUSTOMER,
      });
      return await this.repo.save(newUser);
    }
  }

  async setHashedRefreshToken(userId: string, hash: string | null) {
    await this.repo.update(userId, { hashedRefreshToken: hash });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (!user.password)
      throw new ForbiddenException('User registered with Google cannot change password');

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid)
      throw new ForbiddenException('Current password is incorrect');

    // Check password history (last 3)
    const histories = await this.passwordHistoryRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    for (const history of histories) {
      const matchesOld = await bcrypt.compare(newPassword, history.passwordHash);
      if (matchesOld) {
        throw new ConflictException('New password cannot match any of the last 3 used passwords');
      }
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    await this.repo.save(user);
    await this.addToPasswordHistory(userId, newPasswordHash);

    return { message: 'Password changed successfully' };
  }

  async handleFailedLogin(userId: string) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) return;
    user.failCount += 1;
    if (user.failCount >= 5 && !user.isLocked) {
      user.isLocked = true;
      user.lockedAt = new Date();
      await this.logAction(userId, 'LOCK_ACCOUNT', undefined, {
        reason: 'Exceeded 5 failed login attempts',
      });
    }
    await this.repo.save(user);
  }

  async resetFailedLogin(userId: string) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (user && user.failCount > 0) {
      user.failCount = 0;
      user.isLocked = false;
      user.lockedAt = null;
      await this.repo.save(user);
    }
  }

  async logAction(
    userId: string | undefined,
    action: string,
    ipAddress?: string,
    details?: Record<string, unknown>,
  ) {
    await this.auditLogService.logAction(userId, action, ipAddress, details);
  }

  // ── 2FA ──────────────────────────────────────────────────────────────────

  async update2FASecret(userId: string, secret: string | null) {
    await this.repo.update(userId, { twoFactorSecret: secret });
  }

  async set2FAEnabled(userId: string, enabled: boolean) {
    await this.repo.update(userId, { twoFactorEnabled: enabled });
  }

  // ── Address management ────────────────────────────────────────────────────

  async createUserAddress(userId: string, dto: CreateUserAddressDto) {
    if (dto.isDefault) {
      await this.addressRepo.update({ userId, isDefault: true }, { isDefault: false });
    }
    const address = this.addressRepo.create({ userId, ...dto });
    return await this.addressRepo.save(address);
  }

  async getUserAddresses(userId: string) {
    return await this.addressRepo.find({ where: { userId } });
  }

  async getUserAddress(userId: string, addressId: string) {
    const address = await this.addressRepo.findOne({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async updateUserAddress(userId: string, addressId: string, dto: UpdateUserAddressDto) {
    const address = await this.addressRepo.findOne({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException('Address not found');
    if (dto.isDefault) {
      await this.addressRepo.update({ userId, isDefault: true }, { isDefault: false });
    }
    Object.assign(address, dto);
    return await this.addressRepo.save(address);
  }

  async deleteUserAddress(userId: string, addressId: string) {
    const address = await this.addressRepo.findOne({ where: { id: addressId, userId } });
    if (!address) throw new NotFoundException('Address not found');
    await this.addressRepo.delete(addressId);
    return { message: 'Address deleted successfully' };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async addToPasswordHistory(userId: string, passwordHash: string) {
    const history = this.passwordHistoryRepo.create({
      user: { id: userId },
      passwordHash,
    });
    await this.passwordHistoryRepo.save(history);
  }

  private stripSensitive(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRefreshToken, twoFactorSecret, ...rest } = user;
    return rest;
  }
}
