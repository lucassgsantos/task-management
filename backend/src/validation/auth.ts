import { badRequest } from '../lib/errors';
import { LoginInput, RegisterInput } from '../models/User';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ensureObject = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    throw badRequest('Envie um corpo JSON válido.', 'INVALID_BODY');
  }

  return value as Record<string, unknown>;
};

const ensureString = (value: unknown, field: string) => {
  if (typeof value !== 'string') {
    throw badRequest(`Campo inválido: ${field}.`, 'VALIDATION_ERROR');
  }

  return value.trim();
};

export const validateRegisterInput = (value: unknown): RegisterInput => {
  const body = ensureObject(value);
  const email = ensureString(body.email, 'email').toLowerCase();
  const name = ensureString(body.name, 'name');
  const password = ensureString(body.password, 'password');

  if (!emailPattern.test(email)) {
    throw badRequest('Digite um e-mail válido.', 'INVALID_EMAIL');
  }

  if (name.length < 2 || name.length > 60) {
    throw badRequest(
      'Seu nome deve ter entre 2 e 60 caracteres.',
      'INVALID_NAME',
    );
  }

  if (password.length < 8 || password.length > 72) {
    throw badRequest(
      'A senha deve ter entre 8 e 72 caracteres.',
      'INVALID_PASSWORD',
    );
  }

  return { email, name, password };
};

export const validateLoginInput = (value: unknown): LoginInput => {
  const body = ensureObject(value);
  const email = ensureString(body.email, 'email').toLowerCase();
  const password = ensureString(body.password, 'password');

  if (!emailPattern.test(email)) {
    throw badRequest('Digite um e-mail válido.', 'INVALID_EMAIL');
  }

  if (!password) {
    throw badRequest('Digite sua senha.', 'INVALID_PASSWORD');
  }

  return { email, password };
};
