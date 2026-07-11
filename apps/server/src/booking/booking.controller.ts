import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateServiceUsageDto } from './dto/create-service-usage.dto';
import { Booking } from './entities/booking.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { STAFF_ROLES } from '../auth/constants/role-groups.constant';

@ApiTags('Bookings')
@Controller('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard, PermissionGuard)
@Roles(...STAFF_ROLES)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @AuditLog('CREATE_BOOKING')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, type: Booking })
  @RequirePermission('entity.booking', 'create')
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, type: [Booking] })
  @RequirePermission('entity.booking', 'view')
  findAll(
    @Query('propertyId') propertyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingService.findAll({
      propertyId,
      startDate,
      endDate,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({ status: 200, type: Booking })
  @RequirePermission('entity.booking', 'view')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @AuditLog('UPDATE_BOOKING')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, type: Booking })
  @RequirePermission('entity.booking', 'update')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(id, dto);
  }

  @Delete(':id')
  @AuditLog('DELETE_BOOKING')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @RequirePermission('entity.booking', 'delete')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  @Post(':id/payments')
  @AuditLog('ADD_BOOKING_PAYMENT')
  @ApiOperation({ summary: 'Add a payment to a booking' })
  @RequirePermission('entity.booking', 'update')
  addPayment(@Param('id') id: string, @Body() dto: CreatePaymentDto) {
    return this.bookingService.addPayment(id, dto);
  }

  @Post(':id/service-usages')
  @AuditLog('ADD_SERVICE_USAGE')
  @ApiOperation({ summary: 'Add a service usage to a booking' })
  @RequirePermission('entity.booking', 'update')
  addServiceUsage(@Param('id') id: string, @Body() dto: CreateServiceUsageDto) {
    return this.bookingService.addServiceUsage(id, dto);
  }

  @Get(':id/minibar')
  @ApiOperation({ summary: 'Get minibar consumption for a booking' })
  @RequirePermission('entity.booking', 'view')
  getMinibar(@Param('id') id: string) {
    return this.bookingService.getMinibarForBooking(id);
  }

  @Post(':id/cancel')
  @AuditLog('CANCEL_BOOKING')
  @ApiOperation({ summary: 'Cancel a booking' })
  @RequirePermission('entity.booking', 'update')
  cancel(@Param('id') id: string, @Body() dto: { reason?: string }) {
    return this.bookingService.cancelBooking(id, dto?.reason);
  }

  @Get('service-usages/:bookingId')
  @ApiOperation({ summary: 'Get service usages by booking' })
  @RequirePermission('entity.booking', 'view')
  findServiceUsages(@Param('bookingId') bookingId: string) {
    return this.bookingService.findServiceUsages(bookingId);
  }

  @Patch('service-usages/:id')
  @AuditLog('UPDATE_SERVICE_USAGE')
  @ApiOperation({ summary: 'Update a service usage' })
  @RequirePermission('entity.booking', 'update')
  updateServiceUsage(
    @Param('id') id: string,
    @Body() dto: { quantity?: number; unitPrice?: number; note?: string },
  ) {
    return this.bookingService.updateServiceUsage(id, dto);
  }

  @Delete('service-usages/:id')
  @AuditLog('DELETE_SERVICE_USAGE')
  @ApiOperation({ summary: 'Delete a service usage' })
  @RequirePermission('entity.booking', 'delete')
  removeServiceUsage(@Param('id') id: string) {
    return this.bookingService.removeServiceUsage(id);
  }
}
