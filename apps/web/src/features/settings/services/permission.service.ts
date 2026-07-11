import axiosInstance from '@/lib/axios';

export interface RolePermission {
  role: string;
  modules: string[];
  isCustom: boolean;
}

export interface CustomRole {
  id: string;
  propertyId: string;
  name: string;
  baseRole: string;
  modules: string[];
  createdAt: string;
}

export const permissionService = {
  // Built-in role matrix
  getMatrix: () => axiosInstance.get<RolePermission[]>('/permissions'),
  getMyModules: () => axiosInstance.get<{ modules: string[] | null }>('/permissions/my-modules'),
  getMyPermissions: () =>
    axiosInstance.get<{ role: string; permissions: { resourceKey: string; actions: string[] }[] }>('/permissions/me'),
  updateRoleModules: (role: string, modules: string[]) =>
    axiosInstance.put(`/permissions/${role}`, { modules }),
  resetRoleModules: (role: string) => axiosInstance.delete<{ modules: string[] }>(`/permissions/${role}`),

  // Custom roles
  getCustomRoles: () => axiosInstance.get<CustomRole[]>('/permissions/custom-roles'),
  createCustomRole: (data: { name: string; baseRole: string; modules: string[] }) =>
    axiosInstance.post<CustomRole>('/permissions/custom-roles', data),
  updateCustomRole: (id: string, data: { name?: string; baseRole?: string; modules?: string[] }) =>
    axiosInstance.patch<CustomRole>(`/permissions/custom-roles/${id}`, data),
  deleteCustomRole: (id: string) => axiosInstance.delete(`/permissions/custom-roles/${id}`),
};
