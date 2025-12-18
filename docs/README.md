# Documentação da API

Esta pasta contém a especificação OpenAPI da API em formato JSON e YAML.

## Arquivos

- `openapi.json` - Especificação OpenAPI 3.0 em formato JSON
- `openapi.yaml` - Especificação OpenAPI 3.0 em formato YAML

## Como visualizar a documentação

### Opção 1: Swagger UI local
Execute o servidor e acesse:
```
http://localhost:3000/api-docs
```

### Opção 2: Swagger Editor online
1. Acesse [Swagger Editor](https://editor.swagger.io/)
2. Cole o conteúdo do arquivo `openapi.yaml` ou `openapi.json`

### Opção 3: GitHub Pages (se configurado)
Se você configurar GitHub Pages, pode hospedar a documentação estática.

### Opção 4: Redoc
1. Acesse [Redoc](https://redocly.github.io/redoc/)
2. Use o arquivo `openapi.yaml` para gerar documentação visual

### Opção 5: Postman
1. Abra o Postman
2. Importe o arquivo `openapi.json`
3. A documentação será importada automaticamente

## Gerar/Atualizar documentação

Para gerar ou atualizar os arquivos de documentação:

```bash
npm run docs:generate
```

Isso irá:
- Ler as anotações JSDoc das rotas
- Gerar os arquivos `openapi.json` e `openapi.yaml` na pasta `docs/`

## Notas

- Os arquivos são gerados automaticamente a partir das anotações JSDoc nas rotas
- Sempre execute `npm run docs:generate` após alterar as rotas ou adicionar novos endpoints
- Os arquivos podem ser commitados no repositório para versionamento da documentação

