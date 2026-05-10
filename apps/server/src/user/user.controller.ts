import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from './enum/role';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user (Admin only)' })
  @AuditLog('CREATE_USER')
  create(@Body() dto: CreateUserDto, @Request() req: RequestWithUser) {
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
  getProfile(@Request() req: RequestWithUser) {
    return this.userService.findOne(req.user.id);
  }

  // ── Property-scoped staff management (must be before :id routes) ──────────

  @Get('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER, ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List staff for current property' })
  listStaff(@Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.userService.findStaffByProperty(propertyId);
  }

  @Post('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER, ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create staff account for current property' })
  @AuditLog('CREATE_STAFF')
  createStaff(@Body() dto: CreateStaffDto, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.userService.createStaff(propertyId, dto, req.user.role);
  }

  @Patch('staff/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER, ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff account' })
  @AuditLog('UPDATE_STAFF')
  updateStaff(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @Request() req: RequestWithUser,
  ) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.userService.updateStaff(id, propertyId, dto, req.user.role);
  }

  @Delete('staff/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER, ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete staff account' })
  @AuditLog('DELETE_STAFF')
  removeStaff(@Param('id') id: string, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.userService.removeStaff(id, propertyId);
  }

  @Post('staff/:id/toggle-lock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER, ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lock/unlock staff account' })
  @AuditLog('TOGGLE_LOCK_STAFF')
  toggleStaffLock(@Param('id') id: string, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.userService.toggleStaffLock(id, propertyId);
  }

  // ── Generic :id routes (must be after all named routes) ──────────────────

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
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
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
  addAddress(
    @Request() req: RequestWithUser,
    @Body() dto: CreateUserAddressDto,
  ) {
    return this.userService.createUserAddress(req.user.id, dto);
  }

  @Get('address')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all my addresses' })
  getAddresses(@Request() req: RequestWithUser) {
    return this.userService.getUserAddresses(req.user.id);
  }

  @Get('address/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific address' })
  getAddress(@Request() req: RequestWithUser, @Param('id') addressId: string) {
    return this.userService.getUserAddress(req.user.id, addressId);
  }

  @Patch('address/:id')
  @AuditLog('UPDATE_USER_ADDRESS')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update address' })
  updateAddress(
    @Request() req: RequestWithUser,
    @Param('id') addressId: string,
    @Body() dto: UpdateUserAddressDto,
  ) {
    return this.userService.updateUserAddress(req.user.id, addressId, dto);
  }

  @Delete('address/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete address' })
  @AuditLog('DELETE_USER_ADDRESS')
  deleteAddress(
    @Request() req: RequestWithUser,
    @Param('id') addressId: string,
  ) {
    return this.userService.deleteUserAddress(req.user.id, addressId);
  }
}
