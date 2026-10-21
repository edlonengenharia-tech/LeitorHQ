# 🚀 AutoComix - Início Rápido

## Instalação Completa

```bash
# 1. Instalar dependências
npm install

# 2. Verificar instalação (opcional)
node check-installation.js
```

## Como Rodar

### 🌐 Versão Web (Navegador)

```bash
# Desenvolvimento com hot-reload
npm run dev

# Acesse: http://localhost:5173
```

### 🖥️ Versão Desktop (Electron)

```bash
# Modo desenvolvimento (com hot-reload)
node dev-electron.js

# Modo produção
npm run build
node start-electron.js
```

## Criar Instalador

```bash
# Build completo + empacotamento
node build-electron.js

# Os instaladores serão criados na pasta release/
```

## Abrindo Quadrinhos

### No Navegador
- Clique em "Start Reading Demo" para ver o exemplo
- Arraste e solte arquivos/pastas

### No Desktop
- `Ctrl+O` - Abrir arquivo (.cbz, .cbr, .cb7)
- `Ctrl+Shift+O` - Abrir pasta de imagens
- Arraste e solte arquivos

## Atalhos Principais

| Tecla | Ação |
|-------|------|
| `→` / `Space` | Próximo |
| `←` | Anterior |
| `F` | Tela cheia |
| `T` | Miniaturas |
| `H` | Ajuda |
| `R` | Modo mangá |
| `M` | Lupa |
| `E` | Editar painéis |

## Problemas Comuns

### CBR não abre?
```bash
# macOS
brew install unrar

# Linux
sudo apt-get install unrar

# Windows
# Instale WinRAR ou unrar
```

### CB7 não abre?
```bash
# macOS
brew install p7zip

# Linux
sudo apt-get install p7zip-full

# Windows
# Instale 7-Zip
```

### Electron não inicia?
```bash
rm -rf node_modules
npm install
```

## Documentação Completa

- [README.md](README.md) - Documentação principal
- [INSTALL.md](INSTALL.md) - Guia de instalação detalhado
- [README-ELECTRON.md](README-ELECTRON.md) - Documentação Electron

## Scripts Disponíveis

```bash
npm run dev              # Servidor web de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build

node dev-electron.js     # Electron com hot-reload
node start-electron.js   # Electron em produção
node build-electron.js   # Criar instaladores
node check-installation.js # Verificar instalação
```

## Suporte

Para problemas e sugestões:
- GitHub: https://github.com/SorbP/AutoComix/issues

---

**Pronto para ler quadrinhos! 📚**
