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
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../user/enum/role';
import { RentalService } from './rental.service';
import {
  CreateVehicleDto,
  CreateRentalDto,
  UpdateVehicleDto,
  UpdateRentalStatusDto,
} from './dto/rental.dto';

@ApiTags('Rental')
@Controller('rentals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get('vehicles')
  @ApiOperation({ summary: 'Get all vehicles for a property' })
  findAllVehicles(@Query('propertyId') propertyId: string) {
    return this.rentalService.findAllVehicles(propertyId);
  }

  @Post('vehicles')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Create a new vehicle' })
  createVehicle(@Body() dto: CreateVehicleDto) {
    return this.rentalService.createVehicle(dto);
  }

  @Patch('vehicles/:id')
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Update vehicle information' })
  updateVehicle(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.rentalService.updateVehicle(id, dto);
  }

  @Get('rentals')
  @ApiOperation({ summary: 'Get all rental records' })
  findAllRentals(@Query('propertyId') propertyId: string) {
    return this.rentalService.findAllRentals(propertyId);
  }

  @Post('rentals')
  @ApiOperation({ summary: 'Create a new rental record' })
  createRental(@Body() dto: CreateRentalDto) {
    return this.rentalService.createRental(dto);
  }

  @Put('rentals/:id/pickup')
  @ApiOperation({ summary: 'Record vehicle pickup' })
  recordPickup(@Param('id') id: string) {
    return this.rentalService.recordPickup(id);
  }

  @Put('rentals/:id/return')
  @ApiOperation({ summary: 'Record vehicle return' })
  recordReturn(@Param('id') id: string) {
    return this.rentalService.recordReturn(id);
  }

  @Patch('rentals/:id/status')
  @ApiOperation({ summary: 'Update rental status' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRentalStatusDto,
  ) {
    return this.rentalService.updateStatus(id, dto.status);
  }
}
