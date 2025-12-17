# 🪟 Instalação no Windows

## ❗ Problema com better-sqlite3

O pacote `better-sqlite3` requer compilação de módulos nativos e precisa de:
- Python 3.x
- Visual Studio Build Tools

## 🛠️ Soluções

### Opção 1: Instalar dependências de build (Recomendado)

```powershell
# Instalar ferramentas de build do Windows (como administrador)
npm install --global windows-build-tools
```

Ou instalar manualmente:
1. **Python 3.x**: https://www.python.org/downloads/
2. **Visual Studio Build Tools**: https://visualstudio.microsoft.com/downloads/ (procure por "Build Tools for Visual Studio")

Depois:
```powershell
npm install
```

### Opção 2: Usar versão pré-compilada

Se a Opção 1 falhar, você pode tentar:

```powershell
# Limpar cache
npm cache clean --force

# Instalar com flag para baixar binários pré-compilados
npm install --build-from-source=false
```

### Opção 3: Trocar para PostgreSQL/MySQL

Se nenhuma das opções acima funcionar, você pode modificar o projeto para usar PostgreSQL ou MySQL, que não precisam de compilação:

1. Trocar `better-sqlite3` por `pg` (PostgreSQL) ou `mysql2` (MySQL)
2. Ajustar queries SQL para o banco escolhido
3. Instalar o banco de dados localmente

## ✅ Verificar se instalou corretamente

```powershell
node -e "console.log(require('better-sqlite3'))"
```

Se não houver erros, está funcionando!

## 🐧 Alternativa: Usar WSL

Se estiver tendo muitos problemas no Windows, considere usar WSL (Windows Subsystem for Linux):

```powershell
wsl --install
```

Depois, dentro do WSL:
```bash
cd /mnt/c/Users/VC/Documents/kanban
npm install
npm run dev
```

---

**Após a instalação bem-sucedida, continue com o README.md principal.**

