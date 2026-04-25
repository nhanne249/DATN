import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { ROLE } from '../user/enum/role';
import { OtaService } from './ota.service';
import { OtaChannel } from './entities/ota-channel.entity';
import { OtaMapping } from './entities/ota-mapping.entity';
import { SyncLog } from './entities/sync-log.entity';
import { RoomType } from '../room/entities/room-type.entity';

describe('OtaService', () => {
  let service: OtaService;

  const configMock = {
    get: jest.fn((key: string) => {
      if (key === 'OTA_WEBHOOK_REQUIRE_SIGNATURE') return 'false';
      return undefined;
    }),
  };

  const channelRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mappingRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
  const syncLogRepo = {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
  const roomTypeRepo = {
    findOne: jest.fn(),
  };

  const actor = {
    id: 'user-1',
    role: ROLE.HOTEL_OWNER,
    propertyId: 'property-1',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtaService,
        { provide: ConfigService, useValue: configMock },
        { provide: getRepositoryToken(OtaChannel), useValue: channelRepo },
        { provide: getRepositoryToken(OtaMapping), useValue: mappingRepo },
        { provide: getRepositoryToken(SyncLog), useValue: syncLogRepo },
        { provide: getRepositoryToken(RoomType), useValue: roomTypeRepo },
      ],
    }).compile();

    service = module.get<OtaService>(OtaService);
    mappingRepo.create.mockImplementation((value: unknown) => value);
    syncLogRepo.create.mockImplementation((value: Record<string, unknown>) => ({ ...value }));
    syncLogRepo.save.mockImplementation(async (value: unknown) => value);
    channelRepo.create.mockImplementation((value: unknown) => value);
    channelRepo.save.mockImplementation(async (value: unknown) => value);
  });

  it('blocks channel access across properties', async () => {
    channelRepo.findOne.mockResolvedValue({
      id: 'channel-1',
      propertyId: 'property-2',
      otaMappings: [],
    });

    await expect(service.findChannelById('channel-1', actor)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects mapping when room type is outside channel property', async () => {
    channelRepo.findOne.mockResolvedValue({ id: 'channel-1', propertyId: 'property-1' });
    roomTypeRepo.findOne.mockResolvedValue(null);

    await expect(
      service.createMapping(
        { channelId: 'channel-1', roomTypeId: 'room-type-2' },
        actor,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects duplicate externalRoomId in same channel', async () => {
    channelRepo.findOne.mockResolvedValue({ id: 'channel-1', propertyId: 'property-1' });
    roomTypeRepo.findOne.mockResolvedValue({ id: 'room-type-1', propertyId: 'property-1' });
    mappingRepo.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'existing-mapping' });

    await expect(
      service.createMapping(
        {
          channelId: 'channel-1',
          roomTypeId: 'room-type-1',
          externalRoomId: 'OTA_ROOM_101',
        },
        actor,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('clamps sync-log limit and enforces channel ownership', async () => {
    channelRepo.findOne.mockResolvedValue({ id: 'channel-1', propertyId: 'property-1' });
    syncLogRepo.find.mockResolvedValue([]);

    await service.getSyncLogs('channel-1', 1000, actor);

    expect(syncLogRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { channelId: 'channel-1' },
        take: 200,
      }),
    );
  });

  it('accepts unsigned webhook in compatibility mode and logs security flags', async () => {
    channelRepo.findOne.mockResolvedValue({
      id: 'channel-1',
      type: 'channex',
      isActive: true,
      propertyId: 'property-1',
      credentials: {},
    });
    mappingRepo.findOne.mockResolvedValue({
      id: 'mapping-1',
      roomType: { id: 'room-type-1', name: 'Deluxe' },
    });

    await expect(
      service.processWebhook({
        channelId: 'channel-1',
        channelType: 'channex',
        reservationId: 'RES-1',
        externalRoomId: 'ROOM-EXT-1',
        status: 'CONFIRMED',
      }),
    ).resolves.toEqual({ success: true, message: 'Webhook processed' });

    const firstCreateArg = syncLogRepo.create.mock.calls[0][0];
    expect(firstCreateArg).toMatchObject({
      channelId: 'channel-1',
      action: 'WEBHOOK_CONFIRMED',
      details: {
        security: expect.objectContaining({
          hasSignature: false,
          missingSignatureAccepted: true,
        }),
      },
    });
  });

  it('rejects invalid webhook signature when signature is provided', async () => {
    channelRepo.findOne.mockResolvedValue({
      id: 'channel-1',
      type: 'channex',
      isActive: true,
      propertyId: 'property-1',
      credentials: { webhookSecret: 'secret-key' },
    });

    await expect(
      service.processWebhook(
        {
          channelId: 'channel-1',
          channelType: 'channex',
          reservationId: 'RES-1',
          externalRoomId: 'ROOM-EXT-1',
          status: 'CONFIRMED',
        },
        'sha256=invalid-signature',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
