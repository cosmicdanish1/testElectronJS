import React, { useState, useEffect } from 'react';
import './Spreadsheet.css';

interface SpreadsheetProps {
  data: any[][];
  onDataChange: (data: any[][]) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ data, onDataChange }) => {
  const [spreadsheetData, setSpreadsheetData] = useState<any[][]>(data);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    setSpreadsheetData(data);
  }, [data]);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    setEditingCell({ row, col });
    setEditValue(spreadsheetData[row]?.[col]?.toString() || '');
  };

  const handleEditChange = (value: string) => {
    setEditValue(value);
  };

  const handleEditBlur = () => {
    if (editingCell) {
      const newData = [...spreadsheetData];
      if (!newData[editingCell.row]) {
        newData[editingCell.row] = [];
      }
      newData[editingCell.row][editingCell.col] = editValue;
      setSpreadsheetData(newData);
      onDataChange(newData);
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const addRow = () => {
    const newData = [...spreadsheetData, []];
    setSpreadsheetData(newData);
    onDataChange(newData);
  };

  const addColumn = () => {
    const maxCols = Math.max(...spreadsheetData.map(row => row?.length || 0));
    const newData = spreadsheetData.map(row => {
      const newRow = [...(row || [])];
      newRow[maxCols] = '';
      return newRow;
    });
    setSpreadsheetData(newData);
    onDataChange(newData);
  };

  const deleteRow = (rowIndex: number) => {
    const newData = spreadsheetData.filter((_, index) => index !== rowIndex);
    setSpreadsheetData(newData);
    onDataChange(newData);
  };

  const deleteColumn = (colIndex: number) => {
    const newData = spreadsheetData.map(row => 
      row?.filter((_, index) => index !== colIndex) || []
    );
    setSpreadsheetData(newData);
    onDataChange(newData);
  };

  const getMaxRows = () => Math.max(spreadsheetData.length, 20);
  const getMaxCols = () => Math.max(...spreadsheetData.map(row => row?.length || 0), 10);

  const renderCell = (row: number, col: number) => {
    const cellValue = spreadsheetData[row]?.[col] || '';
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isEditing = editingCell?.row === row && editingCell?.col === col;

    if (isEditing) {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => handleEditChange(e.target.value)}
          onBlur={handleEditBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="cell-input"
        />
      );
    }

    return (
      <div
        className={`cell ${isSelected ? 'selected' : ''}`}
        onClick={() => handleCellClick(row, col)}
        onDoubleClick={() => handleCellDoubleClick(row, col)}
      >
        {cellValue}
      </div>
    );
  };

  return (
    <div className="spreadsheet-container">
      <div className="spreadsheet-toolbar">
        <button onClick={addRow} className="toolbar-btn">Add Row</button>
        <button onClick={addColumn} className="toolbar-btn">Add Column</button>
        {selectedCell && (
          <>
            <button 
              onClick={() => deleteRow(selectedCell.row)} 
              className="toolbar-btn delete-btn"
            >
              Delete Row {selectedCell.row + 1}
            </button>
            <button 
              onClick={() => deleteColumn(selectedCell.col)} 
              className="toolbar-btn delete-btn"
            >
              Delete Column {String.fromCharCode(65 + selectedCell.col)}
            </button>
          </>
        )}
      </div>
      
      <div className="spreadsheet-grid">
        <div className="spreadsheet-header">
          <div className="corner-cell"></div>
          {Array.from({ length: getMaxCols() }, (_, col) => (
            <div key={col} className="header-cell">
              {String.fromCharCode(65 + col)}
            </div>
          ))}
        </div>
        
        <div className="spreadsheet-body">
          {Array.from({ length: getMaxRows() }, (_, row) => (
            <div key={row} className="spreadsheet-row">
              <div className="row-header">{row + 1}</div>
              {Array.from({ length: getMaxCols() }, (_, col) => (
                <div key={col} className="cell-container">
                  {renderCell(row, col)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet; 