import { FormEvent, useState } from 'react';
import { extractApiError } from '../services/api';
import '../styles/taskform.css';
import { CreateTaskInput } from '../types';

interface TaskFormProps {
  onAddTask: (input: CreateTaskInput) => Promise<void>;
}

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle) {
      setError('Informe um titulo para a tarefa.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddTask({
        title: normalizedTitle,
        description: normalizedDescription || null,
      });
      setTitle('');
      setDescription('');
    } catch (submitError) {
      setError(extractApiError(submitError).error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="task-form-card" aria-labelledby="task-form-title">
      <div className="task-form-card__copy">
        <span className="task-form-card__eyebrow">Nova prioridade</span>
        <h2 id="task-form-title">Adicione algo importante agora</h2>
        <p>
          Registre uma tarefa com contexto suficiente para executar sem precisar
          relembrar depois.
        </p>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-form-grid">
          <div className="task-form-field task-form-field--wide">
            <label htmlFor="new-task-title">Titulo</label>
            <input
              id="new-task-title"
              type="text"
              placeholder="Ex.: Preparar demo do projeto"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="task-form-field task-form-field--wide">
            <label htmlFor="new-task-description">Descricao</label>
            <textarea
              id="new-task-description"
              placeholder="Adicione contexto, links ou detalhes do proximo passo."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        {error && (
          <div className="task-form-error" role="alert">
            {error}
          </div>
        )}

        <button
          className="task-form-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Adicionar tarefa'}
        </button>
      </form>
    </section>
  );
}

export default TaskForm;
