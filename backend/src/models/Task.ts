export interface TaskRecord {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
}
