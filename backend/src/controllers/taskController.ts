import { Request, Response } from 'express';
import db, { uuidv4 } from '../config/database';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const tasks = db.prepare(
      'SELECT id, title, description, completed, created_at, updated_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId);

    const mapped = (tasks as any[]).map(t => ({ ...t, completed: !!t.completed }));
    res.json(mapped);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const id = uuidv4();
    db.prepare(
      'INSERT INTO tasks (id, user_id, title, description, completed) VALUES (?, ?, ?, ?, 0)'
    ).run(id, userId, title, description || null);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;
    res.status(201).json({ ...task, completed: !!task.completed });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;
    if (!existing || existing.user_id !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newTitle = title !== undefined ? title : existing.title;
    const newDescription = description !== undefined ? description : existing.description;
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;

    db.prepare(
      "UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(newTitle, newDescription, newCompleted, id);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;
    res.json({ ...task, completed: !!task.completed });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;
    if (!existing || existing.user_id !== userId) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
