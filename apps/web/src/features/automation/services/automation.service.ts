import axiosInstance from '@/lib/axios';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  propertyId: string;
  createdAt: string;
}

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  conditions: any;
  isActive: boolean;
  propertyId: string;
  createdAt: string;
}

export const automationService = {
  getTemplates: (propertyId: string) => 
    axiosInstance.get<EmailTemplate[]>(`/automation/templates?propertyId=${propertyId}`),
  
  createTemplate: (data: Partial<EmailTemplate>) => 
    axiosInstance.post<EmailTemplate>('/automation/templates', data),
    
  getFlows: (propertyId: string) => 
    axiosInstance.get<AutomationFlow[]>(`/automation/flows?propertyId=${propertyId}`),
    
  createFlow: (data: Partial<AutomationFlow>) => 
    axiosInstance.post<AutomationFlow>('/automation/flows', data),
};
