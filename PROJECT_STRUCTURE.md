# 📁 Estrutura do Projeto

## 🗂️ Visão Geral

```
kanban/
│
├── 📄 README.md                    # Documentação principal
├── 📄 ARCHITECTURE.md              # Decisões arquiteturais
├── 📄 PROJECT_SUMMARY.md           # Resumo técnico completo
├── 📄 TESTING_GUIDE.md             # Guia de testes
├── 📄 NEXT_STEPS.md                # Próximos passos
├── 📄 WINDOWS_SETUP.md             # Setup no Windows
├── 📄 API_EXAMPLES.http            # Exemplos de API
│
├── 📄 package.json                 # Dependências
├── 📄 tsconfig.json                # Config TypeScript
├── 📄 .gitignore                   # Arquivos ignorados
│
└── src/
    ├── 📄 app.ts                   # Configuração Express
    ├── 📄 server.ts                # Inicialização do servidor
    │
    ├── 📁 modules/                 # Módulos de domínio
    │   ├── 📁 auth/                # ⭐ Autenticação
    │   │   ├── auth.types.ts       # Interfaces e types
    │   │   ├── auth.repository.ts  # Queries de database
    │   │   ├── auth.service.ts     # Lógica de negócio
    │   │   ├── auth.controller.ts  # Handlers HTTP
    │   │   ├── auth.validation.ts  # Schemas Zod
    │   │   └── auth.routes.ts      # Rotas Express
    │   │
    │   ├── 📁 tasks/               # ⭐ Tasks (Kanban)
    │   │   ├── task.types.ts
    │   │   ├── task.repository.ts
    │   │   ├── task.service.ts
    │   │   ├── task.controller.ts
    │   │   ├── task.validation.ts
    │   │   └── task.routes.ts
    │   │
    │   └── 📁 users/               # ⭐ Usuários
    │       ├── user.types.ts
    │       ├── user.repository.ts
    │       ├── user.service.ts
    │       ├── user.controller.ts
    │       ├── user.validation.ts
    │       └── user.routes.ts
    │
    └── 📁 shared/                  # Código compartilhado
        ├── 📁 config/
        │   └── env.ts              # Variáveis de ambiente
        │
        ├── 📁 database/
        │   ├── connection.ts       # Conexão SQLite
        │   └── migrate.ts          # Migrations
        │
        ├── 📁 errors/
        │   └── AppError.ts         # Erro customizado
        │
        ├── 📁 middlewares/
        │   ├── asyncHandler.ts     # Wrapper async
        │   ├── authenticate.ts     # Valida JWT
        │   ├── authorize.ts        # Valida roles
        │   ├── errorHandler.ts     # Handler global de erros
        │   └── rateLimit.ts        # Rate limiting
        │
        └── 📁 audit/
            └── auditLog.service.ts # Sistema de auditoria
```

---

## 🎯 Módulos Principais

### 1. 🔐 Auth (Autenticação)

```
auth/
├── types.ts       → User, UserDTO, RegisterDTO, LoginDTO, JWTPayload
├── repository.ts  → findUserByEmail, createUser, saveRefreshToken, revokeRefreshToken
├── service.ts     → register, login, refreshAccessToken, logout
├── controller.ts  → Handlers HTTP
├── validation.ts  → Schemas Zod
└── routes.ts      → POST /register, /login, /refresh, /logout
```

**Funcionalidades:**
- ✅ Registro de usuários
- ✅ Login com credenciais
- ✅ JWT Access Token (15min)
- ✅ JWT Refresh Token (7 dias)
- ✅ Refresh Token Rotation
- ✅ Logout com revogação
- ✅ Rate limiting no login

---

### 2. 📝 Tasks (Kanban)

```
tasks/
├── types.ts       → Task, TaskDTO, CreateTaskDTO, MoveTaskDTO, ALLOWED_TRANSITIONS
├── repository.ts  → findAll, findById, findByAssignedTo, create, update, updateStatus, delete
├── service.ts     → createTask, getAllTasks, getTaskById, updateTask, moveTask, deleteTask
├── controller.ts  → Handlers HTTP
├── validation.ts  → Schemas Zod
└── routes.ts      → GET /tasks, POST /tasks, PUT /tasks/:id, PATCH /tasks/:id/move, DELETE /tasks/:id
```

**Funcionalidades:**
- ✅ CRUD de tasks (ADMIN only para create, update, delete)
- ✅ Listagem (ADMIN vê todas, MEMBER vê só as dele)
- ✅ Movimentação com regras complexas
- ✅ Validação de transições de status
- ✅ Autorização por role e ownership

**Fluxo:**
```
BACKLOG → IN_PROGRESS → REVIEW → DONE
```

---

### 3. 👥 Users (Usuários)

```
users/
├── types.ts       → UserDTO, UpdateUserDTO
├── repository.ts  → findAll, findById, update, delete, emailExists, countAdmins
├── service.ts     → getAllUsers, getUserById, updateUser, deleteUser
├── controller.ts  → Handlers HTTP
├── validation.ts  → Schemas Zod
└── routes.ts      → GET /users, GET /users/:id, PUT /users/:id, DELETE /users/:id
```

**Funcionalidades:**
- ✅ Listar usuários (ADMIN only)
- ✅ Buscar por ID (ADMIN ou próprio usuário)
- ✅ Atualizar usuário (ADMIN only)
- ✅ Deletar usuário (ADMIN only, com validações)

---

## 🛠️ Shared (Infraestrutura)

### Config
- **env.ts**: Centraliza variáveis de ambiente com validação

