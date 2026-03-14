import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report.service';

export const useMonthlyReport = (propertyId: string, year: string) => {
  return useQuery({
    queryKey: ['reports', 'monthly', propertyId, year],
    queryFn: () => reportService.getMonthlyReport(propertyId, year).then(res => res.data),
    enabled: !!propertyId && !!year,
  });
};

export const useRevenueReport = (propertyId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['reports', 'revenue', propertyId, startDate, endDate],
    queryFn: () => reportService.getRevenueReport(propertyId, startDate, endDate).then(res => res.data),
    enabled: !!propertyId && !!startDate && !!endDate,
  });
};

export const useServicesReport = (propertyId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['reports', 'services', propertyId, startDate, endDate],
    queryFn: () => reportService.getServicesReport(propertyId, startDate, endDate).then(res => res.data),
    enabled: !!propertyId && !!startDate && !!endDate,
  });
};

export const useOperationsReport = (propertyId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['reports', 'operations', propertyId, startDate, endDate],
    queryFn: () => reportService.getOperationsReport(propertyId, startDate, endDate).then(res => res.data),
    enabled: !!propertyId && !!startDate && !!endDate,
  });
};

export const usePaymentsReport = (propertyId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['reports', 'payments', propertyId, startDate, endDate],
    queryFn: () => reportService.getPaymentsReport(propertyId, startDate, endDate).then(res => res.data),
    enabled: !!propertyId && !!startDate && !!endDate,
  });
};

export const usePerformanceReport = (propertyId: string, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['reports', 'performance', propertyId, startDate, endDate],
    queryFn: () => reportService.getPerformanceReport(propertyId, startDate, endDate).then(res => res.data),
    enabled: !!propertyId && !!startDate && !!endDate,
  });
};
