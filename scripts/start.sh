#!/bin/bash

echo "🚀 Iniciando Kanban API..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Subindo PostgreSQL...${NC}"
docker-compose up -d

echo -e "${YELLOW}⏳ Aguardando PostgreSQL estar pronto...${NC}"
sleep 5

# Aguardar PostgreSQL estar pronto
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U kanban_user > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL está pronto!${NC}"
        break
    fi
    attempt=$((attempt + 1))
    echo -e "${YELLOW}   Tentativa $attempt/$max_attempts...${NC}"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}❌ PostgreSQL não ficou pronto a tempo${NC}"
    exit 1
fi

echo -e "${YELLOW}🗄️  Rodando migrations...${NC}"
npm run db:migrate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao rodar migrations${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Migrations concluídas!${NC}"
echo ""
echo -e "${GREEN}🚀 Iniciando servidor...${NC}"
echo ""

npm run dev

