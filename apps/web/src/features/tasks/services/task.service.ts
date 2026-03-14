import axiosInstance from '@/lib/axios';
import { Task, CreateTaskDto, UpdateTaskDto, TaskTemplate } from '../types';

export const taskService = {
  getTasks: (propertyId: string) =>
    axiosInstance.get<Task[]>(`/tasks`, { params: { propertyId } }),

  getTask: (id: string) =>
    axiosInstance.get<Task>(`/tasks/${id}`),

  createTask: (dto: CreateTaskDto) =>
    axiosInstance.post<Task>(`/tasks`, dto),

  updateTask: (id: string, dto: UpdateTaskDto) =>
    axiosInstance.patch<Task>(`/tasks/${id}`, dto),

  removeTask: (id: string) =>
    axiosInstance.delete(`/tasks/${id}`),

  getTemplates: (propertyId: string) =>
    axiosInstance.get<TaskTemplate[]>(`/tasks/templates`, { params: { propertyId } }),
};
