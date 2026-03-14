export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskType {
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: string;
  roomId?: string;
  room?: any;
  bookingId?: string;
  booking?: any;
  assigneeId?: string;
  assignee?: any;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  type?: TaskType;
  status?: TaskStatus;
  dueDate?: string;
  roomId?: string;
  bookingId?: string;
  assigneeId?: string;
  propertyId: string;
}

export interface UpdateTaskDto extends Partial<Omit<CreateTaskDto, 'propertyId'>> {}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  type: TaskType;
  propertyId: string;
}
