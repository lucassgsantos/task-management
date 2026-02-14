import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { getStoredUser, clearAuth } from '../utils/auth';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import '../styles/tasks.css';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TasksPageProps {
  onLogout: () => void;
}

function TasksPage({ onLogout }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
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
    } catch (err: any) {
      setError('Erro ao carregar tarefas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string, description: string) => {
    try {
      const response = await taskService.createTask(title, description);
      setTasks([response.data, ...tasks]);
    } catch (err: any) {
      setError('Erro ao criar tarefa');
    }
  };

  const handleUpdateTask = async (id: string, completed: boolean) => {
    try {
      const response = await taskService.updateTask(id, undefined, undefined, completed);
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (err: any) {
      setError('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err: any) {
      setError('Erro ao deletar tarefa');
    }
  };

  const handleLogout = () => {
    clearAuth();
    onLogout();
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div>
          <h1>Minhas Tarefas</h1>
          <p>Olá, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Sair</button>
      </div>

      <TaskForm onAddTask={handleAddTask} />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : (
        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">Nenhuma tarefa ainda. Crie uma!</p>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => handleUpdateTask(task.id, !task.completed)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
