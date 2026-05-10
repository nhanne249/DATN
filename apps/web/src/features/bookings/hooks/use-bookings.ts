import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import { toast } from 'sonner';

export const useBookings = (propertyId: string, params?: { startDate?: string; endDate?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['bookings', propertyId, params],
    queryFn: () => bookingService.getBookings(propertyId, params).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingService.getBooking(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useBookingMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => bookingService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Tạo đặt phòng thành công');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể tạo đặt phòng');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      bookingService.updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      toast.success('Cập nhật đặt phòng thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể cập nhật đặt phòng');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bookingService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Xóa đặt phòng thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể xóa đặt phòng');
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: any }) =>
      bookingService.addPayment(bookingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId] });
      toast.success('Ghi nhận thanh toán thành công');
    },
  });

  const addServiceUsageMutation = useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: any }) =>
      bookingService.addServiceUsage(bookingId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking', variables.bookingId] });
      toast.success('Ghi nhận dịch vụ thành công');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingService.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      toast.success('Đã hủy đặt phòng');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => bookingService.createTask(data),
    onSuccess: () => {
      toast.success('Tạo nhiệm vụ thành công');
    },
  });

  return {
    createBooking: createMutation.mutateAsync,
    updateBooking: updateMutation.mutateAsync,
    deleteBooking: deleteMutation.mutateAsync,
    addPayment: addPaymentMutation.mutateAsync,
    addServiceUsage: addServiceUsageMutation.mutateAsync,
    cancelBooking: cancelMutation.mutateAsync,
    createTask: createTaskMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
