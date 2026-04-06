import apiClient from './client';
import type {
  ApiResponse,
  FinancialRecord,
  CreateRecordInput,
  UpdateRecordInput,
  RecordFilters,
  PaginationMeta,
} from '../types';

export const recordsApi = {
  getAll: async (filters: RecordFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const { data } = await apiClient.get<
      ApiResponse<FinancialRecord[]> & { pagination: PaginationMeta }
    >(`/records?${params.toString()}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<FinancialRecord>>(`/records/${id}`);
    return data;
  },

  create: async (record: CreateRecordInput) => {
    const { data } = await apiClient.post<ApiResponse<FinancialRecord>>('/records', record);
    return data;
  },

  update: async (id: string, record: UpdateRecordInput) => {
    const { data } = await apiClient.patch<ApiResponse<FinancialRecord>>(`/records/${id}`, record);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<{ id: string }>>(`/records/${id}`);
    return data;
  },
};
