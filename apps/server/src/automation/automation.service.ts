import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailTemplate } from './entities/email-template.entity';
import { AutomationFlow } from './entities/automation-flow.entity';
import { CreateEmailTemplateDto, CreateAutomationFlowDto } from './dto/automation.dto';

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly templateRepo: Repository<EmailTemplate>,
    @InjectRepository(AutomationFlow)
    private readonly flowRepo: Repository<AutomationFlow>,
  ) {}

  // ===== TEMPLATES =====
  findAllTemplates(propertyId: string) {
    return this.templateRepo.find({ where: { propertyId } });
  }

  createTemplate(dto: CreateEmailTemplateDto) {
    const template = this.templateRepo.create(dto);
    return this.templateRepo.save(template);
  }

  // ===== FLOWS =====
  findAllFlows(propertyId: string) {
    return this.flowRepo.find({ where: { propertyId } });
  }

  createFlow(dto: CreateAutomationFlowDto) {
    const flow = this.flowRepo.create(dto);
    return this.flowRepo.save(flow);
  }

  async triggerFlows(event: string, propertyId: string, context: any) {
    const flows = await this.flowRepo.find({
      where: { triggerEvent: event, propertyId, isActive: true },
    });

    for (const flow of flows) {
      // Implement flow logic execution here
      console.log(`Triggering flow ${flow.name} for event ${event}`);
    }
  }
}
