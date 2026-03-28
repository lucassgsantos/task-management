import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="screen-state" role="status" aria-live="polite">
        <div className="screen-state__card">
          <span className="screen-state__eyebrow">Task Flow</span>
          <h1>Preparando o acesso</h1>
          <p>Um instante enquanto organizamos sua experiencia.</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/tasks" />;
  }

  return <>{children}</>;
}

export default PublicRoute;
