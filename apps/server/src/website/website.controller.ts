import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../user/enum/role';
import { WebsiteService } from './website.service';
import { UpdateWebsiteConfigDto } from './dto/website.dto';

@ApiTags('Website')
@Controller('website')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('config')
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Get website configuration' })
  getConfig(@Query('propertyId') propertyId: string) {
    return this.websiteService.getConfig(propertyId);
  }

  @Put('config')
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Update website configuration' })
  updateConfig(@Query('propertyId') propertyId: string, @Body() dto: UpdateWebsiteConfigDto) {
    return this.websiteService.updateConfig(propertyId, dto);
  }
}
