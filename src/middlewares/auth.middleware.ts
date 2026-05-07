import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env, prisma } from '../config';
import { sendUnauthorized } from '../utils';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

interface JwtPayload {
  userId: string;
  email: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Token não fornecido');
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        onboardingCompleted: true,
      },
    });

    if (!user || !user.isActive) {
      sendUnauthorized(res, 'Usuário não encontrado ou inativo');
      return;
    }

    req.userId = user.id;
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendUnauthorized(res, 'Token expirado');
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      sendUnauthorized(res, 'Token inválido');
      return;
    }
    sendUnauthorized(res, 'Erro na autenticação');
  }
};

export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });

    if (user && user.isActive) {
      req.userId = user.id;
      req.user = user;
    }

    next();
  } catch {
    next();
  }
};
