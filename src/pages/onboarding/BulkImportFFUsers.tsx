import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Download, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Send,
  UserPlus,
  ArrowLeft,
  FileText,
  Users,
  Clock
} from 'lucide-react';
import { useFFUsers } from '../../contexts';
import { apiService } from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Bulk invitation limits
const BULK_INVITATION_LIMITS = {
  MAX_USERS_PER_BATCH: 50,        // Max users per CSV upload
  MAX_DAILY_INVITATIONS: 50,      // Max invitations per day per admin
};

interface CSVUser {
  fullName: string;
  email: string;
}

interface ValidationResult {
  totalUsers: number;
  existingUsers: number;
  newUsers: number;
  results: Array<{
    fullName: string;
    email: string;
    isExisting: boolean;
    existingUser: boolean;
    existingInvitation: boolean;
  }>;
}

interface SendResult {
  totalUsers: number;
  successCount: number;
  errorCount: number;
  message: string;
  results: Array<{
    fullName: string;
    email: string;
    success: boolean;
    invitationId?: string;
    error?: string;
  }>;
}

const BulkImportFFUsers: React.FC = () => {
  const navigate = useNavigate();
  const { addFFUsers } = useFFUsers();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setValidationResult(null);
      setSendResult(null);
      setShowConfirmation(false);
    } else {
      toast.error('Please select a valid CSV file.');
    }
  };

  const parseCSV = (file: File): Promise<CSVUser[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          
          // Remove empty lines and trim whitespace
          const nonEmptyLines = lines.filter(line => line.trim());
          
          if (nonEmptyLines.length < 2) {
            reject(new Error('CSV file must have at least a header row and one data row'));
            return;
          }

          // Parse header
          const header = nonEmptyLines[0].split(',').map(h => h.trim().toLowerCase());
          const nameIndex = header.findIndex(h => h === 'full name' || h === 'name');
          const emailIndex = header.findIndex(h => h === 'email');

          if (nameIndex === -1 || emailIndex === -1) {
            reject(new Error('CSV must have "Full Name" and "Email" columns'));
            return;
          }

          // Parse data rows
          const users: CSVUser[] = [];
          for (let i = 1; i < nonEmptyLines.length; i++) {
            const line = nonEmptyLines[i];
            const values = line.split(',').map(v => v.trim());
            
            if (values.length >= Math.max(nameIndex, emailIndex) + 1) {
              const fullName = values[nameIndex];
              const email = values[emailIndex];
              
              if (fullName && email) {
                users.push({ fullName, email });
              }
            }
          }

          if (users.length === 0) {
            reject(new Error('No valid user data found in CSV'));
            return;
          }

          // Check batch size limit
          if (users.length > BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH) {
            reject(new Error(`CSV contains ${users.length} users, which exceeds the maximum limit of ${BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users per batch. Please split your CSV into smaller files with a maximum of ${BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users each.`));
            return;
          }

          resolve(users);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const validateUsers = async (users: CSVUser[]): Promise<ValidationResult> => {
    try {
      const response = await apiService.post<{ success: boolean; data: ValidationResult }>('/admin/bulk-invitations/validate', { users });
      return response.data;
    } catch (error: any) {
      console.error('Validation error:', error);
      if (error.response?.data?.error === 'INVALID_CSV_FORMAT') {
        throw new Error('Invalid CSV format. Each row must have Full Name and Email columns.');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your login status.');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(error.response?.data?.message || 'Failed to validate users');
    }
  };

  const sendInvitations = async (users: CSVUser[]): Promise<SendResult> => {
    try {
      const response = await apiService.post<SendResult>('/admin/bulk-invitations/send', { users });
      return response;
    } catch (error: any) {
      console.error('Send invitations error:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your login status.');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(error.response?.data?.message || 'Failed to send invitations');
    }
  };

  const handleSendEmailInvitations = async () => {
    if (!csvFile) {
      toast.warning('Please upload a CSV file before sending email invitations.');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      // Parse CSV
      const users = await parseCSV(csvFile);
      setProgress(30);

      // Validate users
      const validation = await validateUsers(users);
      setValidationResult(validation);
      setProgress(60);

      // Show confirmation popup
      setShowConfirmation(true);
      setProgress(100);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleConfirmSend = async () => {
    if (!csvFile || !validationResult) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Get only new users for sending invitations
      const newUsers = validationResult.results
        .filter(result => !result.isExisting)
        .map(result => ({ fullName: result.fullName, email: result.email }));

      if (newUsers.length === 0) {
        toast.warning('All users are already registered. No invitations will be sent.');
        setShowConfirmation(false);
        return;
      }

      // Send invitations
      const result = await sendInvitations(newUsers);
      setSendResult(result);
      setShowConfirmation(false);

      // Show success popup
      setSuccessCount(result.successCount);
      setShowSuccessPopup(true);

      // Show success notification
      toast.success(result.message);

      // Removed daily stats fetching

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `Full Name,Email
John Doe,john.doe@example.com
Jane Smith,jane.smith@example.com
Bob Johnson,bob.johnson@example.com
Alice Brown,alice.brown@example.com
Charlie Wilson,charlie.wilson@example.com
# Note: Maximum 50 users per CSV file`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_bulk_invitations.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getConfirmationMessage = () => {
    if (!validationResult) return '';

    const { totalUsers, existingUsers, newUsers } = validationResult;

    if (newUsers === 0) {
      return 'All users are already registered. No invitations will be sent.';
    } else if (existingUsers === 0) {
      return `All users are new. Confirm to send invitations to ${newUsers} users?`;
    } else {
      return `${existingUsers} user(s) already registered. Confirm to send invitations to ${newUsers} new user(s)?`;
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/admin/fnf-onboarding');
  };

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/fnf-onboarding')}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to F&F Onboarding
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Import F&F Users</h1>
            <p className="text-gray-600 mt-1">Import multiple users at once using CSV files</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card">
        <div className="p-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Bulk Invitation Process</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Upload a CSV file with Full Name and Email columns. The system will check for existing users and send invitations only to new users.
                </p>
              </div>
            </div>
          </div>

          {/* Limits Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Bulk Invitation Limits</h3>
                <div className="text-sm text-yellow-700 mt-2 space-y-1">
                  <p>• Maximum <span className="font-semibold">{BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users</span> per CSV file</p>
                  <p>• Maximum <span className="font-semibold">{BULK_INVITATION_LIMITS.MAX_DAILY_INVITATIONS} invitations</span> per day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Usage Stats */}
          {/* Removed daily stats display */}

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-file-upload"
                />
                <label htmlFor="csv-file-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {csvFile ? csvFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Download Sample */}
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadSampleCSV}
                className="btn-secondary flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample CSV
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSendEmailInvitations}
              disabled={ isProcessing}
              className="btn-primary flex items-center w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email Invitations
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isProcessing && progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Send Results */}
          {sendResult && (
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Send Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Total: <span className="font-medium text-blue-600">{sendResult.totalUsers}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">
                    Success: <span className="font-medium text-green-600">{sendResult.successCount}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">
                    Failed: <span className="font-medium text-red-600">{sendResult.errorCount}</span>
                  </span>
                </div>
              </div>
              {sendResult.results && sendResult.results.some(r => !r.success) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Failed Invitations:</h4>
                  <ul className="text-sm text-red-600 space-y-1">
                    {sendResult.results
                      .filter(r => !r.success)
                      .map((result, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{result.fullName} ({result.email}): {result.error}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Confirm Bulk Invitations</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {getConfirmationMessage()}
            </p>

            <div className="flex space-x-3">
              {validationResult && validationResult.newUsers === 0 ? (
                // Show only "Okay" button when all users are already registered
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="btn-primary flex-1"
                >
                  Okay
                </button>
              ) : (
                // Show Cancel and Confirm buttons for normal cases
                <>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="btn-secondary flex-1"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSend}
                    className="btn-primary flex-1 flex items-center justify-center"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Confirm & Send
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Invitations Sent Successfully!</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Invitations have been sent to <span className="font-semibold text-green-600">{successCount}</span> user(s).
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleSuccessPopupClose}
                className="btn-primary flex-1"
              >
                Go to F&F Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkImportFFUsers; 