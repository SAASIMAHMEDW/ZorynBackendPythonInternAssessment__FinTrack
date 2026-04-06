import { Request } from 'express';
import { Role } from '@prisma/client';

// ─── JWT ────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

// ─── Authenticated Request ──────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── API Response ───────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  pagination?: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Query Filters ──────────────────────────────────────────
export interface PaginationQuery {
  page: number;
  limit: number;
}
