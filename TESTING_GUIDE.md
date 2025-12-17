# 🧪 Guia de Testes - Kanban Auth System

Este guia mostra como testar todas as funcionalidades do sistema passo a passo.

## 📋 Pré-requisitos

```bash
# 1. Instalar dependências
npm install

# 2. Criar banco de dados
npm run db:migrate

# 3. Iniciar servidor
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

---

## 🔐 Testes de Autenticação

### 1. Criar primeiro ADMIN

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Admin Principal",
  "email": "admin@kanban.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Resposta esperada:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin Principal",
      "email": "admin@kanban.com",
      "role": "ADMIN",
      "createdAt": "..."
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Criar um MEMBER

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "João Desenvolvedor",
  "email": "joao@kanban.com",
  "password": "joao123",
  "role": "MEMBER"
}
```

### 3. Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@kanban.com",
  "password": "admin123"
}
```

### 4. Refresh Token

```bash
POST http://localhost:3000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "SEU_REFRESH_TOKEN_AQUI"
}
```

### 5. Logout

```bash
POST http://localhost:3000/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "SEU_REFRESH_TOKEN_AQUI"
}
```

---

## 📝 Testes de Tasks

### Setup: Salvar o Access Token

Após o login, copie o `accessToken` e use em todas as requisições:

```
Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
```

### 1. Criar Task (ADMIN apenas)

```bash
POST http://localhost:3000/api/tasks
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN
Content-Type: application/json

{
  "title": "Implementar autenticação JWT",
  "description": "Criar sistema completo de auth com refresh token",
  "assignedTo": 2
}
```

### 2. Listar Tasks

```bash
# ADMIN vê todas as tasks
GET http://localhost:3000/api/tasks
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN

# MEMBER vê apenas tasks atribuídas a ele
GET http://localhost:3000/api/tasks
Authorization: Bearer SEU_ACCESS_TOKEN_MEMBER
```

### 3. Buscar Task por ID

```bash
GET http://localhost:3000/api/tasks/1
Authorization: Bearer SEU_ACCESS_TOKEN
```

### 4. Atualizar Task (ADMIN apenas)

```bash
PUT http://localhost:3000/api/tasks/1
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN
Content-Type: application/json

{
  "title": "Implementar autenticação JWT (atualizado)",
  "description": "Adicionar refresh token rotation"
}
```

### 5. Mover Task (Regras complexas)

#### MEMBER move: BACKLOG → IN_PROGRESS

```bash
PATCH http://localhost:3000/api/tasks/1/move
Authorization: Bearer SEU_ACCESS_TOKEN_MEMBER
Content-Type: application/json

{
  "newStatus": "IN_PROGRESS"
}
```

#### MEMBER move: IN_PROGRESS → REVIEW

```bash
PATCH http://localhost:3000/api/tasks/1/move
Authorization: Bearer SEU_ACCESS_TOKEN_MEMBER
Content-Type: application/json

{
  "newStatus": "REVIEW"
}
```

#### ❌ MEMBER NÃO PODE: REVIEW → DONE (Apenas ADMIN)

```bash
PATCH http://localhost:3000/api/tasks/1/move
Authorization: Bearer SEU_ACCESS_TOKEN_MEMBER
Content-Type: application/json

{
  "newStatus": "DONE"
}
```

**Resposta esperada:** `403 Forbidden`

#### ✅ ADMIN pode: REVIEW → DONE

```bash
PATCH http://localhost:3000/api/tasks/1/move
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN
Content-Type: application/json

{
  "newStatus": "DONE"
}
```

### 6. Deletar Task (ADMIN apenas)

```bash
DELETE http://localhost:3000/api/tasks/1
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN
```

---

## 👥 Testes de Usuários

### 1. Listar Usuários (ADMIN apenas)

```bash
GET http://localhost:3000/api/users
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN
```

### 2. Buscar Usuário por ID

```bash
GET http://localhost:3000/api/users/2
Authorization: Bearer SEU_ACCESS_TOKEN
```

### 3. Atualizar Usuário (ADMIN apenas)

```bash
PUT http://localhost:3000/api/users/2
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN
Content-Type: application/json

