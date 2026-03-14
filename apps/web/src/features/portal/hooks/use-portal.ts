import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { portalService } from '../services/portal.service';
import { toast } from 'sonner';

export const useMonthlyCalendar = (propertyId: string, year?: number, month?: number) => {
  return useQuery({
    queryKey: ['portal', 'calendar', 'monthly', propertyId, year, month],
    queryFn: () => portalService.getMonthlyCalendar(propertyId, year, month).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useCalendarShares = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'calendar', 'share', propertyId],
    queryFn: () => portalService.getCalendarShares(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useChannelRestrictions = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'channel-manager', 'restrictions', propertyId],
    queryFn: () => portalService.getChannelRestrictions(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useChannelMessages = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'channel-manager', 'messages', propertyId],
    queryFn: () => portalService.getChannelMessages(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useChannelAllocation = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'channel-manager', 'allocation', propertyId],
    queryFn: () => portalService.getChannelAllocation(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useChannelReviews = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'channel-manager', 'reviews', propertyId],
    queryFn: () => portalService.getChannelReviews(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useDynamicPricing = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'channel-manager', 'dynamic-pricing', propertyId],
    queryFn: () => portalService.getDynamicPricing(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useChannelHistory = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'channel-manager', 'history', propertyId],
    queryFn: () => portalService.getChannelHistory(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useRecurringExpenses = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'finance', 'recurring', propertyId],
    queryFn: () => portalService.getRecurringExpenses(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useEInvoices = (propertyId: string) => {
  return useQuery({
    queryKey: ['portal', 'finance', 'e-invoices', propertyId],
    queryFn: () => portalService.getEInvoices(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useAccountSummary = () => {
  return useQuery({
    queryKey: ['portal', 'account', 'summary'],
    queryFn: () => portalService.getAccountSummary().then((res) => res.data),
  });
};

export const useHelpFaqs = (propertyId?: string) => {
  return useQuery({
    queryKey: ['portal', 'help', 'faqs', propertyId],
    queryFn: () => portalService.getHelpFaqs(propertyId).then((res) => res.data),
  });
};

export const usePortalMutation = (propertyId?: string) => {
  const queryClient = useQueryClient();

  const invalidatePortal = () => queryClient.invalidateQueries({ queryKey: ['portal'] });

  const withSuccess = (message: string) => ({
    onSuccess: () => {
      invalidatePortal();
      toast.success(message);
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : 'Operation failed';
      toast.error(msg);
    },
  });

  const createCalendarShare = useMutation({
    mutationFn: portalService.createCalendarShare,
    ...withSuccess('Da tao link chia se'),
  });

  const revokeCalendarShare = useMutation({
    mutationFn: ({ id, propertyId: pid }: { id: string; propertyId: string }) =>
      portalService.revokeCalendarShare(id, pid),
    ...withSuccess('Da thu hoi link chia se'),
  });

  const createChannelRestriction = useMutation({
    mutationFn: portalService.createChannelRestriction,
    ...withSuccess('Da tao han che kenh'),
  });

  const updateChannelRestriction = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        propertyId: string;
        rule?: string;
        channel?: string;
        scope?: string;
        value?: string;
        status?: string;
      };
    }) => portalService.updateChannelRestriction(id, payload),
    ...withSuccess('Da cap nhat han che kenh'),
  });

  const bulkApplyRestrictions = useMutation({
    mutationFn: portalService.bulkApplyRestrictions,
    ...withSuccess('Da ap dung hang loat han che'),
  });

  const connectChannel = useMutation({
    mutationFn: portalService.connectChannel,
    ...withSuccess('Da ket noi kenh moi'),
  });

  const refreshChannel = useMutation({
    mutationFn: ({ id, propertyId: pid }: { id: string; propertyId: string }) =>
      portalService.refreshChannel(id, pid),
    ...withSuccess('Da refresh kenh'),
  });

  const assignChannelMessage = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { propertyId: string; assignee: string; note?: string };
    }) => portalService.assignChannelMessage(id, payload),
    ...withSuccess('Da gan nguoi xu ly tin nhan'),
  });

  const createMessageTemplate = useMutation({
    mutationFn: portalService.createMessageTemplate,
    ...withSuccess('Da tao template tin nhan'),
  });

  const recalculateAllocation = useMutation({
    mutationFn: portalService.recalculateAllocation,
    ...withSuccess('Da tinh lai allocation'),
  });

  const upsertAllocationRule = useMutation({
    mutationFn: portalService.upsertAllocationRule,
    ...withSuccess('Da luu quy tac allocation'),
  });

  const exportChannelReviews = useMutation({
    mutationFn: portalService.exportChannelReviews,
    ...withSuccess('Da xuat bao cao review'),
  });

  const createReviewTemplate = useMutation({
    mutationFn: portalService.createReviewTemplate,
    ...withSuccess('Da tao template review'),
  });

  const simulateDynamicPricing = useMutation({
    mutationFn: portalService.simulateDynamicPricing,
    ...withSuccess('Da chay simulation gia'),
  });

  const applyDynamicPricing = useMutation({
    mutationFn: portalService.applyDynamicPricing,
    ...withSuccess('Da ap dung dynamic pricing'),
  });

  const exportChannelHistory = useMutation({
    mutationFn: portalService.exportChannelHistory,
    ...withSuccess('Da xuat lich su dong bo'),
  });

  const resyncChannels = useMutation({
    mutationFn: portalService.resyncChannels,
    ...withSuccess('Da khoi tao dong bo lai'),
  });

  const createRecurringExpense = useMutation({
    mutationFn: portalService.createRecurringExpense,
    ...withSuccess('Da tao chi phi dinh ky'),
  });

  const createEInvoice = useMutation({
    mutationFn: portalService.createEInvoice,
    ...withSuccess('Da tao hoa don dien tu'),
  });

  const syncEInvoices = useMutation({
    mutationFn: portalService.syncEInvoices,
    ...withSuccess('Da dong bo hoa don dien tu'),
  });

  const updateAccountProfile = useMutation({
    mutationFn: portalService.updateAccountProfile,
    ...withSuccess('Da cap nhat ho so tai khoan'),
  });

  const updateAccountPassword = useMutation({
    mutationFn: portalService.updateAccountPassword,
    ...withSuccess('Da cap nhat mat khau'),
  });

  const logoutAllSessions = useMutation({
    mutationFn: portalService.logoutAllSessions,
    ...withSuccess('Da dang xuat tat ca phien'),
  });

  const trackHelpSearch = useMutation({
    mutationFn: portalService.trackHelpSearch,
    ...withSuccess('Da ghi nhan tim kiem'),
  });

  const trackGuideOpen = useMutation({
    mutationFn: portalService.trackGuideOpen,
    ...withSuccess('Da mo huong dan nhanh'),
  });

  const exportMonthlyCalendar = useMutation({
    mutationFn: ({
      propertyId: pid,
      year,
      month,
    }: {
      propertyId: string;
      year?: number;
      month?: number;
    }) => portalService.exportMonthlyCalendar(pid, year, month),
    ...withSuccess('Da xuat du lieu lich thang'),
  });

  return {
    propertyId,
    createCalendarShare,
    revokeCalendarShare,
    createChannelRestriction,
    updateChannelRestriction,
    bulkApplyRestrictions,
    connectChannel,
    refreshChannel,
    assignChannelMessage,
    createMessageTemplate,
    recalculateAllocation,
    upsertAllocationRule,
    exportChannelReviews,
    createReviewTemplate,
    simulateDynamicPricing,
    applyDynamicPricing,
    exportChannelHistory,
    resyncChannels,
    createRecurringExpense,
    createEInvoice,
    syncEInvoices,
    updateAccountProfile,
    updateAccountPassword,
    logoutAllSessions,
    trackHelpSearch,
    trackGuideOpen,
    exportMonthlyCalendar,
  };
};
