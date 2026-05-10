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
  Req,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MANAGEMENT_ROLES, STAFF_ROLES } from '../auth/constants/role-groups.constant';
import { OtaService } from './ota.service';
import {
  CreateOtaChannelDto,
  UpdateOtaChannelDto,
  CreateOtaMappingDto,
  GetOtaChannelsQueryDto,
  PushAriBodyDto,
} from './dto/ota.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';

@ApiTags('OTA')
@Controller('ota')
export class OtaController {
  constructor(private readonly otaService: OtaService) {}

  @Get('channels')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...STAFF_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all OTA channels for a property' })
  findAllChannels(@Req() req: RequestWithUser, @Query() query: GetOtaChannelsQueryDto) {
    return this.otaService.findAllChannels(query.propertyId, req.user);
  }

  @Get('channels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...STAFF_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get OTA channel details' })
  findChannelById(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.otaService.findChannelById(id, req.user);
  }

  @Post('channels')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @AuditLog('CREATE_OTA_CHANNEL')
  @ApiOperation({ summary: 'Create a new OTA channel' })
  createChannel(@Req() req: RequestWithUser, @Body() dto: CreateOtaChannelDto) {
    return this.otaService.createChannel(dto, req.user);
  }

  @Put('channels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @AuditLog('UPDATE_OTA_CHANNEL')
  @ApiOperation({ summary: 'Update OTA channel' })
  updateChannel(@Req() req: RequestWithUser, @Param('id') id: string, @Body() dto: UpdateOtaChannelDto) {
    return this.otaService.updateChannel(id, dto, req.user);
  }

  @Delete('channels/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @AuditLog('DELETE_OTA_CHANNEL')
  @ApiOperation({ summary: 'Delete OTA channel' })
  deleteChannel(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.otaService.deleteChannel(id, req.user);
  }

  @Post('channels/:id/refresh')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manual refresh / mark last sync time' })
  refreshChannel(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.otaService.refreshChannel(id, req.user);
  }

  @Post('channels/:id/push-ari')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @AuditLog('PUSH_ARI')
  @ApiOperation({ summary: 'Push availability/rates to Channex' })
  pushARI(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: PushAriBodyDto,
  ) {
    return this.otaService.pushChannelARI(id, body, req.user);
  }

  @Post('channels/:id/pull-reservations')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @AuditLog('PULL_RESERVATIONS')
  @ApiOperation({ summary: 'Pull reservations from Channex and sync to bookings' })
  pullReservations(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.otaService.pullAndSyncReservations(id, req.user);
  }

  @Post('mappings')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @AuditLog('CREATE_OTA_MAPPING')
  @ApiOperation({ summary: 'Create OTA room mapping' })
  createMapping(@Req() req: RequestWithUser, @Body() dto: CreateOtaMappingDto) {
    return this.otaService.createMapping(dto, req.user);
  }

  @Delete('mappings/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @AuditLog('DELETE_OTA_MAPPING')
  @ApiOperation({ summary: 'Delete OTA room mapping' })
  deleteMapping(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.otaService.deleteMapping(id, req.user);
  }

  @Get('channels/:id/logs')
  @UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
  @Roles(...STAFF_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sync logs for a channel' })
  getSyncLogs(@Req() req: RequestWithUser, @Param('id') id: string, @Query('limit') limit?: number) {
    return this.otaService.getSyncLogs(id, limit, req.user);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle OTA/Channex webhook (public — no auth)' })
  processWebhook(
    @Body() body: any,
    @Headers('x-channex-signature') channexSig?: string,
    @Headers('x-ota-signature') otaSig?: string,
  ) {
    return this.otaService.processWebhook(body, channexSig || otaSig);
  }
}
