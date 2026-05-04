import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const globalErrorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    console.error(`[${err.statusCode}] ${err.name}: ${err.message}`);
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
};
