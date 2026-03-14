import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { STAFF_ROLES } from '../auth/constants/role-groups.constant';
import { PortalService } from './portal.service';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('Portal')
@Controller('dashboard/portal')
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
@ApiBearerAuth()
@Roles(...STAFF_ROLES)
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get('calendar/monthly')
  @ApiOperation({ summary: 'Get monthly calendar analytics' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  getMonthlyCalendar(
    @Query('propertyId') propertyId: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.portalService.getMonthlyCalendar(
      propertyId,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );
  }

  @Get('calendar/monthly/export')
  @ApiOperation({ summary: 'Export monthly calendar data' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  exportMonthlyCalendar(
    @Req() req: RequestWithUser,
    @Query('propertyId') propertyId: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.portalService.exportMonthlyCalendar(
      propertyId,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
      req.user.id,
    );
  }

  @Get('calendar/share')
  @ApiOperation({ summary: 'Get calendar share links' })
  @ApiQuery({ name: 'propertyId', required: true })
  getCalendarShare(@Query('propertyId') propertyId: string) {
    return this.portalService.getCalendarShares(propertyId);
  }

  @Post('calendar/share')
  @ApiOperation({ summary: 'Create a calendar share link' })
  createCalendarShare(
    @Req() req: RequestWithUser,
    @Body()
    dto: {
      propertyId: string;
      name: string;
      scope: string;
      audience: string;
      expiresAt: string;
      url?: string;
    },
  ) {
    return this.portalService.createCalendarShare(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Patch('calendar/share/:id/revoke')
  @ApiOperation({ summary: 'Revoke a calendar share link' })
  revokeCalendarShare(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: { propertyId: string },
  ) {
    return this.portalService.revokeCalendarShare(
      dto.propertyId,
      id,
      req.user.id,
    );
  }

  @Get('channel-manager/restrictions')
  @ApiOperation({ summary: 'Get channel restrictions overview' })
  @ApiQuery({ name: 'propertyId', required: true })
  getChannelRestrictions(@Query('propertyId') propertyId: string) {
    return this.portalService.getChannelRestrictions(propertyId);
  }

  @Post('channel-manager/restrictions')
  @ApiOperation({ summary: 'Create channel restriction' })
  createChannelRestriction(
    @Req() req: RequestWithUser,
    @Body()
    dto: {
      propertyId: string;
      rule: string;
      channel: string;
      scope: string;
      value: string;
      status?: string;
    },
  ) {
    return this.portalService.createChannelRestriction(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Patch('channel-manager/restrictions/:id')
  @ApiOperation({ summary: 'Update channel restriction' })
  updateChannelRestriction(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body()
    dto: {
      propertyId: string;
      rule?: string;
      channel?: string;
      scope?: string;
      value?: string;
      status?: string;
    },
  ) {
    return this.portalService.updateChannelRestriction(
      dto.propertyId,
      id,
      req.user.id,
      dto,
    );
  }

  @Post('channel-manager/restrictions/bulk-apply')
  @ApiOperation({ summary: 'Bulk apply status for restrictions' })
  bulkApplyRestrictions(
    @Req() req: RequestWithUser,
    @Body()
    dto: { propertyId: string; ids: string[]; status: string },
  ) {
    return this.portalService.bulkApplyChannelRestrictions(
      dto.propertyId,
      req.user.id,
      dto.ids || [],
      dto.status,
    );
  }

  @Get('channel-manager/messages')
  @ApiOperation({ summary: 'Get channel inbox messages' })
  @ApiQuery({ name: 'propertyId', required: true })
  getChannelMessages(@Query('propertyId') propertyId: string) {
    return this.portalService.getChannelMessages(propertyId);
  }

  @Post('channel-manager/messages/:id/assign')
  @ApiOperation({ summary: 'Assign a message to staff' })
  assignChannelMessage(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: { propertyId: string; assignee: string; note?: string },
  ) {
    return this.portalService.assignChannelMessage(
      dto.propertyId,
      id,
      req.user.id,
      dto,
    );
  }

  @Post('channel-manager/messages/template')
  @ApiOperation({ summary: 'Create message response template' })
  createMessageTemplate(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string; title: string; content: string },
  ) {
    return this.portalService.createMessageTemplate(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Get('channel-manager/allocation')
  @ApiOperation({ summary: 'Get channel allocation overview' })
  @ApiQuery({ name: 'propertyId', required: true })
  getChannelAllocation(@Query('propertyId') propertyId: string) {
    return this.portalService.getChannelAllocation(propertyId);
  }

  @Post('channel-manager/allocation/recalculate')
  @ApiOperation({ summary: 'Recalculate channel allocation' })
  recalculateAllocation(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string },
  ) {
    return this.portalService.recalculateAllocation(
      dto.propertyId,
      req.user.id,
    );
  }

  @Post('channel-manager/allocation/rule')
  @ApiOperation({ summary: 'Create or update allocation rule' })
  upsertAllocationRule(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string; roomTypeId: string; allocation: string },
  ) {
    return this.portalService.upsertAllocationRule(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Get('channel-manager/reviews')
  @ApiOperation({ summary: 'Get channel reviews overview' })
  @ApiQuery({ name: 'propertyId', required: true })
  getChannelReviews(@Query('propertyId') propertyId: string) {
    return this.portalService.getChannelReviews(propertyId);
  }

  @Post('channel-manager/reviews/export')
  @ApiOperation({ summary: 'Export channel reviews' })
  exportChannelReviews(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string },
  ) {
    return this.portalService.exportChannelReviews(dto.propertyId, req.user.id);
  }

  @Post('channel-manager/reviews/template')
  @ApiOperation({ summary: 'Create review response template' })
  createReviewTemplate(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string; title: string; content: string },
  ) {
    return this.portalService.createReviewTemplate(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Get('channel-manager/dynamic-pricing')
  @ApiOperation({ summary: 'Get dynamic pricing overview' })
  @ApiQuery({ name: 'propertyId', required: true })
  getDynamicPricing(@Query('propertyId') propertyId: string) {
    return this.portalService.getDynamicPricing(propertyId);
  }

  @Post('channel-manager/dynamic-pricing/simulate')
  @ApiOperation({ summary: 'Simulate dynamic pricing changes' })
  simulateDynamicPricing(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string; percent?: number },
  ) {
    return this.portalService.simulateDynamicPricing(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Post('channel-manager/dynamic-pricing/apply')
  @ApiOperation({ summary: 'Apply dynamic pricing to room type' })
  applyDynamicPricing(
    @Req() req: RequestWithUser,
    @Body()
    dto: { propertyId: string; roomTypeId: string; adjustmentPercent: number },
  ) {
    return this.portalService.applyDynamicPricing(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Get('channel-manager/history')
  @ApiOperation({ summary: 'Get channel sync history' })
  @ApiQuery({ name: 'propertyId', required: true })
  getChannelHistory(@Query('propertyId') propertyId: string) {
    return this.portalService.getChannelHistory(propertyId);
  }

  @Get('channel-manager/history/export')
  @ApiOperation({ summary: 'Export channel history data' })
  exportChannelHistory(
    @Req() req: RequestWithUser,
    @Query('propertyId') propertyId: string,
  ) {
    return this.portalService.exportChannelHistory(propertyId, req.user.id);
  }

  @Post('channel-manager/history/resync')
  @ApiOperation({ summary: 'Trigger manual re-sync' })
  resyncChannels(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string; channelId?: string },
  ) {
    return this.portalService.resyncChannels(
      dto.propertyId,
      req.user.id,
      dto.channelId,
    );
  }

  @Post('channel-manager/channels/connect')
  @ApiOperation({ summary: 'Connect a new OTA channel from portal page' })
  connectChannel(
    @Req() req: RequestWithUser,
    @Body()
    dto: {
      propertyId: string;
      name: string;
      type: string;
      credentials?: Record<string, unknown>;
    },
  ) {
    return this.portalService.connectChannel(dto.propertyId, req.user.id, dto);
  }

  @Post('channel-manager/channels/:id/refresh')
  @ApiOperation({ summary: 'Refresh single OTA channel' })
  refreshChannel(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: { propertyId: string },
  ) {
    return this.portalService.refreshChannel(dto.propertyId, id, req.user.id);
  }

  @Get('finance/recurring')
  @ApiOperation({ summary: 'Get recurring expenses' })
  @ApiQuery({ name: 'propertyId', required: true })
  getRecurringExpenses(@Query('propertyId') propertyId: string) {
    return this.portalService.getRecurringExpenses(propertyId);
  }

  @Post('finance/recurring')
  @ApiOperation({ summary: 'Create recurring expense entry' })
  createRecurringExpense(
    @Req() req: RequestWithUser,
    @Body()
    dto: {
      propertyId: string;
      title: string;
      amount: number;
      interval: string;
      nextDueDate: string;
      category?: string;
      description?: string;
    },
  ) {
    return this.portalService.createRecurringExpense(
      dto.propertyId,
      req.user.id,
      dto,
    );
  }

  @Get('finance/e-invoices')
  @ApiOperation({ summary: 'Get e-invoices list' })
  @ApiQuery({ name: 'propertyId', required: true })
  getEInvoices(@Query('propertyId') propertyId: string) {
    return this.portalService.getEInvoices(propertyId);
  }

  @Post('finance/e-invoices')
  @ApiOperation({ summary: 'Create manual e-invoice entry' })
  createEInvoice(
    @Req() req: RequestWithUser,
    @Body()
    dto: {
      propertyId: string;
      customerName: string;
      total: number;
      bookingCode?: string;
    },
  ) {
    return this.portalService.createEInvoice(dto.propertyId, req.user.id, dto);
  }

  @Post('finance/e-invoices/sync')
  @ApiOperation({ summary: 'Sync e-invoices to provider' })
  syncEInvoices(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId: string },
  ) {
    return this.portalService.syncEInvoices(dto.propertyId, req.user.id);
  }

  @Get('account/summary')
  @ApiOperation({ summary: 'Get account summary for current user' })
  getAccountSummary(@Req() req: RequestWithUser) {
    return this.portalService.getAccountSummary(req.user.id);
  }

  @Patch('account/profile')
  @ApiOperation({ summary: 'Update current user profile from portal page' })
  updateAccountProfile(
    @Req() req: RequestWithUser,
    @Body() dto: { name?: string; phone?: string; email?: string },
  ) {
    return this.portalService.updateAccountProfile(req.user.id, dto);
  }

  @Patch('account/password')
  @ApiOperation({ summary: 'Update current user password from portal page' })
  updateAccountPassword(
    @Req() req: RequestWithUser,
    @Body() dto: { currentPassword: string; newPassword: string },
  ) {
    return this.portalService.updateAccountPassword(req.user.id, dto);
  }

  @Post('account/logout-all')
  @ApiOperation({ summary: 'Logout all sessions for current user' })
  logoutAll(@Req() req: RequestWithUser) {
    return this.portalService.logoutAllSessions(req.user.id);
  }

  @Get('help/faqs')
  @ApiOperation({ summary: 'Get help faqs and live support stats' })
  @ApiQuery({ name: 'propertyId', required: false })
  getHelpFaq(@Query('propertyId') propertyId?: string) {
    return this.portalService.getHelpFaq(propertyId);
  }

  @Post('help/search')
  @ApiOperation({ summary: 'Track help search from portal' })
  trackHelpSearch(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId?: string; query: string },
  ) {
    return this.portalService.trackHelpSearch(dto.propertyId, req.user.id, dto);
  }

  @Post('help/guide/open')
  @ApiOperation({ summary: 'Track opening quick guide' })
  trackGuideOpen(
    @Req() req: RequestWithUser,
    @Body() dto: { propertyId?: string; topic: string },
  ) {
    return this.portalService.trackGuideOpen(dto.propertyId, req.user.id, dto);
  }
}
