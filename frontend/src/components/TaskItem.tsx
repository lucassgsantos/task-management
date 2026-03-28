import { FormEvent, useEffect, useState } from 'react';
import { extractApiError } from '../services/api';
import '../styles/taskitem.css';
import { TaskDto, UpdateTaskInput } from '../types';

interface TaskItemProps {
  task: TaskDto;
  onToggle: (task: TaskDto) => Promise<void>;
  onDelete: (task: TaskDto) => Promise<void>;
  onSave: (
    task: TaskDto,
    input: Pick<UpdateTaskInput, 'title' | 'description'>,
  ) => Promise<void>;
}

const formatTaskDate = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'agora';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(parsedDate);
};

function TaskItem({ task, onToggle, onDelete, onSave }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDescription, setDraftDescription] = useState(
    task.description ?? '',
  );
  const [error, setError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<
    'toggle' | 'save' | 'delete' | null
  >(null);

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setDraftTitle(task.title);
    setDraftDescription(task.description ?? '');
    setError(null);
  }, [isEditing, task.description, task.title]);

  const handleToggle = async () => {
    setError(null);
    setActiveAction('toggle');

    try {
      await onToggle(task);
    } catch (actionError) {
      setError(extractApiError(actionError).error);
    } finally {
      setActiveAction(null);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Remover a tarefa "${task.title}"?`);

    if (!confirmed) {
      return;
    }

    setError(null);
    setActiveAction('delete');

    try {
      await onDelete(task);
    } catch (actionError) {
      setError(extractApiError(actionError).error);
    } finally {
      setActiveAction(null);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = draftTitle.trim();
    const normalizedDescription = draftDescription.trim();

    if (!normalizedTitle) {
      setError('O titulo nao pode ficar vazio.');
      return;
    }

    setError(null);
    setActiveAction('save');

    try {
      await onSave(task, {
        title: normalizedTitle,
        description: normalizedDescription || null,
      });
      setIsEditing(false);
    } catch (actionError) {
      setError(extractApiError(actionError).error);
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <article className={task.completed ? 'task-item is-complete' : 'task-item'}>
      <div className="task-item__status">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            disabled={activeAction !== null}
          />
          <span aria-hidden="true" />
          <span className="sr-only">
            {task.completed ? 'Reabrir tarefa' : 'Marcar tarefa como concluida'}
          </span>
        </label>

        <div className="task-status-copy">
          <span
            className={
              task.completed
                ? 'task-status-pill is-complete'
                : 'task-status-pill'
            }
          >
            {task.completed ? 'Concluida' : 'Em aberto'}
          </span>
          <small>Atualizada em {formatTaskDate(task.updatedAt)}</small>
        </div>
      </div>

      {isEditing ? (
        <form className="task-edit-form" onSubmit={handleSave}>
          <div className="task-edit-field">
            <label htmlFor={`task-title-${task.id}`}>Titulo</label>
            <input
              id={`task-title-${task.id}`}
              type="text"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="task-edit-field">
            <label htmlFor={`task-description-${task.id}`}>Descricao</label>
            <textarea
              id={`task-description-${task.id}`}
              rows={3}
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
              maxLength={500}
            />
          </div>

          {error && (
            <div className="task-inline-error" role="alert">
              {error}
            </div>
          )}

          <div className="task-action-row">
            <button
              className="task-primary-button"
              type="submit"
              disabled={activeAction !== null}
            >
              {activeAction === 'save' ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              className="task-secondary-button"
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
              disabled={activeAction !== null}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-content">
            <h3>{task.title}</h3>
            <p>
              {task.description ||
                'Sem descricao extra. Edite a tarefa para adicionar contexto.'}
            </p>
          </div>

          {error && (
            <div className="task-inline-error" role="alert">
              {error}
            </div>
          )}

          <div className="task-action-row">
            <button
              className="task-secondary-button"
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={activeAction !== null}
            >
              Editar
            </button>
            <button
              className="task-danger-button"
              type="button"
              onClick={handleDelete}
              disabled={activeAction !== null}
            >
              {activeAction === 'delete' ? 'Removendo...' : 'Excluir'}
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default TaskItem;
