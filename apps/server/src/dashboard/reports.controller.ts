import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly financial report' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'year', required: true })
  getMonthly(
    @Query('propertyId') propertyId: string,
    @Query('year') year: string,
  ) {
    return this.reportsService.getMonthlyReport(propertyId, parseInt(year));
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  getRevenue(
    @Query('propertyId') propertyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getRevenueReport(
      propertyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('services')
  @ApiOperation({ summary: 'Get services report' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  getServices(
    @Query('propertyId') propertyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getServicesReport(
      propertyId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('operations')
  @ApiOperation({ summary: 'Get operations report' })
  @ApiQuery({ name: 'propertyId', required: true })
  @ApiQuery({ name: 'date', required: true })
  getOperations(
    @Query('propertyId') propertyId: string,
    @Query('date') date: string,
  ) {
    return this.reportsService.getOperationsReport(propertyId, new Date(date));
  }
}
