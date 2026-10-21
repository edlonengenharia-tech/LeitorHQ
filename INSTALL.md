# AutoComix - Guia de Instalação Electron

## Instalação Rápida

### 1. Instalar Dependências

```bash
npm install
```

### 2. Modo Desenvolvimento

Para rodar com hot-reload (desenvolvimento):

```bash
node dev-electron.js
```

### 3. Modo Produção

Para rodar a versão de produção:

```bash
npm run build
node start-electron.js
```

### 4. Criar Instalador

Para criar pacotes distribuíveis:

```bash
node build-electron.js
```

Os instaladores serão criados na pasta `release/`:
- **Windows**: `AutoComix Setup X.X.X.exe` (instalador) e `AutoComix X.X.X.exe` (portátil)
- **macOS**: `AutoComix-X.X.X.dmg`
- **Linux**: `AutoComix-X.X.X.AppImage` e `auto-comix_X.X.X_amd64.deb`

## Requisitos

### Para Desenvolvimento
- Node.js 16+ 
- npm ou yarn

### Para Usuários Finais
- Windows 10/11 (64-bit)
- macOS 10.13+ (Intel ou Apple Silicon)
- Linux (64-bit, glibc 2.17+)

### Para Abrir CBR/RAR
- **Windows**: Instalar [WinRAR](https://www.rarlab.com/rar_add.htm) ou `unrar`
- **macOS**: `brew install unrar`
- **Linux**: `sudo apt-get install unrar`

### Para Abrir CB7/7z
- **Windows**: Instalar [7-Zip](https://www.7-zip.org/)
- **macOS**: `brew install p7zip`
- **Linux**: `sudo apt-get install p7zip-full`

## Estrutura do Projeto

```
autocomix/
├── electron/              # Processo principal do Electron
│   ├── main.js           # Entry point do Electron
│   ├── preload.js        # Script de preload (segurança)
│   └── fileHandler.js    # Manipulação de arquivos
├── src/                   # Código React (processo de renderização)
│   ├── App.tsx           # Componente principal
│   ├── components/       # Componentes React
│   ├── hooks/            # Hooks personalizados
│   └── types.ts          # Tipos TypeScript
├── dist/                 # Build do Vite (gerado)
├── release/              # Pacotes distribuíveis (gerado)
├── dev-electron.js       # Script de desenvolvimento
├── start-electron.js     # Script de produção
├── build-electron.js     # Script de build
└── electron-builder.json # Configuração do electron-builder
```

## Comandos Úteis

```bash
# Desenvolvimento
node dev-electron.js          # Rodar com hot-reload

# Produção
npm run build                 # Build do Vite
node start-electron.js        # Rodar versão de produção

# Build
node build-electron.js        # Criar instaladores

# Limpeza
rm -rf dist release           # Limpar builds
```

## Troubleshooting

### Electron não inicia
```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Build falha
```bash
# Limpar cache e rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problemas no Windows
- Certifique-se de ter o [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe) instalado
- Execute o PowerShell como Administrador se necessário

### Problemas no macOS
- Pode ser necessário permitir o app em "Segurança e Privacidade"
- Use `xattr -cr release/AutoComix*.dmg` se houver problemas de quarentena

### Problemas no Linux
- Instale dependências: `sudo apt-get install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libuuid1 libsecret-1-0`
- Para AppImage: `chmod +x release/AutoComix*.AppImage`

## Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| `→` / `Space` | Próximo painel/página |
| `←` | Painel/página anterior |
| `F` | Tela cheia |
| `T` | Navegador de miniaturas |
| `H` | Ajuda |
| `I` | Barra de informações |
| `R` | Modo mangá (direita para esquerda) |
| `M` | Lupa |
| `G` | Modo guiado |
| `E` | Editar painéis |
| `1-4` | Modo de ajuste |
| `Ctrl+O` | Abrir arquivo |
| `Ctrl+Shift+O` | Abrir pasta |
| `Ctrl+B` | Marcador |
| `Esc` | Sair da tela cheia |

## Suporte

Para problemas e sugestões:
- GitHub Issues: https://github.com/SorbP/AutoComix/issues
- Documentação: README-ELECTRON.md

## Licença

AGPL-3.0 - Código aberto
