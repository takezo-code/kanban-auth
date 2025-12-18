import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt: string;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },
};

