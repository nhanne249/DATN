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
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';

@ApiTags('Guests')
@Controller('guests')
@UseInterceptors(AuditLogInterceptor)
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @AuditLog('CREATE_GUEST')
  @ApiOperation({ summary: 'Create a new guest' })
  @ApiResponse({ status: 201, type: Guest })
  create(@Body() dto: CreateGuestDto) {
    return this.guestService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all guests' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiResponse({ status: 200, type: [Guest] })
  findAll(@Query('propertyId') propertyId?: string) {
    return this.guestService.findAll(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a guest by ID' })
  @ApiResponse({ status: 200, type: Guest })
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(id);
  }

  @Patch(':id')
  @AuditLog('UPDATE_GUEST')
  @ApiOperation({ summary: 'Update a guest' })
  @ApiResponse({ status: 200, type: Guest })
  update(@Param('id') id: string, @Body() dto: UpdateGuestDto) {
    return this.guestService.update(id, dto);
  }

  @Delete(':id')
  @AuditLog('DELETE_GUEST')
  @ApiOperation({ summary: 'Delete a guest' })
  @ApiResponse({ status: 200, description: 'Guest deleted successfully' })
  remove(@Param('id') id: string) {
    return this.guestService.remove(id);
  }
}
