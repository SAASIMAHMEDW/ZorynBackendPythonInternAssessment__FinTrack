import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { sendError } from '../utils/response';

/**
 * Factory middleware that restricts access to users with
 * one of the specified roles.  Must run after `authenticate`.
 *
 * Usage:  router.get('/admin-only', authenticate, requireRole('ADMIN'), handler);
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        403
      );
      return;
    }

    next();
  };
};
