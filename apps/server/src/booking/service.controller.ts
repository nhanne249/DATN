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
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { Service } from './entities/service.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { STAFF_ROLES } from '../auth/constants/role-groups.constant';

@ApiTags('Services')
@Controller('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard, PermissionGuard)
@Roles(...STAFF_ROLES)
export class ServiceController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @AuditLog('CREATE_SERVICE')
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, type: Service })
  @RequirePermission('entity.service', 'create')
  create(@Body() dto: CreateServiceDto) {
    return this.bookingService.createService(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiResponse({ status: 200, type: [Service] })
  @RequirePermission('entity.service', 'view')
  findAll(@Query('propertyId') propertyId: string) {
    return this.bookingService.findAllServices(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, type: Service })
  @RequirePermission('entity.service', 'view')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOneService(id);
  }

  @Patch(':id')
  @AuditLog('UPDATE_SERVICE')
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, type: Service })
  @RequirePermission('entity.service', 'update')
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.bookingService.updateService(id, dto);
  }

  @Delete(':id')
  @AuditLog('DELETE_SERVICE')
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @RequirePermission('entity.service', 'delete')
  remove(@Param('id') id: string) {
    return this.bookingService.removeService(id);
  }
}
