# 📋 Resumo Técnico do Projeto

## 🎯 Objetivo

Sistema Kanban auth-first com controle de acesso granular, focado em demonstrar expertise em:
- Autenticação e autorização
- Arquitetura limpa e escalável
- Regras de negócio complexas
- Boas práticas de backend

---

## ✅ O que foi Implementado

### 🔐 Autenticação Completa

- [x] **Registro de usuários** com hash bcrypt (10 rounds)
- [x] **Login** com validação de credenciais
- [x] **JWT Access Token** (vida curta: 15min)
- [x] **JWT Refresh Token** (vida longa: 7 dias)
- [x] **Refresh Token Rotation** (token usado é revogado e novo é gerado)
- [x] **Logout** com revogação de refresh token
- [x] **Rate Limiting** no login (5 tentativas em 15min)
- [x] Middleware `authenticate` para proteger rotas
- [x] Middleware `authorize` para verificar roles

### 🎭 Sistema de Autorização (RBAC)

#### ADMIN pode:
- [x] Criar tasks
- [x] Editar tasks (título, descrição, atribuição)
- [x] Deletar tasks
- [x] Mover tasks entre qualquer status
- [x] Fazer transições exclusivas (REVIEW → DONE, REVIEW → IN_PROGRESS)
- [x] Gerenciar usuários (listar, editar, deletar)
- [x] Ver todas as tasks do sistema

#### MEMBER pode:
- [x] Ver tasks atribuídas a ele
- [x] Mover tasks atribuídas (apenas transições permitidas)
- [x] Transições: BACKLOG → IN_PROGRESS, IN_PROGRESS → REVIEW
- [x] Ver seus próprios dados

#### MEMBER NÃO pode:
- [x] Criar, editar ou deletar tasks
- [x] Mover tasks não atribuídas a ele
- [x] Fazer transições exclusivas de ADMIN
- [x] Pular etapas no fluxo (ex: BACKLOG → REVIEW)
- [x] Gerenciar outros usuários

### 📊 Fluxo de Status (Kanban)

```
BACKLOG → IN_PROGRESS → REVIEW → DONE
```

- [x] Toda task nasce em **BACKLOG**
- [x] Validação de transições no service
- [x] Transições exclusivas de ADMIN identificadas
- [x] **DONE** é status final (não pode mover)
- [x] Mensagens de erro claras para transições inválidas

### 🗄️ Database (SQLite)

- [x] Tabela `users` com role (ADMIN/MEMBER)
- [x] Tabela `tasks` com status e foreign keys
- [x] Tabela `refresh_tokens` para rotação
- [x] Tabela `audit_logs` para rastreabilidade (opcional)
- [x] Foreign keys com CASCADE e SET NULL
- [x] Índices em campos frequentemente buscados
- [x] CHECK constraints para validação de dados

### 🏗️ Arquitetura

- [x] Estrutura modular por domínio (auth, tasks, users)
- [x] Separação em 3 camadas: Controller → Service → Repository
- [x] Controllers finos (apenas validação e chamada ao service)
- [x] Services com regras de negócio e autorização
- [x] Repositories apenas com queries SQL
- [x] Error handling centralizado com `AppError`
- [x] Async handler para capturar erros de promises
- [x] Validação de input com Zod

### 🛡️ Segurança

- [x] Senhas hasheadas com bcrypt
- [x] JWT assinado com secret
- [x] Access token de vida curta
- [x] Refresh token com rotação
- [x] Refresh token armazenado no banco (pode ser revogado)
- [x] Rate limiting para prevenir força bruta
- [x] Validação de input para prevenir injection
- [x] Erros não vazam detalhes internos
- [x] Foreign keys para integridade referencial

### 📝 Validação

- [x] Zod schemas para todas as entradas
- [x] Validação de email, senha, campos obrigatórios
- [x] Validação de transições de status
- [x] Validação de ownership (MEMBER só move suas tasks)
- [x] Validação de existência (usuário assignedTo existe?)

### 🧪 Preparado para Testes

- [x] Guia completo de testes (`TESTING_GUIDE.md`)
- [x] Cenários de sucesso e falha documentados
- [x] Endpoints de health check
- [x] Estrutura facilita testes unitários

### 📚 Documentação

- [x] README completo com setup e uso
- [x] ARCHITECTURE.md explicando decisões técnicas
- [x] TESTING_GUIDE.md com todos os cenários
- [x] WINDOWS_SETUP.md para problemas de instalação
- [x] Comentários explicativos em código crítico

---

## 🎓 Decisões Técnicas e Justificativas

### 1. Por que SQLite?

**Escolha:** SQLite com `better-sqlite3`

**Justificativa:**
- ✅ Zero configuração
- ✅ Ideal para portfólio (fácil rodar)
- ✅ Síncrono (sem await no repository)
- ✅ Embutido no projeto
- ❌ Não escalável para produção (mas pode trocar por PostgreSQL)

### 2. Por que separar Access e Refresh Token?

**Escolha:** Access Token (15min) + Refresh Token (7 dias)

**Justificativa:**
- ✅ Segurança: Access token roubado expira rápido
- ✅ UX: Usuário não precisa fazer login toda hora
- ✅ Controle: Refresh token pode ser revogado
- ✅ Rotação: Refresh usado vira novo (previne replay attacks)

### 3. Por que Zod em vez de class-validator?

**Escolha:** Zod para validação

**Justificativa:**
- ✅ TypeScript-first (inferência de tipos)
- ✅ Leve e sem decorators
- ✅ Mensagens de erro customizáveis
- ✅ Validação funcional (não precisa de classes)

### 4. Por que regras de negócio no Service?

**Escolha:** Controller fino, Service gordo

