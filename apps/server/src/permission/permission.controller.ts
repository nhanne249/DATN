import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ROLE } from '../user/enum/role';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

// ── DTOs ─────────────────────────────────────────────────────────────────────

class PermissionEntryDto {
  @IsString()
  resourceKey: string;

  @IsArray()
  @IsString({ each: true })
  actions: string[];
}

class CreateCustomRoleDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modules?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionEntryDto)
  permissions?: PermissionEntryDto[];
}

class UpdateCustomRoleDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  modules?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionEntryDto)
  permissions?: PermissionEntryDto[];
}

class AssignCustomRoleDto {
  @IsOptional()
  @IsString()
  customRoleId: string | null;
}

// ── Controller ────────────────────────────────────────────────────────────────

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Get the fine-grained permissions of the currently authenticated user.
   * Frontend uses this to determine which pages and actions are accessible.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my effective permissions (page + entity + action)' })
  async getMyPermissions(@Request() req: RequestWithUser) {
    const { id, role } = req.user;
    const roleCodes = await this.permissionService.getEffectiveRoleCodes(id, role);
    const permissions = await this.permissionService.getPermissionsForRoles(roleCodes);
    return { role, permissions };
  }

  // ── Custom Roles ─────────────────────────────────────────────────────────

  @Get('custom-roles')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
  @Roles(ROLE.INTERNAL_USER, ROLE.ADMIN)
  @RequirePermission('entity.permission', 'view')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List custom roles for current property' })
  getCustomRoles(@Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.permissionService.getCustomRoles(propertyId);
  }

  @Post('custom-roles')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
  @Roles(ROLE.INTERNAL_USER, ROLE.ADMIN)
  @RequirePermission('entity.permission', 'create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a custom role with fine-grained permissions' })
  @ApiBody({ type: CreateCustomRoleDto })
  createCustomRole(@Body() dto: CreateCustomRoleDto, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.permissionService.createCustomRole(
      propertyId,
      dto.name,
      dto.description ?? null,
      dto.modules ?? dto.permissions ?? [],
    );
  }

  @Get('custom-roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
  @Roles(ROLE.INTERNAL_USER, ROLE.ADMIN)
  @RequirePermission('entity.permission', 'view')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get permissions granted to a specific custom role' })
  getCustomRolePermissions(@Param('id') id: string, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.permissionService.getCustomRolePermissions(id, propertyId);
  }

  @Patch('custom-roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
  @Roles(ROLE.INTERNAL_USER, ROLE.ADMIN)
  @RequirePermission('entity.permission', 'update')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a custom role name/description/permissions' })
  updateCustomRole(
    @Param('id') id: string,
    @Body() dto: UpdateCustomRoleDto,
    @Request() req: RequestWithUser,
  ) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.permissionService.updateCustomRole(id, propertyId, {
      name: dto.name,
      description: dto.description,
      modules: dto.modules,
      permissions: dto.permissions,
    });
  }

  @Delete('custom-roles/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
  @Roles(ROLE.INTERNAL_USER, ROLE.ADMIN)
  @RequirePermission('entity.permission', 'delete')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a custom role (unassigns from all users)' })
  deleteCustomRole(@Param('id') id: string, @Request() req: RequestWithUser) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.permissionService.deleteCustomRole(id, propertyId);
  }

  @Patch('custom-roles/:id/assign/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
  @Roles(ROLE.INTERNAL_USER, ROLE.ADMIN)
  @RequirePermission('entity.permission', 'manage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign or unassign a custom role to/from a user' })
  assignCustomRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: AssignCustomRoleDto,
    @Request() req: RequestWithUser,
  ) {
    const propertyId = req.user.propertyId;
    if (!propertyId) throw new ForbiddenException('No property associated with this account');
    return this.permissionService.assignCustomRoleToUser(userId, dto.customRoleId, propertyId);
  }
}
