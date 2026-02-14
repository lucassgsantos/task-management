# Arquitetura do Projeto

## Visão Geral

Arquitetura full-stack moderna com separação clara entre frontend e backend, banco de dados relacional e autenticação segura.

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                        │
│              Frontend React + TypeScript                     │
│                     (Port 3000)                              │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         │ JWT Token
┌────────────────────────▼────────────────────────────────────┐
│                    Backend API                              │
│            Express.js + Node.js + TypeScript                │
│                     (Port 5000)                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │ Middleware   │  │ Controllers  │      │
│  │  /api/auth   │  │  (JWT Auth)  │  │  (Logic)     │      │
│  │  /api/tasks  │  └──────────────┘  └──────────────┘      │
│  └──────────────┘                                           │
└────────────────────────┬────────────────────────────────────┘
                         │ TCP/SQL
┌────────────────────────▼────────────────────────────────────┐
│                    PostgreSQL Database                      │
│                   (Port 5432)                                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   users      │  │   tasks      │                        │
│  │   (auth)     │  │  (CRUD)      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Backend

### Camadas

1. **Routes** (`src/routes/`)
   - Define os endpoints HTTP
   - Mapeia requisições para controllers
   - Aplica middlewares de autenticação

2. **Controllers** (`src/controllers/`)
   - Contém a lógica de negócio
   - Processa requisições e respostas
   - Interage com o banco de dados

3. **Middleware** (`src/middleware/`)
   - JWT token validation
   - CORS handling
   - Error handling

4. **Models** (`src/models/`)
   - Interfaces TypeScript
   - Tipagem de dados

5. **Config** (`src/config/`)
   - Configuração do banco de dados
   - Schema SQL

### Fluxo de Requisição

```
Client Request
      ↓
Express App (CORS, JSON parsing)
      ↓
Route Handler (/api/tasks)
      ↓
Auth Middleware (JWT validation)
      ↓
Controller (getTasks, createTask, etc)
      ↓
Database Query (PostgreSQL)
      ↓
Response JSON
      ↓
Client
```

### Autenticação

- Utiliza JWT (JSON Web Tokens)
- Token passado no header: `Authorization: Bearer <token>`
- Token expira em 7 dias
- Senhas hasheadas com bcryptjs

### Banco de Dados

Tabelas:
- **users**: Armazena informações de usuários
- **tasks**: Armazena tarefas associadas ao usuário

Relação:
```
users (1) ──→ (N) tasks
  ↓             ↓
user_id ←─ user_id
```

## Frontend

### Estrutura de Componentes

```
App.tsx (Componente raiz)
  ├── LoginPage
  ├── RegisterPage
  └── TasksPage
      ├── TaskForm
      └── TaskItem
```

### Camadas

1. **Pages** (`src/pages/`)
   - Componentes de página principal
   - Gerenciam estado global da página
   - Chamam serviços de API

2. **Components** (`src/components/`)
   - Componentes reutilizáveis
   - Props bem definidas
   - Responsáveis apenas por UI

3. **Services** (`src/services/`)
   - Abstração de chamadas HTTP
   - Configuração do Axios
   - Interceptadores de token

4. **Utils** (`src/utils/`)
   - Funções auxiliares
   - Gerenciamento de localStorage
   - Validações

5. **Styles** (`src/styles/`)
   - CSS puro
   - Estilos modulares
   - Responsivos

### Fluxo de Renderização

```
User Interaction (click, submit)
            ↓
Event Handler
            ↓
API Service Call
            ↓
Backend Response
            ↓
State Update (useState)
            ↓
Re-render Component
            ↓
Updated UI
```

### Armazenamento Local

- Token JWT: `localStorage.getItem('token')`
- Dados do usuário: `localStorage.getItem('user')`
- Limpeza no logout

## Fluxo Completo: Criar Tarefa

```
1. Usuario escreve titulo e descricao no TaskForm
2. Clica no botao "Adicionar Tarefa"
3. Frontend chama taskService.createTask()
4. Axios intercepta e adiciona token no header
5. POST /api/tasks é enviada ao backend
6. Backend recebe em routes/tasks.ts
7. Middleware auth valida o JWT
8. Controller createTask processa a logica
9. Insere tarefa no PostgreSQL
10. Retorna tarefa criada em JSON
11. Frontend recebe resposta
12. Estado de tasks é atualizado
13. Nova tarefa aparece na lista
14. TaskForm é limpo
```

## Segurança

- **Senhas**: Hasheadas com bcryptjs antes de armazenar
- **Tokens**: JWT assinado com secret key
- **CORS**: Configurado para aceitar localhost
- **SQL**: Prepared statements (pg library)
- **HTTPS**: Recomendado em produção
- **Headers**: Validação de tipos

## Performance

- Índices no PostgreSQL para queries rápidas
- Lazy loading no frontend (se escalar)
- Caching de tokens no localStorage
- Separação de bundle no Vite

## Escalabilidade

Para produção:
- Usar variáveis de ambiente secretas
- Implementar rate limiting
- Adicionar logging e monitoring
- Usar CDN para frontend
- Implementar cache (Redis)
- Containerizar com Docker
- Usar load balancer
- Replicação do banco de dados
