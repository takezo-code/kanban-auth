# 🔐 Auth-first Kanban API

Sistema Kanban com foco em **autenticação e autorização**, desenvolvido como projeto de portfólio para demonstrar domínio em segurança e arquitetura backend.

## 🛠️ Stack

- **Node.js** + **Express** + **TypeScript**
- **SQLite** (better-sqlite3)
- **JWT** (Access + Refresh Token com rotação)
- **bcrypt** (hash de senhas)
- **Zod** (validação)

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

## 🚀 Instalação

```bash
# Clonar repositório
git clone https://github.com/takezo-code/projetooo.git
cd projetooo

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Rodar migrations
npm run migrate

# Iniciar servidor
npm run dev
```

### ⚠️ Windows

Se tiver problemas com `better-sqlite3`, use WSL:

```bash
wsl --install
# No terminal WSL:
cd /mnt/c/caminho/do/projeto
npm install
npm run dev
```

## 🔑 Variáveis de Ambiente

```env
PORT=3000
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## 📡 Endpoints

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Renovar tokens |
| POST | `/api/auth/logout` | Logout |

### Tasks
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/tasks` | Listar tasks |
| GET | `/api/tasks/:id` | Buscar task |
| POST | `/api/tasks` | Criar task (ADMIN) |
| PUT | `/api/tasks/:id` | Atualizar task (ADMIN) |
| PATCH | `/api/tasks/:id/move` | Mover task |
| DELETE | `/api/tasks/:id` | Deletar task (ADMIN) |

### Users
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users` | Listar usuários (ADMIN) |
| GET | `/api/users/:id` | Buscar usuário |
| PUT | `/api/users/:id` | Atualizar usuário (ADMIN) |
| DELETE | `/api/users/:id` | Deletar usuário (ADMIN) |

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
