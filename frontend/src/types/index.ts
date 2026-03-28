export interface ApiError {
  error: string;
  code?: string;
  status?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
