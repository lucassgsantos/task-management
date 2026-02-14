import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/taskitem.css';
function TaskItem({ task, onToggle, onDelete }) {
    return (_jsxs("div", { className: `task-item ${task.completed ? 'completed' : ''}`, children: [_jsx("input", { type: "checkbox", checked: task.completed, onChange: onToggle, className: "task-checkbox" }), _jsxs("div", { className: "task-content", children: [_jsx("h3", { children: task.title }), task.description && _jsx("p", { children: task.description })] }), _jsx("button", { onClick: onDelete, className: "delete-button", children: "Deletar" })] }));
}
export default TaskItem;
