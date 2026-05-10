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
import { InventoryService } from './inventory.service';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  CreateInventoryTransactionDto,
} from './dto/inventory.dto';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // --- Items ---
  @Get('items')
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiQuery({ name: 'propertyId', required: true })
  findAllItems(@Query('propertyId') propertyId: string) {
    return this.inventoryService.findAllItems(propertyId);
  }

  @Get('items/low-stock')
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get items with stock below minimum' })
  @ApiQuery({ name: 'propertyId', required: true })
  findLowStockItems(@Query('propertyId') propertyId: string) {
    return this.inventoryService.findLowStockItems(propertyId);
  }

  @Post('items')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('CREATE_INVENTORY_ITEM')
  @ApiOperation({ summary: 'Create inventory item' })
  createItem(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.createItem(dto);
  }

  @Put('items/:id')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('UPDATE_INVENTORY_ITEM')
  @ApiOperation({ summary: 'Update inventory item' })
  updateItem(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto) {
    return this.inventoryService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('DELETE_INVENTORY_ITEM')
  @ApiOperation({ summary: 'Delete inventory item' })
  deleteItem(@Param('id') id: string) {
    return this.inventoryService.deleteItem(id);
  }

  // --- Transactions ---
  @Get('transactions')
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get inventory transactions' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'itemId', required: false })
  findTransactions(
    @Query('propertyId') propertyId: string,
    @Query('itemId') itemId?: string,
  ) {
    return this.inventoryService.findTransactions(propertyId, itemId);
  }

  @Post('transactions')
  @Roles(...STAFF_ROLES)
  @AuditLog('INVENTORY_TRANSACTION')
  @ApiOperation({ summary: 'Record stock IN / OUT / ADJUSTMENT' })
  createTransaction(
    @Body() dto: CreateInventoryTransactionDto,
    @Request() req: any,
  ) {
    return this.inventoryService.createTransaction(dto, req.user.id);
  }
}
