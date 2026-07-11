import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { CreatePrintTemplateDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { MANAGEMENT_ROLES } from '../auth/constants/role-groups.constant';

@ApiTags('Settings')
@Controller('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard, PermissionGuard)
@Roles(...MANAGEMENT_ROLES)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('categories')
  @RequirePermission('entity.permission', 'view')
  getCategories(
    @Query('propertyId') propertyId: string,
    @Query('type') type?: string,
  ) {
    return this.settingsService.getCategories(propertyId, type);
  }

  @Post('categories')
  @RequirePermission('entity.permission', 'create')
  createCategory(
    @Body() dto: { name: string; type?: string; propertyId: string },
  ) {
    return this.settingsService.createCategory(dto);
  }

  @Patch('categories/:id')
  @RequirePermission('entity.permission', 'update')
  updateCategory(
    @Param('id') id: string,
    @Body() dto: { name?: string; type?: string },
  ) {
    return this.settingsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @RequirePermission('entity.permission', 'delete')
  removeCategory(@Param('id') id: string) {
    return this.settingsService.removeCategory(id);
  }

  @Get('print-templates')
  @RequirePermission('entity.permission', 'view')
  getPrintTemplates(
    @Query('propertyId') propertyId: string,
    @Query('type') type?: string,
  ) {
    return this.settingsService.getPrintTemplates(propertyId, type);
  }

  @Get('print-templates/type/:type')
  @RequirePermission('entity.permission', 'view')
  getPrintTemplateByType(
    @Param('type') type: string,
    @Query('propertyId') propertyId: string,
  ) {
    return this.settingsService.getPrintTemplateByType(propertyId, type);
  }

  @Post('print-templates')
  @RequirePermission('entity.permission', 'create')
  upsertPrintTemplate(@Body() dto: CreatePrintTemplateDto) {
    return this.settingsService.upsertPrintTemplate(dto);
  }

  @Patch('print-templates/:id')
  @RequirePermission('entity.permission', 'update')
  updatePrintTemplate(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePrintTemplateDto>,
  ) {
    return this.settingsService.updatePrintTemplate(id, dto);
  }

  @Delete('print-templates/:id')
  @RequirePermission('entity.permission', 'delete')
  removePrintTemplate(@Param('id') id: string) {
    return this.settingsService.removePrintTemplate(id);
  }
}

