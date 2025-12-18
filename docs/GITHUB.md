# Como usar a documentação no GitHub

## Opções para visualizar a documentação

### 1. **Swagger Editor (Recomendado - Mais fácil)**

1. Acesse [https://editor.swagger.io/](https://editor.swagger.io/)
2. Abra o arquivo `openapi.yaml` do repositório
3. Cole o conteúdo no editor
4. A documentação será renderizada automaticamente

### 2. **GitHub Pages (Hospedagem própria)**

Se você quiser hospedar a documentação no GitHub Pages:

1. Crie um arquivo `index.html` na pasta `docs/`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Kanban API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: "./openapi.json",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ]
      });
    };
  </script>
</body>
</html>
```

2. No GitHub, vá em **Settings > Pages**
3. Selecione a branch `main` e pasta `docs/`
4. A documentação estará disponível em: `https://seu-usuario.github.io/projetooo/`

### 3. **Badge no README**

Adicione um badge no README principal:

```markdown
[![API Documentation](https://img.shields.io/badge/docs-openapi-blue)](./docs/openapi.yaml)
```

### 4. **Link direto para Swagger Editor**

Adicione no README:

```markdown
📚 [Visualizar documentação no Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/takezo-code/projetooo/main/docs/openapi.yaml)
```

### 5. **Postman**

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `openapi.json`
4. A coleção será importada com todos os endpoints documentados

### 6. **Insomnia**

1. Abra o Insomnia
2. Clique em **Create > Import > From File**
3. Selecione o arquivo `openapi.json`

## Atualizar documentação

Sempre que alterar as rotas ou adicionar novos endpoints:

```bash
npm run docs:generate
git add docs/
git commit -m "docs: atualizar documentação da API"
git push
```

## Vantagens de ter no GitHub

✅ **Versionamento**: Histórico de mudanças na API  
✅ **Colaboração**: Outros desenvolvedores podem ver a documentação  
✅ **Integração**: Ferramentas podem importar automaticamente  
✅ **Backup**: Documentação sempre disponível  
✅ **CI/CD**: Pode gerar automaticamente em pipelines

