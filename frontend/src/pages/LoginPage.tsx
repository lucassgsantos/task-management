import { useState } from 'react';
import { authService } from '../services/api';
import { storeAuth } from '../utils/auth';
import '../styles/auth.css';

interface LoginPageProps {
  onSwitchPage: () => void;
  onLogin: () => void;
}

function LoginPage({ onSwitchPage, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      storeAuth(response.data.token, response.data.user);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Não tem conta? <button type="button" onClick={onSwitchPage} className="link-button">Registrar</button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
