import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { authService } from '../services/api';
import { storeAuth } from '../utils/auth';
import '../styles/auth.css';
function LoginPage({ onSwitchPage, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            storeAuth(response.data.token, response.data.user);
            onLogin();
        }
        catch (err) {
            setError(err.response?.data?.error || 'Erro ao fazer login');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-form", children: [_jsx("h1", { children: "Login" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Senha", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { type: "submit", disabled: loading, children: loading ? 'Carregando...' : 'Entrar' })] }), error && _jsx("p", { className: "error", children: error }), _jsxs("p", { children: ["N\u00E3o tem conta? ", _jsx("button", { type: "button", onClick: onSwitchPage, className: "link-button", children: "Registrar" })] })] }) }));
}
export default LoginPage;
