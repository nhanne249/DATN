import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ROLE } from '../../user/enum/role';
import { User } from '../../user/entities/user.entity';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

type PropertyRequest = RequestWithUser & {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  baseUrl?: string;
};

@Injectable()
export class PropertyAccessGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PropertyRequest>();
    const user = request.user;
    if (!user) return false;
    if (user.role === ROLE.ADMIN) return true;

    const requestedPropertyId = this.extractPropertyId(request);
    if (!requestedPropertyId) return true;

    const actorPropertyId = await this.resolveActorPropertyId(request);
    if (!actorPropertyId) {
      throw new ForbiddenException('User is not assigned to any property');
    }
    if (actorPropertyId !== requestedPropertyId) {
      throw new ForbiddenException('You do not have access to this property');
    }
    return true;
  }

  private normalizeString(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private extractPropertyId(request: PropertyRequest): string | undefined {
    const fromQuery = this.normalizeString(request.query?.propertyId);
    if (fromQuery) return fromQuery;

    const fromBody = this.normalizeString(request.body?.propertyId);
    if (fromBody) return fromBody;

    const fromParams = this.normalizeString(request.params?.propertyId);
    if (fromParams) return fromParams;

    const fromPropertyRoute =
      typeof request.baseUrl === 'string' &&
      request.baseUrl.includes('/properties')
        ? this.normalizeString(request.params?.id)
        : undefined;

    return fromPropertyRoute;
  }

  private async resolveActorPropertyId(
    request: PropertyRequest,
  ): Promise<string | undefined> {
    if (request.user.propertyId) {
      return request.user.propertyId;
    }

    const actor = await this.dataSource.getRepository(User).findOne({
      where: { id: request.user.id },
      select: ['id', 'propertyId'],
    });
    if (!actor) {
      throw new ForbiddenException('User not found');
    }
    request.user.propertyId = actor.propertyId;
    return actor.propertyId || undefined;
  }
}
