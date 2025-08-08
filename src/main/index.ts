import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';

// Store recent files
let recentFiles: string[] = [];
const recentFilesPath = path.join(app.getPath('userData'), 'recent-files.json');

// Load recent files on startup
function loadRecentFiles() {
  try {
    if (fs.existsSync(recentFilesPath)) {
      const data = fs.readFileSync(recentFilesPath, 'utf8');
      recentFiles = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading recent files:', error);
  }
}

// Save recent files
function saveRecentFiles() {
  try {
    fs.writeFileSync(recentFilesPath, JSON.stringify(recentFiles, null, 2));
  } catch (error) {
    console.error('Error saving recent files:', error);
  }
}

// Add file to recent files
function addToRecentFiles(filePath: string) {
  const index = recentFiles.indexOf(filePath);
  if (index > -1) {
    recentFiles.splice(index, 1);
  }
  recentFiles.unshift(filePath);
  recentFiles = recentFiles.slice(0, 10); // Keep only 10 recent files
  saveRecentFiles();
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Excel Manager - Electron React TypeScript App',
    show: false // Don't show until ready
  });

  // Show window when ready to prevent visual flash
  win.once('ready-to-show', () => {
    win.show();
  });

  // Load the React app
  if (process.env.NODE_ENV === 'development') {
    // In development, load from Vite dev server
    win.loadURL('http://localhost:5173');
    // Open DevTools in development
    win.webContents.openDevTools();
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

// IPC Handlers for Excel operations
ipcMain.handle('open-excel-file', async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Excel Files', extensions: ['xlsx', 'xls'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      addToRecentFiles(filePath);
      return { data, filePath };
    }
    return null;
  } catch (error) {
    console.error('Error opening Excel file:', error);
    return null;
  }
});

ipcMain.handle('save-excel-file', async (event, data, filePath) => {
  try {
    if (!filePath) {
      const result = await dialog.showSaveDialog({
        filters: [
          { name: 'Excel Files', extensions: ['xlsx'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled) return false;
      filePath = result.filePath;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filePath);
    
    addToRecentFiles(filePath);
    return true;
  } catch (error) {
    console.error('Error saving Excel file:', error);
    return false;
  }
});

ipcMain.handle('create-new-excel-file', async () => {
  try {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'Excel Files', extensions: ['xlsx'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled) return null;

    const filePath = result.filePath;
    const defaultData = [
      ['A1', 'B1', 'C1'],
      ['A2', 'B2', 'C2'],
      ['A3', 'B3', 'C3']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(defaultData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filePath);
    
    addToRecentFiles(filePath);
    return { data: defaultData, filePath };
  } catch (error) {
    console.error('Error creating new Excel file:', error);
    return null;
  }
});

ipcMain.handle('save-as-excel-file', async (event, data) => {
  try {
    const result = await dialog.showSaveDialog({
      filters: [
        { name: 'Excel Files', extensions: ['xlsx'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled) return false;

    const filePath = result.filePath;
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filePath);
    
    addToRecentFiles(filePath);
    return true;
  } catch (error) {
    console.error('Error saving as Excel file:', error);
    return false;
  }
});

ipcMain.handle('get-recent-files', () => {
  return recentFiles;
});

ipcMain.handle('add-to-recent-files', (event, filePath) => {
  addToRecentFiles(filePath);
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  loadRecentFiles();
  createWindow();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent new window creation and handle external links
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Open external links in the default browser
    shell.openExternal(url);
    return { action: 'deny' };
  });
});
