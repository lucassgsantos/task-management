import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { getStoredUser, clearAuth } from '../utils/auth';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import '../styles/tasks.css';
function TasksPage({ onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = getStoredUser();
    useEffect(() => {
        loadTasks();
    }, []);
    const loadTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getTasks();
            setTasks(response.data);
        }
        catch (err) {
            setError('Erro ao carregar tarefas');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddTask = async (title, description) => {
        try {
            const response = await taskService.createTask(title, description);
            setTasks([response.data, ...tasks]);
        }
        catch (err) {
            setError('Erro ao criar tarefa');
        }
    };
    const handleUpdateTask = async (id, completed) => {
        try {
            const response = await taskService.updateTask(id, undefined, undefined, completed);
            setTasks(tasks.map(t => t.id === id ? response.data : t));
        }
        catch (err) {
            setError('Erro ao atualizar tarefa');
        }
    };
    const handleDeleteTask = async (id) => {
        try {
            await taskService.deleteTask(id);
            setTasks(tasks.filter(t => t.id !== id));
        }
        catch (err) {
            setError('Erro ao deletar tarefa');
        }
    };
    const handleLogout = () => {
        clearAuth();
        onLogout();
    };
    return (_jsxs("div", { className: "tasks-container", children: [_jsxs("div", { className: "tasks-header", children: [_jsxs("div", { children: [_jsx("h1", { children: "Minhas Tarefas" }), _jsxs("p", { children: ["Ol\u00E1, ", user?.name] })] }), _jsx("button", { onClick: handleLogout, className: "logout-button", children: "Sair" })] }), _jsx(TaskForm, { onAddTask: handleAddTask }), error && _jsx("div", { className: "error-message", children: error }), loading ? (_jsx("p", { children: "Carregando tarefas..." })) : (_jsx("div", { className: "tasks-list", children: tasks.length === 0 ? (_jsx("p", { className: "no-tasks", children: "Nenhuma tarefa ainda. Crie uma!" })) : (tasks.map(task => (_jsx(TaskItem, { task: task, onToggle: () => handleUpdateTask(task.id, !task.completed), onDelete: () => handleDeleteTask(task.id) }, task.id)))) }))] }));
}
export default TasksPage;
