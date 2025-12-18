# 🔍 Troubleshooting - Frontend em Branco

## Verificações Rápidas

### 1. Verificar se o servidor está rodando
```bash
# Verificar porta 5173
netstat -ano | findstr :5173
```

### 2. Verificar console do navegador
- Abra o DevTools (F12)
- Vá na aba "Console"
- Procure por erros em vermelho

### 3. Verificar Network
- Abra o DevTools (F12)
- Vá na aba "Network"
- Recarregue a página (F5)
- Verifique se os arquivos estão carregando

### 4. Limpar cache do navegador
- Pressione Ctrl+Shift+Delete
- Limpe cache e cookies
- Ou use modo anônimo (Ctrl+Shift+N)

### 5. Verificar se a API está respondendo
```bash
# Testar health check
Invoke-WebRequest -Uri "http://localhost:3000/health"
```

## Soluções Comuns

### Problema: Página completamente branca
**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros JavaScript
3. Se houver erro de CORS, verifique se o backend está rodando
4. Tente recarregar a página (Ctrl+F5 para hard refresh)

### Problema: "Cannot GET /"
**Solução:**
- O servidor Vite não está rodando
- Execute: `cd frontend && npm run dev`

### Problema: Erro de conexão com API
**Solução:**
- Verifique se o backend está rodando: `docker-compose ps`
- Verifique se a porta 3000 está livre
- Verifique o proxy no `vite.config.ts`

### Problema: Erro de módulo não encontrado
**Solução:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## Debug

Para ver logs no console:
1. Abra o DevTools (F12)
2. Vá na aba "Console"
3. Você deve ver: "Auth status: false" ou "Auth status: true"

Se não ver nada, o React não está renderizando.

