import { NextFunction, Request, Response } from 'express';
import { verifyAuthToken } from '../lib/authToken';
import { unauthorized } from '../lib/errors';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(
      unauthorized('Faça login para acessar este recurso.', 'AUTH_REQUIRED'),
    );
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const payload = verifyAuthToken(token);
    req.userId = payload.userId;
    return next();
  } catch {
    return next(unauthorized('Sua sessão é inválida.', 'INVALID_TOKEN'));
  }
};
