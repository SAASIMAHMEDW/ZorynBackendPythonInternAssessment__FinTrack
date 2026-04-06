import apiClient from './client';
import type { ApiResponse, User, UserWithCount, UserFilters, PaginationMeta } from '../types';

export const usersApi = {
  getAll: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const { data } = await apiClient.get<
      ApiResponse<User[]> & { pagination: PaginationMeta }
    >(`/users?${params.toString()}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<UserWithCount>>(`/users/${id}`);
    return data;
  },

  update: async (id: string, updates: Partial<Pick<User, 'role' | 'status' | 'firstName' | 'lastName'>>) => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, updates);
    return data;
  },

  deactivate: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<User>>(`/users/${id}`);
    return data;
  },
};
