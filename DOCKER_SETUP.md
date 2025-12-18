# 🐳 Docker Setup Completo

Este projeto está configurado para rodar completamente no Docker, incluindo a aplicação Node.js e o PostgreSQL.

## 🚀 Início Rápido

### Opção 1: Produção (Build + Start)

```bash
# Construir e iniciar tudo
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Parar tudo
docker-compose down
```

### Opção 2: Desenvolvimento (Hot Reload)

```bash
# Usar docker-compose.dev.yml para desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 📋 Comandos Úteis

```bash
# Construir imagens
docker-compose build

# Subir containers
docker-compose up -d

# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f app
docker-compose logs -f postgres

# Parar containers
docker-compose down

# Parar e remover volumes (limpar dados)
docker-compose down -v

# Reiniciar containers
docker-compose restart

# Executar comandos no container
docker-compose exec app npm run db:migrate
docker-compose exec app sh

# Acessar PostgreSQL
docker-compose exec postgres psql -U kanban_user -d kanban_db
```

## 🔧 Configuração

### Variáveis de Ambiente

O Docker Compose usa variáveis do arquivo `.env` ou valores padrão:

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL (dentro do Docker, use 'postgres' como host)
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=kanban_user
POSTGRES_PASSWORD=kanban_pass
POSTGRES_DB=kanban_db

# JWT
JWT_ACCESS_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
```

### Portas

- **API**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`
- **Swagger**: `http://localhost:3000/api-docs`

## 🏗️ Estrutura Docker

```
docker-compose.yml          # Produção
docker-compose.dev.yml      # Desenvolvimento (hot reload)
Dockerfile                  # Build produção
Dockerfile.dev              # Build desenvolvimento
.dockerignore               # Arquivos ignorados no build
```

## 🔍 Troubleshooting

### Porta 3000 em uso

```bash
# Parar processos Node.js locais
taskkill /F /IM node.exe

# Ou usar outra porta
# Edite docker-compose.yml: "3001:3000"
```

### Porta 5432 em uso

```bash
# Verificar containers
docker ps -a | findstr postgres

# Parar containers antigos
docker-compose down

# Ou usar outra porta
# Edite docker-compose.yml: "5433:5432"
```

### Rebuild completo

```bash
# Remover tudo e reconstruir
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Ver logs de erro

```bash
# Logs da aplicação
docker-compose logs app

# Logs do PostgreSQL
docker-compose logs postgres

# Logs de ambos
docker-compose logs -f
```

## ✅ Verificação

Após iniciar, verifique:

1. **Health Check**: `http://localhost:3000/health`
2. **Swagger Docs**: `http://localhost:3000/api-docs`
3. **Status dos containers**: `docker-compose ps`

Todos devem estar com status "Up" e "healthy".

