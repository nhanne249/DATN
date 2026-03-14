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
import { Roles } from '../auth/decorators/roles.decorator';
import { MANAGEMENT_ROLES } from '../auth/constants/role-groups.constant';

@ApiTags('Settings')
@Controller('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
@Roles(...MANAGEMENT_ROLES)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('categories')
  getCategories(
    @Query('propertyId') propertyId: string,
    @Query('type') type?: string,
  ) {
    return this.settingsService.getCategories(propertyId, type);
  }

  @Post('categories')
  createCategory(
    @Body() dto: { name: string; type?: string; propertyId: string },
  ) {
    return this.settingsService.createCategory(dto);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() dto: { name?: string; type?: string },
  ) {
    return this.settingsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.settingsService.removeCategory(id);
  }

  @Get('print-templates')
  getPrintTemplates(
    @Query('propertyId') propertyId: string,
    @Query('type') type?: string,
  ) {
    return this.settingsService.getPrintTemplates(propertyId, type);
  }

  @Get('print-templates/type/:type')
  getPrintTemplateByType(
    @Param('type') type: string,
    @Query('propertyId') propertyId: string,
  ) {
    return this.settingsService.getPrintTemplateByType(propertyId, type);
  }

  @Post('print-templates')
  upsertPrintTemplate(@Body() dto: CreatePrintTemplateDto) {
    return this.settingsService.upsertPrintTemplate(dto);
  }

  @Patch('print-templates/:id')
  updatePrintTemplate(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePrintTemplateDto>,
  ) {
    return this.settingsService.updatePrintTemplate(id, dto);
  }

  @Delete('print-templates/:id')
  removePrintTemplate(@Param('id') id: string) {
    return this.settingsService.removePrintTemplate(id);
  }
}
