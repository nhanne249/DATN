import axiosInstance from '@/lib/axios';

export interface PropertyInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  logo?: string;
  timezone?: string;
  currency?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface PropertySettings {
  id: string;
  propertyId: string;
  checkInTime: string;
  checkOutTime: string;
  requirePaymentBeforeCheckOut: boolean;
  allowHourlyBooking: boolean;
  calendarEventColor: 'status' | 'source';
  defaultCalendarView: 'week' | 'month';
}

export const settingsService = {
  getProperty: (id: string) =>
    axiosInstance.get<PropertyInfo>(`/properties/${id}`),

  updateProperty: (id: string, data: Partial<PropertyInfo>) =>
    axiosInstance.patch<PropertyInfo>(`/properties/${id}`, data),

  getSettings: (propertyId: string) =>
    axiosInstance.get<PropertySettings>(`/properties/${propertyId}/settings`),

  updateSettings: (propertyId: string, data: Partial<PropertySettings>) =>
    axiosInstance.patch<PropertySettings>(`/properties/${propertyId}/settings`, data),

  getPrintTemplate: (type: string, propertyId: string) =>
    axiosInstance.get(`/settings/print-templates/type/${type}?propertyId=${propertyId}`),
};
