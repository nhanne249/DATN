import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PropertyService } from '../property/property.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ROLE } from '../user/enum/role';
import { JwtPayload } from './strategies/jwt.strategy';
import { OAuth2Client } from 'google-auth-library';
import { Request } from 'express';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly properties: PropertyService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check slug uniqueness
    const existingProp = await this.properties.findBySlug(dto.hotelSlug);
    if (existingProp) throw new ConflictException('Tên định danh khách sạn đã được sử dụng');

    // Check phone if provided
    if (dto.phone) {
      const existingPhone = await this.users.findByPhone(dto.phone);
      if (existingPhone) throw new ConflictException('Số điện thoại đã được đăng ký');
    }

    // Create property with slug
    const property = await this.properties.create({
      name: dto.hotelName,
      slug: dto.hotelSlug,
      currency: 'VND',
      timezone: 'Asia/Ho_Chi_Minh',
    });

    // Create hotel owner account
    const created = await this.users.create(
      {
        username: dto.username,
        phone: dto.phone,
        name: dto.ownerName,
        password: dto.password,
        role: ROLE.HOTEL_OWNER,
        propertyId: property.id,
      },
      ROLE.ADMIN,
    );

    const tokens = await this.generateTokens(
      created.id,
      created.role,
      created.propertyId ?? undefined,
      created.name,
    );
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.users.setHashedRefreshToken(created.id, refreshHash);

    await this.users.logAction(created.id, 'REGISTER_SUCCESS', undefined, {
      hotelSlug: dto.hotelSlug,
      username: dto.username,
    });

    const safe = this.stripSensitive(created);
    return { user: { ...safe, propertyName: property.name, propertySlug: property.slug }, ...tokens };
  }

  async login(dto: LoginDto, ipAddress?: string) {
    // Find property by slug
    const property = await this.properties.findBySlug(dto.hotelSlug);
    if (!property) {
      await this.users.logAction(undefined, 'LOGIN_FAIL', ipAddress, {
        hotelSlug: dto.hotelSlug,
        reason: 'Property not found',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Find user by username within this property
    const user = await this.users.findByUsernameAndProperty(dto.username, property.id);
    if (!user) {
      await this.users.logAction(undefined, 'LOGIN_FAIL', ipAddress, {
        hotelSlug: dto.hotelSlug,
        username: dto.username,
        reason: 'User not found',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isLocked) {
      await this.users.logAction(user.id, 'LOGIN_FAIL', ipAddress, {
        reason: 'Account locked',
      });
      throw new ForbiddenException(
        'Account is locked due to too many failed login attempts.',
      );
    }

    if (!user.password) {
      throw new ForbiddenException('Tài khoản không có mật khẩu (đăng nhập qua Google)');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      await this.users.handleFailedLogin(user.id);
      await this.users.logAction(user.id, 'LOGIN_FAIL', ipAddress, {
        reason: 'Incorrect password',
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.users.resetFailedLogin(user.id);
    const tokens = await this.generateTokens(
      user.id,
      user.role,
      user.propertyId ?? undefined,
      user.name,
    );
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.users.setHashedRefreshToken(user.id, refreshHash);

    await this.users.logAction(user.id, 'LOGIN_SUCCESS', ipAddress, {
      role: user.role,
      hotelSlug: dto.hotelSlug,
    });

    const safe = this.stripSensitive(user);
    return { user: { ...safe, propertyName: property.name, propertySlug: property.slug }, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken) throw new ForbiddenException('Refresh token required');
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      const userRaw = await this.users.findOneRaw(payload.sub);
      if (!userRaw || !userRaw.hashedRefreshToken) {
        throw new ForbiddenException('Access denied');
      }
      const match = await bcrypt.compare(
        refreshToken,
        userRaw.hashedRefreshToken,
      );
      if (!match) throw new ForbiddenException('Access denied');
      const tokens = await this.generateTokens(
        payload.sub,
        payload.role,
        userRaw.propertyId || payload.propertyId,
        userRaw.name,
      );
      const newRefreshHash = await bcrypt.hash(tokens.refreshToken, 10);
      await this.users.setHashedRefreshToken(payload.sub, newRefreshHash);
      return tokens;
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.users.setHashedRefreshToken(userId, null);
    return { success: true };
  }

  async googleLogin(googleProfile: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }) {
    const user = await this.users.createOrUpdateGoogleUser(googleProfile);
    const tokens = await this.generateTokens(
      user.id,
      user.role,
      user.propertyId ?? undefined,
      user.name,
    );
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.users.setHashedRefreshToken(user.id, refreshHash);
    const safe = this.stripSensitive(user);
    return { user: safe, ...tokens };
  }

  async verifyGoogleToken(idToken: string) {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId || clientId === 'your_google_client_id_here') {
      throw new UnauthorizedException(
        'Google authentication is not configured',
      );
    }

    const client = new OAuth2Client(clientId);

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const googleProfile = {
        googleId: payload.sub,
        email: payload.email || '',
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        picture: payload.picture,
      };

      return await this.googleLogin(googleProfile);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new UnauthorizedException(
        'Failed to verify Google token: ' + message,
      );
    }
  }

  private async generateTokens(
    sub: string,
    role: ROLE,
    propertyId?: string,
    name?: string,
  ) {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = this.config.get<string>(
      'JWT_ACCESS_EXPIRES',
      '25h',
    );
    const refreshExpiresIn = this.config.get<string>(
      'JWT_REFRESH_EXPIRES',
      '90d',
    );
    const payload = { sub, role, propertyId, name };
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const accessToken = await this.jwt.signAsync(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn as any,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as any,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    return { accessToken, refreshToken };
  }

  // ── 2FA ──────────────────────────────────────────────────────────────
  async generate2FASecret(userId: string) {
    const user = await this.users.findOneRaw(userId);
    if (!user) throw new UnauthorizedException();

    const secretObj = speakeasy.generateSecret({
      name: `HotelPro (${user.phone ?? user.email ?? userId})`,
      length: 20,
    });

    const qrDataUrl = await QRCode.toDataURL(secretObj.otpauth_url!);
    await this.users.update2FASecret(userId, secretObj.base32);

    return { secret: secretObj.base32, qrDataUrl };
  }

  async enable2FA(userId: string, token: string) {
    const user = await this.users.findOneRaw(userId);
    if (!user?.twoFactorSecret) {
      throw new BadRequestException('2FA secret not generated. Call /auth/2fa/generate first.');
    }
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!valid) throw new BadRequestException('Invalid 2FA code');

    await this.users.set2FAEnabled(userId, true);
    return { success: true };
  }

  async disable2FA(userId: string, token: string) {
    const user = await this.users.findOneRaw(userId);
    if (!user?.twoFactorEnabled) {
      throw new BadRequestException('2FA is not enabled');
    }
    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret!,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!valid) throw new BadRequestException('Invalid 2FA code');

    await this.users.set2FAEnabled(userId, false);
    await this.users.update2FASecret(userId, null);
    return { success: true };
  }

  async verify2FAToken(userId: string, token: string): Promise<boolean> {
    const user = await this.users.findOneRaw(userId);
    if (!user?.twoFactorEnabled || !user.twoFactorSecret) return false;
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }

  private stripSensitive(user: Record<string, any>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRefreshToken, twoFactorSecret, ...rest } = user;
    return rest;
  }
}
