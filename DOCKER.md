# 🐳 Docker Setup - PostgreSQL

Este projeto usa Docker para rodar o PostgreSQL de forma isolada e fácil.

## 🚀 Início Rápido

### 1. Subir o PostgreSQL

```bash
# Subir o container
npm run docker:up

# Ou diretamente:
docker-compose up -d
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
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

# Server
PORT=3000
NODE_ENV=development
```

### 3. Rodar migrations

```bash
npm run db:migrate
```

### 4. Iniciar o servidor

```bash
npm run dev
```

## 📋 Comandos Úteis

```bash
# Subir PostgreSQL
npm run docker:up
docker-compose up -d

# Parar PostgreSQL
npm run docker:down
docker-compose down

# Ver logs do PostgreSQL
docker-compose logs -f postgres

# Acessar PostgreSQL via CLI
docker-compose exec postgres psql -U kanban_user -d kanban_db

# Ver status dos containers
docker-compose ps

# Remover tudo (volumes incluídos)
docker-compose down -v
```

## 🔧 Configuração do Docker Compose

O arquivo `docker-compose.yml` configura:

- **Imagem**: `postgres:15-alpine` (PostgreSQL 15, versão leve)
- **Porta**: `5432` (padrão PostgreSQL)
- **Volume**: Dados persistidos em `postgres_data`
- **Healthcheck**: Verifica se o PostgreSQL está pronto

### Personalizar

Edite o `docker-compose.yml` ou use variáveis de ambiente:

```bash
POSTGRES_USER=meu_user POSTGRES_PASSWORD=minha_senha docker-compose up -d
```

## 🗄️ Estrutura do Banco

O PostgreSQL será criado automaticamente com as seguintes tabelas:

- `users` - Usuários do sistema
- `tasks` - Tasks do Kanban
- `refresh_tokens` - Tokens de refresh JWT
- `audit_logs` - Logs de auditoria

## 🔍 Verificar Conexão

Após subir o container, você pode verificar a conexão:

```bash
# Via Docker
docker-compose exec postgres psql -U kanban_user -d kanban_db -c "SELECT version();"

# Ou usando o código (quando o servidor iniciar)
# A conexão será testada automaticamente
```

## ⚠️ Troubleshooting

### Erro: "Connection refused"

1. Verifique se o container está rodando:
   ```bash
   docker-compose ps
   ```

2. Verifique os logs:
   ```bash
   docker-compose logs postgres
   ```

3. Certifique-se de que a porta 5432 não está em uso:
   ```bash
   # Windows
   netstat -ano | findstr :5432
   
   # Linux/Mac
   lsof -i :5432
   ```

### Erro: "Database does not exist"

Execute as migrations:
```bash
npm run db:migrate
```

### Resetar o banco

```bash
# Parar e remover volumes
docker-compose down -v

# Subir novamente
docker-compose up -d

# Rodar migrations
npm run db:migrate
```

## 📦 Dados Persistidos

Os dados do PostgreSQL são salvos em um volume Docker chamado `postgres_data`. Mesmo que você remova o container, os dados permanecem.

Para remover completamente (incluindo dados):

```bash
docker-compose down -v
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: As credenciais padrão são apenas para desenvolvimento!

Para produção:
1. Use senhas fortes
2. Não commite o arquivo `.env`
3. Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
4. Configure SSL/TLS para conexões

