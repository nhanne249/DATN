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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  MANAGEMENT_ROLES,
  STAFF_ROLES,
} from '../auth/constants/role-groups.constant';

@ApiTags('finance')
@Controller('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PropertyAccessGuard)
@Roles(...STAFF_ROLES)
@UseInterceptors(AuditLogInterceptor)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('expenses')
  @ApiOperation({ summary: 'Create a new expense' })
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('CREATE_EXPENSE')
  createExpense(@Body() createDto: CreateExpenseDto) {
    return this.financeService.createExpense(createDto);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Get all expenses for a property' })
  findAllExpenses(@Query('propertyId') propertyId: string) {
    return this.financeService.findAllExpenses(propertyId);
  }

  @Get('expenses/:id')
  @ApiOperation({ summary: 'Get an expense by ID' })
  findOneExpense(@Param('id') id: string) {
    return this.financeService.findOneExpense(id);
  }

  @Patch('expenses/:id')
  @ApiOperation({ summary: 'Update an expense' })
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('UPDATE_EXPENSE')
  updateExpense(@Param('id') id: string, @Body() updateDto: UpdateExpenseDto) {
    return this.financeService.updateExpense(id, updateDto);
  }

  @Delete('expenses/:id')
  @ApiOperation({ summary: 'Delete an expense' })
  @Roles(...MANAGEMENT_ROLES)
  @AuditLog('DELETE_EXPENSE')
  removeExpense(@Param('id') id: string) {
    return this.financeService.removeExpense(id);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get all payments for a property' })
  findAllPayments(@Query('propertyId') propertyId: string) {
    return this.financeService.findAllPayments(propertyId);
  }

  @Get('receivables')
  @ApiOperation({ summary: 'Get receivables (unpaid bookings) for a property' })
  findReceivables(@Query('propertyId') propertyId: string) {
    return this.financeService.findReceivables(propertyId);
  }
}
