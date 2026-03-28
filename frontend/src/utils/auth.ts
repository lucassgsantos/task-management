import { AuthSession } from '../types';

export const AUTH_STORAGE_KEY = 'task-flow.session';

export const getStoredSession = (): AuthSession | null => {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const getStoredToken = () => {
  return getStoredSession()?.token ?? null;
};

export const storeSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
