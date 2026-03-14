import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../user/enum/role';
import { OtaService } from './ota.service';
import {
  CreateOtaChannelDto,
  UpdateOtaChannelDto,
  CreateOtaMappingDto,
  OtaWebhookDto,
} from './dto/ota.dto';

@ApiTags('OTA')
@Controller('ota')
export class OtaController {
  constructor(private readonly otaService: OtaService) {}

  @Get('channels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all OTA channels for a property' })
  findAllChannels(@Query('propertyId') propertyId: string) {
    return this.otaService.findAllChannels(propertyId);
  }

  @Get('channels/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get OTA channel details' })
  findChannelById(@Param('id') id: string) {
    return this.otaService.findChannelById(id);
  }

  @Post('channels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new OTA channel' })
  createChannel(@Body() dto: CreateOtaChannelDto) {
    return this.otaService.createChannel(dto);
  }

  @Put('channels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update OTA channel' })
  updateChannel(@Param('id') id: string, @Body() dto: UpdateOtaChannelDto) {
    return this.otaService.updateChannel(id, dto);
  }

  @Delete('channels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete OTA channel' })
  deleteChannel(@Param('id') id: string) {
    return this.otaService.deleteChannel(id);
  }

  @Post('mappings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create OTA room mapping' })
  createMapping(@Body() dto: CreateOtaMappingDto) {
    return this.otaService.createMapping(dto);
  }

  @Delete('mappings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete OTA room mapping' })
  deleteMapping(@Param('id') id: string) {
    return this.otaService.deleteMapping(id);
  }

  @Get('channels/:id/logs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sync logs for a channel' })
  getSyncLogs(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.otaService.getSyncLogs(id, limit);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle OTA webhook' })
  processWebhook(@Body() payload: OtaWebhookDto) {
    return this.otaService.processWebhook(payload);
  }
}
