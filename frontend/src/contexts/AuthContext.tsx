import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, setUnauthorizedHandler } from '../services/api';
import { AuthSession } from '../types';
import {
  clearStoredSession,
  getStoredSession,
  storeSession,
} from '../utils/auth';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    email: string;
    name: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const storedSession = getStoredSession();

    if (!storedSession) {
      setIsBootstrapping(false);
      return;
    }

    let isMounted = true;

    const restoreSession = async () => {
      try {
        const profile = await authService.getProfile();
        const nextSession = {
          token: storedSession.token,
          user: profile,
        };

        if (!isMounted) {
          return;
        }

        storeSession(nextSession);
        setSession(nextSession);
      } catch {
        if (!isMounted) {
          return;
        }

        clearStoredSession();
        setSession(null);
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearStoredSession();
      setSession(null);
      navigate('/login', { replace: true });
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [navigate]);

  const persistSession = (nextSession: AuthSession) => {
    storeSession(nextSession);
    setSession(nextSession);
  };

  const login = async (input: { email: string; password: string }) => {
    const nextSession = await authService.login(input);
    persistSession(nextSession);
  };

  const register = async (input: {
    email: string;
    name: string;
    password: string;
  }) => {
    const nextSession = await authService.register(input);
    persistSession(nextSession);
  };

  const logout = () => {
    clearStoredSession();
    setSession(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        isBootstrapping,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
