import { ReactNode } from 'react';
import '../styles/auth.css';

interface AuthLayoutProps {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  footer: ReactNode;
  children: ReactNode;
}

function AuthLayout({
  badge,
  title,
  description,
  highlights,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-hero">
        <span className="auth-badge">{badge}</span>
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="auth-highlight-list" aria-label="Principais beneficios">
          {highlights.map((highlight) => (
            <div key={highlight} className="auth-highlight-item">
              <span className="auth-highlight-mark" aria-hidden="true" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          {children}
          <div className="auth-footer">{footer}</div>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
