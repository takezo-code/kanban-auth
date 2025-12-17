# 🏗️ Arquitetura do Sistema

## 📐 Visão Geral

Este projeto segue uma **arquitetura em camadas modular**, onde cada módulo (domínio) tem suas próprias camadas de Controller, Service e Repository.

```
┌─────────────────────────────────────────────┐
│             HTTP Request                     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          CONTROLLER LAYER                    │
│  - Recebe request                            │
│  - Valida input (Zod)                        │
│  - Chama service                             │
│  - Retorna response                          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          SERVICE LAYER                       │
│  - Regras de negócio                         │
│  - Autorização (role + ownership)            │
│  - Orquestração entre repositories           │
│  - Transforma dados                          │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│        REPOSITORY LAYER                      │
│  - Acessa o banco de dados                   │
│  - Queries SQL puras                         │
│  - Sem lógica de negócio                     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│            DATABASE (SQLite)                 │
└─────────────────────────────────────────────┘
```

---

## 📦 Estrutura de Módulos

Cada módulo segue o mesmo padrão:

```
src/modules/auth/
├── auth.types.ts        # Interfaces e types
├── auth.repository.ts   # Acesso ao banco
├── auth.service.ts      # Regras de negócio
├── auth.controller.ts   # Handlers de rotas
├── auth.validation.ts   # Schemas Zod
└── auth.routes.ts       # Definição de rotas
```

### Por que essa estrutura?

1. **Separação de responsabilidades**: Cada camada tem um propósito claro
2. **Testabilidade**: Fácil mockar dependências
3. **Manutenibilidade**: Mudanças em uma camada não afetam outras
4. **Escalabilidade**: Fácil adicionar novos módulos

---

## 🎯 Responsabilidade de Cada Camada

### 1. **Controller** (Fina)

**O que FAZ:**
- Recebe `Request` e retorna `Response`
- Valida input com Zod
- Extrai dados de `req.body`, `req.params`, `req.query`
- Chama service com dados validados
- Formata resposta JSON

**O que NÃO FAZ:**
- ❌ Regras de negócio
- ❌ Autorização complexa
- ❌ Acesso direto ao banco
- ❌ Transformações complexas

**Exemplo:**
```typescript
async createTask(req: Request, res: Response) {
  // ✅ Validar input
  const validation = createTaskSchema.safeParse(req.body);
  if (!validation.success) {
    throw new AppError(validation.error.errors[0].message, 400);
  }

  // ✅ Chamar service
  const task = await this.taskService.createTask(
    validation.data,
    req.user!
  );

  // ✅ Retornar response
  res.status(201).json({ status: 'success', data: task });
}
```

---

### 2. **Service** (Coração do Sistema)

**O que FAZ:**
- ✅ Todas as regras de negócio
- ✅ Autorização (quem pode fazer o quê)
- ✅ Validações de domínio
- ✅ Orquestração de repositories
- ✅ Transformações de dados
- ✅ Lançar `AppError` com mensagens claras

**O que NÃO FAZ:**
- ❌ Queries SQL diretas
- ❌ Parsing de request
- ❌ Formatação de response

**Exemplo:**
```typescript
async createTask(data: CreateTaskDTO, currentUser: JWTPayload) {
  // ✅ Autorização
  if (currentUser.role !== 'ADMIN') {
    throw new AppError('Apenas administradores podem criar tasks', 403);
  }

  // ✅ Validação de negócio
  if (data.assignedTo) {
    const userExists = this.taskRepository.userExists(data.assignedTo);
    if (!userExists) {
      throw new AppError('Usuário atribuído não encontrado', 404);
    }
  }

  // ✅ Chamar repository
  const task = this.taskRepository.create(
    data.title,
    data.description || null,
    currentUser.userId,
    data.assignedTo || null
  );

  return task;
}
```

---

### 3. **Repository** (Acesso ao Banco)

**O que FAZ:**
- ✅ Queries SQL
- ✅ CRUD básico
- ✅ Retornar dados puros do banco

**O que NÃO FAZ:**
- ❌ Regras de negócio
- ❌ Autorização
- ❌ Validações complexas

**Exemplo:**
```typescript
create(title: string, description: string | null, createdBy: number) {
  const stmt = this.db.prepare(`
    INSERT INTO tasks (title, description, created_by, status)
    VALUES (?, ?, ?, 'BACKLOG')
  `);

  const result = stmt.run(title, description, createdBy);
  return this.findById(result.lastInsertRowid as number);
}
```

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

```
1. Register/Login
   ↓
2. Gera Access Token (15min) + Refresh Token (7 dias)
   ↓
3. Cliente guarda ambos
   ↓
4. Toda requisição: envia Access Token no header
   ↓
5. Access Token expira? Usa Refresh Token para renovar
   ↓
6. Refresh Token usado? → Rotação: revoga o antigo, gera novo
```

### Middlewares

**authenticate.ts**
- Valida JWT Access Token
- Adiciona `req.user` com dados do usuário

**authorize.ts**
- Verifica se usuário tem role permitida
- Usa **depois** do `authenticate`

---

## 🎭 Sistema de Autorização

### Níveis de Autorização

#### 1. **Autorização por Role (RBAC)**

Verifica se usuário tem role necessária:

