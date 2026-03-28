import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { extractApiError } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state
      ? String((location.state as { from?: string }).from || '/tasks')
      : '/tasks';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
      });
      navigate(from, { replace: true });
    } catch (submitError) {
      setError(extractApiError(submitError).error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Organize sem friccao"
      title="Entre e retome seu ritmo"
      description="Uma experiencia de tarefas pensada para quem quer foco, clareza e progresso visivel todos os dias."
      highlights={[
        'Painel simples para ver o que esta em aberto e o que ja avancou.',
        'Feedback claro em cada acao para reduzir atrito no fluxo.',
        'Sessao persistida para voce continuar de onde parou.',
      ]}
      footer={
        <p className="auth-footer-text">
          Ainda nao tem conta? <Link to="/register">Criar acesso</Link>
        </p>
      }
    >
      <div className="auth-form-header">
        <h2>Login</h2>
        <p>Use seu e-mail para voltar ao painel.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="voce@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <div className="auth-field-heading">
            <label htmlFor="login-password">Senha</label>
            <span>Minimo de 8 caracteres</span>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar no painel'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
