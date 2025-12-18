# 🔐 Auth-first Kanban API

Sistema Kanban com foco em **autenticação e autorização**, desenvolvido como projeto de portfólio para demonstrar domínio em segurança e arquitetura backend.

## 🛠️ Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** (via Docker)
- **JWT** (Access + Refresh Token com rotação)
- **bcrypt** (hash de senhas)
- **Zod** (validação)
- **Swagger/OpenAPI** (documentação)

### Frontend
- **React** + **TypeScript** + **Vite**
- **Axios** (HTTP client)
- Interface Kanban visual e responsiva

## 📁 Arquitetura

```
src/
├── controllers/      # Handlers HTTP
├── services/         # Lógica de negócio
├── repositories/     # Acesso ao banco
├── routes/           # Definição de rotas
├── entities/         # Entidades de domínio
├── dtos/             # Data Transfer Objects
├── interfaces/       # Contratos (SOLID)
├── mappers/          # Transformadores Entity ↔ DTO
├── constants/        # Constantes centralizadas
├── exceptions/       # Exceções customizadas
├── validations/      # Schemas Zod
├── utils/            # Utilitários (JWT, Hash)
└── shared/           # Middlewares, config, database
```

## 👥 Roles e Permissões

| Ação | ADMIN | MEMBER |
|------|:-----:|:------:|
| Criar tasks | ✅ | ❌ |
| Editar tasks | ✅ | ❌ |
| Deletar tasks | ✅ | ❌ |
| Ver todas as tasks | ✅ | ❌ |
| Ver tasks atribuídas | ✅ | ✅ |
| Mover tasks (próprias) | ✅ | ✅ |
| Aprovar tasks (REVIEW → DONE) | ✅ | ❌ |
| Gerenciar usuários | ✅ | ❌ |

## 📋 Fluxo Kanban

```
BACKLOG → IN_PROGRESS → REVIEW → DONE
```

**Regras:**
- Tasks sempre começam em `BACKLOG`
- MEMBER pode mover: `BACKLOG → IN_PROGRESS`, `IN_PROGRESS → REVIEW`
- ADMIN pode mover: `REVIEW → DONE`, `REVIEW → IN_PROGRESS` (rejeição)
- MEMBER só pode mover tasks atribuídas a ele

## 🚀 Como Rodar

### 🐳 Docker (Recomendado - Mais Fácil)

```bash
# Construir e iniciar tudo
docker-compose up -d --build

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f app

# Parar
docker-compose down
```

**Acesse:**
- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- Health: http://localhost:3000/health

### 💻 Local (Desenvolvimento)

```bash
# Instalar dependências
npm install

# Subir PostgreSQL
npm run docker:up

# Rodar migrations
npm run db:migrate

# Iniciar servidor
npm run dev

# Ou tudo de uma vez:
npm run start:all
```

Veja [`QUICK_START.md`](./QUICK_START.md) para mais detalhes.

### 🐳 Docker (Recomendado)

**Para rodar tudo no Docker:**

```bash
# Produção (build + start)
docker-compose up -d --build

# Desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up --build

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

### 🚀 Início Rápido (Local)

**Para iniciar tudo automaticamente:**

```bash
# Windows (PowerShell)
npm run start:win

# Linux/Mac (Bash)
npm run start:unix

# Cross-platform (Node.js)
npm run start:all
```

O script irá:
1. ✅ Verificar se Docker está rodando
2. ✅ Subir PostgreSQL
3. ✅ Aguardar PostgreSQL estar pronto
4. ✅ Rodar migrations automaticamente
5. ✅ Iniciar o servidor

### 🐳 Docker (Backend)

**Para rodar o backend no Docker:**

```bash
# Iniciar backend
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Parar
docker-compose down
```

### 🎨 Frontend

**Para rodar o frontend:**

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### 🚀 Rodar Tudo de Uma Vez (Recomendado)

**Comando único para iniciar Backend + Frontend:**

```bash
npm run start:all
```

Ou no Windows PowerShell:
```bash
npm run start:win
```

Isso irá:
- ✅ Verificar e iniciar Docker (PostgreSQL + API)
- ✅ Aguardar backend estar pronto
- ✅ Iniciar frontend automaticamente

**Acessar:**
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api-docs

### 🔧 Rodar Separadamente

1. **Backend (Docker):**
   ```bash
   docker-compose up -d --build
   ```

2. **Frontend (Terminal separado):**
   ```bash
   cd frontend
   npm run dev
   ```

Veja [`QUICK_START.md`](./QUICK_START.md) para guia completo.

**Comandos úteis:**
```bash
docker-compose ps              # Status dos containers
docker-compose logs -f         # Logs em tempo real
docker-compose restart         # Reiniciar containers
docker-compose down -v         # Parar e limpar volumes
```

## 🔑 Variáveis de Ambiente

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=kanban_user
POSTGRES_PASSWORD=kanban_pass
POSTGRES_DB=kanban_db
DATABASE_URL=postgresql://kanban_user:kanban_pass@localhost:5432/kanban_db

# JWT
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

Veja [`DOCKER.md`](./DOCKER.md) para mais detalhes.

## 📚 Documentação da API

A documentação completa da API está disponível em:

- **Swagger UI local**: `http://localhost:3000/api-docs` (quando o servidor estiver rodando)
- **Arquivos estáticos**: Pasta `docs/` contém `openapi.json` e `openapi.yaml`

