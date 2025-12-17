# 🎯 Kanban Auth-First System

Sistema Kanban profissional com foco em autenticação, autorização e controle de acesso granular.

## 🏗️ Stack Técnica

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT (Access + Refresh Token)
- **Security:** bcrypt, express-rate-limit
- **Validation:** Zod

## 🎭 Papéis e Permissões

### ADMIN
- ✅ Criar, editar e deletar tasks
- ✅ Atribuir tasks a membros
- ✅ Mover tasks entre qualquer status
- ✅ Visualizar tudo

### MEMBER
- ✅ Visualizar tasks
- ✅ Mover tasks atribuídas (apenas transições permitidas)
- ❌ Não pode criar, editar ou deletar tasks
- ❌ Não pode pular etapas no fluxo

## 📊 Fluxo de Status

```
BACKLOG → IN_PROGRESS → REVIEW → DONE
```

### Regras de Transição

**MEMBER pode:**
- `BACKLOG → IN_PROGRESS`
- `IN_PROGRESS → REVIEW`

**Apenas ADMIN pode:**
- `REVIEW → DONE` (aprovação)
- `REVIEW → IN_PROGRESS` (rejeição)
- Qualquer outra transição

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente
```bash
# Copiar .env.example para .env e ajustar valores
cp .env.example .env
```

### 3. Criar database
```bash
npm run db:migrate
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/          # Autenticação (register, login, refresh, logout)
│   ├── users/         # Gerenciamento de usuários (ADMIN only)
│   └── tasks/         # CRUD de tasks + regras de movimentação
├── shared/
│   ├── config/        # Configurações (env)
│   ├── database/      # Conexão e migrations
│   ├── errors/        # Erros customizados
│   └── middlewares/   # Auth, error handler, rate limit
├── app.ts             # Configuração do Express
└── server.ts          # Inicialização do servidor
```

## 🏛️ Arquitetura

```
Request → Controller → Service → Repository → Database
              ↓           ↓
         Validação   Regras de      
         de input    negócio e
                     autorização
```

### Responsabilidades

- **Controller:** Recebe request, valida input, chama service, retorna response
- **Service:** Regras de negócio, autorização, orquestração
- **Repository:** Acesso direto ao banco (queries)

## 🔐 Sistema de Autenticação

### Endpoints

```
POST /api/auth/register  - Criar conta
POST /api/auth/login     - Login (retorna access + refresh token)
POST /api/auth/refresh   - Renovar access token
POST /api/auth/logout    - Logout (revoga refresh token)
```

### JWT Strategy

- **Access Token:** Vida curta (15min), usado em toda requisição
- **Refresh Token:** Vida longa (7 dias), armazenado no DB, rotacionado a cada uso

## 🧪 Testando a API

### 1. Criar primeiro ADMIN
```bash
POST /api/auth/register
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "senha123",
  "role": "ADMIN"
}
```

### 2. Login
```bash
POST /api/auth/login
{
  "email": "admin@test.com",
  "password": "senha123"
}
```

### 3. Usar access token nas requisições
```bash
Authorization: Bearer <seu_access_token>
```

## 📝 Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento com hot reload
npm run build      # Build para produção
npm run start      # Rodar build de produção
npm run db:migrate # Executar migrations
```

## 🎯 Objetivo do Projeto

Este é um projeto de portfólio focado em demonstrar:

- ✅ Domínio de autenticação e autorização
- ✅ Arquitetura limpa e escalável
- ✅ Regras de negócio bem definidas
- ✅ Controle de acesso granular (RBAC)
- ✅ Boas práticas de segurança
- ✅ Código explicável em entrevistas técnicas

---

**Status:** 🚧 Em desenvolvimento

