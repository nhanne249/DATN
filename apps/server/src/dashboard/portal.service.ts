import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room/entities/room-type.entity';
import { OtaChannel } from '../ota/entities/ota-channel.entity';
import { OtaMapping } from '../ota/entities/ota-mapping.entity';
import {
  SyncDirection,
  SyncLog,
  SyncStatus,
} from '../ota/entities/sync-log.entity';
import { Expense } from '../finance/entities/expense.entity';
import { Payment, PaymentStatus } from '../booking/entities/payment.entity';
import { User } from '../user/entities/user.entity';
import { AuditLog } from '../audit-log/entities/audit-log.entity';
import { WebsiteConfig } from '../website/entities/website-config.entity';
import { PortalRecord } from './entities/portal-record.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class PortalService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
    @InjectRepository(OtaChannel)
    private readonly otaChannelRepo: Repository<OtaChannel>,
    @InjectRepository(OtaMapping)
    private readonly otaMappingRepo: Repository<OtaMapping>,
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
    @InjectRepository(WebsiteConfig)
    private readonly websiteConfigRepo: Repository<WebsiteConfig>,
    @InjectRepository(PortalRecord)
    private readonly portalRecordRepo: Repository<PortalRecord>,
    private readonly userService: UserService,
  ) {}

  private pickStringFromUnknown(
    input: unknown,
    key: string,
  ): string | undefined {
    if (!input || typeof input !== 'object') {
      return undefined;
    }

    const value = (input as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : undefined;
  }

  private requirePropertyId(propertyId?: string): string {
    if (!propertyId) {
      throw new BadRequestException('propertyId is required');
    }
    return propertyId;
  }

  private pickNumberFromUnknown(
    input: unknown,
    key: string,
  ): number | undefined {
    if (!input || typeof input !== 'object') {
      return undefined;
    }

    const value = (input as Record<string, unknown>)[key];
    return typeof value === 'number' ? value : undefined;
  }

  private async createRecord(params: {
    propertyId: string;
    module: string;
    type: string;
    title?: string;
    status?: string;
    createdBy?: string;
    payload?: Record<string, unknown>;
  }) {
    const record = this.portalRecordRepo.create({
      propertyId: params.propertyId,
      module: params.module,
      type: params.type,
      title: params.title,
      status: params.status,
      createdBy: params.createdBy,
      isActive: true,
      payload: params.payload || {},
    });
    return this.portalRecordRepo.save(record);
  }

  private getRecords(propertyId: string, module: string) {
    return this.portalRecordRepo.find({
      where: {
        propertyId,
        module,
        isActive: true,
      },
      order: { updatedAt: 'DESC' },
    });
  }

  async getMonthlyCalendar(propertyId?: string, year?: number, month?: number) {
    const pid = this.requirePropertyId(propertyId);
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const start = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0, 0);
    const end = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();

    const totalRooms = await this.roomRepo
      .createQueryBuilder('room')
      .innerJoin('room.roomType', 'roomType')
      .where('roomType.propertyId = :propertyId', { propertyId: pid })
      .getCount();

    const bookings = await this.bookingRepo.find({
      where: {
        propertyId: pid,
        checkIn: LessThanOrEqual(end),
        checkOut: MoreThan(start),
      },
      order: { checkIn: 'ASC' },
    });

    const validBookings = bookings.filter(
      (booking) =>
        booking.status !== BookingStatus.CANCELLED &&
        booking.status !== BookingStatus.NO_SHOW,
    );

    const days = Array.from({ length: daysInMonth }).map((_, index) => {
      const dayStart = new Date(
        targetYear,
        targetMonth - 1,
        index + 1,
        0,
        0,
        0,
        0,
      );
      const dayEnd = new Date(
        targetYear,
        targetMonth - 1,
        index + 2,
        0,
        0,
        0,
        0,
      );

      const overlapping = validBookings.filter(
        (booking) => booking.checkIn < dayEnd && booking.checkOut > dayStart,
      );
      const checkIns = validBookings.filter(
        (booking) => booking.checkIn >= dayStart && booking.checkIn < dayEnd,
      ).length;
      const checkOuts = validBookings.filter(
        (booking) => booking.checkOut >= dayStart && booking.checkOut < dayEnd,
      ).length;

      const occupied = Math.min(totalRooms, overlapping.length);
      const occupancyRate =
        totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;

      return {
        date: dayStart.toISOString(),
        day: index + 1,
        occupied,
        total: totalRooms,
        checkIn: checkIns,
        checkOut: checkOuts,
        occupancyRate,
      };
    });

    const avgOccupancy =
      days.length > 0
        ? Math.round(
            days.reduce((sum, day) => sum + day.occupancyRate, 0) / days.length,
          )
        : 0;

    const peak = days.reduce(
      (best, current) =>
        current.occupancyRate > best.occupancyRate ? current : best,
      days[0] || { day: 1, occupancyRate: 0 },
    );

    return {
      year: targetYear,
      month: targetMonth,
      totalRooms,
      days,
      summary: {
        avgOccupancyRate: avgOccupancy,
        peakOccupancyRate: peak.occupancyRate || 0,
        peakDay: peak.day || 1,
      },
    };
  }

  async exportMonthlyCalendar(
    propertyId: string,
    year: number | undefined,
    month: number | undefined,
    userId: string,
  ) {
    const pid = this.requirePropertyId(propertyId);
    const data = await this.getMonthlyCalendar(pid, year, month);

    await this.createRecord({
      propertyId: pid,
      module: 'calendar-export',
      type: 'monthly-export',
      title: `Calendar export ${data.month}/${data.year}`,
      status: 'Done',
      createdBy: userId,
      payload: {
        year: data.year,
        month: data.month,
        totalRooms: data.totalRooms,
        days: data.days.length,
      },
    });

    return {
      generatedAt: new Date().toISOString(),
      ...data,
    };
  }

  async getCalendarShares(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);

    const website = await this.websiteConfigRepo.findOne({
      where: { propertyId: pid, isActive: true },
      order: { updatedAt: 'DESC' },
    });

    const channels = await this.otaChannelRepo.find({
      where: { propertyId: pid },
      order: { updatedAt: 'DESC' },
    });
    const customShares = await this.getRecords(pid, 'calendar-share');

    const now = new Date();
    const shares = [
      ...(website
        ? [
            {
              id: `website-${website.id}`,
              name: 'Public booking calendar',
              scope: 'Availability',
              audience: website.domain,
              expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
              status: website.isActive ? 'Active' : 'Inactive',
              url: `https://${website.domain}/book`,
            },
          ]
        : []),
      ...channels.map((channel, index) => ({
        id: `channel-${channel.id}`,
        name: `${channel.name} calendar feed`,
        scope: 'Booking + Inventory',
        audience: channel.type,
        expiresAt: new Date(now.getTime() + (14 + index) * 24 * 60 * 60 * 1000),
        status: channel.isActive ? 'Active' : 'Pending revoke',
        url: `ota://${channel.type}/${channel.id}`,
      })),
      ...customShares.map((record) => ({
        id: record.id,
        name: record.title || 'Custom share',
        scope:
          this.pickStringFromUnknown(record.payload, 'scope') || 'Availability',
        audience:
          this.pickStringFromUnknown(record.payload, 'audience') || 'Unknown',
        expiresAt:
          this.pickStringFromUnknown(record.payload, 'expiresAt') ||
          new Date(
            record.createdAt.getTime() + 14 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        status: record.status || 'Active',
        url: this.pickStringFromUnknown(record.payload, 'url') || '',
      })),
    ];

    return shares;
  }

  async getChannelRestrictions(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const persisted = await this.getRecords(pid, 'channel-restriction');
    if (persisted.length > 0) {
      return persisted.map((record) => ({
        id: record.id,
        rule:
          this.pickStringFromUnknown(record.payload, 'rule') ||
          record.title ||
          'Custom rule',
        channel:
          this.pickStringFromUnknown(record.payload, 'channel') ||
          'Unknown channel',
        scope:
          this.pickStringFromUnknown(record.payload, 'scope') ||
          'Unknown scope',
        value: this.pickStringFromUnknown(record.payload, 'value') || '-',
        status: record.status || 'Draft',
        updatedAt: record.updatedAt,
      }));
    }

    const channels = await this.otaChannelRepo.find({
      where: { propertyId: pid },
      order: { createdAt: 'ASC' },
    });
    const roomTypes = await this.roomTypeRepo.find({
      where: { propertyId: pid },
      order: { createdAt: 'ASC' },
    });

    const ruleNames = [
      'Minimum stay',
      'Stop sell',
      'Closed to arrival',
      'Max stay',
    ];
    const restrictions: Array<Record<string, unknown>> = [];

    channels.slice(0, 4).forEach((channel, channelIndex) => {
      roomTypes.slice(0, 4).forEach((roomType, roomTypeIndex) => {
        const idx = channelIndex + roomTypeIndex;
        restrictions.push({
          id: `${channel.id}-${roomType.id}`,
          rule: ruleNames[idx % ruleNames.length],
          channel: channel.name,
          scope: roomType.name,
          value:
            idx % 2 === 0
              ? `${2 + (idx % 3)} nights`
              : new Date(Date.now() + idx * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .slice(0, 10),
          status: channel.isActive ? 'Enabled' : 'Draft',
          updatedAt: channel.updatedAt,
        });
      });
    });

    return restrictions;
  }

  async getChannelMessages(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const assigned = await this.getRecords(pid, 'channel-message');

    const logs = await this.syncLogRepo
      .createQueryBuilder('log')
      .innerJoinAndSelect('log.channel', 'channel')
      .where('channel.propertyId = :propertyId', { propertyId: pid })
      .orderBy('log.timestamp', 'DESC')
      .take(50)
      .getMany();

    const systemMessages = logs.map((log) => ({
      id: log.id,
      bookingCode: this.pickStringFromUnknown(
        log.details as unknown,
        'reservationId',
      )
        ? this.pickStringFromUnknown(log.details as unknown, 'reservationId')
        : `SYNC-${log.id.slice(0, 6).toUpperCase()}`,
      channel: log.channel?.name || 'Unknown',
      content: this.pickStringFromUnknown(log.details as unknown, 'error')
        ? this.pickStringFromUnknown(log.details as unknown, 'error')
        : `${log.action} (${log.direction})`,
      status:
        log.status === SyncStatus.SUCCESS
          ? 'Resolved'
          : log.status === SyncStatus.PENDING
            ? 'Waiting'
            : 'New',
      createdAt: log.timestamp,
    }));

    const assignmentMessages = assigned.map((record) => ({
      id: record.id,
      bookingCode:
        this.pickStringFromUnknown(record.payload, 'messageId') || 'MANUAL',
      channel:
        this.pickStringFromUnknown(record.payload, 'channel') ||
        'Manual assignment',
      content:
        this.pickStringFromUnknown(record.payload, 'note') ||
        `Assigned to ${
          this.pickStringFromUnknown(record.payload, 'assignee') || 'team'
        }`,
      status: record.status || 'Waiting',
      createdAt: record.updatedAt,
    }));

    return [...assignmentMessages, ...systemMessages]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 80);
  }

  async getChannelAllocation(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const ruleRecords = await this.getRecords(pid, 'channel-allocation');
    const roomTypes = await this.roomTypeRepo.find({
      where: { propertyId: pid },
      relations: ['rooms'],
      order: { createdAt: 'ASC' },
    });
    const channels = await this.otaChannelRepo.find({
      where: { propertyId: pid },
      relations: ['otaMappings'],
      order: { createdAt: 'ASC' },
    });

    return roomTypes.map((roomType) => {
      const latestRule = ruleRecords.find(
        (record) =>
          this.pickStringFromUnknown(record.payload, 'roomTypeId') ===
          roomType.id,
      );

      if (latestRule) {
        return {
          id: roomType.id,
          roomType: roomType.name,
          allocation:
            this.pickStringFromUnknown(latestRule.payload, 'allocation') ||
            'Direct 100%',
          availableRooms: (roomType.rooms || []).length,
          status: latestRule.status || 'Optimizing',
        };
      }

      const allocationParts = channels
        .map((channel) => {
          const mappingCount = (channel.otaMappings || []).filter(
            (mapping) => mapping.roomTypeId === roomType.id,
          ).length;
          if (mappingCount <= 0) return null;
          const ratio = Math.min(45, 20 + mappingCount * 5);
          return `${channel.name} ${ratio}%`;
        })
        .filter(Boolean) as string[];

      if (!allocationParts.length) {
        allocationParts.push('Direct 100%');
      }

      const availableRooms = (roomType.rooms || []).length;
      const status =
        availableRooms <= 3
          ? 'Tight'
          : availableRooms <= 8
            ? 'Optimizing'
            : 'Balanced';

      return {
        id: roomType.id,
        roomType: roomType.name,
        allocation: allocationParts.join(' | '),
        availableRooms,
        status,
      };
    });
  }

  async getChannelReviews(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);

    const bookings = await this.bookingRepo.find({
      where: { propertyId: pid },
      relations: ['guest'],
      order: { createdAt: 'DESC' },
      take: 40,
    });

    return bookings
      .filter((booking) => !!booking.source)
      .map((booking) => {
        const hash = booking.id
          .split('')
          .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const rating = (3 + (hash % 21) / 10).toFixed(1);
        const channel =
          booking.source && booking.source.toLowerCase() !== 'walk-in'
            ? booking.source
            : 'Direct';

        return {
          id: booking.id,
          bookingCode: booking.bookingCode,
          channel,
          rating: Number(rating),
          status:
            booking.status === BookingStatus.CHECKED_OUT
              ? 'Replied'
              : 'Need response',
          guestName: booking.guest?.name || 'Guest',
        };
      });
  }

  async getDynamicPricing(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const simulations = await this.getRecords(pid, 'dynamic-pricing');
    const simulationPercent = simulations.length
      ? this.pickNumberFromUnknown(simulations[0].payload, 'percent') || 0
      : 0;
    const roomTypes = await this.roomTypeRepo.find({
      where: { propertyId: pid },
      order: { createdAt: 'ASC' },
    });
    const bookings = await this.bookingRepo.find({
      where: { propertyId: pid },
      relations: ['rooms', 'rooms.room', 'rooms.room.roomType'],
      order: { createdAt: 'DESC' },
      take: 200,
    });

    return roomTypes.map((roomType) => {
      const relatedBookings = bookings.filter((booking) =>
        (booking.rooms || []).some(
          (bookingRoom) => bookingRoom.room?.roomTypeId === roomType.id,
        ),
      );
      const occupancySignal = Math.min(1, relatedBookings.length / 25);
      const adjustment =
        Math.round((occupancySignal - 0.5) * 20) + simulationPercent;
      const currentPrice = Math.max(
        0,
        Math.round((roomType.basePrice || 0) * (1 + adjustment / 100)),
      );
      const status =
        adjustment > 5 ? 'Applied' : adjustment < -3 ? 'Review' : 'Scheduled';

      return {
        id: roomType.id,
        roomType: roomType.name,
        currentPrice,
        adjustmentPercent: adjustment,
        status,
      };
    });
  }

  async getChannelHistory(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const recordLogs = await this.portalRecordRepo.find({
      where: {
        propertyId: pid,
        module: In([
          'channel-history',
          'dynamic-pricing',
          'dynamic-pricing-apply',
        ]),
      },
      order: { updatedAt: 'DESC' },
      take: 40,
    });

    const logs = await this.syncLogRepo
      .createQueryBuilder('log')
      .innerJoinAndSelect('log.channel', 'channel')
      .where('channel.propertyId = :propertyId', { propertyId: pid })
      .orderBy('log.timestamp', 'DESC')
      .take(80)
      .getMany();

    const syncItems = logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp,
      event: log.action,
      channel: log.channel?.name || 'Unknown',
      result:
        log.status === SyncStatus.SUCCESS
          ? 'Success'
          : log.status === SyncStatus.PENDING
            ? 'Retrying'
            : 'Failed',
      details:
        log.details && typeof log.details === 'object'
          ? (log.details as Record<string, unknown>)
          : null,
    }));

    const recordItems = recordLogs.map((record) => ({
      id: record.id,
      timestamp: record.updatedAt,
      event: record.title || record.type,
      channel:
        this.pickStringFromUnknown(record.payload, 'channelName') ||
        'Manual action',
      result: record.status || 'Success',
      details: record.payload,
    }));

    return [...recordItems, ...syncItems]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 120);
  }

  async getRecurringExpenses(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const recurring = await this.expenseRepo.find({
      where: { propertyId: pid, isRecurring: true, isActive: true },
      order: { date: 'DESC' },
      take: 100,
    });

    return recurring.map((expense) => ({
      id: expense.id,
      title: expense.title || expense.category,
      interval: expense.recurringInterval || 'monthly',
      nextDueDate: expense.date,
      amount: expense.amount,
      status: expense.isActive ? 'Auto-pay' : 'Inactive',
    }));
  }

  async getEInvoices(propertyId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const customInvoices = await this.getRecords(pid, 'e-invoice');
    const payments = await this.paymentRepo.find({
      where: { propertyId: pid },
      relations: ['booking', 'booking.guest'],
      order: { createdAt: 'DESC' },
      take: 120,
    });

    const paymentInvoices = payments.map((payment) => {
      const year = payment.createdAt.getFullYear();
      const bookingCode =
        payment.booking?.bookingCode || payment.id.slice(0, 6).toUpperCase();
      const invoiceNo = `INV-${year}-${bookingCode}`;

      return {
        id: payment.id,
        invoiceNo,
        customerName: payment.booking?.guest?.name || 'Guest',
        total: payment.amount,
        status:
          payment.status === PaymentStatus.COMPLETED
            ? 'Issued'
            : payment.status === PaymentStatus.FAILED
              ? 'Rejected'
              : 'Pending sign',
        createdAt: payment.createdAt,
      };
    });

    const manualInvoices = customInvoices.map((record) => ({
      id: record.id,
      invoiceNo:
        this.pickStringFromUnknown(record.payload, 'invoiceNo') ||
        `INV-MANUAL-${record.id.slice(0, 6)}`,
      customerName:
        this.pickStringFromUnknown(record.payload, 'customerName') || 'Guest',
      total: this.pickNumberFromUnknown(record.payload, 'total') || 0,
      status: record.status || 'Pending sign',
      createdAt: record.createdAt,
    }));

    return [...manualInvoices, ...paymentInvoices]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 200);
  }

  async getAccountSummary(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const recentLogs = await this.auditLogRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const recentLogin = recentLogs.find(
      (log) => log.action === 'LOGIN_SUCCESS',
    );
    const activeSessionsEstimate = Math.max(
      1,
      recentLogs.filter((log) => log.action === 'LOGIN_SUCCESS').length,
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
      security: {
        twoFactorEnabled: false,
        activeSessionsEstimate,
        lastLoginAt: recentLogin?.createdAt || null,
        lastKnownIp: recentLogin?.ipAddress || null,
      },
    };
  }

  async createCalendarShare(
    propertyId: string,
    userId: string,
    dto: {
      name: string;
      scope: string;
      audience: string;
      expiresAt: string;
      url?: string;
    },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const record = await this.createRecord({
      propertyId: pid,
      module: 'calendar-share',
      type: 'link',
      title: dto.name,
      status: 'Active',
      createdBy: userId,
      payload: {
        scope: dto.scope,
        audience: dto.audience,
        expiresAt: dto.expiresAt,
        url: dto.url || `share://${pid}/${Date.now()}`,
      },
    });

    return {
      id: record.id,
      name: record.title,
      scope: dto.scope,
      audience: dto.audience,
      expiresAt: dto.expiresAt,
      status: record.status,
      url: this.pickStringFromUnknown(record.payload, 'url') || '',
    };
  }

  async revokeCalendarShare(propertyId: string, id: string, userId: string) {
    const pid = this.requirePropertyId(propertyId);

    if (id.startsWith('channel-')) {
      const channelId = id.replace('channel-', '');
      const channel = await this.otaChannelRepo.findOne({
        where: { id: channelId, propertyId: pid },
      });
      if (!channel) throw new NotFoundException('Channel not found');
      channel.isActive = false;
      await this.otaChannelRepo.save(channel);
      return { success: true };
    }

    if (id.startsWith('website-')) {
      const websiteId = id.replace('website-', '');
      const website = await this.websiteConfigRepo.findOne({
        where: { id: websiteId, propertyId: pid },
      });
      if (!website) throw new NotFoundException('Website config not found');
      website.isActive = false;
      await this.websiteConfigRepo.save(website);
      return { success: true };
    }

    const record = await this.portalRecordRepo.findOne({
      where: { id, propertyId: pid, module: 'calendar-share' },
    });
    if (!record) throw new NotFoundException('Share link not found');
    record.isActive = false;
    record.status = 'Revoked';
    record.createdBy = userId;
    await this.portalRecordRepo.save(record);
    return { success: true };
  }

  async createChannelRestriction(
    propertyId: string,
    userId: string,
    dto: {
      rule: string;
      channel: string;
      scope: string;
      value: string;
      status?: string;
    },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const record = await this.createRecord({
      propertyId: pid,
      module: 'channel-restriction',
      type: 'rule',
      title: dto.rule,
      status: dto.status || 'Draft',
      createdBy: userId,
      payload: {
        rule: dto.rule,
        channel: dto.channel,
        scope: dto.scope,
        value: dto.value,
      },
    });

    return {
      id: record.id,
      rule: dto.rule,
      channel: dto.channel,
      scope: dto.scope,
      value: dto.value,
      status: record.status,
      updatedAt: record.updatedAt,
    };
  }

  async updateChannelRestriction(
    propertyId: string,
    id: string,
    userId: string,
    dto: {
      rule?: string;
      channel?: string;
      scope?: string;
      value?: string;
      status?: string;
    },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const record = await this.portalRecordRepo.findOne({
      where: { id, propertyId: pid, module: 'channel-restriction' },
    });
    if (!record) throw new NotFoundException('Restriction not found');

    const payload = { ...record.payload };
    if (dto.rule) payload.rule = dto.rule;
    if (dto.channel) payload.channel = dto.channel;
    if (dto.scope) payload.scope = dto.scope;
    if (dto.value) payload.value = dto.value;
    record.payload = payload;
    if (dto.rule) record.title = dto.rule;
    if (dto.status) record.status = dto.status;
    record.createdBy = userId;
    await this.portalRecordRepo.save(record);

    return {
      id: record.id,
      rule:
        this.pickStringFromUnknown(record.payload, 'rule') ||
        record.title ||
        'Custom rule',
      channel:
        this.pickStringFromUnknown(record.payload, 'channel') ||
        'Unknown channel',
      scope:
        this.pickStringFromUnknown(record.payload, 'scope') || 'Unknown scope',
      value: this.pickStringFromUnknown(record.payload, 'value') || '-',
      status: record.status || 'Draft',
      updatedAt: record.updatedAt,
    };
  }

  async bulkApplyChannelRestrictions(
    propertyId: string,
    userId: string,
    ids: string[],
    status: string,
  ) {
    const pid = this.requirePropertyId(propertyId);
    const records = await this.portalRecordRepo.find({
      where:
        ids.length > 0
          ? {
              propertyId: pid,
              module: 'channel-restriction',
              id: In(ids),
              isActive: true,
            }
          : {
              propertyId: pid,
              module: 'channel-restriction',
              isActive: true,
            },
    });

    records.forEach((record) => {
      record.status = status;
      record.createdBy = userId;
    });
    await this.portalRecordRepo.save(records);
    return { updated: records.length };
  }

  async connectChannel(
    propertyId: string,
    userId: string,
    dto: { name: string; type: string; credentials?: Record<string, unknown> },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const channel = this.otaChannelRepo.create({
      propertyId: pid,
      name: dto.name,
      type: dto.type,
      credentials: dto.credentials || {},
      isActive: true,
      lastSyncAt: new Date(),
    });
    const saved = await this.otaChannelRepo.save(channel);

    await this.createRecord({
      propertyId: pid,
      module: 'channel-history',
      type: 'connect-channel',
      title: `Connected ${saved.name}`,
      status: 'Success',
      createdBy: userId,
      payload: { channelId: saved.id, channelName: saved.name },
    });

    return saved;
  }

  async refreshChannel(propertyId: string, channelId: string, userId: string) {
    const pid = this.requirePropertyId(propertyId);
    const channel = await this.otaChannelRepo.findOne({
      where: { id: channelId, propertyId: pid },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    channel.lastSyncAt = new Date();
    await this.otaChannelRepo.save(channel);

    const log = this.syncLogRepo.create({
      channelId: channel.id,
      action: 'MANUAL_REFRESH',
      direction: SyncDirection.PULL,
      status: SyncStatus.SUCCESS,
      details: { triggeredBy: userId },
      duration: 0,
    });
    await this.syncLogRepo.save(log);

    return { success: true, lastSyncAt: channel.lastSyncAt };
  }

  async assignChannelMessage(
    propertyId: string,
    messageId: string,
    userId: string,
    dto: { assignee: string; note?: string },
  ) {
    const pid = this.requirePropertyId(propertyId);
    return this.createRecord({
      propertyId: pid,
      module: 'channel-message',
      type: 'assignment',
      title: `Assign ${messageId}`,
      status: 'Waiting',
      createdBy: userId,
      payload: {
        messageId,
        assignee: dto.assignee,
        note: dto.note || '',
      },
    });
  }

  async createMessageTemplate(
    propertyId: string,
    userId: string,
    dto: { title: string; content: string },
  ) {
    const pid = this.requirePropertyId(propertyId);
    return this.createRecord({
      propertyId: pid,
      module: 'channel-message-template',
      type: 'template',
      title: dto.title,
      status: 'Active',
      createdBy: userId,
      payload: { content: dto.content },
    });
  }

  async recalculateAllocation(propertyId: string, userId: string) {
    const pid = this.requirePropertyId(propertyId);
    const data = await this.getChannelAllocation(pid);
    await this.createRecord({
      propertyId: pid,
      module: 'channel-allocation',
      type: 'recalculate',
      title: 'Allocation recalculated',
      status: 'Success',
      createdBy: userId,
      payload: { affectedRoomTypes: data.length },
    });
    return { affectedRoomTypes: data.length };
  }

  async upsertAllocationRule(
    propertyId: string,
    userId: string,
    dto: { roomTypeId: string; allocation: string },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const roomType = await this.roomTypeRepo.findOne({
      where: { id: dto.roomTypeId, propertyId: pid },
    });
    if (!roomType) throw new NotFoundException('Room type not found');

    return this.createRecord({
      propertyId: pid,
      module: 'channel-allocation',
      type: 'rule',
      title: `Allocation ${roomType.name}`,
      status: 'Optimizing',
      createdBy: userId,
      payload: {
        roomTypeId: roomType.id,
        roomTypeName: roomType.name,
        allocation: dto.allocation,
      },
    });
  }

  async exportChannelReviews(propertyId: string, userId: string) {
    const pid = this.requirePropertyId(propertyId);
    const data = await this.getChannelReviews(pid);
    await this.createRecord({
      propertyId: pid,
      module: 'channel-review-export',
      type: 'export',
      title: 'Review export',
      status: 'Done',
      createdBy: userId,
      payload: { total: data.length },
    });
    return {
      generatedAt: new Date().toISOString(),
      total: data.length,
      items: data,
    };
  }

  async createReviewTemplate(
    propertyId: string,
    userId: string,
    dto: { title: string; content: string },
  ) {
    const pid = this.requirePropertyId(propertyId);
    return this.createRecord({
      propertyId: pid,
      module: 'channel-review-template',
      type: 'template',
      title: dto.title,
      status: 'Active',
      createdBy: userId,
      payload: { content: dto.content },
    });
  }

  async simulateDynamicPricing(
    propertyId: string,
    userId: string,
    dto: { percent?: number },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const record = await this.createRecord({
      propertyId: pid,
      module: 'dynamic-pricing',
      type: 'simulation',
      title: 'Pricing simulation',
      status: 'Ready',
      createdBy: userId,
      payload: { percent: dto.percent || 0 },
    });
    return { id: record.id, percent: dto.percent || 0, status: record.status };
  }

  async applyDynamicPricing(
    propertyId: string,
    userId: string,
    dto: { roomTypeId: string; adjustmentPercent: number },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const roomType = await this.roomTypeRepo.findOne({
      where: { id: dto.roomTypeId, propertyId: pid },
    });
    if (!roomType) throw new NotFoundException('Room type not found');

    roomType.basePrice = Math.max(
      0,
      Math.round((roomType.basePrice || 0) * (1 + dto.adjustmentPercent / 100)),
    );
    await this.roomTypeRepo.save(roomType);

    await this.createRecord({
      propertyId: pid,
      module: 'dynamic-pricing-apply',
      type: 'apply',
      title: `Apply pricing for ${roomType.name}`,
      status: 'Applied',
      createdBy: userId,
      payload: {
        roomTypeId: roomType.id,
        adjustmentPercent: dto.adjustmentPercent,
        newBasePrice: roomType.basePrice,
      },
    });

    return {
      roomTypeId: roomType.id,
      newBasePrice: roomType.basePrice,
      adjustmentPercent: dto.adjustmentPercent,
    };
  }

  async exportChannelHistory(propertyId: string, userId: string) {
    const pid = this.requirePropertyId(propertyId);
    const items = await this.getChannelHistory(pid);
    await this.createRecord({
      propertyId: pid,
      module: 'channel-history',
      type: 'export',
      title: 'Channel history export',
      status: 'Done',
      createdBy: userId,
      payload: { total: items.length },
    });
    return {
      generatedAt: new Date().toISOString(),
      total: items.length,
      items,
    };
  }

  async resyncChannels(propertyId: string, userId: string, channelId?: string) {
    const pid = this.requirePropertyId(propertyId);
    const channels = await this.otaChannelRepo.find({
      where: channelId
        ? { propertyId: pid, id: channelId }
        : { propertyId: pid, isActive: true },
    });

    for (const channel of channels) {
      channel.lastSyncAt = new Date();
      await this.otaChannelRepo.save(channel);
      const log = this.syncLogRepo.create({
        channelId: channel.id,
        action: 'MANUAL_RESYNC',
        direction: SyncDirection.PULL,
        status: SyncStatus.SUCCESS,
        details: { triggeredBy: userId },
        duration: 0,
      });
      await this.syncLogRepo.save(log);
    }

    return { synced: channels.length };
  }

  async createRecurringExpense(
    propertyId: string,
    userId: string,
    dto: {
      title: string;
      amount: number;
      interval: string;
      nextDueDate: string;
      category?: string;
      description?: string;
    },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const expense = this.expenseRepo.create({
      propertyId: pid,
      title: dto.title,
      category: dto.category || 'Recurring',
      amount: dto.amount,
      description: dto.description || '',
      date: new Date(dto.nextDueDate),
      isRecurring: true,
      recurringInterval: dto.interval,
      isActive: true,
      code: `REC-${Date.now()}`,
    });
    const saved = await this.expenseRepo.save(expense);

    await this.createRecord({
      propertyId: pid,
      module: 'finance-recurring',
      type: 'create',
      title: saved.title || saved.category,
      status: 'Created',
      createdBy: userId,
      payload: { expenseId: saved.id },
    });

    return saved;
  }

  async createEInvoice(
    propertyId: string,
    userId: string,
    dto: { customerName: string; total: number; bookingCode?: string },
  ) {
    const pid = this.requirePropertyId(propertyId);
    const year = new Date().getFullYear();
    const bookingCode = dto.bookingCode || `${Date.now()}`.slice(-6);
    const invoiceNo = `INV-${year}-${bookingCode}`;

    const record = await this.createRecord({
      propertyId: pid,
      module: 'e-invoice',
      type: 'manual-invoice',
      title: invoiceNo,
      status: 'Pending sign',
      createdBy: userId,
      payload: {
        invoiceNo,
        customerName: dto.customerName,
        total: dto.total,
      },
    });

    return {
      id: record.id,
      invoiceNo,
      customerName: dto.customerName,
      total: dto.total,
      status: record.status,
      createdAt: record.createdAt,
    };
  }

  async syncEInvoices(propertyId: string, userId: string) {
    const pid = this.requirePropertyId(propertyId);
    const records = await this.portalRecordRepo.find({
      where: { propertyId: pid, module: 'e-invoice', isActive: true },
    });

    records.forEach((record) => {
      if (record.status === 'Pending sign') {
        record.status = 'Submitted';
        record.createdBy = userId;
      }
    });
    await this.portalRecordRepo.save(records);

    return { synced: records.length };
  }

  async updateAccountProfile(
    userId: string,
    dto: { name?: string; phone?: string; email?: string },
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.email !== undefined) user.email = dto.email;
    const saved = await this.userRepo.save(user);
    return {
      id: saved.id,
      name: saved.name,
      phone: saved.phone,
      email: saved.email,
      role: saved.role,
    };
  }

  async updateAccountPassword(
    userId: string,
    dto: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || !user.password) {
      throw new BadRequestException('User password not found');
    }

    const ok = await bcrypt.compare(dto.currentPassword, user.password);
    if (!ok) throw new BadRequestException('Current password is incorrect');
    await this.userService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
    return { success: true };
  }

  async logoutAllSessions(userId: string) {
    await this.userRepo.update(userId, { hashedRefreshToken: null });
    return { success: true };
  }

  async trackHelpSearch(
    propertyId: string | undefined,
    userId: string,
    dto: { query: string },
  ) {
    const pid = this.requirePropertyId(propertyId);
    return this.createRecord({
      propertyId: pid,
      module: 'help-search',
      type: 'search',
      title: dto.query,
      status: 'Done',
      createdBy: userId,
      payload: { query: dto.query },
    });
  }

  async trackGuideOpen(
    propertyId: string | undefined,
    userId: string,
    dto: { topic: string },
  ) {
    const pid = this.requirePropertyId(propertyId);
    return this.createRecord({
      propertyId: pid,
      module: 'help-guide',
      type: 'open-guide',
      title: dto.topic,
      status: 'Done',
      createdBy: userId,
      payload: { topic: dto.topic },
    });
  }

  async getHelpFaq(propertyId?: string) {
    const pid = propertyId || undefined;

    const failedSyncCount = pid
      ? await this.syncLogRepo
          .createQueryBuilder('log')
          .innerJoin('log.channel', 'channel')
          .where('channel.propertyId = :propertyId', { propertyId: pid })
          .andWhere('log.status = :status', { status: SyncStatus.FAILED })
          .getCount()
      : 0;

    const pendingBookings = pid
      ? await this.bookingRepo.count({
          where: { propertyId: pid, status: BookingStatus.PENDING },
        })
      : 0;

    return {
      faqs: [
        {
          question: 'Lam sao dong bo gia len OTA?',
          answer:
            'Vao Channel Manager > Gia linh hoat, dieu chinh rule va bam Ap dung ngay.',
        },
        {
          question: 'Vi sao booking moi khong vao lich?',
          answer:
            'Kiem tra trang thai kenh OTA va bo loc property trong dashboard calendar.',
        },
        {
          question: 'Tao tai khoan nhan vien o dau?',
          answer: 'Vao Settings > Users de tao user moi va gan role phu hop.',
        },
      ],
      liveStats: {
        failedSyncCount,
        pendingBookings,
      },
    };
  }
}
