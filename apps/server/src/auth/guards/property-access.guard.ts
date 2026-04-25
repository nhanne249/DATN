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
import { OtaChannel } from '../../ota/entities/ota-channel.entity';
import { OtaMapping } from '../../ota/entities/ota-mapping.entity';

type PropertyRequest = RequestWithUser & {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  baseUrl?: string;
  method?: string;
  originalUrl?: string;
  url?: string;
};

@Injectable()
export class PropertyAccessGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PropertyRequest>();
    const user = request.user;
    if (!user) return false;
    if (user.role === ROLE.ADMIN) return true;

    const requestedPropertyId = await this.extractPropertyId(request);
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

  private async extractPropertyId(
    request: PropertyRequest,
  ): Promise<string | undefined> {
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
    if (fromPropertyRoute) return fromPropertyRoute;

    return this.resolvePropertyIdFromOtaRoute(request);
  }

  private getRequestPath(request: PropertyRequest): string {
    return request.originalUrl || request.url || request.baseUrl || '';
  }

  private async resolvePropertyIdFromOtaRoute(
    request: PropertyRequest,
  ): Promise<string | undefined> {
    const path = this.getRequestPath(request);
    if (!path.includes('/ota/')) return undefined;

    const method = (request.method || '').toUpperCase();
    if (method === 'POST') {
      const channelId = this.normalizeString(request.body?.channelId);
      if (channelId) {
        return this.resolveChannelPropertyId(channelId);
      }
    }

    const resourceId = this.normalizeString(request.params?.id);
    if (!resourceId) return undefined;

    if (path.includes('/ota/mappings/')) {
      return this.resolveMappingPropertyId(resourceId);
    }
    if (path.includes('/ota/channels/')) {
      return this.resolveChannelPropertyId(resourceId);
    }

    return undefined;
  }

  private async resolveChannelPropertyId(
    channelId: string,
  ): Promise<string | undefined> {
    const channel = await this.dataSource.getRepository(OtaChannel).findOne({
      where: { id: channelId },
      select: ['id', 'propertyId'],
    });
    return channel?.propertyId || undefined;
  }

  private async resolveMappingPropertyId(
    mappingId: string,
  ): Promise<string | undefined> {
    const row = await this.dataSource
      .getRepository(OtaMapping)
      .createQueryBuilder('mapping')
      .innerJoin('mapping.channel', 'channel')
      .select('channel.propertyId', 'propertyId')
      .where('mapping.id = :id', { id: mappingId })
      .getRawOne<{ propertyId?: string }>();

    return row?.propertyId || undefined;
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
    request.user.propertyId = actor.propertyId ?? undefined;
    return actor.propertyId ?? undefined;
  }
}
