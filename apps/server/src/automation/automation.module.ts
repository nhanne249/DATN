import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { AutomationFlow } from './entities/automation-flow.entity';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate, AutomationFlow])],
  controllers: [AutomationController],
  providers: [AutomationService],
  exports: [AutomationService],
})
export class AutomationModule {}
