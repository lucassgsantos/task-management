# Task Flow

Aplicacao full stack de gerenciamento de tarefas com autenticacao, filtros, edicao inline e uma interface pensada para portfolio.

## Destaques

- Rotas explicitas no frontend com `react-router-dom`
- Sessao centralizada com `AuthContext` e persistencia em `localStorage`
- Dashboard responsivo com resumo, filtros, feedback visual e acessibilidade melhorada
- Backend organizado em configuracao, validacao, repositorios e tratamento padronizado de erros
- Testes automatizados cobrindo autenticacao, autorizacao e fluxo principal de tarefas
- Pipeline de CI no GitHub Actions para lint, typecheck, testes e build

## Stack

- Frontend: React 18, TypeScript, Vite, React Router, Axios
- Backend: Node.js, Express, TypeScript, SQLite com `better-sqlite3`, JWT, bcryptjs
- Qualidade: ESLint, Prettier, Vitest, Testing Library, Supertest, GitHub Actions

## Estrutura

```text
.
|-- backend/
|   |-- src/
|   |-- tests/
|   `-- vitest.config.ts
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- test/
|   |   |-- types/
|   |   `-- utils/
|   `-- vite.config.ts
`-- .github/workflows/ci.yml
```

## Como rodar

1. Instale as dependencias na raiz:

```bash
npm install
```

2. Crie `backend/.env` a partir de [`backend/.env.example`](./backend/.env.example) e defina um `JWT_SECRET` forte.

3. Opcionalmente crie `frontend/.env` a partir de [`frontend/.env.example`](./frontend/.env.example) se quiser apontar para uma URL de API especifica.

4. Inicie frontend e backend juntos:

```bash
npm run dev
```

5. Acesse:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)
- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

O banco SQLite e recriado automaticamente em `backend/data.db` quando o backend sobe.
Arquivos gerados, bancos locais, `dist/`, `coverage/` e arquivos `.env` ficam fora do versionamento via `.gitignore`.

## Scripts uteis

- `npm run dev`: sobe backend e frontend em paralelo
- `npm run lint`: roda ESLint em todos os workspaces
- `npm run typecheck`: valida TypeScript sem emitir arquivos compilados
- `npm run test`: executa suites do backend e do frontend
- `npm run build`: gera `backend/dist` e o build de producao do frontend
- `npm run format:write`: aplica Prettier no projeto inteiro

## Fluxo principal

1. Registrar conta ou fazer login
2. Criar tarefas com titulo e descricao
3. Filtrar entre `Todas`, `Pendentes` e `Concluidas`
4. Editar tarefa inline
5. Marcar como concluida ou reabrir
6. Excluir com confirmacao

## Cobertura atual

- Backend:
  - cadastro, login e perfil
  - email duplicado e credenciais invalidas
  - rotas protegidas
  - isolamento de tarefas por usuario
  - validacao de payload, update e delete
- Frontend:
  - redirecionamento de rota protegida para login
  - restauracao de sessao salva
  - criar, filtrar, editar, concluir e excluir tarefas

## CI

O workflow em [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) roda em `push` para `main` e em `pull_request` com:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Proximos passos para producao

- mover autenticacao para cookie `httpOnly`
- adicionar rate limiting e logging estruturado
- adicionar observabilidade e monitoramento
