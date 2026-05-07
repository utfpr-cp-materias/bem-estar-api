import { Request, Response, NextFunction } from 'express';
import { sendServerError } from '../utils';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (res.headersSent) {
    next(error);
    return;
  }

  sendServerError(res,
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'Erro interno do servidor'
  );
};
