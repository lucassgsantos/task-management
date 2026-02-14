# Exemplos de Requisições HTTP

## BASE_URL: http://localhost:5000/api

## Autenticação

### Registrar novo usuário
```
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "name": "João Silva",
  "password": "senha123"
}

Response 201:
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "João Silva"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Fazer login
```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}

Response 200:
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "João Silva"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Obter perfil do usuário
```
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "name": "João Silva",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## Tarefas

### Listar todas as tarefas
```
GET /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
[
  {
    "id": "650f9400-e29b-41d4-a716-446655440001",
    "title": "Aprender TypeScript",
    "description": "Estudar tipos e interfaces",
    "completed": false,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "650f9400-e29b-41d4-a716-446655440002",
    "title": "Fazer exercícios",
    "description": null,
    "completed": true,
    "created_at": "2024-01-15T11:00:00.000Z",
    "updated_at": "2024-01-15T12:00:00.000Z"
  }
]
```

### Criar nova tarefa
```
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Aprender React",
  "description": "Estudar hooks e componentes"
}

Response 201:
{
  "id": "750f9400-e29b-41d4-a716-446655440003",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Aprender React",
  "description": "Estudar hooks e componentes",
  "completed": false,
  "created_at": "2024-01-15T15:30:00.000Z",
  "updated_at": "2024-01-15T15:30:00.000Z"
}
```

### Atualizar tarefa
```
PUT /tasks/750f9400-e29b-41d4-a716-446655440003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Aprender React Avançado",
  "description": "Estudar Context API",
  "completed": false
}

Response 200:
{
  "id": "750f9400-e29b-41d4-a716-446655440003",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Aprender React Avançado",
  "description": "Estudar Context API",
  "completed": false,
  "created_at": "2024-01-15T15:30:00.000Z",
  "updated_at": "2024-01-15T16:45:00.000Z"
}
```

### Marcar tarefa como completa
```
PUT /tasks/750f9400-e29b-41d4-a716-446655440003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "completed": true
}

Response 200:
{
  "id": "750f9400-e29b-41d4-a716-446655440003",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Aprender React Avançado",
  "description": "Estudar Context API",
  "completed": true,
  "created_at": "2024-01-15T15:30:00.000Z",
  "updated_at": "2024-01-15T17:00:00.000Z"
}
```

### Deletar tarefa
```
DELETE /tasks/750f9400-e29b-41d4-a716-446655440003
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
{
  "message": "Task deleted successfully"
}
```

## Health Check

### Verificar saúde da API
```
GET /api/health

Response 200:
{
  "status": "ok"
}
```

## Código de Respostas

- 200: Sucesso
- 201: Criado com sucesso
- 400: Requisição inválida
- 401: Não autenticado ou token inválido
- 404: Recurso não encontrado
- 409: Conflito (ex: email já existe)
- 500: Erro interno do servidor
