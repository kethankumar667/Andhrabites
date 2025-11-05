import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/middleware/errorHandler';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found`) as CustomError;
  error.statusCode = 404;
  error.code = 'ROUTE_NOT_FOUND';
  next(error);
};