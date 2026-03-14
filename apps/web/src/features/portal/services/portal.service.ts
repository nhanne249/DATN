import axiosInstance from '@/lib/axios';

export interface MonthlyCalendarDay {
  date: string;
  day: number;
  occupied: number;
  total: number;
  checkIn: number;
  checkOut: number;
  occupancyRate: number;
}

export interface MonthlyCalendarResponse {
  year: number;
  month: number;
  totalRooms: number;
  days: MonthlyCalendarDay[];
  summary: {
    avgOccupancyRate: number;
    peakOccupancyRate: number;
    peakDay: number;
  };
}

export interface CalendarShareItem {
  id: string;
  name: string;
  scope: string;
  audience: string;
  expiresAt: string;
  status: string;
  url: string;
}

export interface ChannelRestrictionItem {
  id: string;
  rule: string;
  channel: string;
  scope: string;
  value: string;
  status: string;
  updatedAt: string;
}

export interface ChannelMessageItem {
  id: string;
  bookingCode: string;
  channel: string;
  content: string;
  status: string;
  createdAt: string;
}

export interface ChannelAllocationItem {
  id: string;
  roomType: string;
  allocation: string;
  availableRooms: number;
  status: string;
}

export interface ChannelReviewItem {
  id: string;
  bookingCode: string;
  channel: string;
  rating: number;
  status: string;
  guestName: string;
}

export interface DynamicPricingItem {
  id: string;
  roomType: string;
  currentPrice: number;
  adjustmentPercent: number;
  status: string;
}

export interface ChannelHistoryItem {
  id: string;
  timestamp: string;
  event: string;
  channel: string;
  result: string;
}

export interface RecurringExpenseItem {
  id: string;
  title: string;
  interval: string;
  nextDueDate: string;
  amount: number;
  status: string;
}

