// ─── User Types ─────────────────────────────────────────────
export type Role = 'VIEWER' | 'ANALYST' | 'ADMIN';
export type Status = 'ACTIVE' | 'INACTIVE';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithCount extends User {
  _count?: { records: number };
}

// ─── Financial Record Types ─────────────────────────────────
export interface FinancialRecord {
  id: string;
  amount: string | number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateRecordInput {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
}

export interface UpdateRecordInput {
  amount?: number;
  type?: TransactionType;
  category?: string;
  date?: string;
  description?: string;
}

// ─── Dashboard Types ────────────────────────────────────────
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalRecords: number;
  incomeCount: number;
  expenseCount: number;
}

export interface CategoryBreakdown {
  category: string;
  type: TransactionType;
  total: number;
  count: number;
}

export interface TrendData {
  month: string;
  income: number;
  expense: number;
}

// ─── API Types ──────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// ─── Query Filter Types ─────────────────────────────────────
export interface RecordFilters {
  page?: number;
  limit?: number;
  type?: TransactionType | '';
  category?: string;
  startDate?: string;
  endDate?: string;
  sort?: 'date' | 'amount' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: Role | '';
  status?: Status | '';
  search?: string;
}

// ─── Dashboard Config Types ────────────────────────────────
export interface DashboardLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
}

export interface ChartConfig {
  id: string;
  type: 'BAR' | 'LINE' | 'PIE' | 'AREA' | 'BAR_HORIZONTAL';
  title: string;
  color?: string;
  showLegend?: boolean;
  isStack?: boolean;
  formula?: {
    type: 'sum' | 'count' | 'avg' | 'max' | 'min';
    field: string;
  };
}

export interface DashboardConfig {
  id: string;
  userId: string;
  name: string;
  layout: DashboardLayoutItem[];
  charts: ChartConfig[];
  createdAt: string;
  updatedAt: string;
}
