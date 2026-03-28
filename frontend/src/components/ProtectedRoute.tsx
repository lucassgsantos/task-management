import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="screen-state" role="status" aria-live="polite">
        <div className="screen-state__card">
          <span className="screen-state__eyebrow">Task Flow</span>
          <h1>Carregando sua area de trabalho</h1>
          <p>Estamos restaurando sua sessao e sincronizando suas tarefas.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
