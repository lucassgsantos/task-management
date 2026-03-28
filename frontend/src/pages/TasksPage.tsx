import { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../contexts/AuthContext';
import { extractApiError, taskService } from '../services/api';
import '../styles/tasks.css';
import {
  CreateTaskInput,
  TaskDto,
  TaskFilter,
  UpdateTaskInput,
} from '../types';

interface Notice {
  kind: 'success' | 'error';
  message: string;
}

function TasksPage() {
  const { session, logout } = useAuth();
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        const nextTasks = await taskService.getTasks();

        if (!isMounted) {
          return;
        }

        setTasks(nextTasks);
        setScreenError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setScreenError(extractApiError(loadError).error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setNotice(null);
    }, 3200);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [notice]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'pending') {
      return !task.completed;
    }

    if (filter === 'completed') {
      return task.completed;
    }

    return true;
  });

  const showSuccess = (message: string) => {
    setNotice({
      kind: 'success',
      message,
    });
  };

  const handleAddTask = async (input: CreateTaskInput) => {
    const createdTask = await taskService.createTask(input);

    setTasks((previousTasks) => [createdTask, ...previousTasks]);
    setScreenError(null);
    showSuccess('Tarefa criada com sucesso.');
  };

  const handleToggleTask = async (task: TaskDto) => {
    const updatedTask = await taskService.updateTask(task.id, {
      completed: !task.completed,
    });

    setTasks((previousTasks) =>
      previousTasks.map((item) => (item.id === task.id ? updatedTask : item)),
    );
    showSuccess(
      updatedTask.completed ? 'Tarefa concluida.' : 'Tarefa reaberta.',
    );
  };

  const handleSaveTask = async (
    task: TaskDto,
    input: Pick<UpdateTaskInput, 'title' | 'description'>,
  ) => {
    const updatedTask = await taskService.updateTask(task.id, input);

    setTasks((previousTasks) =>
      previousTasks.map((item) => (item.id === task.id ? updatedTask : item)),
    );
    showSuccess('Tarefa atualizada.');
  };

  const handleDeleteTask = async (task: TaskDto) => {
    await taskService.deleteTask(task.id);

    setTasks((previousTasks) =>
      previousTasks.filter((item) => item.id !== task.id),
    );
    showSuccess('Tarefa removida.');
  };

  const emptyTitle =
    filter === 'all'
      ? 'Nenhuma tarefa por aqui ainda.'
      : filter === 'pending'
        ? 'Tudo em dia neste momento.'
        : 'Ainda nao ha tarefas concluidas.';

  const emptyDescription =
    filter === 'all'
      ? 'Crie a primeira tarefa para transformar essa tela em um painel de progresso.'
      : filter === 'pending'
        ? 'Voce concluiu tudo que estava pendente. Hora de respirar ou planejar o proximo passo.'
        : 'Assim que voce marcar uma tarefa como concluida, ela aparecera aqui.';

  return (
    <main className="tasks-page">
      <div className="tasks-shell">
        <header className="tasks-topbar">
          <div className="tasks-topbar-copy">
            <span className="tasks-eyebrow">Painel principal</span>
            <h1>Seu fluxo diario em um so lugar</h1>
            <p>
              Organize tarefas, atualize prioridades e acompanhe o que ja foi
              entregue sem trocar de contexto.
            </p>
          </div>

          <div className="tasks-topbar-actions">
            <div className="tasks-user-chip">
              <span className="tasks-user-chip__label">Logado como</span>
              <strong>{session?.user.name}</strong>
              <span>{session?.user.email}</span>
            </div>

            <button className="logout-button" type="button" onClick={logout}>
              Encerrar sessao
            </button>
          </div>
        </header>

        <section className="tasks-summary-grid" aria-label="Resumo das tarefas">
          <article className="summary-card">
            <span>Total</span>
            <strong>{totalTasks}</strong>
            <p>Visao geral do seu backlog atual.</p>
          </article>
          <article className="summary-card">
            <span>Pendentes</span>
            <strong>{pendingTasks}</strong>
            <p>Tarefas que ainda precisam de acao.</p>
          </article>
          <article className="summary-card">
            <span>Concluidas</span>
            <strong>{completedTasks}</strong>
            <p>Entregas que ja sairam do radar.</p>
          </article>
        </section>

        <TaskForm onAddTask={handleAddTask} />

        <section className="tasks-controls" aria-label="Filtros de exibicao">
          <div className="filter-group">
            <button
              className={
                filter === 'all' ? 'filter-pill is-active' : 'filter-pill'
              }
              type="button"
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={
                filter === 'pending' ? 'filter-pill is-active' : 'filter-pill'
              }
              type="button"
              onClick={() => setFilter('pending')}
            >
              Pendentes
            </button>
            <button
              className={
                filter === 'completed' ? 'filter-pill is-active' : 'filter-pill'
              }
              type="button"
              onClick={() => setFilter('completed')}
            >
              Concluidas
            </button>
          </div>
        </section>

        {notice && (
          <div
            className={
              notice.kind === 'success'
                ? 'notice notice--success'
                : 'notice notice--error'
            }
            role="status"
            aria-live="polite"
          >
            {notice.message}
          </div>
        )}

        {screenError && (
          <div className="notice notice--error" role="alert">
            {screenError}
          </div>
        )}

        {isLoading ? (
          <section className="loading-panel" role="status" aria-live="polite">
            <h2>Carregando tarefas</h2>
            <p>Buscando o que voce ja tinha planejado para hoje.</p>
          </section>
        ) : visibleTasks.length === 0 ? (
          <section className="empty-state">
            <span className="empty-state__badge">Sem itens nesta visao</span>
            <h2>{emptyTitle}</h2>
            <p>{emptyDescription}</p>
          </section>
        ) : (
          <section className="tasks-list" aria-live="polite">
            {visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default TasksPage;
