import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface AuthTokenPayload {
  userId: string;
}

export const createAuthToken = (userId: string) => {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: '7d' });
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.jwtSecret);

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof decoded.userId !== 'string'
  ) {
    throw new Error('Token inválido');
  }

  return { userId: decoded.userId };
};
