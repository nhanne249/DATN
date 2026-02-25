import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiOperation, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService, private readonly config: ConfigService) { }

    private setTokenCookie(res: Response, accessToken: string) {
        const expiresInStr = this.config.get<string>('JWT_ACCESS_EXPIRES', '25h');
        let maxAge = 25 * 60 * 60 * 1000; // default 25h in ms
        if (expiresInStr.endsWith('h')) {
            maxAge = parseInt(expiresInStr) * 60 * 60 * 1000;
        } else if (expiresInStr.endsWith('d')) {
            maxAge = parseInt(expiresInStr) * 24 * 60 * 60 * 1000;
        } else if (expiresInStr.endsWith('m')) {
            maxAge = parseInt(expiresInStr) * 60 * 1000;
        } else if (expiresInStr.endsWith('s')) {
            maxAge = parseInt(expiresInStr) * 1000;
        }

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: maxAge,
        });
    }

    @Post('register')
    @ApiOperation({
        summary: 'Đăng ký tài khoản mới',
        description: 'Tạo tài khoản mới với email và password. Trả về access token và refresh token sau khi đăng ký thành công.'
    })
    @ApiCreatedResponse({ description: 'User registered and tokens issued' })
    @ApiBadRequestResponse({ description: 'Email already exists or invalid data' })
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.auth.register(dto);
        this.setTokenCookie(res, result.accessToken);
        const { accessToken, ...rest } = result;
        return rest;
    }

    @Post('login')
    @ApiOperation({
        summary: 'Đăng nhập',
        description: 'Đăng nhập bằng email và password. Trả về access token và refresh token.'
    })
    @ApiOkResponse({ description: 'User authenticated, returns tokens' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // Extract IP address from request
        const ipstr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ipAddress = Array.isArray(ipstr) ? ipstr[0] : (typeof ipstr === 'string' ? ipstr.split(',')[0] : ipstr);

        const result = await this.auth.login(dto, ipAddress);
        this.setTokenCookie(res, result.accessToken);
        const { accessToken, ...rest } = result;
        return rest;
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({
        summary: 'Đăng nhập Google (Web)',
        description: 'Redirect đến trang đăng nhập Google OAuth. Dành cho web browser.'
    })
    @ApiOkResponse({ description: 'Redirects to Google OAuth' })
    async googleAuth() {
        // Guard redirects to Google
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({
        summary: 'Google OAuth callback',
        description: 'Endpoint nhận callback từ Google sau khi user đăng nhập thành công. Tạo/update user và trả về tokens.'
    })
    @ApiOkResponse({ description: 'Google OAuth callback, returns tokens' })
    async googleAuthCallback(@Req() req: Request & { user?: any }, @Res({ passthrough: true }) res: Response) {
        const googleUser = req.user;
        const result = await this.auth.googleLogin({
            googleId: googleUser.googleId,
            email: googleUser.email,
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            picture: googleUser.picture,
        });

        this.setTokenCookie(res, result.accessToken);
        const { accessToken, ...rest } = result;
        return rest;
    }

    @Post('google/mobile')
    @ApiOperation({
        summary: 'Đăng nhập Google (Mobile)',
        description: 'Xác thực Google ID Token từ mobile app (React Native, Flutter). Client gửi idToken sau khi đăng nhập với Google SDK.'
    })
    @ApiCreatedResponse({ description: 'Authenticate with Google ID Token from mobile app' })
    @ApiBadRequestResponse({ description: 'Invalid Google ID Token' })
    @ApiBody({ type: GoogleSignInDto })
    async googleMobileAuth(@Body() dto: GoogleSignInDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.auth.verifyGoogleToken(dto.idToken);
        this.setTokenCookie(res, result.accessToken);
        const { accessToken, ...rest } = result;
        return rest;
    }

    @Post('refresh')
    @ApiOperation({
        summary: 'Làm mới access token',
        description: 'Sử dụng refresh token để lấy access token và refresh token mới khi access token hết hạn.'
    })
    @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
    @ApiOkResponse({ description: 'New access & refresh tokens' })
    @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
    async refresh(@Body('refreshToken') refreshToken: string, @Res({ passthrough: true }) res: Response) {
        const result = await this.auth.refreshTokens(refreshToken);
        this.setTokenCookie(res, result.accessToken);
        const { accessToken, ...rest } = result;
        return rest;
    }

    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Đăng xuất',
        description: 'Đăng xuất và vô hiệu hóa refresh token của user.'
    })
    @ApiOkResponse({ description: 'User logged out (refresh token invalidated)' })
    @UseGuards(JwtAuthGuard)
    logout(@Req() req: Request & { user?: { id: string } }, @Res({ passthrough: true }) res: Response) {
        const id = req?.user?.id;
        res.clearCookie('accessToken');
        return this.auth.logout(id || '');
    }
}
