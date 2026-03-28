import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import { AUTH_STORAGE_KEY } from '../utils/auth';

const mocks = vi.hoisted(() => ({
  authService: {
    getProfile: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
  setUnauthorizedHandler: vi.fn(),
}));

vi.mock('../services/api', () => ({
  authService: mocks.authService,
  taskService: mocks.taskService,
  setUnauthorizedHandler: mocks.setUnauthorizedHandler,
  extractApiError: (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      return error as { error: string };
    }

    return { error: 'Erro inesperado' };
  },
}));

const renderApp = (initialEntry: string) => {
  return render(
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe('app routes and tasks flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mocks.authService.getProfile.mockResolvedValue({
      id: 'user-1',
      name: 'Ana',
      email: 'ana@example.com',
    });
    mocks.taskService.getTasks.mockResolvedValue([]);
    mocks.taskService.createTask.mockImplementation(async (input) => ({
      id: 'task-new',
      title: input.title,
      description: input.description ?? null,
      completed: false,
      createdAt: '2026-03-28T10:00:00.000Z',
      updatedAt: '2026-03-28T10:00:00.000Z',
    }));
    mocks.taskService.updateTask.mockImplementation(async (id, input) => ({
      id,
      title:
        input.title ?? (id === 'task-1' ? 'Planejar demo' : 'Enviar follow-up'),
      description:
        input.description !== undefined
          ? input.description
          : id === 'task-1'
            ? 'Ajustar slides finais'
            : null,
      completed:
        input.completed !== undefined ? input.completed : id === 'task-1',
      createdAt: '2026-03-27T10:00:00.000Z',
      updatedAt: '2026-03-28T10:00:00.000Z',
    }));
    mocks.taskService.deleteTask.mockResolvedValue(undefined);
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('redirects guests from /tasks to the login screen', async () => {
    renderApp('/tasks');

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Login' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Seu fluxo diario em um so lugar'),
    ).not.toBeInTheDocument();
  });

  it('restores a saved session and supports the main task interactions', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: 'stored-token',
        user: {
          id: 'user-1',
          name: 'Ana',
          email: 'ana@example.com',
        },
      }),
    );

    mocks.taskService.getTasks.mockResolvedValue([
      {
        id: 'task-1',
        title: 'Planejar demo',
        description: 'Ajustar slides finais',
        completed: true,
        createdAt: '2026-03-27T10:00:00.000Z',
        updatedAt: '2026-03-28T10:00:00.000Z',
      },
      {
        id: 'task-2',
        title: 'Enviar follow-up',
        description: null,
        completed: false,
        createdAt: '2026-03-28T08:30:00.000Z',
        updatedAt: '2026-03-28T08:30:00.000Z',
      },
    ]);

    const user = userEvent.setup();

    renderApp('/tasks');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Seu fluxo diario em um so lugar',
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Pendentes' }));
    expect(screen.getByText('Enviar follow-up')).toBeInTheDocument();
    expect(screen.queryByText('Planejar demo')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Todas' }));

    await user.type(screen.getByLabelText('Titulo'), 'Revisar README');
    await user.type(
      screen.getByLabelText('Descricao'),
      'Atualizar instalacao e capturas.',
    );
    await user.click(screen.getByRole('button', { name: 'Adicionar tarefa' }));

    expect(await screen.findByText('Revisar README')).toBeInTheDocument();
    expect(mocks.taskService.createTask).toHaveBeenCalledWith({
      title: 'Revisar README',
      description: 'Atualizar instalacao e capturas.',
    });

    const latestTaskCard = screen
      .getByText('Revisar README')
      .closest('article');

    expect(latestTaskCard).not.toBeNull();

    await user.click(
      within(latestTaskCard as HTMLElement).getByRole('button', {
        name: 'Editar',
      }),
    );
    const titleInput = within(latestTaskCard as HTMLElement).getByLabelText(
      'Titulo',
    );
    await user.clear(titleInput);
    await user.type(titleInput, 'Revisar README final');
    await user.click(
      within(latestTaskCard as HTMLElement).getByRole('button', {
        name: 'Salvar',
      }),
    );

    expect(await screen.findByText('Revisar README final')).toBeInTheDocument();

    const toggleCheckboxes = screen.getAllByRole('checkbox');
    await user.click(toggleCheckboxes[0]);

    await waitFor(() => {
      expect(mocks.taskService.updateTask).toHaveBeenCalledWith(
        'task-new',
        expect.objectContaining({ completed: true }),
      );
    });

    await user.click(
      within(latestTaskCard as HTMLElement).getByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Revisar README final'),
      ).not.toBeInTheDocument();
    });
    expect(mocks.taskService.deleteTask).toHaveBeenCalledWith('task-new');
  });
});
