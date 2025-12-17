# 🏗️ Estrutura Completa - Padrão de Mercado

## 📚 Nome da Arquitetura

**Layered Architecture (Arquitetura em Camadas)** com elementos de:
- **Repository Pattern**
- **Service Layer Pattern**
- **DTO Pattern**
- **Mapper Pattern**
- **Dependency Inversion Principle (SOLID)**

---

## 📁 Estrutura Completa Implementada

```
src/
├── controllers/          ✅ Handlers HTTP (camada de apresentação)
│   ├── auth.controller.ts
│   ├── task.controller.ts
│   └── user.controller.ts
│
├── services/             ✅ Lógica de negócio (camada de domínio)
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── user.service.ts
│
├── repositories/         ✅ Acesso ao banco (camada de dados)
│   ├── auth.repository.ts
│   ├── task.repository.ts
│   └── user.repository.ts
│
├── routes/               ✅ Definição de rotas
│   ├── auth.routes.ts
│   ├── task.routes.ts
│   └── user.routes.ts
│
├── entities/             ✨ NOVO - Entidades de domínio
│   ├── User.entity.ts
│   ├── Task.entity.ts
│   └── RefreshToken.entity.ts
│
├── dtos/                 ✨ NOVO - Data Transfer Objects
│   ├── auth/
│   │   ├── RegisterDTO.ts
│   │   ├── LoginDTO.ts
│   │   └── AuthResponseDTO.ts
│   ├── task/
│   │   ├── CreateTaskDTO.ts
│   │   ├── UpdateTaskDTO.ts
│   │   ├── MoveTaskDTO.ts
│   │   └── TaskDTO.ts
│   └── user/
│       ├── UserDTO.ts
│       └── UpdateUserDTO.ts
│
├── interfaces/           ✨ NOVO - Contratos (SOLID)
│   └── repositories/
│       ├── IAuthRepository.ts
│       ├── ITaskRepository.ts
│       └── IUserRepository.ts
│
├── mappers/              ✨ NOVO - Transformadores
│   ├── user.mapper.ts
│   └── task.mapper.ts
│
├── constants/            ✨ NOVO - Constantes centralizadas
│   ├── roles.constants.ts
│   ├── task-status.constants.ts
│   └── app.constants.ts
│
├── exceptions/           ✨ NOVO - Exceções customizadas
│   ├── NotFoundException.ts
│   ├── UnauthorizedException.ts
│   ├── ForbiddenException.ts
│   ├── ValidationException.ts
│   └── ConflictException.ts
│
├── validations/          ✅ Schemas Zod
│   ├── auth.validation.ts
│   ├── task.validation.ts
│   └── user.validation.ts
│
├── utils/                ✅ Funções utilitárias
│   ├── jwt.util.ts
│   └── hash.util.ts
│
└── shared/               ✅ Código compartilhado
    ├── middlewares/
    ├── database/
    ├── errors/
    └── config/
```

---

## 🎯 O Que Foi Adicionado

### 1. **Entities** ✨
**Separação clara entre modelo de domínio e DTOs**

```typescript
// entities/User.entity.ts
export class User {
  isAdmin(): boolean { ... }
  isMember(): boolean { ... }
}
```

**Por quê?**
- Entities = modelo de domínio (regras de negócio)
- DTOs = modelo de apresentação (API)
- Separação clara = melhor manutenção

---

### 2. **DTOs Separados** ✨
**Cada DTO em seu próprio arquivo**

```typescript
// dtos/auth/RegisterDTO.ts
export interface RegisterDTO { ... }

// dtos/task/CreateTaskDTO.ts
export interface CreateTaskDTO { ... }
```

**Por quê?**
- Organização clara
- Fácil encontrar DTOs específicos
- Padrão de mercado

---

### 3. **Interfaces de Contrato** ✨
**Dependency Inversion Principle (SOLID)**

```typescript
// interfaces/repositories/IAuthRepository.ts
export interface IAuthRepository {
  findUserByEmail(email: string): User | undefined;
  // ...
}
```

