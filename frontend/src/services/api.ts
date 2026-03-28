import axios, { AxiosError } from 'axios';
import {
  ApiError,
  AuthResponse,
  AuthUser,
  CreateTaskInput,
  TaskDto,
  UpdateTaskInput,
} from '../types';
import { clearStoredSession, getStoredToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL?.trim() || '/api';

let unauthorizedHandler: (() => void) | null = null;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; code?: string }>) => {
    if (error.response?.status === 401) {
      clearStoredSession();
      unauthorizedHandler?.();
    }

    return Promise.reject(extractApiError(error));
  },
);

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

export const extractApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      error:
        error.response?.data?.error ||
        error.message ||
        'Nao foi possivel concluir essa acao agora.',
      code: error.response?.data?.code,
      status: error.response?.status,
    };
  }

  if (typeof error === 'object' && error !== null && 'error' in error) {
    const typedError = error as ApiError;

    return {
      error: typedError.error,
      code: typedError.code,
      status: typedError.status,
    };
  }

  return {
    error: 'Nao foi possivel concluir essa acao agora.',
  };
};

export const authService = {
  async register(input: {
    email: string;
    name: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', input);
    return data;
  },

  async login(input: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', input);
    return data;
  },

  async getProfile(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>('/auth/profile');
    return data;
  },
};

export const taskService = {
  async getTasks(): Promise<TaskDto[]> {
    const { data } = await api.get<TaskDto[]>('/tasks');
    return data;
  },

  async createTask(input: CreateTaskInput): Promise<TaskDto> {
    const { data } = await api.post<TaskDto>('/tasks', input);
    return data;
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<TaskDto> {
    const { data } = await api.put<TaskDto>(`/tasks/${id}`, input);
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
