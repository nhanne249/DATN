import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, PropertyInfo, PropertySettings } from '../services/settings.service';
import { toast } from 'sonner';

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => settingsService.getProperty(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useSettings = (propertyId: string) => {
  return useQuery({
    queryKey: ['settings', propertyId],
    queryFn: () => settingsService.getSettings(propertyId).then((res) => res.data),
    enabled: !!propertyId,
  });
};

export const useSettingsMutation = (propertyId: string) => {
  const queryClient = useQueryClient();

  const updatePropertyMutation = useMutation({
    mutationFn: (data: Partial<PropertyInfo>) => settingsService.updateProperty(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      toast.success('Property information updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update property info');
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<PropertySettings>) => settingsService.updateSettings(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', propertyId] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });

  return {
    updateProperty: updatePropertyMutation.mutateAsync,
    updateSettings: updateSettingsMutation.mutateAsync,
    isUpdatingProperty: updatePropertyMutation.isPending,
    isUpdatingSettings: updateSettingsMutation.isPending,
  };
};
