import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import {
  MANAGEMENT_ROLES,
  STAFF_ROLES,
} from '../auth/constants/role-groups.constant';
import { RentalService } from './rental.service';
import {
  CreateVehicleDto,
  CreateRentalDto,
  UpdateVehicleDto,
  UpdateRentalStatusDto,
} from './dto/rental.dto';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';

@ApiTags('Rental')
@Controller('rentals')
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard, PermissionGuard)
@ApiBearerAuth()
@Roles(...STAFF_ROLES)
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('vehicles')
  @ApiOperation({ summary: 'Get all vehicles for a property' })
  @RequirePermission('entity.rental', 'view')
  findAllVehicles(@Query('propertyId') propertyId: string) {
    return this.rentalService.findAllVehicles(propertyId);
  }

  @Post('vehicles')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('CREATE_VEHICLE')
  @ApiOperation({ summary: 'Create a new vehicle' })
  @RequirePermission('entity.rental', 'create')
  createVehicle(@Body() dto: CreateVehicleDto) {
    return this.rentalService.createVehicle(dto);
  }

  @Patch('vehicles/:id')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('UPDATE_VEHICLE')
  @ApiOperation({ summary: 'Update vehicle information' })
  @RequirePermission('entity.rental', 'update')
  updateVehicle(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.rentalService.updateVehicle(id, dto);
  }

  @Get('rentals')
  @ApiOperation({ summary: 'Get all rental records' })
  @RequirePermission('entity.rental', 'view')
  findAllRentals(@Query('propertyId') propertyId: string) {
    return this.rentalService.findAllRentals(propertyId);
  }

  @Post('rentals')
  @AuditLog('CREATE_RENTAL')
  @ApiOperation({ summary: 'Create a new rental record' })
  @RequirePermission('entity.rental', 'create')
  createRental(@Body() dto: CreateRentalDto) {
    return this.rentalService.createRental(dto);
  }

  @Put('rentals/:id/pickup')
  @AuditLog('RENTAL_PICKUP')
  @ApiOperation({ summary: 'Record vehicle pickup' })
  @RequirePermission('entity.rental', 'update')
  recordPickup(@Param('id') id: string) {
    return this.rentalService.recordPickup(id);
  }

  @Put('rentals/:id/return')
  @AuditLog('RENTAL_RETURN')
  @ApiOperation({ summary: 'Record vehicle return' })
  @RequirePermission('entity.rental', 'update')
  recordReturn(@Param('id') id: string) {
    return this.rentalService.recordReturn(id);
  }

  @Patch('rentals/:id/status')
  @AuditLog('UPDATE_RENTAL_STATUS')
  @ApiOperation({ summary: 'Update rental status' })
  @RequirePermission('entity.rental', 'update')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRentalStatusDto) {
    return this.rentalService.updateStatus(id, dto.status);
  }
}
