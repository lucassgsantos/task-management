import { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
    });
  }

  console.error('Erro interno não tratado:', error);

  return res.status(500).json({
    error: 'Ocorreu um erro interno no servidor.',
    code: 'INTERNAL_ERROR',
  });
};
