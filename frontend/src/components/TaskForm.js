import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import '../styles/taskform.css';
function TaskForm({ onAddTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim())
            return;
        setLoading(true);
        try {
            await onAddTask(title, description);
            setTitle('');
            setDescription('');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { className: "task-form", onSubmit: handleSubmit, children: [_jsx("input", { type: "text", placeholder: "T\u00EDtulo da tarefa", value: title, onChange: (e) => setTitle(e.target.value), required: true }), _jsx("textarea", { placeholder: "Descri\u00E7\u00E3o (opcional)", value: description, onChange: (e) => setDescription(e.target.value), rows: 2 }), _jsx("button", { type: "submit", disabled: loading, children: loading ? 'Adicionando...' : 'Adicionar Tarefa' })] }));
}
export default TaskForm;
