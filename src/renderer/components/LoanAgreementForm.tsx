import React, { useState, useEffect } from 'react';
import './LoanAgreementForm.css';

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

interface LoanAgreementFormProps {
  onSubmit: (data: LoanAgreementData) => void;
  existingData: any[][];
  isLoading: boolean;
}

const LoanAgreementForm: React.FC<LoanAgreementFormProps> = ({
  onSubmit,
  existingData,
  isLoading
}) => {
  const [formData, setFormData] = useState<LoanAgreementData>({
    serialNo: '',
    membershipNo: '',
    memberName: '',
    fatherHusbandName: '',
    societyNameAddress: 'Default Society Name & Address', // Fixed default
    loanAmountFigures: '',
    loanAmountWords: '',
    loanStartMonthYear: '',
    loanInstallmentFigures: '',
    loanInstallmentWords: '',
    numberOfInstallments: '',
    shareValueFigures: '',
    shareValueWords: '',
    shareValueStartMonthYear: '',
    fixedDepositFigures: '',
    fixedDepositWords: '',
    fixedDepositStartMonthYear: '',
    employeeNumber: '',
    departmentName: '',
    designation: '',
    salaryFigures: '',
    salaryWords: '',
    monthlyDeductionFigures: '',
    monthlyDeductionWords: '',
    totalDeductionFigures: '',
    totalDeductionWords: '',
    agreementDate: '',
    witnessName1: '',
    witnessName2: '',
    memberSignature: false,
    managerSignature: false
  });

  const [errors, setErrors] = useState<Partial<LoanAgreementData>>({});
  const [duplicateError, setDuplicateError] = useState<string>('');

  // Check for duplicates
  const checkDuplicates = (membershipNo: string, employeeNumber: string) => {
    if (!existingData || existingData.length === 0) return false;
    
    // Skip header row if it exists
    const dataRows = existingData.slice(1);
    
    return dataRows.some(row => {
      const existingMembershipNo = row[1]?.toString() || ''; // Column B
      const existingEmployeeNo = row[17]?.toString() || ''; // Column R
      
      return existingMembershipNo === membershipNo || existingEmployeeNo === employeeNumber;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoanAgreementData> = {};

    // Required fields validation
    if (!formData.serialNo.trim()) newErrors.serialNo = 'Serial No. is required';
    if (!formData.membershipNo.trim()) newErrors.membershipNo = 'Membership No. is required';
    if (!formData.memberName.trim()) newErrors.memberName = 'Member Name is required';
    if (!formData.fatherHusbandName.trim()) newErrors.fatherHusbandName = 'Father/Husband Name is required';
    if (!formData.loanAmountFigures.trim()) newErrors.loanAmountFigures = 'Loan Amount (Figures) is required';
    if (!formData.loanAmountWords.trim()) newErrors.loanAmountWords = 'Loan Amount (Words) is required';
    if (!formData.loanStartMonthYear.trim()) newErrors.loanStartMonthYear = 'Loan Start Month/Year is required';
    if (!formData.employeeNumber.trim()) newErrors.employeeNumber = 'Employee Number is required';
    if (!formData.agreementDate.trim()) newErrors.agreementDate = 'Agreement Date is required';

    // Duplicate check
    if (formData.membershipNo.trim() && formData.employeeNumber.trim()) {
      if (checkDuplicates(formData.membershipNo.trim(), formData.employeeNumber.trim())) {
        setDuplicateError('A record with this Membership No. or Employee No. already exists!');
        return false;
      } else {
        setDuplicateError('');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        ...formData,
        serialNo: '',
        membershipNo: '',
        memberName: '',
        fatherHusbandName: '',
        loanAmountFigures: '',
        loanAmountWords: '',
        loanStartMonthYear: '',
        loanInstallmentFigures: '',
        loanInstallmentWords: '',
        numberOfInstallments: '',
        shareValueFigures: '',
        shareValueWords: '',
        shareValueStartMonthYear: '',
        fixedDepositFigures: '',
        fixedDepositWords: '',
        fixedDepositStartMonthYear: '',
        employeeNumber: '',
        departmentName: '',
        designation: '',
        salaryFigures: '',
        salaryWords: '',
        monthlyDeductionFigures: '',
        monthlyDeductionWords: '',
        totalDeductionFigures: '',
        totalDeductionWords: '',
        agreementDate: '',
        witnessName1: '',
        witnessName2: '',
        memberSignature: false,
        managerSignature: false
      });
    }
  };

  const handleInputChange = (field: keyof LoanAgreementData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear duplicate error when user changes membership or employee number
    if ((field === 'membershipNo' || field === 'employeeNumber') && duplicateError) {
      setDuplicateError('');
    }
  };

  const convertToWords = (amount: string): string => {
    if (!amount || isNaN(Number(amount))) return '';
    
    const num = parseInt(amount);
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + convertToWords(num % 100) : '');
    if (num < 100000) return convertToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convertToWords(num % 1000) : '');
    if (num < 10000000) return convertToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convertToWords(num % 100000) : '');
    return convertToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + convertToWords(num % 10000000) : '');
  };

  const handleAmountChange = (field: keyof LoanAgreementData, value: string) => {
    handleInputChange(field, value);
    
    // Auto-convert to words
    if (value && !isNaN(Number(value))) {
      const wordsField = field.replace('Figures', 'Words') as keyof LoanAgreementData;
      const words = convertToWords(value) + ' Rupees Only';
      setFormData(prev => ({ ...prev, [wordsField]: words }));
    }
  };

  return (
    <div className="loan-agreement-form">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h3>Loan Agreement Details</h3>
          {duplicateError && <div className="error-message duplicate-error">{duplicateError}</div>}
        </div>

        <div className="form-sections">
          {/* Basic Information */}
          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Serial No. *</label>
                <input
                  type="text"
                  value={formData.serialNo}
                  onChange={(e) => handleInputChange('serialNo', e.target.value)}
                  className={errors.serialNo ? 'error' : ''}
                />
                {errors.serialNo && <span className="error-text">{errors.serialNo}</span>}
              </div>
              <div className="form-group">
                <label>Membership No. *</label>
                <input
                  type="text"
                  value={formData.membershipNo}
                  onChange={(e) => handleInputChange('membershipNo', e.target.value)}
                  className={errors.membershipNo ? 'error' : ''}
                />
                {errors.membershipNo && <span className="error-text">{errors.membershipNo}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Name of Member *</label>
                <input
                  type="text"
                  value={formData.memberName}
                  onChange={(e) => handleInputChange('memberName', e.target.value)}
                  className={errors.memberName ? 'error' : ''}
                />
                {errors.memberName && <span className="error-text">{errors.memberName}</span>}
              </div>
              <div className="form-group">
                <label>Father's / Husband's Name *</label>
                <input
                  type="text"
                  value={formData.fatherHusbandName}
                  onChange={(e) => handleInputChange('fatherHusbandName', e.target.value)}
                  className={errors.fatherHusbandName ? 'error' : ''}
                />
                {errors.fatherHusbandName && <span className="error-text">{errors.fatherHusbandName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Society Name & Address</label>
              <textarea
                value={formData.societyNameAddress}
                onChange={(e) => handleInputChange('societyNameAddress', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Loan Details */}
          <div className="form-section">
            <h4>Loan Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Loan Amount (Figures) *</label>
                <input
                  type="number"
                  value={formData.loanAmountFigures}
                  onChange={(e) => handleAmountChange('loanAmountFigures', e.target.value)}
                  className={errors.loanAmountFigures ? 'error' : ''}
                />
                {errors.loanAmountFigures && <span className="error-text">{errors.loanAmountFigures}</span>}
              </div>
              <div className="form-group">
                <label>Loan Amount (Words)</label>
                <input
                  type="text"
                  value={formData.loanAmountWords}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Loan Start Month/Year *</label>
                <input
                  type="month"
                  value={formData.loanStartMonthYear}
                  onChange={(e) => handleInputChange('loanStartMonthYear', e.target.value)}
                  className={errors.loanStartMonthYear ? 'error' : ''}
                />
                {errors.loanStartMonthYear && <span className="error-text">{errors.loanStartMonthYear}</span>}
              </div>
              <div className="form-group">
                <label>Number of Installments</label>
                <input
                  type="number"
                  value={formData.numberOfInstallments}
                  onChange={(e) => handleInputChange('numberOfInstallments', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Loan Installment Amount (Figures)</label>
                <input
                  type="number"
                  value={formData.loanInstallmentFigures}
                  onChange={(e) => handleAmountChange('loanInstallmentFigures', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Loan Installment Amount (Words)</label>
                <input
                  type="text"
                  value={formData.loanInstallmentWords}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
          </div>

          {/* Share Value Details */}
          <div className="form-section">
            <h4>Share Value Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Share Value Amount (Figures)</label>
                <input
                  type="number"
                  value={formData.shareValueFigures}
                  onChange={(e) => handleAmountChange('shareValueFigures', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Share Value Amount (Words)</label>
                <input
                  type="text"
                  value={formData.shareValueWords}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Share Value Start Month/Year</label>
              <input
                type="month"
                value={formData.shareValueStartMonthYear}
                onChange={(e) => handleInputChange('shareValueStartMonthYear', e.target.value)}
              />
            </div>
          </div>

          {/* Fixed Deposit Details */}
          <div className="form-section">
            <h4>Fixed Deposit Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Fixed Deposit Amount (Figures)</label>
                <input
                  type="number"
                  value={formData.fixedDepositFigures}
                  onChange={(e) => handleAmountChange('fixedDepositFigures', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Fixed Deposit Amount (Words)</label>
                <input
                  type="text"
                  value={formData.fixedDepositWords}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Fixed Deposit Start Month/Year</label>
              <input
                type="month"
                value={formData.fixedDepositStartMonthYear}
                onChange={(e) => handleInputChange('fixedDepositStartMonthYear', e.target.value)}
              />
            </div>
          </div>

          {/* Employee Details */}
          <div className="form-section">
            <h4>Employee Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Employee Number (P.No.) *</label>
                <input
                  type="text"
                  value={formData.employeeNumber}
                  onChange={(e) => handleInputChange('employeeNumber', e.target.value)}
                  className={errors.employeeNumber ? 'error' : ''}
                />
                {errors.employeeNumber && <span className="error-text">{errors.employeeNumber}</span>}
              </div>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={formData.departmentName}
                  onChange={(e) => handleInputChange('departmentName', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Salary Amount (Figures)</label>
                <input
                  type="number"
                  value={formData.salaryFigures}
                  onChange={(e) => handleAmountChange('salaryFigures', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Salary Amount (Words)</label>
                <input
                  type="text"
                  value={formData.salaryWords}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
          </div>

          {/* Deduction Details */}
          <div className="form-section">
            <h4>Deduction Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Monthly Deduction Amount (Figures)</label>
                <input
                  type="number"
                  value={formData.monthlyDeductionFigures}
                  onChange={(e) => handleAmountChange('monthlyDeductionFigures', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Monthly Deduction Amount (Words)</label>
                <input
                  type="text"
                  value={formData.monthlyDeductionWords}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Deduction per Month (Figures)</label>
                <input
                  type="number"
                  value={formData.totalDeductionFigures}
                  onChange={(e) => handleAmountChange('totalDeductionFigures', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Total Deduction per Month (Words)</label>
                <input
                  type="text"
                  value={formData.totalDeductionWords}
                  readOnly
                  className="readonly"
                />
              </div>
            </div>
          </div>

          {/* Agreement Details */}
          <div className="form-section">
            <h4>Agreement Details</h4>
            <div className="form-group">
              <label>Agreement Date *</label>
              <input
                type="date"
                value={formData.agreementDate}
                onChange={(e) => handleInputChange('agreementDate', e.target.value)}
                className={errors.agreementDate ? 'error' : ''}
              />
              {errors.agreementDate && <span className="error-text">{errors.agreementDate}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Witness Name 1</label>
                <input
                  type="text"
                  value={formData.witnessName1}
                  onChange={(e) => handleInputChange('witnessName1', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Witness Name 2</label>
                <input
                  type="text"
                  value={formData.witnessName2}
                  onChange={(e) => handleInputChange('witnessName2', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.memberSignature}
                    onChange={(e) => handleInputChange('memberSignature', e.target.checked)}
                  />
                  Member Signature
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.managerSignature}
                    onChange={(e) => handleInputChange('managerSignature', e.target.checked)}
                  />
                  Manager Signature
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Saving...' : 'Save Agreement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanAgreementForm; 