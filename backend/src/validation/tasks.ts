import { badRequest } from '../lib/errors';
import { CreateTaskInput, UpdateTaskInput } from '../models/Task';

const ensureObject = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    throw badRequest('Envie um corpo JSON válido.', 'INVALID_BODY');
  }

  return value as Record<string, unknown>;
};

const normalizeOptionalText = (value: unknown, field: string) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw badRequest(`Campo inválido: ${field}.`, 'VALIDATION_ERROR');
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
};

export const validateCreateTaskInput = (value: unknown): CreateTaskInput => {
  const body = ensureObject(value);
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = normalizeOptionalText(body.description, 'description');

  if (!title) {
    throw badRequest('Informe um título para a tarefa.', 'INVALID_TITLE');
  }

  if (title.length > 120) {
    throw badRequest(
      'O título deve ter no máximo 120 caracteres.',
      'INVALID_TITLE',
    );
  }

  if (description && description.length > 500) {
    throw badRequest(
      'A descrição deve ter no máximo 500 caracteres.',
      'INVALID_DESCRIPTION',
    );
  }

  return { title, description };
};

export const validateUpdateTaskInput = (value: unknown): UpdateTaskInput => {
  const body = ensureObject(value);
  const input: UpdateTaskInput = {};

  if (body.title !== undefined) {
    if (typeof body.title !== 'string') {
      throw badRequest('Campo inválido: title.', 'VALIDATION_ERROR');
    }

    const title = body.title.trim();

    if (!title) {
      throw badRequest('Informe um título para a tarefa.', 'INVALID_TITLE');
    }

    if (title.length > 120) {
      throw badRequest(
        'O título deve ter no máximo 120 caracteres.',
        'INVALID_TITLE',
      );
    }

    input.title = title;
  }

  if (body.description !== undefined) {
    const description = normalizeOptionalText(body.description, 'description');

    if (description && description.length > 500) {
      throw badRequest(
        'A descrição deve ter no máximo 500 caracteres.',
        'INVALID_DESCRIPTION',
      );
    }

    input.description = description;
  }

  if (body.completed !== undefined) {
    if (typeof body.completed !== 'boolean') {
      throw badRequest('Campo inválido: completed.', 'VALIDATION_ERROR');
    }

    input.completed = body.completed;
  }

  if (Object.keys(input).length === 0) {
    throw badRequest(
      'Envie ao menos um campo para atualizar a tarefa.',
      'EMPTY_UPDATE',
    );
  }

  return input;
};
