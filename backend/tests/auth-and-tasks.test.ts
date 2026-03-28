import fs from 'fs';
import path from 'path';
import request from 'supertest';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

describe('auth and task API', () => {
  const dbPath = path.join(process.cwd(), '.tmp-test-db.sqlite');
  let app: Awaited<ReturnType<typeof loadApp>>;
  let db: Awaited<ReturnType<typeof loadDatabase>>;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.DB_PATH = dbPath;
    process.env.CORS_ORIGIN = '*';

    vi.resetModules();
    app = await loadApp();
    db = await loadDatabase();
  });

  beforeEach(() => {
    db.exec('DELETE FROM tasks;');
    db.exec('DELETE FROM users;');
  });

  afterAll(() => {
    db.close();

    if (fs.existsSync(dbPath)) {
      fs.rmSync(dbPath, { force: true });
    }
  });

  it('registers a user, logs in and returns the profile', async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'ana@example.com',
        name: 'Ana Maria',
        password: 'supersegura123',
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.email).toBe('ana@example.com');
    expect(registerResponse.body.token).toBeTruthy();

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'ana@example.com',
      password: 'supersegura123',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.name).toBe('Ana Maria');

    const profileResponse = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.email).toBe('ana@example.com');
  });

  it('rejects duplicate emails and invalid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'duplicate@example.com',
      name: 'Pessoa Um',
      password: 'supersegura123',
    });

    const duplicateResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'duplicate@example.com',
        name: 'Pessoa Dois',
        password: 'outrasenha123',
      });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.code).toBe('EMAIL_IN_USE');

    const invalidLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'duplicate@example.com',
        password: 'senha-errada',
      });

    expect(invalidLoginResponse.status).toBe(401);
    expect(invalidLoginResponse.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('protects tasks routes and only returns the authenticated user tasks', async () => {
    const userOne = await registerAndLogin(app, {
      email: 'owner@example.com',
      name: 'Owner',
      password: 'password123',
    });
    const userTwo = await registerAndLogin(app, {
      email: 'other@example.com',
      name: 'Other',
      password: 'password123',
    });

    const unauthorizedResponse = await request(app).get('/api/tasks');
    expect(unauthorizedResponse.status).toBe(401);

    const createdTask = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userOne.token}`)
      .send({
        title: 'Planejar apresentação',
        description: 'Criar roteiro para a demo',
      });

    expect(createdTask.status).toBe(201);
    expect(createdTask.body.title).toBe('Planejar apresentação');

    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userTwo.token}`)
      .send({
        title: 'Task da outra conta',
      });

    const tasksResponse = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${userOne.token}`);

    expect(tasksResponse.status).toBe(200);
    expect(tasksResponse.body).toHaveLength(1);
    expect(tasksResponse.body[0].title).toBe('Planejar apresentação');
  });

  it('validates task payloads and allows update and delete', async () => {
    const session = await registerAndLogin(app, {
      email: 'tasks@example.com',
      name: 'Tasks',
      password: 'password123',
    });

    const invalidTask = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${session.token}`)
      .send({
        title: '',
      });

    expect(invalidTask.status).toBe(400);
    expect(invalidTask.body.code).toBe('INVALID_TITLE');

    const createdTask = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${session.token}`)
      .send({
        title: 'Publicar projeto',
        description: 'Escrever README final',
      });

    const updateResponse = await request(app)
      .put(`/api/tasks/${createdTask.body.id}`)
      .set('Authorization', `Bearer ${session.token}`)
      .send({
        title: 'Publicar projeto atualizado',
        completed: true,
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.completed).toBe(true);
    expect(updateResponse.body.title).toBe('Publicar projeto atualizado');

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${createdTask.body.id}`)
      .set('Authorization', `Bearer ${session.token}`);

    expect(deleteResponse.status).toBe(200);

    const tasksResponse = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${session.token}`);

    expect(tasksResponse.body).toHaveLength(0);
  });
});

const loadApp = async () => {
  const module = await import('../src/app');
  return module.createApp();
};

const loadDatabase = async () => {
  const module = await import('../src/config/database');
  return module.default;
};

const registerAndLogin = async (
  app: Awaited<ReturnType<typeof loadApp>>,
  input: {
    email: string;
    name: string;
    password: string;
  },
) => {
  const response = await request(app).post('/api/auth/register').send(input);

  return {
    token: response.body.token as string,
    user: response.body.user as { id: string; email: string; name: string },
  };
};
