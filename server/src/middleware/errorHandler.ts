import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/response';
import { config } from '../config';

/**
 * Global error handler — must be registered last in the middleware chain.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Prisma known-request errors
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      success: false,
      message: 'Database operation failed',
    });
    return;
  }

  // Unexpected errors
  if (!config.isProduction) {
    console.error('🔥 Unexpected Error:', err);
  }

  res.status(500).json({
    success: false,
    message: config.isProduction
      ? 'Internal server error'
      : err.message || 'Internal server error',
  });
};

/**
 * Catch-all for routes that don't match any registered handler.
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
