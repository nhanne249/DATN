import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface GoogleProfile {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  private parseDurationMs(str: string, defaultMs: number): number {
    if (str.endsWith('h')) return parseInt(str) * 60 * 60 * 1000;
    if (str.endsWith('d')) return parseInt(str) * 24 * 60 * 60 * 1000;
    if (str.endsWith('m')) return parseInt(str) * 60 * 1000;
    if (str.endsWith('s')) return parseInt(str) * 1000;
    return defaultMs;
  }

  private setTokenCookie(res: Response, accessToken: string) {
    const expiresInStr = this.config.get<string>('JWT_ACCESS_EXPIRES', '25h');
    const maxAge = this.parseDurationMs(expiresInStr, 25 * 60 * 60 * 1000);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
    });
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    const expiresInStr = this.config.get<string>('JWT_REFRESH_EXPIRES', '90d');
    const maxAge = this.parseDurationMs(expiresInStr, 90 * 24 * 60 * 60 * 1000);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });
  }

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản mới',
    description:
      'Tạo tài khoản mới với email và password. Trả về access token và refresh token sau khi đăng ký thành công.',
  })
  @ApiCreatedResponse({ description: 'User registered and tokens issued' })
  @ApiBadRequestResponse({
    description: 'Email already exists or invalid data',
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, ...rest } = await this.auth.register(dto);
    this.setTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);
    return rest;
  }

  @Post('login')
  @ApiOperation({
    summary: 'Đăng nhập',
    description:
      'Đăng nhập bằng email và password. Trả về access token và refresh token.',
  })
  @ApiOkResponse({ description: 'User authenticated, returns tokens' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Extract IP address from request
    const ipstr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipAddress = Array.isArray(ipstr)
      ? ipstr[0]
      : typeof ipstr === 'string'
        ? ipstr.split(',')[0]
        : ipstr;

    const { accessToken, refreshToken, ...rest } = await this.auth.login(dto, ipAddress);
    this.setTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);
    return rest;
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Đăng nhập Google (Web)',
    description:
      'Redirect đến trang đăng nhập Google OAuth. Dành cho web browser.',
  })
  @ApiOkResponse({ description: 'Redirects to Google OAuth' })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Endpoint nhận callback từ Google sau khi user đăng nhập thành công. Tạo/update user và trả về tokens.',
  })
  @ApiOkResponse({ description: 'Google OAuth callback, returns tokens' })
  async googleAuthCallback(
    @Req() req: Request & { user?: GoogleProfile },
    @Res({ passthrough: true }) res: Response,
  ) {
    const googleUser = req.user;
    if (!googleUser) {
      throw new Error('Google user not found in request');
    }
    const { accessToken, refreshToken, ...result } = await this.auth.googleLogin({
      googleId: googleUser.googleId,
      email: googleUser.email,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      picture: googleUser.picture,
    });

    this.setTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);
    return result;
  }

  @Post('google/mobile')
  @ApiOperation({
    summary: 'Đăng nhập Google (Mobile)',
    description:
      'Xác thực Google ID Token từ mobile app (React Native, Flutter). Client gửi idToken sau khi đăng nhập với Google SDK.',
  })
  @ApiCreatedResponse({
    description: 'Authenticate with Google ID Token from mobile app',
  })
  @ApiBadRequestResponse({ description: 'Invalid Google ID Token' })
  @ApiBody({ type: GoogleSignInDto })
  async googleMobileAuth(
    @Body() dto: GoogleSignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, ...rest } = await this.auth.verifyGoogleToken(
      dto.idToken,
    );
    this.setTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);
    return rest;
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Làm mới access token',
    description:
      'Đọc refresh token từ httpOnly cookie hoặc body. Trả về access token & refresh token mới.',
  })
  @ApiBody({
    schema: { properties: { refreshToken: { type: 'string' } } },
    required: false,
  })
  @ApiOkResponse({ description: 'New access & refresh tokens' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() req: Request,
    @Body('refreshToken') bodyRefreshToken: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Prefer cookie, fall back to request body for backward-compat / mobile clients
    const cookieRefreshToken = (req as Request & { cookies?: Record<string, string> }).cookies
      ?.['refreshToken'];
    const token = cookieRefreshToken || bodyRefreshToken;
    const { accessToken, refreshToken, ...rest } =
      await this.auth.refreshTokens(token as string);
    this.setTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);
    return rest;
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Đăng xuất và vô hiệu hóa refresh token của user.',
  })
  @ApiOkResponse({ description: 'User logged out (refresh token invalidated)' })
  @UseGuards(JwtAuthGuard)
  logout(
    @Req() req: Request & { user?: { id: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = req?.user?.id;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/' });
    return this.auth.logout(id || '');
  }

  // ── 2FA ────────────────────────────────────────────────────────────────────

  @Post('2fa/generate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate 2FA secret and QR code' })
  generate2FA(@NestRequest() req: any) {
    return this.auth.generate2FASecret(req.user.id);
  }

  @Post('2fa/enable')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Enable 2FA by verifying the first TOTP code' })
  @ApiBody({ schema: { properties: { token: { type: 'string' } } } })
  enable2FA(@NestRequest() req: any, @Body('token') token: string) {
    return this.auth.enable2FA(req.user.id, token);
  }

  @Post('2fa/disable')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiBody({ schema: { properties: { token: { type: 'string' } } } })
  disable2FA(@NestRequest() req: any, @Body('token') token: string) {
    return this.auth.disable2FA(req.user.id, token);
  }

  @Post('2fa/verify')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify a TOTP code' })
  @ApiBody({ schema: { properties: { token: { type: 'string' } } } })
  async verify2FA(@NestRequest() req: any, @Body('token') token: string) {
    const valid = await this.auth.verify2FAToken(req.user.id, token);
    return { valid };
  }
}
