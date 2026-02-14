import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { authService } from '../services/api';
import { storeAuth } from '../utils/auth';
import '../styles/auth.css';
function RegisterPage({ onSwitchPage, onRegister }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
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
        }
        catch (err) {
            setError(err.response?.data?.error || 'Erro ao registrar');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-form", children: [_jsx("h1", { children: "Registrar" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { type: "text", placeholder: "Nome", value: name, onChange: (e) => setName(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Senha", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Confirmar Senha", value: passwordConfirm, onChange: (e) => setPasswordConfirm(e.target.value), required: true }), _jsx("button", { type: "submit", disabled: loading, children: loading ? 'Carregando...' : 'Registrar' })] }), error && _jsx("p", { className: "error", children: error }), _jsxs("p", { children: ["J\u00E1 tem conta? ", _jsx("button", { type: "button", onClick: onSwitchPage, className: "link-button", children: "Fazer login" })] })] }) }));
}
export default RegisterPage;
