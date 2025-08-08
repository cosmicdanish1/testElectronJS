import React, { useState, useEffect } from 'react';
import './App.css';
import Spreadsheet from './components/Spreadsheet';
import FileManager from './components/FileManager';

function App() {
  const [excelData, setExcelData] = useState<any[][]>([
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A3', 'B3', 'C3']
  ]);
  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataChange = (newData: any[][]) => {
    setExcelData(newData);
    setHasUnsavedChanges(true);
  };

  const handleCreateFile = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.createNewExcelFile();
      if (result) {
        setExcelData(result.data);
        setCurrentFilePath(result.filePath);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error creating new file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFile = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.openExcelFile();
      if (result) {
        setExcelData(result.data);
        setCurrentFilePath(result.filePath);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!currentFilePath) {
      await handleSaveAsFile();
      return;
    }

    setIsLoading(true);
    try {
      const success = await window.electronAPI.saveExcelFile(excelData, currentFilePath);
      if (success) {
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsFile = async () => {
    setIsLoading(true);
    try {
      const success = await window.electronAPI.saveAsExcelFile(excelData);
      if (success) {
        setHasUnsavedChanges(false);
        // Note: We can't get the new file path from saveAs, so we'll keep the current one
        // In a real app, you might want to handle this differently
      }
    } catch (error) {
      console.error('Error saving as file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="App">
      <div className="app-container">
        <FileManager
          onOpenFile={handleOpenFile}
          onCreateFile={handleCreateFile}
          onSaveFile={handleSaveFile}
          onSaveAsFile={handleSaveAsFile}
          currentFilePath={currentFilePath}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        
        <div className="main-content">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <Spreadsheet
              data={excelData}
              onDataChange={handleDataChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
