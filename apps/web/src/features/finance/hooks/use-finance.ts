import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeService } from '../services/finance.service';
import { CreateExpenseDto, UpdateExpenseDto } from '../types';
import { toast } from 'sonner';

export const useExpenses = (propertyId: string) => {
  return useQuery({
    queryKey: ['expenses', propertyId],
    queryFn: () => financeService.getExpenses(propertyId),
    enabled: !!propertyId,
  });
};

export const usePayments = (propertyId: string) => {
  return useQuery({
    queryKey: ['payments', propertyId],
    queryFn: () => financeService.getPayments(propertyId),
    enabled: !!propertyId,
  });
};

export const useFinanceMutation = () => {
  const queryClient = useQueryClient();

  const createExpense = useMutation({
    mutationFn: (dto: CreateExpenseDto) => financeService.createExpense(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.propertyId] });
      toast.success('Đã tạo phiếu chi thành công');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể tạo phiếu chi');
    },
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateExpenseDto }) =>
      financeService.updateExpense(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', data.propertyId] });
      toast.success('Đã cập nhật phiếu chi');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể cập nhật phiếu chi');
    },
  });

  const removeExpense = useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) =>
      financeService.removeExpense(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.propertyId] });
      toast.success('Đã xóa phiếu chi');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể xóa phiếu chi');
    },
  });

  return {
    createExpense,
    updateExpense,
    removeExpense,
  };
};
