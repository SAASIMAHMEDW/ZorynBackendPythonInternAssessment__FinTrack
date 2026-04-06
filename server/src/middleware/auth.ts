import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types';
import { sendError } from '../utils/response';

/**
 * Middleware that validates the Bearer access token from the
 * Authorization header and attaches the decoded user to `req.user`.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Access token is required', 401);
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      sendError(res, 'Access token is required', 401);
      return;
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendError(res, 'Access token has expired', 401);
      return;
    }
    if (error.name === 'JsonWebTokenError') {
      sendError(res, 'Invalid access token', 401);
      return;
    }
    sendError(res, 'Authentication failed', 401);
  }
};
