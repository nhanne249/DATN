import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import { DashboardParams } from '../types';

export const useDashboard = (params: DashboardParams) => {
  return useQuery({
    queryKey: ['dashboard-summary', params],
    queryFn: () => dashboardService.getSummary(params).then(res => res.data),
    enabled: !!params.propertyId,
  });
};
