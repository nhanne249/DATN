import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskTemplate } from './entities/task-template.entity';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskTemplate]), AuditLogModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TypeOrmModule, TaskService],
})
export class TaskModule {}
