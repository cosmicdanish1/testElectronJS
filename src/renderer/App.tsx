import React, { useState, useEffect } from 'react';
import './App.css';
import FileManager from './components/FileManager';
import LoanAgreementForm from './components/LoanAgreementForm';

interface LoanAgreementData {
  serialNo: string;
  membershipNo: string;
  memberName: string;
  fatherHusbandName: string;
  societyNameAddress: string;
  loanAmountFigures: string;
  loanAmountWords: string;
  loanStartMonthYear: string;
  loanInstallmentFigures: string;
  loanInstallmentWords: string;
  numberOfInstallments: string;
  shareValueFigures: string;
  shareValueWords: string;
  shareValueStartMonthYear: string;
  fixedDepositFigures: string;
  fixedDepositWords: string;
  fixedDepositStartMonthYear: string;
  employeeNumber: string;
  departmentName: string;
  designation: string;
  salaryFigures: string;
  salaryWords: string;
  monthlyDeductionFigures: string;
  monthlyDeductionWords: string;
  totalDeductionFigures: string;
  totalDeductionWords: string;
  agreementDate: string;
  witnessName1: string;
  witnessName2: string;
  memberSignature: boolean;
  managerSignature: boolean;
}

function App() {
  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [excelData, setExcelData] = useState<any[][]>([]);

  const handleCreateFile = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.createNewExcelFile();
      if (result) {
        // Create headers for the loan agreement data
        const headers = [
          'Serial No.',
          'Membership No.',
          'Name of Member',
          'Father/Husband Name',
          'Society Name & Address',
          'Loan Amount (Figures)',
          'Loan Amount (Words)',
          'Loan Start Month/Year',
          'Loan Installment Amount (Figures)',
          'Loan Installment Amount (Words)',
          'Number of Installments',
          'Share Value Amount (Figures)',
          'Share Value Amount (Words)',
          'Share Value Start Month/Year',
          'Fixed Deposit Amount (Figures)',
          'Fixed Deposit Amount (Words)',
          'Fixed Deposit Start Month/Year',
          'Employee Number (P.No.)',
          'Department Name',
          'Designation',
          'Salary Amount (Figures)',
          'Salary Amount (Words)',
          'Monthly Deduction Amount (Figures)',
          'Monthly Deduction Amount (Words)',
          'Total Deduction per Month (Figures)',
          'Total Deduction per Month (Words)',
          'Agreement Date',
          'Witness Name 1',
          'Witness Name 2',
          'Member Signature',
          'Manager Signature'
        ];
        
        setExcelData([headers]);
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
      }
    } catch (error) {
      console.error('Error saving as file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (formData: LoanAgreementData) => {
    // Convert form data to Excel row format
    const newRow = [
      formData.serialNo,
      formData.membershipNo,
      formData.memberName,
      formData.fatherHusbandName,
      formData.societyNameAddress,
      formData.loanAmountFigures,
      formData.loanAmountWords,
      formData.loanStartMonthYear,
      formData.loanInstallmentFigures,
      formData.loanInstallmentWords,
      formData.numberOfInstallments,
      formData.shareValueFigures,
      formData.shareValueWords,
      formData.shareValueStartMonthYear,
      formData.fixedDepositFigures,
      formData.fixedDepositWords,
      formData.fixedDepositStartMonthYear,
      formData.employeeNumber,
      formData.departmentName,
      formData.designation,
      formData.salaryFigures,
      formData.salaryWords,
      formData.monthlyDeductionFigures,
      formData.monthlyDeductionWords,
      formData.totalDeductionFigures,
      formData.totalDeductionWords,
      formData.agreementDate,
      formData.witnessName1,
      formData.witnessName2,
      formData.memberSignature ? 'Yes' : 'No',
      formData.managerSignature ? 'Yes' : 'No'
    ];

    // Add new row to Excel data
    const updatedData = [...excelData, newRow];
    setExcelData(updatedData);
    setHasUnsavedChanges(true);
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
            <div className="form-container">
              <h2>Loan Agreement Data Entry</h2>
              <p>Create or open an Excel file to start entering loan agreement details.</p>
              
              {!currentFilePath ? (
                <div className="no-file-selected">
                  <p>Please create a new file or open an existing Excel file to start entering data.</p>
                </div>
              ) : (
                <LoanAgreementForm
                  onSubmit={handleFormSubmit}
                  existingData={excelData}
                  isLoading={isLoading}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
