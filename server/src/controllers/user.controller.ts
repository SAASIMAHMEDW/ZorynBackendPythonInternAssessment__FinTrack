import { Response } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types';

/**
 * GET /api/users
 */
export const getUsers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { users, total } = await UserService.findAll(req.query as any);
    const { page, limit } = req.query as any;
    sendPaginated(res, users, total, Number(page), Number(limit), 'Users retrieved');
  }
);

/**
 * GET /api/users/:id
 */
export const getUserById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await UserService.findById(req.params.id as string);
    sendSuccess(res, user, 'User retrieved');
  }
);

/**
 * PATCH /api/users/:id
 */
export const updateUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await UserService.update(req.params.id as string, req.body);
    sendSuccess(res, user, 'User updated');
  }
);

/**
 * DELETE /api/users/:id
 */
export const deactivateUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await UserService.deactivate(req.params.id as string);
    sendSuccess(res, user, 'User deactivated');
  }
);
