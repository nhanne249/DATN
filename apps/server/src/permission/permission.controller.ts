import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../user/enum/role';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';

class UpdateModulesDto {
  @IsArray()
  modules: string[];
}

class CreateCustomRoleDto {
  @IsString() @Length(1, 100)
  name: string;

  @IsEnum(ROLE)
  baseRole: ROLE;

  @IsArray()
  modules: string[];
}

class UpdateCustomRoleDto {
  @IsOptional() @IsString() @Length(1, 100)
  name?: string;

  @IsOptional() @IsEnum(ROLE)
  baseRole?: ROLE;

  @IsOptional() @IsArray()
  modules?: string[];
}

const FULL_ACCESS: ROLE[] = [ROLE.ADMIN, ROLE.HOTEL_OWNER];

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // ── Built-in role matrix ─────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER, ROLE.ADMIN)
  @ApiBearerAuth()
  getMatrix(@Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property');
    return this.permissionService.getMatrix(propertyId);
  }

  @Get('my-modules')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyModules(@Request() req: RequestWithUser) {
    const { propertyId, role, id } = req.user;
    if (FULL_ACCESS.includes(role)) return { modules: null };
    if (!propertyId) return { modules: null };
    const modules = await this.permissionService.getModulesForUser(propertyId, role, id);
    return { modules };
  }

  @Put(':role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.ADMIN)
  @ApiBearerAuth()
  updateRoleModules(
    @Param('role') role: string,
    @Body() body: UpdateModulesDto,
    @Request() req: RequestWithUser,
  ) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property');
    return this.permissionService.updateRoleModules(propertyId, role, body.modules);
  }

  @Delete(':role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.ADMIN)
  @ApiBearerAuth()
  resetRole(@Param('role') role: string, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property');
    return this.permissionService.resetRoleModules(propertyId, role);
  }

  // ── Custom roles (must be before :role wildcard routes) ──────────────────

  @Get('custom-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER, ROLE.ADMIN)
  @ApiBearerAuth()
  getCustomRoles(@Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property');
    return this.permissionService.getCustomRoles(propertyId);
  }

  @Post('custom-roles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.ADMIN)
  @ApiBearerAuth()
  createCustomRole(@Body() dto: CreateCustomRoleDto, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property');
    return this.permissionService.createCustomRole(propertyId, dto.name, dto.baseRole, dto.modules);
  }

  @Patch('custom-roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.ADMIN)
  @ApiBearerAuth()
  updateCustomRole(
    @Param('id') id: string,
    @Body() dto: UpdateCustomRoleDto,
    @Request() req: RequestWithUser,
  ) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property');
    return this.permissionService.updateCustomRole(id, propertyId, dto);
  }

  @Delete('custom-roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.HOTEL_OWNER, ROLE.ADMIN)
  @ApiBearerAuth()
  deleteCustomRole(@Param('id') id: string, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property');
    return this.permissionService.deleteCustomRole(id, propertyId);
  }
}
