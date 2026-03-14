import axiosInstance from '@/lib/axios';
import { DashboardSummary, DashboardParams } from '../types';

export const dashboardService = {
  getSummary: (params: DashboardParams) =>
    axiosInstance.get<DashboardSummary>('/dashboard/summary', { params }),
};
