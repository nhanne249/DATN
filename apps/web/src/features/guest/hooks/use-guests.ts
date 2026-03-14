import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guestService, CreateGuestDto, UpdateGuestDto } from '../services/guest.service';
import { toast } from 'sonner';

export const useGuests = (propertyId: string) => {
  return useQuery({
    queryKey: ['guests', propertyId],
    queryFn: () => guestService.getGuests(propertyId),
    enabled: !!propertyId,
  });
};

export const useGuestMutation = (propertyId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (dto: CreateGuestDto) => guestService.createGuest(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', propertyId] });
      toast.success('Thêm khách hàng thành công');
    },
    onError: () => {
      toast.error('Lỗi khi thêm khách hàng');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateGuestDto }) =>
      guestService.updateGuest(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', propertyId] });
      toast.success('Cập nhật khách hàng thành công');
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật khách hàng');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => guestService.removeGuest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', propertyId] });
      toast.success('Xóa khách hàng thành công');
    },
    onError: () => {
      toast.error('Lỗi khi xóa khách hàng');
    },
  });

  return {
    createGuest: createMutation.mutateAsync,
    updateGuest: updateMutation.mutateAsync,
    removeGuest: removeMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
