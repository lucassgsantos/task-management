import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { createAuthToken } from '../lib/authToken';
import { conflict, notFound, unauthorized } from '../lib/errors';
import { userRepository } from '../repositories/userRepository';
import { validateLoginInput, validateRegisterInput } from '../validation/auth';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = validateRegisterInput(req.body);
  const existingUser = userRepository.findByEmail(input.email);

  if (existingUser) {
    throw conflict('Já existe uma conta com esse e-mail.', 'EMAIL_IN_USE');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = userRepository.create({
    email: input.email,
    name: input.name,
    passwordHash,
  });

  res.status(201).json({
    user,
    token: createAuthToken(user.id),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = validateLoginInput(req.body);
  const user = userRepository.findByEmail(input.email);

  if (!user) {
    throw unauthorized('E-mail ou senha inválidos.', 'INVALID_CREDENTIALS');
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw unauthorized('E-mail ou senha inválidos.', 'INVALID_CREDENTIALS');
  }

  const publicUser = userRepository.findPublicById(user.id);

  if (!publicUser) {
    throw notFound('Usuário não encontrado.', 'USER_NOT_FOUND');
  }

  res.json({
    user: publicUser,
    token: createAuthToken(publicUser.id),
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = userRepository.findPublicById(req.userId as string);

  if (!user) {
    throw notFound('Usuário não encontrado.', 'USER_NOT_FOUND');
  }

  res.json(user);
});
