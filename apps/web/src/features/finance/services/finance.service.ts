import axiosInstance from '@/lib/axios';
import { Expense, CreateExpenseDto, UpdateExpenseDto, Payment } from '../types';

export const financeService = {
  // Expenses
  getExpenses: (propertyId: string): Promise<Expense[]> =>
    axiosInstance.get(`/finance/expenses`, { params: { propertyId } }),

  getExpense: (id: string): Promise<Expense> =>
    axiosInstance.get(`/finance/expenses/${id}`),

  createExpense: (dto: CreateExpenseDto): Promise<Expense> =>
    axiosInstance.post(`/finance/expenses`, dto),

  updateExpense: (id: string, dto: UpdateExpenseDto): Promise<Expense> =>
    axiosInstance.patch(`/finance/expenses/${id}`, dto),

  removeExpense: (id: string): Promise<void> =>
    axiosInstance.delete(`/finance/expenses/${id}`),

  // Payments (Fetching via bookings or property)
  // Note: Backend might need a dedicated payments controller for global list
  // For now, assume we might need to add it or use a filtered query if available
  getPayments: (propertyId: string): Promise<Payment[]> =>
    axiosInstance.get(`/finance/payments`, { params: { propertyId } }),
};
