import apiClient from './client';
import type {
  ApiResponse,
  DashboardSummary,
  CategoryBreakdown,
  TrendData,
  FinancialRecord,
} from '../types';

type DateRange = '7d' | '30d' | '90d' | 'ytd';

export const dashboardApi = {
  getSummary: async (range?: string) => {
    const params = range ? { range } : {};
    const { data } = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary', { params });
    return data;
  },

  getCategoryBreakdown: async (range?: string) => {
    const params = range ? { range } : {};
    const { data } = await apiClient.get<ApiResponse<CategoryBreakdown[]>>(
      '/dashboard/category-breakdown',
      { params }
    );
    return data;
  },

  getTrends: async (range?: string) => {
    const params = range ? { range } : {};
    const { data } = await apiClient.get<ApiResponse<TrendData[]>>('/dashboard/trends', { params });
    return data;
  },

  getRecentActivity: async (range?: string) => {
    const params = range ? { range } : {};
    const { data } = await apiClient.get<ApiResponse<FinancialRecord[]>>('/dashboard/recent', { params });
    return data;
  },
};
