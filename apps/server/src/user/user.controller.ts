import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from './enum/role';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create user (Admin only)' })
    @AuditLog('CREATE_USER')
    create(@Body() dto: CreateUserDto, @Request() req: any) {
        return this.userService.create(dto, req.user.role);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all users (Admin only)' })
    findAll() {
        return this.userService.findAll();
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Request() req: any) {
        return this.userService.findOne(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user by ID (Admin only)' })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user (Admin only)' })
    @AuditLog('UPDATE_USER')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Request() req: any) {
        return this.userService.update(id, dto, req.user.role);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLE.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user (Admin only)' })
    @AuditLog('DELETE_USER')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }

    // Address endpoints
    @Post('address')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add a new address' })
    @AuditLog('CREATE_USER_ADDRESS')
    addAddress(@Request() req: any, @Body() dto: CreateUserAddressDto) {
        return this.userService.createUserAddress(req.user.id, dto);
    }

    @Get('address')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all my addresses' })
    getAddresses(@Request() req: any) {
        return this.userService.getUserAddresses(req.user.id);
    }

    @Get('address/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get specific address' })
    getAddress(@Request() req: any, @Param('id') addressId: string) {
        return this.userService.getUserAddress(req.user.id, addressId);
    }

    @Patch('address/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update address' })
    updateAddress(@Request() req: any, @Param('id') addressId: string, @Body() dto: UpdateUserAddressDto) {
        return this.userService.updateUserAddress(req.user.id, addressId, dto);
    }

    @Delete('address/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete address' })
    @AuditLog('DELETE_USER_ADDRESS')
    deleteAddress(@Request() req: any, @Param('id') addressId: string) {
        return this.userService.deleteUserAddress(req.user.id, addressId);
    }
}
