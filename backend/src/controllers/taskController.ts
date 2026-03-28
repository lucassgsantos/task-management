import { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { notFound } from '../lib/errors';
import { taskRepository } from '../repositories/taskRepository';
import {
  validateCreateTaskInput,
  validateUpdateTaskInput,
} from '../validation/tasks';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = taskRepository.listByUser(req.userId as string);
  res.json(tasks);
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const input = validateCreateTaskInput(req.body);
  const task = taskRepository.create(req.userId as string, input);

  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const input = validateUpdateTaskInput(req.body);
  const task = taskRepository.findByIdForUser(
    req.params.id,
    req.userId as string,
  );

  if (!task) {
    throw notFound('Tarefa não encontrada.', 'TASK_NOT_FOUND');
  }

  const updatedTask = taskRepository.update(task, input);

  res.json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const task = taskRepository.findByIdForUser(
    req.params.id,
    req.userId as string,
  );

  if (!task) {
    throw notFound('Tarefa não encontrada.', 'TASK_NOT_FOUND');
  }

  taskRepository.delete(task.id);

  res.json({ message: 'Tarefa removida com sucesso.' });
});
