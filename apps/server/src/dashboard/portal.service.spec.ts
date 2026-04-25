import { NotFoundException } from '@nestjs/common';
import { ROLE } from '../user/enum/role';
import { PortalService } from './portal.service';

describe('PortalService OTA delegation', () => {
  const makeService = () => {
    const portalRecordRepo = {
      create: jest.fn((value: unknown) => value),
      save: jest.fn(async (value: unknown) => value),
    };
    const otaService = {
      createChannel: jest.fn(),
      findChannelById: jest.fn(),
      refreshChannel: jest.fn(),
    };

    const service = new PortalService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      portalRecordRepo as any,
      otaService as any,
      {} as any,
    );
    return { service, otaService, portalRecordRepo };
  };

  const actor = {
    id: 'user-1',
    role: ROLE.HOTEL_MANAGER,
    propertyId: 'property-1',
  };

  it('connectChannel uses OtaService.createChannel with actor ownership context', async () => {
    const { service, otaService } = makeService();
    otaService.createChannel.mockResolvedValue({
      id: 'channel-1',
      name: 'Channex',
      propertyId: 'property-1',
    });

    await service.connectChannel('property-1', actor, {
      name: 'Channex',
      type: 'channex',
    });

    expect(otaService.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyId: 'property-1',
        isActive: true,
      }),
      actor,
    );
  });

  it('refreshChannel rejects when route propertyId does not match channel property', async () => {
    const { service, otaService } = makeService();
    otaService.findChannelById.mockResolvedValue({
      id: 'channel-1',
      propertyId: 'property-2',
    });

    await expect(
      service.refreshChannel('property-1', 'channel-1', actor),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(otaService.refreshChannel).not.toHaveBeenCalled();
  });
});
