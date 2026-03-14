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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomType } from './entities/room-type.entity';
import { Room } from './entities/room.entity';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { STAFF_ROLES } from '../auth/constants/role-groups.constant';

@ApiTags('Rooms')
@Controller('rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
@Roles(...STAFF_ROLES)
@UseInterceptors(AuditLogInterceptor)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Room Types
  @Post('types')
  @AuditLog('CREATE_ROOM_TYPE')
  @ApiOperation({ summary: 'Create a new room type' })
  @ApiResponse({ status: 201, type: RoomType })
  createType(@Body() dto: CreateRoomTypeDto) {
    return this.roomService.createType(dto);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all room types' })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiResponse({ status: 200, type: [RoomType] })
  findAllTypes(@Query('propertyId') propertyId?: string) {
    return this.roomService.findAllTypes(propertyId);
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get a room type by ID' })
  @ApiResponse({ status: 200, type: RoomType })
  findOneType(@Param('id') id: string) {
    return this.roomService.findOneType(id);
  }

  @Patch('types/:id')
  @AuditLog('UPDATE_ROOM_TYPE')
  @ApiOperation({ summary: 'Update a room type' })
  @ApiResponse({ status: 200, type: RoomType })
  updateType(@Param('id') id: string, @Body() dto: UpdateRoomTypeDto) {
    return this.roomService.updateType(id, dto);
  }

  @Delete('types/:id')
  @AuditLog('DELETE_ROOM_TYPE')
  @ApiOperation({ summary: 'Delete a room type' })
  @ApiResponse({ status: 200, description: 'Room type deleted successfully' })
  removeType(@Param('id') id: string) {
    return this.roomService.removeType(id);
  }

  // Rooms
  @Post()
  @AuditLog('CREATE_ROOM')
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, type: Room })
  createRoom(@Body() dto: CreateRoomDto) {
    return this.roomService.createRoom(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiQuery({ name: 'roomTypeId', required: false })
  @ApiQuery({ name: 'propertyId', required: false })
  @ApiResponse({ status: 200, type: [Room] })
  findAllRooms(
    @Query('roomTypeId') roomTypeId?: string,
    @Query('propertyId') propertyId?: string,
  ) {
    return this.roomService.findAllRooms(roomTypeId, propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiResponse({ status: 200, type: Room })
  findOneRoom(@Param('id') id: string) {
    return this.roomService.findOneRoom(id);
  }

  @Patch(':id')
  @AuditLog('UPDATE_ROOM')
  @ApiOperation({ summary: 'Update a room' })
  @ApiResponse({ status: 200, type: Room })
  updateRoom(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomService.updateRoom(id, dto);
  }

  @Delete(':id')
  @AuditLog('DELETE_ROOM')
  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  removeRoom(@Param('id') id: string) {
    return this.roomService.removeRoom(id);
  }
}
