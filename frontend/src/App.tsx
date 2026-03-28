import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import './styles/global.css';

function SessionRedirect() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="screen-state" role="status" aria-live="polite">
        <div className="screen-state__card">
          <span className="screen-state__eyebrow">Task Flow</span>
          <h1>Preparando seu painel</h1>
          <p>
            Estamos conferindo sua sessão e organizando o que importa agora.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Navigate
      replace
      to={isAuthenticated ? '/tasks' : '/login'}
      state={{ from: location.pathname }}
    />
  );
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<SessionRedirect />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
