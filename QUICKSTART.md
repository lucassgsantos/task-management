# Quick Start - Início Rápido

## 30 segundos de setup

### 1. Criar banco de dados PostgreSQL
```bash
psql -U postgres -c "CREATE DATABASE todo_db;"
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

Você verá: "Server running on port 5000"

### 3. Em outro terminal - Frontend
```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:3000

## Primeiros passos

1. Clique em "Registrar"
2. Crie uma conta com email e senha
3. Crie uma tarefa digitando o título
4. Marque como completo com o checkbox
5. Delete com o botão "Deletar"

## O que você tem

✅ API REST completa com autenticação JWT
✅ Frontend React responsivo
✅ PostgreSQL com schema pronto
✅ TypeScript em ambos (type-safe)
✅ Sem comentários (código limpo)
✅ Pronto para produção

## Arquivos importantes

```
README.md          - O que é o projeto
SETUP.md           - Instruções detalhadas
ARCHITECTURE.md    - Como funciona
API_EXAMPLES.md    - Exemplos de requests
```

## Variáveis de Ambiente

Crie `.env` na pasta backend:
```
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/todo_db
JWT_SECRET=sua_chave_secreta_bem_segura
PORT=5000
NODE_ENV=development
```

Atualize o PostgreSQL URL com suas credenciais!

## Comandos úteis

Backend:
- `npm run dev` - Desenvolvimento
- `npm run build` - Compilar
- `npm start` - Rodar compilado

Frontend:
- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npm run preview` - Ver build

## Troubleshooting rápido

**Erro de conexão ao banco:**
```bash
sudo systemctl start postgresql  # Linux
net start PostgreSQL             # Windows
```

**Porta em uso:**
- Backend: Mude PORT no .env
- Frontend: Mude em vite.config.ts

**Módulos faltando:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Endpoints principais

- `POST /api/auth/register` - Registrar
- `POST /api/auth/login` - Login
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar
- `DELETE /api/tasks/:id` - Deletar

Todos precisam de token JWT exceto register e login!

## Estrutura simplificada

```
projeto2/
├── backend/           ← API (Node.js)
│   ├── src/
│   └── package.json
├── frontend/          ← Interface (React)
│   ├── src/
│   └── package.json
└── README.md
```

Pronto! Você tem um full stack production-ready! 🚀