```typescript
// No middleware
router.post('/tasks', authenticate, authorize(['ADMIN']), ...)

// No service (validação extra)
if (currentUser.role !== 'ADMIN') {
  throw new AppError('Acesso negado', 403);
}
```

#### 2. **Autorização por Ownership**

Verifica se usuário é dono ou tem permissão:

```typescript
// MEMBER só pode ver tasks atribuídas a ele
if (currentUser.role === 'MEMBER') {
  if (task.assignedTo !== currentUser.userId) {
    throw new AppError('Acesso negado', 403);
  }
}
```

#### 3. **Autorização por Transição de Estado**

Regras complexas para movimentação de tasks:

```typescript
// MEMBER não pode aprovar (REVIEW → DONE)
const isAdminOnlyTransition = ADMIN_ONLY_TRANSITIONS.some(
  ([from, to]) => from === currentStatus && to === newStatus
);

if (isAdminOnlyTransition && currentUser.role !== 'ADMIN') {
  throw new AppError('Apenas administradores podem fazer essa transição', 403);
}
```

---

## 📊 Fluxo de uma Requisição

### Exemplo: Mover Task (PATCH /api/tasks/:id/move)

```
1. HTTP Request chega
   ↓
2. Express middleware: body parser
   ↓
3. Router: /api/tasks
   ↓
4. Middleware: authenticate
   - Valida JWT
   - Adiciona req.user
   ↓
5. Controller: moveTask
   - Valida input (Zod)
   - Extrai taskId
   ↓
6. Service: moveTask
   - Busca task no repository
   - Verifica se existe
   - Valida transição no fluxo
   - Verifica se é transição ADMIN-only
   - Verifica ownership (MEMBER)
   - Atualiza task
   ↓
7. Controller retorna response
   ↓
8. Middleware: errorHandler (se houver erro)
```

---

## 🔒 Segurança

### Camadas de Segurança

1. **Rate Limiting**: Limite de requisições (login)
2. **JWT**: Tokens assinados e com expiração
3. **Refresh Token Rotation**: Token usado é revogado
4. **bcrypt**: Hash de senhas com salt
5. **Validação de Input**: Zod previne dados inválidos
6. **Autorização Granular**: Múltiplos níveis de verificação
7. **Error Handling**: Não vaza detalhes internos

### Por que JWT Access + Refresh?

**Access Token (curto):**
- Vida curta (15min)
- Não fica no banco
- Se roubado, expira rápido
- Enviado em toda requisição

**Refresh Token (longo):**
- Vida longa (7 dias)
- Armazenado no banco
- Pode ser revogado
- Usado apenas para renovar access

---

## 🗄️ Database Design

### Decisões Importantes

1. **Foreign Keys com CASCADE/SET NULL**
   - `tasks.created_by` → `CASCADE`: Se usuário deletado, tasks também
   - `tasks.assigned_to` → `SET NULL`: Se usuário deletado, task fica sem atribuição

2. **Índices**
   - `users.email`: Busca frequente no login
   - `tasks.status`: Filtros por status
   - `tasks.assigned_to`: Busca de tasks por membro

3. **CHECK Constraints**
   - `role IN ('ADMIN', 'MEMBER')`
   - `status IN ('BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DONE')`

---

## 🎓 Padrões e Boas Práticas

### 1. **Dependency Injection (Manual)**

```typescript
class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }
}
```

**Por que:** Facilita testes e desacoplamento.

### 2. **DTO (Data Transfer Objects)**

```typescript
interface CreateTaskDTO {
  title: string;
  description?: string;
  assignedTo?: number;
}
```

**Por que:** Define contrato claro entre camadas.

### 3. **Error Handling Centralizado**

```typescript
// Lançar erro
throw new AppError('Task não encontrada', 404);

// Capturado pelo middleware errorHandler
```

**Por que:** Consistência nas respostas de erro.

### 4. **Async/Await com asyncHandler**

```typescript
router.post('/tasks', asyncHandler(controller.createTask));
```

**Por que:** Captura erros de promises automaticamente.

### 5. **Validação na Entrada**

```typescript
const validation = schema.safeParse(req.body);
if (!validation.success) {
  throw new AppError(validation.error.errors[0].message, 400);
}
```

**Por que:** Falha rápido com feedback claro.

---

## 🚀 Escalabilidade

### Como escalar este projeto?

1. **Adicionar novos módulos** (ex: comentários, anexos)
   - Seguir a mesma estrutura
   - Registrar rotas no `app.ts`

2. **Trocar SQLite por PostgreSQL**
   - Ajustar queries SQL
   - Manter mesma arquitetura

3. **Adicionar cache** (Redis)
   - Cachear listagens no service
   - Invalidar cache em updates

4. **Adicionar filas** (Bull)
   - Processar tarefas assíncronas
   - Notificações, emails, etc.

5. **Microserviços**
   - Separar auth, tasks, users em serviços
   - Comunicação via HTTP ou message broker

---

## 📚 Para Estudar Mais

- **Clean Architecture** (Uncle Bob)
- **Domain-Driven Design** (DDD)
- **SOLID Principles**
- **Repository Pattern**
- **Dependency Injection**
- **RBAC (Role-Based Access Control)**

---

**Esta arquitetura é production-ready e serve como base sólida para sistemas complexos.** 🎯