{
  "name": "João Silva Desenvolvedor",
  "role": "ADMIN"
}
```

### 4. Deletar Usuário (ADMIN apenas)

```bash
DELETE http://localhost:3000/api/users/2
Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN
```

---

## 🎯 Cenários de Teste Importantes

### Cenário 1: MEMBER tenta criar task

**Resultado esperado:** `403 Forbidden`

```bash
POST http://localhost:3000/api/tasks
Authorization: Bearer SEU_ACCESS_TOKEN_MEMBER
Content-Type: application/json

{
  "title": "Nova task",
  "description": "Teste"
}
```

### Cenário 2: MEMBER tenta mover task não atribuída a ele

**Resultado esperado:** `403 Forbidden`

```bash
PATCH http://localhost:3000/api/tasks/1/move
Authorization: Bearer SEU_ACCESS_TOKEN_MEMBER
Content-Type: application/json

{
  "newStatus": "IN_PROGRESS"
}
```

### Cenário 3: MEMBER tenta pular etapa (BACKLOG → REVIEW)

**Resultado esperado:** `400 Bad Request - Transição inválida`

```bash
PATCH http://localhost:3000/api/tasks/1/move
Authorization: Bearer SEU_ACCESS_TOKEN_MEMBER
Content-Type: application/json

{
  "newStatus": "REVIEW"
}
```

### Cenário 4: Token expirado

**Resultado esperado:** `401 Unauthorized - Token expirado`

Espere 15 minutos após o login e tente usar o access token.

### Cenário 5: Rate limit no login

**Resultado esperado:** `429 Too Many Requests`

Tente fazer login 6 vezes em menos de 15 minutos com credenciais erradas.

---

## 🔍 Verificar Database

```bash
# Abrir SQLite database
sqlite3 database.sqlite

# Ver usuários
SELECT * FROM users;

# Ver tasks
SELECT * FROM tasks;

# Ver refresh tokens
SELECT * FROM refresh_tokens;

# Ver audit logs
SELECT * FROM audit_logs;
```

---

## ✅ Checklist de Testes

- [ ] Registro de ADMIN e MEMBER
- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas (deve falhar)
- [ ] Refresh token válido
- [ ] Refresh token inválido/expirado (deve falhar)
- [ ] Logout revoga refresh token
- [ ] ADMIN cria task
- [ ] MEMBER não pode criar task (deve falhar)
- [ ] MEMBER move task atribuída a ele (BACKLOG → IN_PROGRESS)
- [ ] MEMBER não pode mover task de outro (deve falhar)
- [ ] MEMBER não pode aprovar (REVIEW → DONE) (deve falhar)
- [ ] ADMIN aprova task (REVIEW → DONE)
- [ ] ADMIN rejeita task (REVIEW → IN_PROGRESS)
- [ ] Transição inválida (deve falhar)
- [ ] Token expirado é rejeitado
- [ ] Rate limit funciona após 5 tentativas de login

---

## 🛠️ Ferramentas Recomendadas

- **Postman** ou **Insomnia**: Clientes REST com suporte a environments
- **VS Code REST Client**: Extensão para testar APIs direto no editor
- **curl**: Linha de comando para testes rápidos

### Exemplo com curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kanban.com","password":"admin123"}'

# Criar task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Nova task","assignedTo":2}'
```

---

## 📊 Fluxo Completo de Task

```
1. ADMIN cria task (status: BACKLOG)
2. ADMIN atribui task ao MEMBER
3. MEMBER move BACKLOG → IN_PROGRESS
4. MEMBER trabalha na task
5. MEMBER move IN_PROGRESS → REVIEW
6. ADMIN revisa e aprova: REVIEW → DONE
   OU
   ADMIN rejeita: REVIEW → IN_PROGRESS (volta para o MEMBER)
```

---

## 🎓 Para Entrevistas

Ao explicar este projeto em entrevistas, destaque:

1. **Arquitetura em camadas** (Controller → Service → Repository)
2. **Regras de negócio complexas** no Service (não no Controller)
3. **Segurança**: bcrypt, JWT, refresh token rotation, rate limiting
4. **Autorização granular**: RBAC com validações por role e ownership
5. **Validação de entrada** com Zod antes de processar
6. **Error handling** centralizado e consistente
7. **Database design** com foreign keys e índices
8. **Auditoria** para rastreabilidade (opcional mas profissional)

---

**Boa sorte com os testes! 🚀**