**Por quê?**
- Facilita testes (mock de interfaces)
- Dependency Inversion Principle
- Contratos claros

---

### 4. **Mappers** ✨
**Transformação entre Entity e DTO**

```typescript
// mappers/user.mapper.ts
export class UserMapper {
  static toDTO(user: User): UserDTO { ... }
  static toEntity(data: any): User { ... }
}
```

**Por quê?**
- Responsabilidade única
- Reutilizável
- Fácil testar

---

### 5. **Constants** ✨
**Constantes centralizadas**

```typescript
// constants/roles.constants.ts
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;
```

**Por quê?**
- Centralização
- Evita typos
- Fácil refatorar

---

### 6. **Exceptions Customizadas** ✨
**Exceções semânticas**

```typescript
// exceptions/NotFoundException.ts
export class NotFoundException extends AppError { ... }

// exceptions/ForbiddenException.ts
export class ForbiddenException extends AppError { ... }
```

**Por quê?**
- Código mais semântico
- Melhor tratamento de erros
- Padrão de mercado

---

## 🔄 Fluxo de Dados

```
HTTP Request
    ↓
Controller (recebe DTO)
    ↓
Service (usa Entity, retorna DTO)
    ↓
Repository (retorna dados do banco)
    ↓
Mapper (converte para Entity)
    ↓
Service (usa Entity com regras de domínio)
    ↓
Mapper (converte Entity para DTO)
    ↓
Controller (retorna DTO)
    ↓
HTTP Response
```

---

## 📚 Padrões Implementados

### 1. **Repository Pattern**
- Abstração de acesso a dados
- Facilita trocar banco de dados
- Testável (mock de repository)

### 2. **Service Layer Pattern**
- Lógica de negócio isolada
- Não depende de HTTP
- Reutilizável

### 3. **DTO Pattern**
- Separação entre modelo de domínio e apresentação
- Segurança (não expõe dados sensíveis)
- Versionamento de API

### 4. **Mapper Pattern**
- Transformação centralizada
- Responsabilidade única
- Testável isoladamente

### 5. **Dependency Inversion (SOLID)**
- Interfaces definem contratos
- Implementações dependem de abstrações
- Facilita testes e manutenção

---

## ✅ Comparação: Antes vs Agora

| Item | Antes | Agora |
|------|-------|-------|
| Entities | ❌ Misturado | ✅ Separado |
| DTOs | ❌ Misturado | ✅ Organizado por módulo |
| Interfaces | ❌ Não existe | ✅ Contratos claros |
| Mappers | ❌ Dentro do service | ✅ Pasta separada |
| Constants | ❌ Espalhado | ✅ Centralizado |
| Exceptions | ⚠️ Só AppError | ✅ Específicas |

---

## 🎓 Para Entrevistas

### Pergunta: "Qual arquitetura você usa?"

**Resposta:**
> "Uso **Layered Architecture** com elementos de Clean Architecture:
> 
> - **Controllers**: Camada de apresentação (HTTP)
> - **Services**: Camada de domínio (regras de negócio)
> - **Repositories**: Camada de dados (acesso ao banco)
> - **Entities**: Modelo de domínio puro
> - **DTOs**: Modelo de apresentação
> - **Mappers**: Transformação entre camadas
> - **Interfaces**: Contratos (Dependency Inversion)
> 
> Separo Entities de DTOs para manter o modelo de domínio independente da API. Uso interfaces para facilitar testes e seguir SOLID."

---

## 🚀 Próximos Passos

1. ✅ Entities criadas
2. ✅ DTOs separados
3. ✅ Interfaces criadas
4. ✅ Mappers criados
5. ✅ Constants centralizadas
6. ✅ Exceptions customizadas
7. ⏳ Atualizar código existente para usar novos padrões
8. ⏳ Implementar repositories usando interfaces

---

**Estrutura completa e profissional! 🎯**

