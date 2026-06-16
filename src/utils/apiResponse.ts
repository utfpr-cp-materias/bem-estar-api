import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: any[]
): Response => {
  const response: ApiResponse = {
    success: false,
    error: message,
    errors,
  };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data?: T,
  message: string = 'Criado com sucesso'
): Response => {
  return sendSuccess(res, data, message, 201);
};

export const sendNotFound = (
  res: Response,
  message: string = 'Recurso não encontrado'
): Response => {
  return sendError(res, message, 404);
};

export const sendUnauthorized = (
  res: Response,
  message: string = 'Não autorizado'
): Response => {
  return sendError(res, message, 401);
};

export const sendServerError = (
  res: Response,
  message: string = 'Erro interno do servidor'
): Response => {
  return sendError(res, message, 500);
};
