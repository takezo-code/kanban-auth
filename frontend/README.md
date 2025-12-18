# 🎨 Frontend - Kanban Board

Frontend React + TypeScript para o sistema Kanban.

## 🚀 Como Rodar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

### Build para Produção

```bash
npm run build
```

Os arquivos serão gerados em `dist/`

## 📋 Funcionalidades

- ✅ Login e Registro
- ✅ Board Kanban visual
- ✅ Criar tasks (ADMIN)
- ✅ Mover tasks entre colunas
- ✅ Visualizar tasks atribuídas (MEMBER)
- ✅ Gerenciar todas as tasks (ADMIN)
- ✅ Interface responsiva

## 🔧 Configuração

O frontend está configurado para se conectar ao backend em `http://localhost:3000` via proxy do Vite.

Se o backend estiver em outra porta, edite `vite.config.ts`:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000', // Altere aqui
    changeOrigin: true,
  },
}
```

## 📁 Estrutura

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── TaskCard.tsx
│   │   └── CreateTaskModal.tsx
│   ├── services/       # Serviços de API
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── task.service.ts
│   │   └── user.service.ts
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entry point
```
