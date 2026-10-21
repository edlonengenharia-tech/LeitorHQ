# 🎨 AutoComix

Leitor de quadrinhos com zoom automático painel por painel, construído com React + Electron.

![AutoComix](https://img.shields.io/badge/version-2.20.0-blue) ![License](https://img.shields.io/badge/license-AGPL--3.0-green) ![Electron](https://img.shields.io/badge/Electron-28+-9FEAF9) ![React](https://img.shields.io/badge/React-18+-61DAFB)

## ✨ Características

- 🔍 **Detecção Automática de Painéis** - Zoom painel por painel com detecção inteligente
- 📖 **Múltiplos Formatos** - CBZ, CBR, CB7, PDF, pastas de imagens
- 🎯 **Modo Mangá** - Suporte para leitura direita-para-esquerda
- 🔎 **Lupa** - Amplie detalhes com lupa ajustável
- 📱 **Tela Cheia** - Experiência imersiva sem distrações
- 🎨 **Navegador de Miniaturas** - Visualize todas as páginas rapidamente
- ⏯️ **Slideshow** - Apresentação automática com tempo ajustável
- 🔖 **Marcadores** - Salve suas páginas favoritas
- 📊 **Histórico** - Rastreie sua posição de leitura
- ⌨️ **Atalhos Completos** - Navegação rápida por teclado
- 🖱️ **Menu de Contexto** - Clique direito para opções rápidas
- 🌍 **Multi-idioma** - Interface em vários idiomas

## 🚀 Instalação

### Versão Web (Navegador)

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

Acesse `http://localhost:5173` no navegador.

### Versão Desktop (Electron)

```bash
# Instalar dependências
npm install

# Modo desenvolvimento (com hot-reload)
node dev-electron.js

# Modo produção
npm run build
node start-electron.js

# Criar instalador
node build-electron.js
```

Veja [INSTALL.md](INSTALL.md) para instruções detalhadas.

## 📖 Uso

### Abrindo Quadrinhos

**Web:**
- Clique em "Start Reading Demo" para ver o quadrinho de demonstração
- Arraste e solte arquivos/pastas na janela

**Desktop:**
- `Ctrl+O` - Abrir arquivo de quadrinho
- `Ctrl+Shift+O` - Abrir pasta de imagens
- Arraste e solte arquivos na janela

### Navegação

| Tecla | Ação |
|-------|------|
| `→` / `Space` | Próximo painel/página |
| `←` | Painel/página anterior |
| `F` | Tela cheia |
| `T` | Navegador de miniaturas |
| `H` | Mostrar ajuda |
| `I` | Barra de informações |
| `R` | Modo mangá |
| `M` | Lupa |
| `G` | Modo guiado |
| `V` | Mostrar página inteira primeiro |
| `D` | Bordas pretas |
| `Shift+D` | Página dupla |
| `E` | Editar painéis |
| `1-4` | Modo de ajuste (tela/largura/altura/100%) |
| `[` / `]` | Rotacionar esquerda/direita |
| `Ctrl+H` | Slideshow on/off |
| `Ctrl+B` | Marcador |
| `Esc` | Sair da tela cheia |

### Mouse

- **Scroll**: Próximo/Anterior painel
- **Clique nas bordas**: Próximo/Anterior painel
- **Duplo-clique no painel**: Zoom no painel
- **Clique direito**: Menu de contexto

## 📦 Formatos Suportados

- **CBZ** (ZIP) - Suporte nativo
- **CBR** (RAR) - Requer `unrar` instalado
- **CB7** (7z) - Requer `7-Zip` instalado
- **Pastas** - Diretórios com imagens
- **Imagens** - JPG, PNG, GIF, WebP, BMP

## 🏗️ Estrutura do Projeto

```
autocomix/
├── electron/              # Processo principal do Electron
│   ├── main.js           # Entry point do Electron
│   ├── preload.js        # Script de preload
│   └── fileHandler.js    # Manipulação de arquivos
├── src/                   # Código React
│   ├── App.tsx           # Componente principal
│   ├── components/       # Componentes React
│   │   ├── ComicReader.tsx
│   │   ├── ThumbnailBrowser.tsx
│   │   ├── Settings.tsx
│   │   ├── HelpOverlay.tsx
│   │   ├── WelcomeScreen.tsx
│   │   └── ViewingHistory.tsx
│   ├── hooks/            # Hooks personalizados
│   │   └── useElectron.ts
│   ├── data/             # Dados de exemplo
│   │   └── sampleComic.ts
│   └── types.ts          # Tipos TypeScript
├── build/                # Recursos de build
├── dist/                 # Build do Vite (gerado)
├── release/              # Pacotes distribuíveis (gerado)
├── dev-electron.js       # Script de desenvolvimento
├── start-electron.js     # Script de produção
├── build-electron.js     # Script de build
├── electron-builder.json # Configuração do electron-builder
├── INSTALL.md            # Guia de instalação
└── README-ELECTRON.md    # Documentação Electron
```

## 🔧 Configuração

### Dependências para CBR/CB7

**CBR (RAR):**
```bash
# macOS
brew install unrar

# Linux (Ubuntu/Debian)
sudo apt-get install unrar

# Windows
# Baixe de https://www.rarlab.com/rar_add.htm
```

**CB7 (7z):**
```bash
# macOS
brew install p7zip

# Linux (Ubuntu/Debian)
sudo apt-get install p7zip-full

# Windows
# Baixe de https://www.7-zip.org/
```

## 🎨 Personalização

### Temas e Cores

Edite `src/index.css` para personalizar cores e estilos.

### Layouts de Painéis

Edite `src/data/sampleComic.ts` para modificar os layouts de painéis padrão.

### Atalhos de Teclado

Edite `src/App.tsx` na função `handleKeyDown` para modificar atalhos.

## 🐛 Troubleshooting

### Electron não inicia
```bash
rm -rf node_modules
npm install
```

### Build falha
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CBR não abre
- Instale `unrar` (veja seção de dependências)
- Reinicie o aplicativo

### Performance lenta
- Feche outros aplicativos
- Reduza o tamanho das imagens
- Desative a detecção automática de painéis nas configurações

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento Web
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build de produção

# Desenvolvimento Electron
node dev-electron.js     # Rodar Electron com hot-reload

# Produção Electron
npm run build            # Build do Vite
node start-electron.js   # Rodar Electron em produção

# Build Electron
node build-electron.js   # Criar instaladores
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença AGPL-3.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Créditos

Baseado em [AutoComix](https://github.com/SorbP/AutoComix) por SorbP

## 📞 Contato

Para problemas e sugestões:
- GitHub Issues: https://github.com/SorbP/AutoComix/issues

---

**Feito com ❤️ para amantes de quadrinhos**
