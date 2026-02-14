# Todo App - Full Stack

Aplicação completa de gerenciamento de tarefas com autenticação JWT, backend Node.js/Express com PostgreSQL e frontend React com TypeScript.

## Estrutura do Projeto

```
projeto2/
├── backend/          - API REST Node.js + Express + PostgreSQL
│   ├── src/
│   ├── package.json
│   └── .env.example
└── frontend/         - Interface React + TypeScript + Vite
    ├── src/
    ├── package.json
    └── index.html
```

## Requisitos

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## Setup Backend

1. Navegue para a pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
copy .env.example .env
```

4. Configure o banco de dados PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE todo_db;
\q
```

5. Execute o schema SQL:
```bash
psql -U postgres -d todo_db -f src/config/schema.sql
```

6. Atualize o arquivo .env com suas credenciais PostgreSQL

7. Inicie o servidor:
```bash
npm run dev
```

O backend estará disponível em `http://localhost:5000`

## Setup Frontend

1. Em outra terminal, navegue para a pasta frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Funcionalidades

- Autenticação com JWT
- Registro e login de usuários
- CRUD completo de tarefas
- Persistência de dados com PostgreSQL
- Interface responsiva e moderna
- TypeScript em todo o código

## Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário (requer token)

### Tarefas
- `GET /api/tasks` - Listar tarefas do usuário
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

Todos os endpoints de tarefas requerem autenticação via token JWT.

## Desenvolvimento

### Backend - Comandos disponíveis
- `npm run dev` - Iniciar servidor em desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Executar versão compilada

### Frontend - Comandos disponíveis
- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- PostgreSQL
- TypeScript
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- React 18
- TypeScript
- Vite
- Axios
- CSS puro

## Estrutura de Pastas

### Backend
```
src/
├── config/      - Configuração de banco de dados
├── controllers/ - Lógica de negócios
├── middleware/  - Middlewares (autenticação)
├── models/      - Interfaces TypeScript
├── routes/      - Definição de rotas
└── server.ts    - Entrada da aplicação
```

### Frontend
```
src/
├── components/  - Componentes reutilizáveis
├── pages/       - Páginas principais
├── services/    - Serviços de API
├── styles/      - Estilos CSS
├── utils/       - Utilitários
└── main.tsx     - Entrada da aplicação
```

## Notas

- Os dados são salvos em tempo real no banco de dados PostgreSQL
- Tokens JWT expiram em 7 dias
- As senhas são hasheadas com bcrypt antes de serem armazenadas
- A aplicação é responsiva e funciona em mobile e desktop