**Justificativa:**
- ✅ Controllers reutilizáveis (CLI, GraphQL, etc.)
- ✅ Regras testáveis isoladamente
- ✅ Lógica não depende de HTTP
- ✅ Arquitetura limpa e escalável

### 5. Por que não usar ORM?

**Escolha:** SQL puro com `better-sqlite3`

**Justificativa:**
- ✅ Controle total sobre queries
- ✅ Performance previsível
- ✅ Aprende SQL de verdade
- ✅ Sem "magic" de ORM
- ❌ Mais verboso (mas mais explícito)

### 6. Por que middleware de autorização E validação no service?

**Escolha:** Dupla validação

**Justificativa:**
- ✅ Middleware bloqueia rápido (menos processamento)
- ✅ Service valida regras complexas (ownership, transições)
- ✅ Defense in depth (segurança em camadas)
- ✅ Service pode ser usado fora de HTTP

---

## 🚀 Como Explicar em Entrevista

### Pergunta: "Como funciona a autenticação?"

**Resposta:**
> "Uso JWT com dois tokens: um Access Token de vida curta (15min) para requisições, e um Refresh Token de vida longa (7 dias) armazenado no banco. Quando o Access Token expira, o cliente usa o Refresh Token para gerar um novo par. Implementei Refresh Token Rotation: cada vez que um Refresh Token é usado, ele é revogado e um novo é gerado, prevenindo replay attacks. As senhas são hasheadas com bcrypt usando 10 rounds."

### Pergunta: "Como você controla o que cada usuário pode fazer?"

**Resposta:**
> "Implementei autorização em 3 níveis:
> 1. **Role-based**: Middleware `authorize` verifica se o usuário tem a role necessária
> 2. **Ownership**: No service, verifico se o usuário é dono do recurso (ex: MEMBER só move tasks atribuídas a ele)
> 3. **State-based**: Para movimentação de tasks, validoto se a transição é permitida no fluxo E se o usuário tem permissão para fazer aquela transição específica (ex: só ADMIN pode fazer REVIEW → DONE)"

### Pergunta: "Por que separar em Controller, Service e Repository?"

**Resposta:**
> "Separação de responsabilidades e testabilidade. O Controller é fino, apenas valida entrada e formata saída. O Service contém TODAS as regras de negócio e autorização. O Repository só faz queries SQL. Isso me permite:
> - Testar regras de negócio sem HTTP
> - Reutilizar services em CLI ou GraphQL
> - Trocar o banco sem mexer nas regras
> - Adicionar novos endpoints sem duplicar lógica"

### Pergunta: "Como você previne ataques de força bruta?"

**Resposta:**
> "Implementei rate limiting com `express-rate-limit` especificamente na rota de login, limitando a 5 tentativas a cada 15 minutos por IP. Além disso, uso bcrypt com 10 rounds para hash de senha (lento por design), JWT com expiração curta, e mensagens de erro genéricas ('Credenciais inválidas') para não revelar se o email existe."

### Pergunta: "Como você garante que um MEMBER não pule etapas?"

**Resposta:**
> "No service de tasks, tenho um mapa `ALLOWED_TRANSITIONS` que define quais transições são válidas (ex: BACKLOG só pode ir para IN_PROGRESS). Também tenho `ADMIN_ONLY_TRANSITIONS` para transições exclusivas. Quando um MEMBER tenta mover, valido:
> 1. Se a transição está no mapa de transições permitidas
> 2. Se não é uma transição ADMIN-only
> 3. Se a task está atribuída a ele
> Se qualquer validação falhar, lanço um AppError com mensagem específica."

---

## 📊 Métricas do Projeto

- **Arquivos TypeScript:** ~30
- **Linhas de código:** ~2000
- **Módulos:** 3 (auth, tasks, users)
- **Endpoints:** ~15
- **Tabelas:** 4
- **Middlewares:** 4
- **Testes:** Preparado (estrutura facilita)

---

## 🎯 Próximos Passos (Expansão Futura)

### Funcionalidades
- [ ] Comentários em tasks
- [ ] Anexos em tasks
- [ ] Histórico de movimentações (usando audit_logs)
- [ ] Notificações (email/push)
- [ ] Dashboard com métricas
- [ ] Filtros avançados (por status, usuário, data)
- [ ] Paginação nas listagens

### Técnico
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] CI/CD (GitHub Actions)
- [ ] Trocar SQLite por PostgreSQL
- [ ] Cache com Redis
- [ ] Logging estruturado (Winston)
- [ ] Monitoramento (Prometheus + Grafana)
- [ ] API documentation (Swagger)
- [ ] Docker + Docker Compose
- [ ] Deploy (Heroku/Railway/Fly.io)

---

## 🏆 Diferenciais deste Projeto

1. ✅ **Autorização GRANULAR**: Não é só "admin ou não", tem regras complexas
2. ✅ **Refresh Token Rotation**: Segurança além do básico
3. ✅ **Arquitetura Limpa**: Escalável e testável
4. ✅ **Regras de Negócio Claras**: Fluxo de tasks bem definido
5. ✅ **Documentação Profissional**: Explicações técnicas detalhadas
6. ✅ **Production-Ready**: Rate limiting, error handling, validações
7. ✅ **Explicável**: Cada decisão tem justificativa

---

## 💼 Para o Portfólio

### Highlights

- "Sistema Kanban com **controle de acesso granular** usando RBAC"
- "Autenticação JWT com **Refresh Token Rotation** para segurança"
- "Arquitetura em camadas (Controller → Service → Repository)"
- "Regras de negócio complexas para **transições de estado**"
- "Autorização em 3 níveis: Role, Ownership e State-based"

### GitHub README Badge Ideas

```markdown
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
```

---

**Este projeto demonstra domínio de backend profissional e está pronto para ser apresentado em entrevistas técnicas.** 🚀

