# AutoComix - Electron Desktop App

Comic reader with automatic panel-by-panel zoom, built with React + Electron.

## 🚀 Quick Start

### Development Mode

Run the app with hot-reload for development:

```bash
node dev-electron.js
```

This starts both the Vite dev server and Electron together.

### Production Mode

Build and run the production version:

```bash
# Build the project
npm run build

# Run with Electron
node start-electron.js
```

## 📦 Building Distributable

Create installers for your platform:

```bash
# Build the project first
npm run build

# Create distributable packages
npx electron-builder
```

This will create packages in the `release/` directory:
- **Windows**: `.exe` installer and portable version
- **macOS**: `.dmg` installer
- **Linux**: `.AppImage` and `.deb` packages

## 📂 Supported Formats

- **CBZ** (ZIP) - Native support
- **CBR** (RAR) - Requires `unrar` installed
- **CB7** (7z) - Requires `7-Zip` installed
- **Folders** - Directories with image files
- **Images** - JPG, PNG, GIF, WebP, BMP

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next panel/page |
| `←` | Previous panel/page |
| `F` | Toggle fullscreen |
| `T` | Thumbnail browser |
| `H` | Show help |
| `I` | Information bar |
| `R` | Manga mode (right-to-left) |
| `M` | Magnifier |
| `G` | Guided mode |
| `V` | Whole page first |
| `D` | Black borders |
| `Shift+D` | Double page spread |
| `E` | Edit panels |
| `1-4` | Fit mode (screen/width/height/100%) |
| `[` / `]` | Rotate left/right |
| `Ctrl+H` | Slideshow on/off |
| `Ctrl+B` | Bookmark |
| `Ctrl+O` | Open comic file |
| `Ctrl+Shift+O` | Open folder |
| `Esc` | Leave fullscreen / close panels |

## 🖱️ Mouse Controls

- **Scroll**: Next/Previous panel
- **Click edges**: Next/Previous panel
- **Double-click panel**: Zoom to panel
- **Right-click**: Context menu

## 🔧 Configuration

### File Associations

On Windows, you can associate comic files with AutoComix:

1. Right-click a `.cbz` file
2. Select "Open with" → "Choose another app"
3. Select AutoComix and check "Always use this app"

### Command Line

Open a comic from the command line:

```bash
# Windows
AutoComix.exe "path/to/comic.cbz"

# macOS
open -a AutoComix "path/to/comic.cbz"

# Linux
./AutoComix "path/to/comic.cbz"
```

## 📁 Project Structure

```
autocomix/
├── electron/              # Electron main process
│   ├── main.js           # Main process entry
│   ├── preload.js        # Preload script
│   └── fileHandler.js    # File handling (CBZ, CBR, etc)
├── src/                   # React source
│   ├── App.tsx           # Main app component
│   ├── components/       # React components
│   ├── data/            # Sample data
│   └── types.ts         # TypeScript types
├── dist/                 # Built files (generated)
├── release/              # Distributable packages (generated)
├── start-electron.js     # Production launcher
├── dev-electron.js       # Development launcher
└── electron-builder.json # Build configuration
```

## 🐛 Troubleshooting

### CBR files not opening
Install `unrar`:
- **Windows**: Download from https://www.rarlab.com/rar_add.htm
- **macOS**: `brew install unrar`
- **Linux**: `sudo apt-get install unrar`

### CB7 files not opening
Install `7-Zip`:
- **Windows**: Download from https://www.7-zip.org/
- **macOS**: `brew install p7zip`
- **Linux**: `sudo apt-get install p7zip-full`

### Build fails
Make sure all dependencies are installed:
```bash
npm install
npm run build
```

## 📝 License

Open source under AGPL-3.0 license.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines first.

## 🙏 Credits

Based on AutoComix by SorbP
https://github.com/SorbP/AutoComix
