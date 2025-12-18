# 👑 Como Virar Admin

Existem **3 formas** de criar um usuário admin:

## 🎯 Opção 1: Via Script (Mais Fácil) ✅

```bash
npm run create:admin "Seu Nome" seu@email.com suaSenha123
```

**Exemplo:**
```bash
npm run create:admin "João Admin" joao@admin.com senha123
```

## 🎯 Opção 2: Via API (Swagger ou Postman)

1. Acesse: http://localhost:3000/api-docs
2. Vá em **POST /api/auth/register**
3. Clique em "Try it out"
4. Preencha o JSON:

```json
{
  "name": "Seu Nome",
  "email": "seu@email.com",
  "password": "suaSenha123",
  "role": "ADMIN"
}
```

5. Clique em "Execute"

## 🎯 Opção 3: Via Frontend

1. Acesse: http://localhost:5173
2. Clique em "Registrar"
3. Preencha o formulário
4. **Importante:** O frontend não permite escolher role no registro (por segurança)
5. Use a **Opção 1** ou **Opção 2** para criar admin

## 🔄 Converter Usuário Existente para Admin

Se você já tem uma conta MEMBER e quer virar ADMIN:

### Via SQL (Direto no Banco)

```sql
-- Conectar ao PostgreSQL
docker-compose exec postgres psql -U kanban_user -d kanban_db

-- Atualizar role
UPDATE users SET role = 'ADMIN' WHERE email = 'seu@email.com';
```

### Via Script (Criar novo admin)

Se você não tem acesso ao banco, crie um novo admin usando a **Opção 1** e depois delete o usuário antigo se necessário.

## ✅ Verificar se é Admin

Após fazer login, verifique:
- No frontend: aparece "(ADMIN)" ao lado do seu nome
- No token JWT: decode o token e verifique o campo `role`

## 🔐 Segurança

**Importante:** Em produção, você deve:
- Restringir criação de admins apenas via script ou endpoint protegido
- Não permitir que qualquer um se registre como ADMIN
- Usar autenticação adicional para criar admins

## 📝 Notas

- Por padrão, novos registros são criados como **MEMBER**
- Apenas **ADMIN** pode criar, editar e deletar tasks
- **MEMBER** só pode visualizar e mover tasks atribuídas a ele

