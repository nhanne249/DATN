import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';
import { UserPasswordHistory } from './entities/user-password-history.entity';
import { AuditLog } from './entities/audit-log.entity';
import { ROLE } from './enum/role';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        @InjectRepository(UserAddress) private readonly addressRepo: Repository<UserAddress>,
        @InjectRepository(UserPasswordHistory) private readonly passwordHistoryRepo: Repository<UserPasswordHistory>,
        @InjectRepository(AuditLog) private readonly auditLogRepo: Repository<AuditLog>,
    ) { }

    async create(dto: CreateUserDto, creatorRole: ROLE) {
        // Only ADMIN can create users with roles other than CUSTOMER
        let roleToSet = dto.role ?? ROLE.CUSTOMER;
        if (dto.role && dto.role !== ROLE.CUSTOMER) {
            if (creatorRole !== ROLE.ADMIN) {
                throw new ForbiddenException('Only admin can create users with specific roles');
            }
            roleToSet = dto.role;
        }

        const existing = await this.repo.findOne({ where: { phone: dto.phone } });
        if (existing) throw new ConflictException('Phone already registered');

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = this.repo.create({
            phone: dto.phone,
            name: dto.name,
            password: passwordHash,
            role: roleToSet,
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

        const fullName = `${googleProfile.firstName || ''} ${googleProfile.lastName || ''}`.trim();

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

    async update(id: string, dto: UpdateUserDto, requesterRole: ROLE) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        if (dto.role) {
            if (requesterRole !== ROLE.ADMIN) {
                throw new ForbiddenException('Only admin can change role');
            }
            user.role = dto.role;
        }
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

    async setHashedRefreshToken(userId: string, hash: string | null) {
        await this.repo.update(userId, { hashedRefreshToken: hash });
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.repo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        if (!user.password) throw new ForbiddenException('User registered with Google cannot change password');

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) throw new ForbiddenException('Current password is incorrect');

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

    private async addToPasswordHistory(userId: string, passwordHash: string) {
        const history = this.passwordHistoryRepo.create({
            user: { id: userId },
            passwordHash,
        });
        await this.passwordHistoryRepo.save(history);
    }

    async handleFailedLogin(userId: string) {
        const user = await this.repo.findOne({ where: { id: userId } });
        if (!user) return;
        user.failCount += 1;
        if (user.failCount >= 5 && !user.isLocked) {
            user.isLocked = true;
            user.lockedAt = new Date();
            await this.logAction(userId, 'LOCK_ACCOUNT', undefined, { reason: 'Exceeded 5 failed login attempts' });
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

    async logAction(userId: string | undefined, action: string, ipAddress?: string, details?: any) {
        const log = this.auditLogRepo.create({
            userId,
            action,
            ipAddress,
            details,
        });
        await this.auditLogRepo.save(log);
    }

    // User Address Management
    async createUserAddress(userId: string, dto: CreateUserAddressDto) {
        // If setting as default, unset other default addresses
        if (dto.isDefault) {
            await this.addressRepo.update({ userId, isDefault: true }, { isDefault: false });
        }

        const address = this.addressRepo.create({
            userId,
            ...dto,
        });
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

        // If setting as default, unset other default addresses
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

    private stripSensitive(user: User) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, hashedRefreshToken, ...rest } = user;
        return rest;
    }
}
