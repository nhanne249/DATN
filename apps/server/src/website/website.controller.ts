import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MANAGEMENT_ROLES } from '../auth/constants/role-groups.constant';
import { WebsiteService } from './website.service';
import { UpdateWebsiteConfigDto } from './dto/website.dto';

@ApiTags('Website')
@Controller('website')
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
@ApiBearerAuth()
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('config')
  @Roles(...MANAGEMENT_ROLES)
  @ApiOperation({ summary: 'Get website configuration' })
  getConfig(@Query('propertyId') propertyId: string) {
    return this.websiteService.getConfig(propertyId);
  }

  @Put('config')
  @Roles(...MANAGEMENT_ROLES)
  @ApiOperation({ summary: 'Update website configuration' })
  updateConfig(
    @Query('propertyId') propertyId: string,
    @Body() dto: UpdateWebsiteConfigDto,
  ) {
    return this.websiteService.updateConfig(propertyId, dto);
  }
}
