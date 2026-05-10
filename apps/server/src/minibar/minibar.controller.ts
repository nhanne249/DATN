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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  MANAGEMENT_ROLES,
  STAFF_ROLES,
} from '../auth/constants/role-groups.constant';
import { MinibarService } from './minibar.service';
import {
  CreateMinibarItemDto,
  UpdateMinibarItemDto,
  CreateMinibarTransactionDto,
} from './dto/minibar.dto';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';

@ApiTags('Minibar')
@Controller('minibar')
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
@ApiBearerAuth()
export class MinibarController {
  constructor(private readonly minibarService: MinibarService) {}

  // --- Items ---
  @Get('items')
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get all minibar items for property' })
  @ApiQuery({ name: 'propertyId', required: true })
  findAllItems(@Query('propertyId') propertyId: string) {
    return this.minibarService.findAllItems(propertyId);
  }

  @Post('items')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('CREATE_MINIBAR_ITEM')
  @ApiOperation({ summary: 'Create minibar item' })
  createItem(@Body() dto: CreateMinibarItemDto) {
    return this.minibarService.createItem(dto);
  }

  @Put('items/:id')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('UPDATE_MINIBAR_ITEM')
  @ApiOperation({ summary: 'Update minibar item' })
  updateItem(@Param('id') id: string, @Body() dto: UpdateMinibarItemDto) {
    return this.minibarService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('DELETE_MINIBAR_ITEM')
  @ApiOperation({ summary: 'Delete minibar item' })
  deleteItem(@Param('id') id: string) {
    return this.minibarService.deleteItem(id);
  }

  // --- Transactions ---
  @Get('transactions')
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get minibar transactions' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'bookingRoomId', required: false })
  findTransactions(
    @Query('propertyId') propertyId: string,
    @Query('roomId') roomId?: string,
    @Query('bookingRoomId') bookingRoomId?: string,
  ) {
    return this.minibarService.findTransactions(propertyId, roomId, bookingRoomId);
  }

  @Post('transactions')
  @Roles(...STAFF_ROLES)
  @AuditLog('MINIBAR_TRANSACTION')
  @ApiOperation({ summary: 'Record minibar consumption or restock' })
  createTransaction(
    @Body() dto: CreateMinibarTransactionDto,
    @Request() req: any,
  ) {
    return this.minibarService.createTransaction(dto, req.user.id);
  }

  @Get('summary/:bookingRoomId')
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get minibar consumption summary for a booking room' })
  @ApiQuery({ name: 'propertyId', required: true })
  getConsumptionSummary(
    @Param('bookingRoomId') bookingRoomId: string,
    @Query('propertyId') propertyId: string,
  ) {
    return this.minibarService.getConsumptionSummary(propertyId, bookingRoomId);
  }
}
