# Guia de Instalação e Setup

## Pré-requisitos

- Node.js v16 ou superior
- PostgreSQL 12 ou superior
- npm ou yarn
- Git (opcional)

## Passo 1: Configurar PostgreSQL

### No Windows:
1. Abra o pgAdmin (se instalado) ou use o psql
2. Crie um novo banco de dados:
```sql
CREATE DATABASE todo_db;
```

### Alternativamente, via terminal:
```bash
psql -U postgres -c "CREATE DATABASE todo_db;"
```

## Passo 2: Setup Backend

```bash
cd backend

npm install

cp .env.example .env
```

### Edite o arquivo .env com suas credenciais PostgreSQL:
```
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/todo_db
JWT_SECRET=sua_chave_secreta_super_segura
PORT=5000
NODE_ENV=development
```

### Crie as tabelas no banco:
```bash
psql -U seu_usuario -d todo_db -f src/config/schema.sql
```

### Inicie o servidor:
```bash
npm run dev
```

Você verá: "Server running on port 5000"

## Passo 3: Setup Frontend

Em outro terminal:
```bash
cd frontend

npm install

npm run dev
```

Abra o navegador em http://localhost:3000

## Testes

### Teste de Registro:
1. Clique em "Registrar"
2. Preencha email, nome e senha
3. Clique em "Registrar"

### Teste de Login:
1. Clique em "Fazer login"
2. Use as credenciais do registro anterior
3. Clique em "Entrar"

### Teste de Tarefas:
1. Digite um título (`Aprender TypeScript`)
2. Adicione uma descrição (opcional)
3. Clique em "Adicionar Tarefa"
4. Marque como completo clicando no checkbox
5. Delete a tarefa com o botão "Deletar"

## Build para Produção

### Backend:
```bash
cd backend
npm run build
npm start
```

### Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Erro: "ECONNREFUSED" ao conectar ao banco
- Verifique se PostgreSQL está rodando
- Windows: Services > PostgreSQL
- Linux: `sudo systemctl start postgresql`

### Erro: "Port already in use"
- Backend: Mude PORT no .env
- Frontend: Mude a porta no vite.config.ts

### Erro: "Module not found"
- Delete node_modules e package-lock.json
- Execute `npm install` novamente

## Estrutura de Diretórios

```
projeto2/
├── README.md
├── SETUP.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── schema.sql
│   │   ├── controllers/
│   │   │   ├── userController.ts
│   │   │   └── taskController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Task.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── tasks.ts
│   │   └── server.ts
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── TaskForm.tsx
    │   │   └── TaskItem.tsx
    │   ├── pages/
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   └── TasksPage.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── styles/
    │   │   ├── auth.css
    │   │   ├── global.css
    │   │   ├── taskform.css
    │   │   ├── taskitem.css
    │   │   └── tasks.css
    │   ├── utils/
    │   │   └── auth.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── .gitignore
```

## Recursos Adicionais

- React Documentation: https://react.dev
- Express.js Guide: https://expressjs.com
- PostgreSQL Manual: https://www.postgresql.org/docs
- Vite Guide: https://vitejs.dev
