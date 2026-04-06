import apiClient from './client';
import type { ApiResponse, AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials) => {
    const { data } = await apiClient.post<ApiResponse<User>>('/auth/register', credentials);
    return data;
  },

  refresh: async () => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>('/auth/logout');
    return data;
  },

  getProfile: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    return data;
  },
};
