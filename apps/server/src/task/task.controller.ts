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
import { TaskService } from './task.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditLog } from '../audit-log/decorators/audit-log.decorator';
import { AuditLogInterceptor } from '../audit-log/interceptors/audit-log.interceptor';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
@UseInterceptors(AuditLogInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @AuditLog('CREATE_TASK')
  create(@Body() createDto: CreateTaskDto) {
    return this.taskService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for a property' })
  findAll(@Query('propertyId') propertyId: string) {
    return this.taskService.findAll(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @AuditLog('UPDATE_TASK')
  update(@Param('id') id: string, @Body() updateDto: UpdateTaskDto) {
    return this.taskService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @AuditLog('DELETE_TASK')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  @Post('templates')
  @ApiOperation({ summary: 'Create a task template' })
  createTemplate(@Body() templateDto: any) {
    return this.taskService.createTemplate(templateDto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all task templates' })
  getTemplates(@Query('propertyId') propertyId: string) {
    return this.taskService.getTemplates(propertyId);
  }
}