### Visualizar no GitHub

📖 [Ver documentação no Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/takezo-code/projetooo/main/docs/openapi.yaml)

### Gerar/Atualizar documentação

```bash
npm run docs:generate
```

Os arquivos podem ser visualizados em:
- [Swagger Editor](https://editor.swagger.io/) - Cole o conteúdo do `openapi.yaml`
- [Redoc](https://redocly.github.io/redoc/) - Visualização alternativa
- Postman - Importe o `openapi.json`
- Insomnia - Importe o `openapi.json`

Veja mais opções em [`docs/GITHUB.md`](./docs/GITHUB.md)

## 📡 Endpoints da API

### 🔐 Autenticação

#### POST `/api/auth/register`
Registrar novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "MEMBER" // opcional, padrão: MEMBER
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { "id": 1, "name": "João Silva", "email": "joao@email.com", "role": "MEMBER" },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### POST `/api/auth/login`
Fazer login.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response:** Mesmo formato do register.

#### POST `/api/auth/refresh`
Renovar access token usando refresh token.

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "accessToken": "novo_token...",
    "refreshToken": "novo_refresh_token..."
  }
}
```

#### POST `/api/auth/logout`
Revogar refresh token.

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

---

### 📋 Tasks

Todas as rotas de tasks requerem autenticação (`Authorization: Bearer <token>`).

#### GET `/api/tasks`
Listar tasks. ADMIN vê todas, MEMBER vê apenas as atribuídas a ele.

#### GET `/api/tasks/:id`
Buscar task por ID.

#### POST `/api/tasks` (ADMIN only)
Criar nova task.

**Body:**
```json
{
  "title": "Implementar feature X",
  "description": "Descrição da task",
  "assignedTo": 2 // opcional
}
```

#### PUT `/api/tasks/:id` (ADMIN only)
Atualizar task.

**Body:**
```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "assignedTo": 3
}
```

#### PATCH `/api/tasks/:id/move`
Mover task entre status. Respeita regras de transição.

**Body:**
```json
{
  "newStatus": "IN_PROGRESS"
}
```

#### DELETE `/api/tasks/:id` (ADMIN only)
Deletar task.

---

### 👥 Users

Todas as rotas de users requerem autenticação.

#### GET `/api/users` (ADMIN only)
Listar todos os usuários.

#### GET `/api/users/:id`
Buscar usuário por ID. ADMIN pode ver qualquer um, MEMBER só o próprio.

#### PUT `/api/users/:id` (ADMIN only)
Atualizar usuário.

**Body:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "role": "ADMIN"
}
```

#### DELETE `/api/users/:id` (ADMIN only)
Deletar usuário. Não pode deletar a si mesmo nem o último admin.

## 🔒 Autenticação

Todas as rotas protegidas requerem header:

```
Authorization: Bearer <access_token>
```

### Refresh Token Rotation

Quando o access token expira, use o refresh token para obter novos tokens. O refresh token antigo é revogado automaticamente (rotação).

## 🎯 Padrões Implementados

- **Layered Architecture** - Separação em camadas
- **Repository Pattern** - Abstração de dados
- **DTO Pattern** - Separação API ↔ Domínio
- **Mapper Pattern** - Transformação entre camadas
- **Dependency Inversion** - Interfaces e contratos
- **Custom Exceptions** - Erros semânticos

## 📄 Licença

MIT
