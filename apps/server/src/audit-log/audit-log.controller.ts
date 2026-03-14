import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLE } from '../user/enum/role';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles(ROLE.ADMIN) // Only admins can view audit logs
  @ApiOperation({ summary: 'Get audit logs with pagination' })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
  ) {
    return this.auditLogService.findAll({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      userId,
      action,
    });
  }
}
