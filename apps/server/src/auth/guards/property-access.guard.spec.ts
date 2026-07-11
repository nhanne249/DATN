import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ROLE } from '../../user/enum/role';
import { User } from '../../user/entities/user.entity';
import { OtaChannel } from '../../ota/entities/ota-channel.entity';
import { OtaMapping } from '../../ota/entities/ota-mapping.entity';
import { PropertyAccessGuard } from './property-access.guard';

describe('PropertyAccessGuard', () => {
  const userRepo = {
    findOne: jest.fn(),
  };
  const channelRepo = {
    findOne: jest.fn(),
  };
  const mappingQb = {
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  };
  const mappingRepo = {
    createQueryBuilder: jest.fn(() => mappingQb),
  };

  const dataSource = {
    getRepository: jest.fn((entity: unknown) => {
      if (entity === User) return userRepo;
      if (entity === OtaChannel) return channelRepo;
      if (entity === OtaMapping) return mappingRepo;
      return {};
    }),
  } as unknown as DataSource;

  const guard = new PropertyAccessGuard(dataSource);

  const createContext = (request: Record<string, unknown>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows access when propertyId in query matches user property', async () => {
    const context = createContext({
      user: { id: 'user-1', role: ROLE.INTERNAL_USER, propertyId: 'property-1' },
      query: { propertyId: 'property-1' },
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('blocks cross-property access from ota channel resource id', async () => {
    channelRepo.findOne.mockResolvedValue({
      id: 'channel-2',
      propertyId: 'property-2',
    });
    const context = createContext({
      user: { id: 'user-1', role: ROLE.INTERNAL_USER, propertyId: 'property-1' },
      method: 'GET',
      baseUrl: '/api/ota',
      originalUrl: '/api/ota/channels/channel-2',
      params: { id: 'channel-2' },
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('resolves property from POST /ota/mappings channelId in body', async () => {
    channelRepo.findOne.mockResolvedValue({
      id: 'channel-1',
      propertyId: 'property-1',
    });
    const context = createContext({
      user: { id: 'user-1', role: ROLE.INTERNAL_USER, propertyId: 'property-1' },
      method: 'POST',
      baseUrl: '/api/ota',
      originalUrl: '/api/ota/mappings',
      body: { channelId: 'channel-1' },
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
