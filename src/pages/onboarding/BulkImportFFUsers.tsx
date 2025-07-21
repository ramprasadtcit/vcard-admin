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
  ArrowLeft
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useFFUsers } from '../../contexts';
import { FFUser } from '../../types/user';

interface UploadResult {
  success: number;
  failure: number;
  duplicates: number;
  errors: string[];
}

interface EmailInviteResult {
  success: number;
  failure: number;
  duplicates: number;
  errors: string[];
}

const BulkImportFFUsers: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { addFFUsers } = useFFUsers();
  const [activeTab, setActiveTab] = useState<'email' | 'full'>('email');
  const [emailFile, setEmailFile] = useState<File | null>(null);
  const [fullFile, setFullFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [emailResults, setEmailResults] = useState<EmailInviteResult | null>(null);
  const [fullResults, setFullResults] = useState<UploadResult | null>(null);

  const handleEmailFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setEmailFile(file);
      setEmailResults(null);
    } else {
      addNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please select a valid CSV file.',
        isRead: false,
        userId: 'current',
      });
    }
  };

  const handleFullFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setFullFile(file);
      setFullResults(null);
    } else {
      addNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please select a valid CSV file.',
        isRead: false,
        userId: 'current',
      });
    }
  };

  const downloadSampleCSV = (type: 'email' | 'full') => {
    let csvContent = '';
    let filename = '';

    if (type === 'email') {
      csvContent = 'Full Name,Email\nJohn Doe,john.doe@example.com\nJane Smith,jane.smith@example.com';
      filename = 'sample_email_invite.csv';
    } else {
      csvContent = `Full Name,Email,Phone,Additional Phones,Additional Emails,Job Title,Company,Street,City,State,Postal,Country,LinkedIn,Instagram,X,Custom Links
John Doe,john.doe@example.com,+1234567890,"+1987654321,+1555123456","john2@example.com,john.work@example.com",Software Engineer,TechCorp,123 Main St,New York,NY,10001,USA,https://linkedin.com/in/johndoe,https://instagram.com/johndoe,https://x.com/johndoe,"Portfolio:https://johndoe.com | Blog:https://blog.johndoe.com"
Jane Smith,jane.smith@example.com,+1234567891,"+1987654322,+1555987654","jane2@example.com,jane.work@example.com",Product Manager,InnovateCorp,456 Oak Ave,San Francisco,CA,94102,USA,https://linkedin.com/in/janesmith,https://instagram.com/janesmith,https://x.com/janesmith,"Website:https://janesmith.com"`;
      filename = 'sample_full_user_details.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleEmailSubmit = async () => {
    if (!emailFile) {
      addNotification({
        type: 'error',
        title: 'No File Selected',
        message: 'Please select a CSV file to upload.',
        isRead: false,
        userId: 'current',
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock CSV parsing and user creation
      const mockImportedUsers: FFUser[] = [
        {
          id: `ff-${Date.now()}-1`,
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          status: 'pending',
          onboardingToken: `ff-token-${Math.random().toString(36).substr(2, 9)}`,
          onboardingLink: `https://twintik.com/onboard/ff-token-${Math.random().toString(36).substr(2, 9)}`,
          invitedBy: 'admin@twintik.com',
          invitedAt: new Date().toISOString(),
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `ff-${Date.now()}-2`,
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          status: 'pending',
          onboardingToken: `ff-token-${Math.random().toString(36).substr(2, 9)}`,
          onboardingLink: `https://twintik.com/onboard/ff-token-${Math.random().toString(36).substr(2, 9)}`,
          invitedBy: 'admin@twintik.com',
          invitedAt: new Date().toISOString(),
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      
      // Add the imported users to the context
      addFFUsers(mockImportedUsers);
      
      // Mock results
      const results: EmailInviteResult = {
        success: mockImportedUsers.length,
        failure: 0,
        duplicates: 0,
        errors: []
      };
      
      setEmailResults(results);
      addNotification({
        type: 'success',
        title: 'Email Invitations Sent',
        message: `Successfully sent ${results.success} invitations. ${results.failure} failed, ${results.duplicates} duplicates found.`,
        isRead: false,
        userId: 'current',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to process the CSV file. Please try again.',
        isRead: false,
        userId: 'current',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFullSubmit = async () => {
    if (!fullFile) {
      addNotification({
        type: 'error',
        title: 'No File Selected',
        message: 'Please select a CSV file to upload.',
        isRead: false,
        userId: 'current',
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock CSV parsing and user creation with full details
      const mockImportedUsers: FFUser[] = [
        {
          id: `ff-${Date.now()}-1`,
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          status: 'pending',
          onboardingToken: `ff-token-${Math.random().toString(36).substr(2, 9)}`,
          onboardingLink: `https://twintik.com/onboard/ff-token-${Math.random().toString(36).substr(2, 9)}`,
          invitedBy: 'admin@twintik.com',
          invitedAt: new Date().toISOString(),
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          profileData: {
            jobTitle: 'Software Engineer',
            company: 'TechCorp',
            phone: '+1234567890',
            additionalPhones: ['+1987654321'],
            additionalEmails: ['john2@example.com'],
            address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA'
            },
            socialLinks: {
              linkedin: 'https://linkedin.com/in/johndoe',
              instagram: 'https://instagram.com/johndoe',
              twitter: 'https://x.com/johndoe'
            }
          }
        },
        {
          id: `ff-${Date.now()}-2`,
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          status: 'pending',
          onboardingToken: `ff-token-${Math.random().toString(36).substr(2, 9)}`,
          onboardingLink: `https://twintik.com/onboard/ff-token-${Math.random().toString(36).substr(2, 9)}`,
          invitedBy: 'admin@twintik.com',
          invitedAt: new Date().toISOString(),
          tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          profileData: {
            jobTitle: 'Product Manager',
            company: 'InnovateCorp',
            phone: '+1234567891',
            additionalPhones: ['+1987654322'],
            additionalEmails: ['jane2@example.com'],
            address: {
              street: '456 Oak Ave',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94102',
              country: 'USA'
            },
            socialLinks: {
              linkedin: 'https://linkedin.com/in/janesmith',
              instagram: 'https://instagram.com/janesmith',
              twitter: 'https://x.com/janesmith'
            }
          }
        }
      ];
      
      // Add the imported users to the context
      addFFUsers(mockImportedUsers);
      
      // Mock results
      const results: UploadResult = {
        success: mockImportedUsers.length,
        failure: 0,
        duplicates: 0,
        errors: []
      };
      
      setFullResults(results);
      addNotification({
        type: 'success',
        title: 'Users Imported',
        message: `Successfully imported ${results.success} users. ${results.failure} failed, ${results.duplicates} duplicates found.`,
        isRead: false,
        userId: 'current',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Import Failed',
        message: 'Failed to import users. Please check your CSV format and try again.',
        isRead: false,
        userId: 'current',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('email')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'email'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Invite via Email</span>
            </button>
            <button
              onClick={() => setActiveTab('full')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'full'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Import Full User Details</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'email' && (
            <div className="space-y-6">
              {/* Email Invite Tab */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Email Invitation Process</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Only Name and Email are required. A unique invitation link will be sent to each email address.
                    </p>
                  </div>
                </div>
              </div>

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
                      onChange={handleEmailFileChange}
                      className="hidden"
                      id="email-file-upload"
                    />
                    <label htmlFor="email-file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          {emailFile ? emailFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Download Sample */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadSampleCSV('email')}
                    className="btn-secondary flex items-center text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Sample CSV
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleEmailSubmit}
                  disabled={!emailFile || isUploading}
                  className="btn-primary flex items-center w-full sm:w-auto"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending Invitations...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Email Invitations
                    </>
                  )}
                </button>
              </div>

              {/* Results */}
              {emailResults && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Results</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Success: <span className="font-medium text-green-600">{emailResults.success}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-gray-600">
                        Failed: <span className="font-medium text-red-600">{emailResults.failure}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-gray-600">
                        Duplicates: <span className="font-medium text-yellow-600">{emailResults.duplicates}</span>
                      </span>
                    </div>
                  </div>
                  {emailResults.errors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        {emailResults.errors.map((error, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'full' && (
            <div className="space-y-6">
              {/* Full Import Tab */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Full User Import</h3>
                    <p className="text-sm text-green-700 mt-1">
                      All fields are optional except Name and Email. Custom links should follow the format: Platform:URL | Platform:URL
                    </p>
                  </div>
                </div>
              </div>

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
                      onChange={handleFullFileChange}
                      className="hidden"
                      id="full-file-upload"
                    />
                    <label htmlFor="full-file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          {fullFile ? fullFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Download Sample */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadSampleCSV('full')}
                    className="btn-secondary flex items-center text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Sample CSV
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleFullSubmit}
                  disabled={!fullFile || isUploading}
                  className="btn-primary flex items-center w-full sm:w-auto"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Importing Users...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Import Users
                    </>
                  )}
                </button>
              </div>

              {/* Results */}
              {fullResults && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Success: <span className="font-medium text-green-600">{fullResults.success}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-gray-600">
                        Failed: <span className="font-medium text-red-600">{fullResults.failure}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-gray-600">
                        Duplicates: <span className="font-medium text-yellow-600">{fullResults.duplicates}</span>
                      </span>
                    </div>
                  </div>
                  {fullResults.errors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        {fullResults.errors.map((error, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkImportFFUsers; 