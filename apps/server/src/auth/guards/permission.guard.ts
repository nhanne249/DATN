import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERMISSION_KEY, RequirePermissionMeta } from '../decorators/require-permission.decorator';
import { PermissionService } from '../../permission/permission.service';
import { UserPayload } from '../../common/interfaces/request-with-user.interface';
import { ROLE } from '../../user/enum/role';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.getAllAndOverride<RequirePermissionMeta>(
      REQUIRE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!metadata) return true;

    const request = context.switchToHttp().getRequest<{ user?: UserPayload }>();
    const user = request.user;
    if (!user) return false;

    // Super Admin bypass
    if (user.role === ROLE.ADMIN) return true;

    const allowed = await this.permissionService.hasPermission({
      userId: user.id,
      jwtRole: user.role,
      resourceKey: metadata.resource,
      actionCode: metadata.action,
    });

    if (!allowed) {
      throw new ForbiddenException(
        `Bạn không có quyền thực hiện hành động này (${metadata.resource}:${metadata.action})`,
      );
    }

    return true;
  }
}
