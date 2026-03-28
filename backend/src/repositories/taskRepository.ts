import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import {
  CreateTaskInput,
  TaskDto,
  TaskRecord,
  UpdateTaskInput,
} from '../models/Task';

interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: number;
  created_at: string;
  updated_at: string;
}

const mapTaskRow = (row: TaskRow): TaskRecord => {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const toTaskDto = (task: TaskRecord): TaskDto => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

export const taskRepository = {
  listByUser(userId: string) {
    const rows = db
      .prepare(
        `
          SELECT id, user_id, title, description, completed, created_at, updated_at
          FROM tasks
          WHERE user_id = ?
          ORDER BY created_at DESC
        `,
      )
      .all(userId) as TaskRow[];

    return rows.map((row) => toTaskDto(mapTaskRow(row)));
  },

  findByIdForUser(id: string, userId: string) {
    const row = db
      .prepare(
        `
          SELECT id, user_id, title, description, completed, created_at, updated_at
          FROM tasks
          WHERE id = ? AND user_id = ?
        `,
      )
      .get(id, userId) as TaskRow | undefined;

    return row ? mapTaskRow(row) : undefined;
  },

  create(userId: string, input: CreateTaskInput) {
    const id = uuidv4();

    db.prepare(
      `
        INSERT INTO tasks (id, user_id, title, description, completed)
        VALUES (?, ?, ?, ?, 0)
      `,
    ).run(id, userId, input.title, input.description);

    const task = this.findByIdForUser(id, userId);

    if (!task) {
      throw new Error('Não foi possível carregar a tarefa criada.');
    }

    return toTaskDto(task);
  },

  update(task: TaskRecord, input: UpdateTaskInput) {
    const nextTitle = input.title ?? task.title;
    const nextDescription =
      input.description !== undefined ? input.description : task.description;
    const nextCompleted =
      input.completed !== undefined
        ? input.completed
          ? 1
          : 0
        : task.completed
          ? 1
          : 0;

    db.prepare(
      `
        UPDATE tasks
        SET title = ?, description = ?, completed = ?, updated_at = datetime('now')
        WHERE id = ?
      `,
    ).run(nextTitle, nextDescription, nextCompleted, task.id);

    const updatedTask = this.findByIdForUser(task.id, task.userId);

    if (!updatedTask) {
      throw new Error('Não foi possível carregar a tarefa atualizada.');
    }

    return toTaskDto(updatedTask);
  },

  delete(id: string) {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  },
};
