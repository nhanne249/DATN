import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../user/enum/role';
import { AutomationService } from './automation.service';
import { CreateEmailTemplateDto, CreateAutomationFlowDto } from './dto/automation.dto';

@ApiTags('Automation')
@Controller('automation')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Get('templates')
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Get all email templates' })
  findAllTemplates(@Query('propertyId') propertyId: string) {
    return this.automationService.findAllTemplates(propertyId);
  }

  @Post('templates')
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Create an email template' })
  createTemplate(@Body() dto: CreateEmailTemplateDto) {
    return this.automationService.createTemplate(dto);
  }

  @Get('flows')
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Get all automation flows' })
  findAllFlows(@Query('propertyId') propertyId: string) {
    return this.automationService.findAllFlows(propertyId);
  }

  @Post('flows')
  @Roles(ROLE.ADMIN, ROLE.HOTEL_OWNER, ROLE.HOTEL_MANAGER)
  @ApiOperation({ summary: 'Create an automation flow' })
  createFlow(@Body() dto: CreateAutomationFlowDto) {
    return this.automationService.createFlow(dto);
  }
}
