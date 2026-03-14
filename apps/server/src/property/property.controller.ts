import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';

@ApiTags('Properties')
@Controller('properties')
@UseInterceptors(AuditLogInterceptor)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @AuditLog('CREATE_PROPERTY')
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({ status: 201, type: Property })
  create(@Body() dto: CreatePropertyDto) {
    return this.propertyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({ status: 200, type: [Property] })
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property by ID' })
  @ApiResponse({ status: 200, type: Property })
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  @AuditLog('UPDATE_PROPERTY')
  @ApiOperation({ summary: 'Update a property' })
  @ApiResponse({ status: 200, type: Property })
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
    return this.propertyService.update(id, dto);
  }

  @Delete(':id')
  @AuditLog('DELETE_PROPERTY')
  @ApiOperation({ summary: 'Delete a property' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }

  @Get(':id/settings')
  @ApiOperation({ summary: 'Get property settings' })
  @ApiResponse({ status: 200, description: 'Return property settings' })
  getSettings(@Param('id') id: string) {
    return this.propertyService.getSettings(id);
  }

  @Patch(':id/settings')
  @AuditLog('UPDATE_PROPERTY_SETTINGS')
  @ApiOperation({ summary: 'Update property settings' })
  @ApiResponse({ status: 200, description: 'Property settings updated' })
  updateSettings(@Param('id') id: string, @Body() dto: any) {
    return this.propertyService.updateSettings(id, dto);
  }
}
