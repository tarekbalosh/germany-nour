import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: (err as ZodError).issues
      }
    });
  }

  const statusCode = err.status || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  
  // Log error safely here without secrets...
  console.error(`[Error] ${err.message}`);

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message
    }
  });
}
