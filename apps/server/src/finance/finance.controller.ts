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
import { FinanceService } from './finance.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@ApiTags('finance')
@Controller('finance')
@UseInterceptors(AuditLogInterceptor)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('expenses')
  @ApiOperation({ summary: 'Create a new expense' })
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
  @AuditLog('UPDATE_EXPENSE')
  updateExpense(@Param('id') id: string, @Body() updateDto: UpdateExpenseDto) {
    return this.financeService.updateExpense(id, updateDto);
  }

  @Delete('expenses/:id')
  @ApiOperation({ summary: 'Delete an expense' })
  @AuditLog('DELETE_EXPENSE')
  removeExpense(@Param('id') id: string) {
    return this.financeService.removeExpense(id);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get all payments for a property' })
  findAllPayments(@Query('propertyId') propertyId: string) {
    return this.financeService.findAllPayments(propertyId);
  }
}
