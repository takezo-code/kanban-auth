# 🚀 Guia Rápido - Como Rodar o Projeto

## 🎯 Opção Mais Fácil: Tudo de Uma Vez

```bash
# Inicia Backend (Docker) + Frontend automaticamente
npm run start:all
```

Isso irá:
- ✅ Verificar Docker
- ✅ Subir PostgreSQL + API no Docker
- ✅ Aguardar backend estar pronto
- ✅ Iniciar frontend
- ✅ Abrir tudo automaticamente

**Acesse:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

---

## ⚠️ IMPORTANTE: Escolha UMA opção

**NÃO rode Docker E local ao mesmo tempo** - ambos usam a porta 3000!

---

## Opção 1: Docker (Recomendado - Mais Fácil) ✅

### Se o Docker já está rodando:

```bash
# Verificar status
docker-compose ps

# Se estiver rodando, já está pronto!
# Acesse: http://localhost:3000/api-docs
```

### Se precisar iniciar:

```bash
# Subir tudo de uma vez
docker-compose up -d --build
```

Isso irá:
- ✅ Construir a imagem da aplicação
- ✅ Subir PostgreSQL
- ✅ Rodar migrations automaticamente
- ✅ Iniciar a API

### Acessar

- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Comandos úteis

```bash
# Parar tudo
docker-compose down

# Reiniciar
docker-compose restart

# Ver logs em tempo real
docker-compose logs -f

# Parar e limpar tudo (remove dados)
docker-compose down -v
```

---

## Opção 2: Local (Desenvolvimento)

### ⚠️ PRIMEIRO: Parar o container da API

```bash
# Parar apenas o container da API (mantém PostgreSQL)
docker-compose stop app

# OU parar tudo
docker-compose down
```

### Passo 1: Subir apenas PostgreSQL no Docker

```bash
docker-compose up -d postgres
```

### Passo 2: Configurar .env

Crie um arquivo `.env` na raiz:

```env
PORT=3000
NODE_ENV=development

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=kanban_user
POSTGRES_PASSWORD=kanban_pass
POSTGRES_DB=kanban_db
DATABASE_URL=postgresql://kanban_user:kanban_pass@localhost:5432/kanban_db

JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Passo 3: Instalar dependências e rodar

```bash
npm install
npm run db:migrate
npm run dev
```

---

## 🎯 Resumo dos Comandos

### Docker (Tudo)
```bash
docker-compose up -d --build    # Iniciar
docker-compose down             # Parar
docker-compose logs -f app      # Ver logs
docker-compose ps               # Status
```

### Local (Apenas PostgreSQL no Docker)
```bash
docker-compose up -d postgres   # Subir PostgreSQL
npm run db:migrate              # Migrations
npm run dev                     # Iniciar API
```

---

## ✅ Verificação

Após iniciar, teste:

1. **Health Check**: http://localhost:3000/health
   - Deve retornar: `{"status":"ok","timestamp":"..."}`

2. **Swagger**: http://localhost:3000/api-docs
   - Deve abrir a documentação interativa

3. **Teste de registro** (via Swagger ou Postman):
   ```json
   POST http://localhost:3000/api/auth/register
   {
     "name": "Admin",
     "email": "admin@test.com",
     "password": "senha123",
     "role": "ADMIN"
   }
   ```

---

## 🆘 Problemas Comuns

### Porta 3000 em uso
```bash
# Parar processos Node.js
taskkill /F /IM node.exe

# Ou usar outra porta (edite docker-compose.yml)
```

### Porta 5432 em uso
```bash
# Parar containers antigos
docker-compose down

# Ou verificar o que está usando
npm run fix:port
```

### Erro de conexão com PostgreSQL
```bash
# Verificar se container está rodando
docker-compose ps

# Ver logs do PostgreSQL
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres
```
