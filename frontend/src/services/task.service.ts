import api from './api';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assignedTo: number | null;
  assignedToName: string | null;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assignedTo?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  assignedTo?: number | null;
}

export interface MoveTaskData {
  newStatus: 'BACKLOG' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  async create(data: CreateTaskData): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateTaskData): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  async move(id: number, data: MoveTaskData): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/move`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

