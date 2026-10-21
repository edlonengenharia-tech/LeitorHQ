import { useEffect, useState } from 'react';

interface ElectronAPI {
  openFileDialog: () => Promise<void>;
  openFolderDialog: () => Promise<void>;
  readFile: (filePath: string) => Promise<string>;
  getFileInfo: (filePath: string) => Promise<any>;
  onComicLoaded: (callback: (data: any) => void) => void;
  onNavigate: (callback: (direction: string) => void) => void;
  onShowHelp: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export function useElectron() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    setIsElectron(!!window.electronAPI);
  }, []);

  const openFileDialog = async () => {
    if (window.electronAPI) {
      await window.electronAPI.openFileDialog();
    }
  };

  const openFolderDialog = async () => {
    if (window.electronAPI) {
      await window.electronAPI.openFolderDialog();
    }
  };

  const onComicLoaded = (callback: (data: any) => void) => {
    if (window.electronAPI) {
      window.electronAPI.onComicLoaded(callback);
    }
  };

  const onNavigate = (callback: (direction: string) => void) => {
    if (window.electronAPI) {
      window.electronAPI.onNavigate(callback);
    }
  };

  const onShowHelp = (callback: () => void) => {
    if (window.electronAPI) {
      window.electronAPI.onShowHelp(callback);
    }
  };

  const removeAllListeners = (channel: string) => {
    if (window.electronAPI) {
      window.electronAPI.removeAllListeners(channel);
    }
  };

  return {
    isElectron,
    openFileDialog,
    openFolderDialog,
    onComicLoaded,
    onNavigate,
    onShowHelp,
    removeAllListeners,
  };
}
