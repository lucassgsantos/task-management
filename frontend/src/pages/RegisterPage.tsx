import { useState } from 'react';
import { authService } from '../services/api';
import { storeAuth } from '../utils/auth';
import '../styles/auth.css';

interface RegisterPageProps {
  onSwitchPage: () => void;
  onRegister: () => void;
}

function RegisterPage({ onSwitchPage, onRegister }: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Senhas não conferem');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(email, name, password);
      storeAuth(response.data.token, response.data.user);
      onRegister();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Registrar</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : 'Registrar'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Já tem conta? <button type="button" onClick={onSwitchPage} className="link-button">Fazer login</button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
