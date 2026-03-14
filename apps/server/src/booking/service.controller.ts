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
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { Service } from './entities/service.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';

@ApiTags('Services')
@Controller('services')
@UseInterceptors(AuditLogInterceptor)
export class ServiceController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @AuditLog('CREATE_SERVICE')
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, type: Service })
  create(@Body() dto: CreateServiceDto) {
    return this.bookingService.createService(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiResponse({ status: 200, type: [Service] })
  findAll(@Query('propertyId') propertyId: string) {
    return this.bookingService.findAllServices(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, type: Service })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOneService(id);
  }

  @Patch(':id')
  @AuditLog('UPDATE_SERVICE')
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, type: Service })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.bookingService.updateService(id, dto);
  }

  @Delete(':id')
  @AuditLog('DELETE_SERVICE')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  remove(@Param('id') id: string) {
    return this.bookingService.removeService(id);
  }
}
