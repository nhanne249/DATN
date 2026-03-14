import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rentalService } from '../services/rental.service';
import { CreateRentalDto, CreateVehicleDto } from '../types';
import { toast } from 'sonner';

export const useRentals = (propertyId: string) => {
  return useQuery({
    queryKey: ['rentals', propertyId],
    queryFn: () => rentalService.getRentals(propertyId),
    enabled: !!propertyId,
  });
};

export const useVehicles = (propertyId: string) => {
  return useQuery({
    queryKey: ['vehicles', propertyId],
    queryFn: () => rentalService.getVehicles(propertyId),
    enabled: !!propertyId,
  });
};

export const useRentalMutation = () => {
  const queryClient = useQueryClient();

  const createRentalMutation = useMutation({
    mutationFn: (dto: CreateRentalDto) => rentalService.createRental(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rentals', variables.propertyId] });
      toast.success('Tạo đơn thuê mới thành công');
    },
    onError: () => {
      toast.error('Lỗi khi tạo đơn thuê');
    },
  });

  const recordPickupMutation = useMutation({
    mutationFn: (id: string) => rentalService.recordPickup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast.success('Đã ghi nhận nhận xe');
    },
    onError: () => {
      toast.error('Lỗi khi ghi nhận nhận xe');
    },
  });

  const recordReturnMutation = useMutation({
    mutationFn: (id: string) => rentalService.recordReturn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast.success('Đã ghi nhận trả xe');
    },
    onError: () => {
      toast.error('Lỗi khi ghi nhận trả xe');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      rentalService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật trạng thái');
    },
  });

  return {
    createRental: createRentalMutation.mutateAsync,
    recordPickup: recordPickupMutation.mutateAsync,
    recordReturn: recordReturnMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    isCreating: createRentalMutation.isPending,
  };
};
