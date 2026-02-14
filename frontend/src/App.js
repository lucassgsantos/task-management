import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/global.css';
import { useEffect, useState } from 'react';
import { isAuthenticated } from './utils/auth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
        if (!isAuthenticated()) {
            setCurrentPage('login');
        }
        else {
            setCurrentPage('tasks');
        }
    }, []);
    if (loading) {
        return _jsx("div", { className: "container", children: _jsx("p", { children: "Carregando..." }) });
    }
    return (_jsxs("div", { className: "app", children: [currentPage === 'login' && _jsx(LoginPage, { onSwitchPage: () => setCurrentPage('register'), onLogin: () => setCurrentPage('tasks') }), currentPage === 'register' && _jsx(RegisterPage, { onSwitchPage: () => setCurrentPage('login'), onRegister: () => setCurrentPage('tasks') }), currentPage === 'tasks' && _jsx(TasksPage, { onLogout: () => { setCurrentPage('login'); } })] }));
}
export default App;