export interface EInvoiceItem {
  id: string;
  invoiceNo: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface AccountSummaryResponse {
  user: {
    id: string;
    name?: string;
    phone?: string;
    email?: string;
    role: string;
  };
  security: {
    twoFactorEnabled: boolean;
    activeSessionsEstimate: number;
    lastLoginAt?: string | null;
    lastKnownIp?: string | null;
  };
}

export interface HelpFaqResponse {
  faqs: Array<{ question: string; answer: string }>;
  liveStats: {
    failedSyncCount: number;
    pendingBookings: number;
  };
}

export const portalService = {
  getMonthlyCalendar: (propertyId: string, year?: number, month?: number) =>
    axiosInstance.get<MonthlyCalendarResponse>('/dashboard/portal/calendar/monthly', {
      params: { propertyId, year, month },
    }),

  getCalendarShares: (propertyId: string) =>
    axiosInstance.get<CalendarShareItem[]>('/dashboard/portal/calendar/share', {
      params: { propertyId },
    }),

  getChannelRestrictions: (propertyId: string) =>
    axiosInstance.get<ChannelRestrictionItem[]>('/dashboard/portal/channel-manager/restrictions', {
      params: { propertyId },
    }),

  getChannelMessages: (propertyId: string) =>
    axiosInstance.get<ChannelMessageItem[]>('/dashboard/portal/channel-manager/messages', {
      params: { propertyId },
    }),

  getChannelAllocation: (propertyId: string) =>
    axiosInstance.get<ChannelAllocationItem[]>('/dashboard/portal/channel-manager/allocation', {
      params: { propertyId },
    }),

  getChannelReviews: (propertyId: string) =>
    axiosInstance.get<ChannelReviewItem[]>('/dashboard/portal/channel-manager/reviews', {
      params: { propertyId },
    }),

  getDynamicPricing: (propertyId: string) =>
    axiosInstance.get<DynamicPricingItem[]>('/dashboard/portal/channel-manager/dynamic-pricing', {
      params: { propertyId },
    }),

  getChannelHistory: (propertyId: string) =>
    axiosInstance.get<ChannelHistoryItem[]>('/dashboard/portal/channel-manager/history', {
      params: { propertyId },
    }),

  getRecurringExpenses: (propertyId: string) =>
    axiosInstance.get<RecurringExpenseItem[]>('/dashboard/portal/finance/recurring', {
      params: { propertyId },
    }),

  getEInvoices: (propertyId: string) =>
    axiosInstance.get<EInvoiceItem[]>('/dashboard/portal/finance/e-invoices', {
      params: { propertyId },
    }),

  getAccountSummary: () =>
    axiosInstance.get<AccountSummaryResponse>('/dashboard/portal/account/summary'),

  getHelpFaqs: (propertyId?: string) =>
    axiosInstance.get<HelpFaqResponse>('/dashboard/portal/help/faqs', {
      params: { propertyId },
    }),

  exportMonthlyCalendar: (propertyId: string, year?: number, month?: number) =>
    axiosInstance.get('/dashboard/portal/calendar/monthly/export', {
      params: { propertyId, year, month },
    }),

  createCalendarShare: (payload: {
    propertyId: string;
    name: string;
    scope: string;
    audience: string;
    expiresAt: string;
    url?: string;
  }) => axiosInstance.post('/dashboard/portal/calendar/share', payload),

  revokeCalendarShare: (id: string, propertyId: string) =>
    axiosInstance.patch(`/dashboard/portal/calendar/share/${id}/revoke`, { propertyId }),

  createChannelRestriction: (payload: {
    propertyId: string;
    rule: string;
    channel: string;
    scope: string;
    value: string;
    status?: string;
  }) => axiosInstance.post('/dashboard/portal/channel-manager/restrictions', payload),

  updateChannelRestriction: (
    id: string,
    payload: {
      propertyId: string;
      rule?: string;
      channel?: string;
      scope?: string;
      value?: string;
      status?: string;
    },
  ) => axiosInstance.patch(`/dashboard/portal/channel-manager/restrictions/${id}`, payload),

  bulkApplyRestrictions: (payload: { propertyId: string; ids: string[]; status: string }) =>
    axiosInstance.post('/dashboard/portal/channel-manager/restrictions/bulk-apply', payload),

  connectChannel: (payload: {
    propertyId: string;
    name: string;
    type: string;
    credentials?: Record<string, unknown>;
  }) => axiosInstance.post('/dashboard/portal/channel-manager/channels/connect', payload),

  refreshChannel: (id: string, propertyId: string) =>
    axiosInstance.post(`/dashboard/portal/channel-manager/channels/${id}/refresh`, { propertyId }),

  assignChannelMessage: (
    id: string,
    payload: { propertyId: string; assignee: string; note?: string },
  ) => axiosInstance.post(`/dashboard/portal/channel-manager/messages/${id}/assign`, payload),

  createMessageTemplate: (payload: {
    propertyId: string;
    title: string;
    content: string;
  }) => axiosInstance.post('/dashboard/portal/channel-manager/messages/template', payload),

  recalculateAllocation: (propertyId: string) =>
    axiosInstance.post('/dashboard/portal/channel-manager/allocation/recalculate', { propertyId }),

  upsertAllocationRule: (payload: {
    propertyId: string;
    roomTypeId: string;
    allocation: string;
  }) => axiosInstance.post('/dashboard/portal/channel-manager/allocation/rule', payload),

  exportChannelReviews: (propertyId: string) =>
    axiosInstance.post('/dashboard/portal/channel-manager/reviews/export', { propertyId }),

  createReviewTemplate: (payload: {
    propertyId: string;
    title: string;
    content: string;
  }) => axiosInstance.post('/dashboard/portal/channel-manager/reviews/template', payload),

  simulateDynamicPricing: (payload: { propertyId: string; percent?: number }) =>
    axiosInstance.post('/dashboard/portal/channel-manager/dynamic-pricing/simulate', payload),

  applyDynamicPricing: (payload: {
    propertyId: string;
    roomTypeId: string;
    adjustmentPercent: number;
  }) => axiosInstance.post('/dashboard/portal/channel-manager/dynamic-pricing/apply', payload),

  exportChannelHistory: (propertyId: string) =>
    axiosInstance.get('/dashboard/portal/channel-manager/history/export', { params: { propertyId } }),

  resyncChannels: (payload: { propertyId: string; channelId?: string }) =>
    axiosInstance.post('/dashboard/portal/channel-manager/history/resync', payload),

  createRecurringExpense: (payload: {
    propertyId: string;
    title: string;
    amount: number;
    interval: string;
    nextDueDate: string;
    category?: string;
    description?: string;
  }) => axiosInstance.post('/dashboard/portal/finance/recurring', payload),

  createEInvoice: (payload: {
    propertyId: string;
    customerName: string;
    total: number;
    bookingCode?: string;
  }) => axiosInstance.post('/dashboard/portal/finance/e-invoices', payload),

  syncEInvoices: (propertyId: string) =>
    axiosInstance.post('/dashboard/portal/finance/e-invoices/sync', { propertyId }),

  updateAccountProfile: (payload: { name?: string; phone?: string; email?: string }) =>
    axiosInstance.patch('/dashboard/portal/account/profile', payload),

  updateAccountPassword: (payload: { currentPassword: string; newPassword: string }) =>
    axiosInstance.patch('/dashboard/portal/account/password', payload),

  logoutAllSessions: () => axiosInstance.post('/dashboard/portal/account/logout-all'),

  trackHelpSearch: (payload: { propertyId?: string; query: string }) =>
    axiosInstance.post('/dashboard/portal/help/search', payload),

  trackGuideOpen: (payload: { propertyId?: string; topic: string }) =>
    axiosInstance.post('/dashboard/portal/help/guide/open', payload),
};
