import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';
import { ValidationError } from '../types';

/**
 * Factory middleware that validates `req[source]` against a Zod schema.
 * On success the parsed (and potentially transformed) value replaces
 * the original data.  On failure a 400 response with field-level
 * errors is returned.
 */
export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      // Replace with the parsed (coerced / defaulted) values
      (req as any)[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: ValidationError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        sendError(res, 'Validation failed', 400, formattedErrors);
        return;
      }
      next(error);
    }
  };
};
