import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ROLE } from '../../user/enum/role';

export interface JwtPayload {
  sub: string;
  role: ROLE;
  propertyId?: string;
  iat?: number;
  exp?: number;
}

export interface RequestUser {
  id: string;
  role: ROLE;
  propertyId?: string;
}

const cookieTokenExtractor = (req: {
  headers?: { cookie?: string };
}): string | null => {
  const cookieHeader = req?.headers?.cookie;
  if (!cookieHeader) return null;

  const tokenPair = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('accessToken='));

  if (!tokenPair) return null;
  return decodeURIComponent(tokenPair.replace('accessToken=', ''));
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_ACCESS_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieTokenExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret || 'access_fallback_secret',
    });
  }

  validate(payload: JwtPayload): RequestUser {
    return {
      id: payload.sub,
      role: payload.role,
      propertyId: payload.propertyId,
    };
  }
}
