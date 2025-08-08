import React, { useState, useEffect } from 'react';
import './FileManager.css';

interface FileManagerProps {
  onOpenFile: () => void;
  onCreateFile: () => void;
  onSaveFile: () => void;
  onSaveAsFile: () => void;
  currentFilePath?: string;
  hasUnsavedChanges: boolean;
}

const FileManager: React.FC<FileManagerProps> = ({
  onOpenFile,
  onCreateFile,
  onSaveFile,
  onSaveAsFile,
  currentFilePath,
  hasUnsavedChanges
}) => {
  const [recentFiles, setRecentFiles] = useState<string[]>([]);

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = async () => {
    try {
      const files = await window.electronAPI.getRecentFiles();
      setRecentFiles(files);
    } catch (error) {
      console.error('Error loading recent files:', error);
    }
  };

  const handleOpenRecentFile = async (filePath: string) => {
    try {
      const result = await window.electronAPI.openExcelFile();
      if (result) {
        // The file will be loaded through the main process
        // We just need to trigger a refresh
        window.location.reload();
      }
    } catch (error) {
      console.error('Error opening recent file:', error);
    }
  };

  const getFileName = (filePath: string) => {
    return filePath.split(/[\\/]/).pop() || filePath;
  };

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xlsx':
        return '📊';
      case 'xls':
        return '📈';
      default:
        return '📄';
    }
  };

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <h3>Excel Manager</h3>
        <div className="file-status">
          {currentFilePath && (
            <span className="current-file">
              📄 {getFileName(currentFilePath)}
              {hasUnsavedChanges && <span className="unsaved-indicator">*</span>}
            </span>
          )}
        </div>
      </div>

      <div className="file-actions">
        <button onClick={onCreateFile} className="action-btn primary">
          📝 New File
        </button>
        <button onClick={onOpenFile} className="action-btn">
          📂 Open File
        </button>
        <button onClick={onSaveFile} className="action-btn" disabled={!currentFilePath}>
          💾 Save
        </button>
        <button onClick={onSaveAsFile} className="action-btn">
          💾 Save As
        </button>
      </div>

      <div className="recent-files">
        <h4>Recent Files</h4>
        {recentFiles.length === 0 ? (
          <p className="no-files">No recent files</p>
        ) : (
          <div className="recent-files-list">
            {recentFiles.map((filePath, index) => (
              <div
                key={index}
                className={`recent-file ${currentFilePath === filePath ? 'active' : ''}`}
                onClick={() => handleOpenRecentFile(filePath)}
                title={filePath}
              >
                <span className="file-icon">{getFileIcon(filePath)}</span>
                <span className="file-name">{getFileName(filePath)}</span>
                <span className="file-path">{filePath}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="file-manager-footer">
        <div className="app-info">
          <span>Excel Manager v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default FileManager; 