import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Excel file operations
  openExcelFile: () => ipcRenderer.invoke('open-excel-file'),
  saveExcelFile: (data: any, filePath?: string) => ipcRenderer.invoke('save-excel-file', data, filePath),
  createNewExcelFile: () => ipcRenderer.invoke('create-new-excel-file'),
  saveAsExcelFile: (data: any) => ipcRenderer.invoke('save-as-excel-file', data),
  
  // File system operations
  getRecentFiles: () => ipcRenderer.invoke('get-recent-files'),
  addToRecentFiles: (filePath: string) => ipcRenderer.invoke('add-to-recent-files', filePath),
  
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // General messaging
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  onMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('message', (_event, message) => callback(message));
  }
});

// TypeScript declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      openExcelFile: () => Promise<{ data: any; filePath: string } | null>;
      saveExcelFile: (data: any, filePath?: string) => Promise<boolean>;
      createNewExcelFile: () => Promise<{ data: any; filePath: string } | null>;
      saveAsExcelFile: (data: any) => Promise<boolean>;
      getRecentFiles: () => Promise<string[]>;
      addToRecentFiles: (filePath: string) => Promise<void>;
      getAppVersion: () => Promise<string>;
      sendMessage: (message: string) => void;
      onMessage: (callback: (message: string) => void) => void;
    };
  }
} 