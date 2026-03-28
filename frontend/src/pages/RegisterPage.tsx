import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../contexts/AuthContext';
import { extractApiError } from '../services/api';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.trim().length < 8) {
      setError('Use uma senha com pelo menos 8 caracteres.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      navigate('/tasks', { replace: true });
    } catch (submitError) {
      setError(extractApiError(submitError).error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      badge="Comece com clareza"
      title="Crie um espaco de trabalho que da vontade de usar"
      description="Configure seu acesso e acompanhe tarefas com uma interface leve, responsiva e pronta para demonstracao."
      highlights={[
        'Resumo rapido do que esta pendente, em andamento e concluido.',
        'Edicao inline para ajustar tarefas sem perder contexto.',
        'Design consistente para web desktop e mobile.',
      ]}
      footer={
        <p className="auth-footer-text">
          Ja tem conta? <Link to="/login">Fazer login</Link>
        </p>
      }
    >
      <div className="auth-form-header">
        <h2>Criar conta</h2>
        <p>Leva menos de um minuto para ativar seu painel.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="register-name">Nome</label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="register-email">E-mail</label>
          <input
            id="register-email"
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
            <label htmlFor="register-password">Senha</label>
            <span>Use ao menos 8 caracteres</span>
          </div>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="Crie uma senha forte"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="register-password-confirm">Confirmar senha</label>
          <input
            id="register-password-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
          />
        </div>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Criar meu painel'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
