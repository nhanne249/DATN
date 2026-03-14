import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automationService, EmailTemplate, AutomationFlow } from '../services/automation.service';
import { toast } from 'sonner';

export const useAutomation = (propertyId: string) => {
  const queryClient = useQueryClient();

  const templatesQuery = useQuery({
    queryKey: ['automation-templates', propertyId],
    queryFn: () => automationService.getTemplates(propertyId).then(res => res.data),
    enabled: !!propertyId,
  });

  const flowsQuery = useQuery({
    queryKey: ['automation-flows', propertyId],
    queryFn: () => automationService.getFlows(propertyId).then(res => res.data),
    enabled: !!propertyId,
  });

  const createTemplateMutation = useMutation({
    mutationFn: (data: Partial<EmailTemplate>) => automationService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-templates', propertyId] });
      toast.success('Đã tạo mẫu email thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const createFlowMutation = useMutation({
    mutationFn: (data: Partial<AutomationFlow>) => automationService.createFlow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-flows', propertyId] });
      toast.success('Đã tạo quy trình tự động thành công!');
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  return {
    templates: templatesQuery.data || [],
    isLoadingTemplates: templatesQuery.isLoading,
    flows: flowsQuery.data || [],
    isLoadingFlows: flowsQuery.isLoading,
    createTemplate: createTemplateMutation.mutateAsync,
    createFlow: createFlowMutation.mutateAsync,
    isCreatingTemplate: createTemplateMutation.isPending,
    isCreatingFlow: createFlowMutation.isPending,
  };
};
