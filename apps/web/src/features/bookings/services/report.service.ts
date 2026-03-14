import axiosInstance from '@/lib/axios';

export const reportService = {
  getMonthlyReport: (propertyId: string, year: string) =>
    axiosInstance.get(`/reports/monthly?propertyId=${propertyId}&year=${year}`),

  getRevenueReport: (propertyId: string, startDate: string, endDate: string) =>
    axiosInstance.get(`/reports/revenue?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`),

  getServicesReport: (propertyId: string, startDate: string, endDate: string) =>
    axiosInstance.get(`/reports/services?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`),

  getOperationsReport: (propertyId: string, startDate: string, endDate: string) =>
    axiosInstance.get(`/reports/operations?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`),

  getPaymentsReport: (propertyId: string, startDate: string, endDate: string) =>
    axiosInstance.get(`/reports/payments?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`),

  getPerformanceReport: (propertyId: string, startDate: string, endDate: string) =>
    axiosInstance.get(`/reports/performance?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`),
};
