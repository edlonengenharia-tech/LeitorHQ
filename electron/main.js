const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const fileHandler = require('./fileHandler');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#030712',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'AutoComix',
    autoHideMenuBar: true,
  });

  // Carrega o aplicativo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Menu personalizado
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Comic...',
          accelerator: 'CmdOrCtrl+O',
          click: () => openComicDialog(),
        },
        {
          label: 'Open Folder...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => openFolderDialog(),
        },
        { type: 'separator' },
        {
          label: 'Recent',
          submenu: createRecentMenu(),
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Fullscreen',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
      ],
    },
    {
      label: 'Navigate',
      submenu: [
        {
          label: 'Next Panel/Page',
          accelerator: 'Right',
          click: () => mainWindow.webContents.send('navigate', 'next'),
        },
        {
          label: 'Previous Panel/Page',
          accelerator: 'Left',
          click: () => mainWindow.webContents.send('navigate', 'prev'),
        },
        { type: 'separator' },
        {
          label: 'Next Page',
          accelerator: 'PageDown',
          click: () => mainWindow.webContents.send('navigate', 'nextPage'),
        },
        {
          label: 'Previous Page',
          accelerator: 'PageUp',
          click: () => mainWindow.webContents.send('navigate', 'prevPage'),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'H',
          click: () => mainWindow.webContents.send('showHelp'),
        },
        { type: 'separator' },
        {
          label: 'About AutoComix',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About AutoComix',
              message: 'AutoComix v2.20.0',
              detail: 'Comic reader with automatic panel-by-panel zoom.\n\nOpen source under AGPL-3.0 license.\nhttps://github.com/SorbP/AutoComix',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function openComicDialog() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Comic',
    filters: [
      { name: 'Comic Files', extensions: ['cbz', 'cbr', 'cb7', 'pdf'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const comicData = await fileHandler.loadComic(filePath);
    mainWindow.webContents.send('comic-loaded', comicData);
    addToRecent(filePath);
  }
}

async function openFolderDialog() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Folder',
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    const comicData = await fileHandler.loadFolder(folderPath);
    mainWindow.webContents.send('comic-loaded', comicData);
    addToRecent(folderPath);
  }
}

// Gerenciar arquivos recentes
let recentFiles = [];

function addToRecent(filePath) {
  recentFiles = recentFiles.filter(f => f !== filePath);
  recentFiles.unshift(filePath);
  if (recentFiles.length > 10) {
    recentFiles = recentFiles.slice(0, 10);
  }
}

function createRecentMenu() {
  if (recentFiles.length === 0) {
    return [{ label: 'No Recent Files', enabled: false }];
  }
  return recentFiles.map(filePath => ({
    label: path.basename(filePath),
    click: async () => {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        let comicData;
        if (stats.isDirectory()) {
          comicData = await fileHandler.loadFolder(filePath);
        } else {
          comicData = await fileHandler.loadComic(filePath);
        }
        mainWindow.webContents.send('comic-loaded', comicData);
      } else {
        dialog.showErrorBox('File Not Found', `The file "${filePath}" no longer exists.`);
      }
    },
  }));
}

// IPC Handlers
ipcMain.handle('open-file-dialog', async () => {
  await openComicDialog();
});

ipcMain.handle('open-folder-dialog', async () => {
  await openFolderDialog();
});

ipcMain.handle('read-file', async (event, filePath) => {
  return await fileHandler.readFile(filePath);
});

ipcMain.handle('get-file-info', async (event, filePath) => {
  return await fileHandler.getFileInfo(filePath);
});

// Abrir arquivo via linha de comando
app.on('open-file', async (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    const stats = fs.statSync(filePath);
    let comicData;
    if (stats.isDirectory()) {
      comicData = await fileHandler.loadFolder(filePath);
    } else {
      comicData = await fileHandler.loadComic(filePath);
    }
    mainWindow.webContents.send('comic-loaded', comicData);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle file passed as argument
const fileArg = process.argv[1];
if (fileArg && app.isReady()) {
  app.whenReady().then(async () => {
    if (fs.existsSync(fileArg)) {
      const stats = fs.statSync(fileArg);
      let comicData;
      if (stats.isDirectory()) {
        comicData = await fileHandler.loadFolder(fileArg);
      } else {
        comicData = await fileHandler.loadComic(fileArg);
      }
      mainWindow.webContents.send('comic-loaded', comicData);
    }
  });
}
