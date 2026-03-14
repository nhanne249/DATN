import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePublicBookingDto } from './dto/public-booking.dto';
import { PublicService } from './public.service';

@ApiTags('Public Website')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get public website config by slug' })
  getConfig(@Param('slug') slug: string) {
    return this.publicService.getPublicConfig(slug);
  }

  @Get(':slug/rooms')
  @ApiOperation({ summary: 'Get public room types by slug' })
  getRooms(@Param('slug') slug: string) {
    return this.publicService.getPublicRooms(slug);
  }

  @Get(':slug/availability')
  @ApiOperation({ summary: 'Get room availability by date range' })
  getAvailability(
    @Param('slug') slug: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.publicService.getAvailability(slug, checkIn, checkOut);
  }

  @Post(':slug/bookings')
  @ApiOperation({ summary: 'Create booking from public website' })
  createBooking(
    @Param('slug') slug: string,
    @Body() dto: CreatePublicBookingDto,
  ) {
    return this.publicService.createPublicBooking(slug, dto);
  }
}
