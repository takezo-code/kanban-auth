# 🔄 Plano de Reorganização: Estrutura por Camadas

## 📊 Estrutura ATUAL vs NOVA

### ATUAL (Modular)
```
src/modules/auth/auth.controller.ts
src/modules/auth/auth.service.ts
src/modules/auth/auth.repository.ts
```

### NOVA (Por Camadas) ✨
```
src/controllers/auth.controller.ts
src/services/auth.service.ts
src/repositories/auth.repository.ts
src/utils/jwt.util.ts
src/utils/hash.util.ts
```

---

## 🎯 Nova Estrutura Completa

```
src/
├── controllers/              ← Todos os controllers
│   ├── auth.controller.ts
│   ├── task.controller.ts
│   └── user.controller.ts
│
├── services/                 ← Todos os services
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── user.service.ts
│
├── repositories/             ← Todos os repositories
│   ├── auth.repository.ts
│   ├── task.repository.ts
│   └── user.repository.ts
│
├── routes/                   ← Todas as rotas
│   ├── auth.routes.ts
│   ├── task.routes.ts
│   └── user.routes.ts
│
├── types/                    ← Types e DTOs
│   ├── auth.types.ts
│   ├── task.types.ts
│   └── user.types.ts
│
├── validations/              ← Schemas de validação
│   ├── auth.validation.ts
│   ├── task.validation.ts
│   └── user.validation.ts
│
├── utils/                    ← Funções utilitárias
│   ├── jwt.util.ts          ← Helpers de JWT
│   ├── hash.util.ts         ← Helpers de bcrypt
│   ├── date.util.ts         ← Helpers de data
│   └── response.util.ts     ← Formatação de respostas
│
├── middlewares/              ← Middlewares Express
│   ├── authenticate.ts
│   ├── authorize.ts
│   ├── errorHandler.ts
│   ├── asyncHandler.ts
│   └── rateLimit.ts
│
├── database/                 ← Database
│   ├── connection.ts
│   └── migrate.ts
│
├── config/                   ← Configurações
│   └── env.ts
│
├── errors/                   ← Erros customizados
│   └── AppError.ts
│
├── app.ts                    ← Configuração Express
└── server.ts                 ← Inicialização
```

---

## ✅ Vantagens da Nova Estrutura

1. ✅ **Mais explícita**: Vê claramente onde está cada coisa
2. ✅ **Tradicional**: Padrão conhecido por muitos devs
3. ✅ **Fácil navegação**: "Quero ver todos os controllers? → controllers/"
4. ✅ **Organização clara**: Cada tipo de arquivo tem sua pasta
5. ✅ **Utils separados**: Funções utilitárias em lugar próprio

---

## 🔧 Mudanças Necessárias

### 1. Mover arquivos
- `modules/*/controller.ts` → `controllers/*.controller.ts`
- `modules/*/service.ts` → `services/*.service.ts`
- `modules/*/repository.ts` → `repositories/*.repository.ts`
- `modules/*/routes.ts` → `routes/*.routes.ts`
- `modules/*/types.ts` → `types/*.types.ts`
- `modules/*/validation.ts` → `validations/*.validation.ts`

### 2. Criar pasta utils/
- Extrair helpers de JWT para `utils/jwt.util.ts`
- Extrair helpers de hash para `utils/hash.util.ts`

### 3. Atualizar imports
- Todos os imports precisam ser atualizados
- Exemplo: `@modules/auth/auth.service` → `@services/auth.service`

### 4. Atualizar tsconfig.json paths
```json
{
  "paths": {
    "@controllers/*": ["./controllers/*"],
    "@services/*": ["./services/*"],
    "@repositories/*": ["./repositories/*"],
    "@utils/*": ["./utils/*"],
    "@shared/*": ["./shared/*"]
  }
}
```

---

## 🚀 Quer que eu faça a reorganização?

Posso:
1. ✅ Mover todos os arquivos
2. ✅ Criar pasta utils/ com helpers
3. ✅ Atualizar todos os imports
4. ✅ Atualizar tsconfig.json
5. ✅ Testar que tudo funciona

**Devo prosseguir?** 🤔

