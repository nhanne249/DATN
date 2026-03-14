import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateServiceUsageDto } from './dto/create-service-usage.dto';
import { Booking } from './entities/booking.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';

@ApiTags('Bookings')
@Controller('bookings')
@UseInterceptors(AuditLogInterceptor)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @AuditLog('CREATE_BOOKING')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, type: Booking })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiResponse({ status: 200, type: [Booking] })
  findAll(@Query('propertyId') propertyId?: string) {
    return this.bookingService.findAll(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiResponse({ status: 200, type: Booking })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @AuditLog('UPDATE_BOOKING')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, type: Booking })
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(id, dto);
  }

  @Delete(':id')
  @AuditLog('DELETE_BOOKING')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }

  @Post(':id/payments')
  @AuditLog('ADD_BOOKING_PAYMENT')
  @ApiOperation({ summary: 'Add a payment to a booking' })
  addPayment(@Param('id') id: string, @Body() dto: CreatePaymentDto) {
    return this.bookingService.addPayment(id, dto);
  }

  @Post(':id/service-usages')
  @AuditLog('ADD_SERVICE_USAGE')
  @ApiOperation({ summary: 'Add a service usage to a booking' })
  addServiceUsage(@Param('id') id: string, @Body() dto: CreateServiceUsageDto) {
    return this.bookingService.addServiceUsage(id, dto);
  }
}
