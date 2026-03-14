import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService, Room, RoomType } from '../services/room.service';
import { toast } from 'sonner';

export const useRooms = (propertyId: string) => {
  return useQuery({
    queryKey: ['rooms', propertyId],
    queryFn: () => roomService.getRooms(propertyId).then(res => res.data),
  });
};

export const useRoomTypes = (propertyId: string) => {
  return useQuery({
    queryKey: ['roomTypes', propertyId],
    queryFn: () => roomService.getRoomTypes(propertyId).then(res => res.data),
  });
};

export const useRoomMutation = (propertyId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Room>) => roomService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', propertyId] });
      toast.success('Đã thêm phòng thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Room> }) => 
      roomService.updateRoom(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', propertyId] });
      toast.success('Đã cập nhật phòng thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roomService.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', propertyId] });
      toast.success('Đã xóa phòng thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return {
    createRoom: createMutation.mutateAsync,
    updateRoom: updateMutation.mutateAsync,
    deleteRoom: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useRoomTypeMutation = (propertyId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<RoomType>) => roomService.createRoomType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes', propertyId] });
      toast.success('Đã thêm loại phòng thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<RoomType> }) => 
      roomService.updateRoomType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes', propertyId] });
      toast.success('Đã cập nhật loại phòng thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roomService.deleteRoomType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes', propertyId] });
      toast.success('Đã xóa loại phòng thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return {
    createRoomType: createMutation.mutateAsync,
    updateRoomType: updateMutation.mutateAsync,
    deleteRoomType: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
