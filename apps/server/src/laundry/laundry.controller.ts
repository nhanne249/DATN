import {
  Controller,
  Get,
  Post,
  Patch,
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
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import {
  MANAGEMENT_ROLES,
  STAFF_ROLES,
} from '../auth/constants/role-groups.constant';
import { LaundryService } from './laundry.service';
import { CreateLaundryOrderDto, UpdateLaundryStatusDto } from './dto/laundry.dto';
import { LaundryStatus } from './entities/laundry-order.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';

@ApiTags('Laundry')
@Controller('laundry')
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard, PermissionGuard)
@ApiBearerAuth()
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @Get()
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get all laundry orders' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'status', required: false, enum: LaundryStatus })
  @RequirePermission('entity.laundry', 'view')
  findAll(
    @Query('propertyId') propertyId: string,
    @Query('status') status?: LaundryStatus,
  ) {
    return this.laundryService.findAll(propertyId, status);
  }

  @Get(':id')
  @Roles(...STAFF_ROLES)
  @ApiOperation({ summary: 'Get laundry order by id' })
  @RequirePermission('entity.laundry', 'view')
  findOne(@Param('id') id: string) {
    return this.laundryService.findOne(id);
  }

  @Post()
  @Roles(...STAFF_ROLES)
  @AuditLog('CREATE_LAUNDRY_ORDER')
  @ApiOperation({ summary: 'Create laundry order' })
  @RequirePermission('entity.laundry', 'create')
  create(@Body() dto: CreateLaundryOrderDto, @Request() req: any) {
    return this.laundryService.create(dto, req.user.id);
  }

  @Patch(':id/status')
  @Roles(...STAFF_ROLES)
  @AuditLog('UPDATE_LAUNDRY_STATUS')
  @ApiOperation({ summary: 'Update laundry order status' })
  @RequirePermission('entity.laundry', 'update')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLaundryStatusDto,
    @Request() req: any,
  ) {
    return this.laundryService.updateStatus(id, dto, req.user.id);
  }

  @Delete(':id')
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('DELETE_LAUNDRY_ORDER')
  @ApiOperation({ summary: 'Delete laundry order (PENDING only)' })
  @RequirePermission('entity.laundry', 'delete')
  delete(@Param('id') id: string) {
    return this.laundryService.delete(id);
  }
}