### Database
- **connection.ts**: Singleton de conexão SQLite
- **migrate.ts**: Cria tabelas (users, tasks, refresh_tokens, audit_logs)

### Errors
- **AppError.ts**: Erro customizado com status code e mensagem

### Middlewares
- **authenticate.ts**: Valida JWT e adiciona `req.user`
- **authorize.ts**: Valida roles (`authorize(['ADMIN'])`)
- **errorHandler.ts**: Captura erros e formata response
- **asyncHandler.ts**: Wrapper para async functions
- **rateLimit.ts**: Limita tentativas de login

### Audit
- **auditLog.service.ts**: Registra ações importantes (opcional)

---

## 📊 Database Schema

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('ADMIN', 'MEMBER')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### tasks
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK(status IN ('BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DONE')) DEFAULT 'BACKLOG',
  assigned_to INTEGER,
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  performed_by INTEGER NOT NULL,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔄 Fluxo de uma Requisição

```
HTTP Request
    ↓
Express Middlewares (body parser)
    ↓
Router (/api/tasks)
    ↓
Middleware: authenticate (valida JWT)
    ↓
Middleware: authorize (valida role) [opcional]
    ↓
Controller
  ├─ Valida input (Zod)
  └─ Chama Service
      ↓
Service
  ├─ Regras de negócio
  ├─ Autorização complexa
  └─ Chama Repository
      ↓
Repository
  ├─ Query SQL
  └─ Retorna dados
      ↓
Service transforma dados
    ↓
Controller formata response
    ↓
HTTP Response (JSON)
```

Se erro em qualquer etapa:
```
throw new AppError()
    ↓
Middleware: errorHandler
    ↓
HTTP Response (error JSON)
```

---

## 📦 Dependências Principais

### Produção
- **express**: Framework HTTP
- **typescript**: Type safety
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: JWT
- **dotenv**: Variáveis de ambiente
- **better-sqlite3**: Database SQLite
- **express-rate-limit**: Rate limiting
- **zod**: Validação de schemas

### Desenvolvimento
- **tsx**: Rodar TypeScript direto
- **@types/***: Types do TypeScript

---

## 🎯 Arquitetura em 3 Camadas

```
┌─────────────────────────────────────┐
│        CONTROLLER (Fina)            │
│  ✅ Valida input                     │
│  ✅ Chama service                    │
│  ✅ Retorna response                 │
│  ❌ Sem regras de negócio            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        SERVICE (Gorda)               │
│  ✅ Regras de negócio                │
│  ✅ Autorização complexa             │
│  ✅ Orquestração                     │
│  ❌ Sem acesso direto ao banco       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      REPOSITORY (Queries)            │
│  ✅ Queries SQL                      │
│  ✅ CRUD básico                      │
│  ❌ Sem regras de negócio            │
└──────────────┬──────────────────────┘
               │
         [ DATABASE ]
```

---

## 🚀 Como Adicionar um Novo Módulo

Exemplo: Adicionar módulo de **comentários**

```bash
src/modules/comments/
├── comment.types.ts       # 1. Definir types
├── comment.repository.ts  # 2. Criar queries
├── comment.service.ts     # 3. Implementar regras
├── comment.controller.ts  # 4. Criar handlers
├── comment.validation.ts  # 5. Schemas Zod
└── comment.routes.ts      # 6. Definir rotas
```

Depois registrar em `app.ts`:
```typescript
import { commentRoutes } from './modules/comments/comment.routes';
app.use('/api/comments', commentRoutes);
```

---

## 📝 Convenções de Código

### Nomenclatura
- **Arquivos**: camelCase (auth.service.ts)
- **Classes**: PascalCase (AuthService)
- **Funções**: camelCase (createTask)
- **Constantes**: UPPER_SNAKE_CASE (ALLOWED_TRANSITIONS)
- **Interfaces**: PascalCase (UserDTO)

### Estrutura de Service
```typescript
export class ExampleService {
  private repository: ExampleRepository;

  constructor() {
    this.repository = new ExampleRepository();
  }

  async method(data: DTO, currentUser: JWTPayload) {
    // 1. Autorização
    if (!can) throw new AppError('Acesso negado', 403);

    // 2. Validações de negócio
    if (!valid) throw new AppError('Inválido', 400);

    // 3. Operação
    const result = this.repository.operation(data);

    // 4. Retorno
    return result;
  }
}
```

### Estrutura de Controller
```typescript
export class ExampleController {
  private service: ExampleService;

  constructor() {
    this.service = new ExampleService();
  }

  method = async (req: Request, res: Response): Promise<void> => {
    // 1. Validar input
    const validation = schema.safeParse(req.body);
    if (!validation.success) throw new AppError(...);

    // 2. Chamar service
    const result = await this.service.method(validation.data, req.user!);

    // 3. Retornar response
    res.status(200).json({ status: 'success', data: result });
  };
}
```

---

## 🎓 Este Projeto Demonstra

1. ✅ **Arquitetura em camadas** (separação de responsabilidades)
2. ✅ **Autenticação robusta** (JWT + Refresh Token Rotation)
3. ✅ **Autorização granular** (RBAC + Ownership + State-based)
4. ✅ **Regras de negócio complexas** (transições de estado)
5. ✅ **Segurança** (bcrypt, rate limit, validações)
6. ✅ **Validação de entrada** (Zod)
7. ✅ **Error handling** (centralizado e consistente)
8. ✅ **Database design** (foreign keys, índices, constraints)
9. ✅ **Código limpo** (legível e manutenível)
10. ✅ **Documentação profissional** (completa e explicativa)

---

**Projeto production-ready e explicável em entrevistas técnicas!** 🚀

