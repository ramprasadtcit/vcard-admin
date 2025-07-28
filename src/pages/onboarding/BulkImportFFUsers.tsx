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

interface FullCSVUser {
  fullName: string;
  email: string;
  username: string;
  phone: string;
  jobTitle?: string;
  company?: string;
  website?: string;
  bio?: string;
  additionalEmails?: string;
  additionalPhones?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  linkedin?: string;
  x?: string;
  instagram?: string;
  customSocialLinks?: string; // JSON string or semicolon-separated
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

interface FullUserValidationResult {
  totalUsers: number;
  existingUsers: number;
  newUsers: number;
  validUsers: number;
  invalidUsers: number;
  missingFieldsUsers: number;
  duplicateUsers: number;
  results: Array<{
    fullName: string;
    email: string;
    username: string;
    phone: string;
    isExisting: boolean;
    isValid: boolean;
    errors?: string[];
    duplicateFields?: {
      email?: boolean;
      username?: boolean;
      phone?: boolean;
    };
    missingFields?: string[];
    reason?: 'VALID' | 'DUPLICATE_FIELDS' | 'MISSING_FIELDS';
    existingUserEmail?: string;
    existingUsername?: string;
    existingPhone?: string;
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
    userId?: string;
    error?: string;
  }>;
}

const BulkImportFFUsers: React.FC = () => {
  const navigate = useNavigate();
  const { addFFUsers } = useFFUsers();
  const [activeTab, setActiveTab] = useState<'invite' | 'create'>('invite');
  const [inviteCsvFile, setInviteCsvFile] = useState<File | null>(null); // For invite tab
  const [createCsvFile, setCreateCsvFile] = useState<File | null>(null); // For create tab
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [fullUserValidationResult, setFullUserValidationResult] = useState<FullUserValidationResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  // Function to clear file input and validation results
  const clearFileAndResults = () => {
    if (activeTab === 'invite') {
      setInviteCsvFile(null);
      setValidationResult(null);
    } else {
      setCreateCsvFile(null);
      setFullUserValidationResult(null);
    }
    setSendResult(null);
    setShowConfirmation(false);
    
    // Clear the actual file input element
    const fileInput = document.getElementById('csv-file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleInviteFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setInviteCsvFile(file);
      setValidationResult(null);
      setSendResult(null);
      setShowConfirmation(false);
    } else {
      toast.error('Please select a valid CSV file.');
    }
  };

  const handleCreateFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCreateCsvFile(file);
      setFullUserValidationResult(null);
      setSendResult(null);
      setShowConfirmation(false);
    } else {
      toast.error('Please select a valid CSV file.');
    }
  };

  const parseInviteCSV = (file: File): Promise<{ users: CSVUser[]; duplicateCount: number; duplicateEmails: string[] }> => {
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
          const emailSet = new Set<string>(); // Track unique emails
          const duplicateEmails: string[] = []; // Track duplicate emails for reporting
          
          for (let i = 1; i < nonEmptyLines.length; i++) {
            const line = nonEmptyLines[i];
            const values = line.split(',').map(v => v.trim());
            
            if (values.length >= Math.max(nameIndex, emailIndex) + 1) {
              const fullName = values[nameIndex];
              const email = values[emailIndex].toLowerCase(); // Normalize email
              
              if (fullName && email) {
                // Check for duplicates within CSV
                if (emailSet.has(email)) {
                  duplicateEmails.push(email);
                } else {
                  emailSet.add(email);
                  users.push({ fullName, email });
                }
              }
            }
          }

          if (users.length === 0) {
            reject(new Error('No valid user data found in CSV'));
            return;
          }

          // Report duplicates if any
          if (duplicateEmails.length > 0) {
            const uniqueDuplicates = Array.from(new Set(duplicateEmails));
            console.warn(`Found ${duplicateEmails.length} duplicate emails in CSV. Removed duplicates: ${uniqueDuplicates.join(', ')}`);
          }

          // Check batch size limit
          if (users.length > BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH) {
            reject(new Error(`CSV contains ${users.length} users (after removing duplicates), which exceeds the maximum limit of ${BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users per batch. Please split your CSV into smaller files with a maximum of ${BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users each.`));
            return;
          }

          resolve({ 
            users, 
            duplicateCount: duplicateEmails.length, 
            duplicateEmails: Array.from(new Set(duplicateEmails))
          });
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const parseFullUserCSV = (file: File): Promise<{ users: FullCSVUser[]; duplicateCount: number; duplicateEmails: string[] }> => {
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
          
          // Required columns
          const nameIndex = header.findIndex(h => h === 'full name' || h === 'name');
          const emailIndex = header.findIndex(h => h === 'email');
          const usernameIndex = header.findIndex(h => h === 'username' || h === 'user name');
          const phoneIndex = header.findIndex(h => h === 'phone' || h === 'phone number' || h === 'mobile');
          
          if (nameIndex === -1 || emailIndex === -1 || usernameIndex === -1 || phoneIndex === -1) {
            reject(new Error('CSV must have "Full Name", "Email", "Username", and "Phone" columns'));
            return;
          }

          // Optional columns
          const getColumnIndex = (columnNames: string[]) => {
            for (const name of columnNames) {
              const index = header.findIndex(h => h === name.toLowerCase());
              if (index !== -1) return index;
            }
            return -1;
          };

          const jobTitleIndex = getColumnIndex(['job title', 'jobtitle', 'title']);
          const companyIndex = getColumnIndex(['company', 'organization']);
          const websiteIndex = getColumnIndex(['website', 'web site']);
          const bioIndex = getColumnIndex(['bio', 'biography', 'description']);
          const additionalEmailsIndex = getColumnIndex(['additional emails', 'secondary emails', 'other emails']);
          const additionalPhonesIndex = getColumnIndex(['additional phones', 'secondary phones', 'other phones']);
          const streetIndex = getColumnIndex(['street', 'address', 'street address']);
          const cityIndex = getColumnIndex(['city']);
          const stateIndex = getColumnIndex(['state', 'province']);
          const zipCodeIndex = getColumnIndex(['zip code', 'zipcode', 'postal code']);
          const countryIndex = getColumnIndex(['country']);
          const linkedinIndex = getColumnIndex(['linkedin', 'linkedin url']);
          const xIndex = getColumnIndex(['x', 'twitter', 'x url', 'twitter url']);
          const instagramIndex = getColumnIndex(['instagram', 'instagram url']);
          const customLinksIndex = getColumnIndex(['custom social links', 'social links', 'other links']);

          // Parse data rows
          const users: FullCSVUser[] = [];
          const emailSet = new Set<string>(); // Track unique emails
          const duplicateEmails: string[] = []; // Track duplicate emails for reporting
          
          for (let i = 1; i < nonEmptyLines.length; i++) {
            const line = nonEmptyLines[i];
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Remove quotes
            
            // Skip completely empty rows
            if (values.every(v => !v || v.trim() === '')) {
              continue;
            }
            
            const fullName = values[nameIndex];
            const email = values[emailIndex]?.toLowerCase(); // Normalize email
            const username = values[usernameIndex];
            const phone = values[phoneIndex];
            
            // Check for duplicates within CSV (by email)
            if (email && emailSet.has(email)) {
              duplicateEmails.push(email);
              continue; // Skip this duplicate
            }
            
            if (email) {
              emailSet.add(email);
            }
            
            // Send ALL records to backend (including incomplete ones) for proper validation
            const user: FullCSVUser = {
              fullName: fullName || '',
              email: email || '',
              username: username || '',
              phone: phone || '',
              jobTitle: jobTitleIndex !== -1 ? values[jobTitleIndex] : undefined,
              company: companyIndex !== -1 ? values[companyIndex] : undefined,
              website: websiteIndex !== -1 ? values[websiteIndex] : undefined,
              bio: bioIndex !== -1 ? values[bioIndex] : undefined,
              additionalEmails: additionalEmailsIndex !== -1 ? values[additionalEmailsIndex] : undefined,
              additionalPhones: additionalPhonesIndex !== -1 ? values[additionalPhonesIndex] : undefined,
              street: streetIndex !== -1 ? values[streetIndex] : undefined,
              city: cityIndex !== -1 ? values[cityIndex] : undefined,
              state: stateIndex !== -1 ? values[stateIndex] : undefined,
              zipCode: zipCodeIndex !== -1 ? values[zipCodeIndex] : undefined,
              country: countryIndex !== -1 ? values[countryIndex] : undefined,
              linkedin: linkedinIndex !== -1 ? values[linkedinIndex] : undefined,
              x: xIndex !== -1 ? values[xIndex] : undefined,
              instagram: instagramIndex !== -1 ? values[instagramIndex] : undefined,
              customSocialLinks: customLinksIndex !== -1 ? values[customLinksIndex] : undefined,
            };
            
            users.push(user);
          }

          if (users.length === 0) {
            reject(new Error('No valid user data found in CSV'));
            return;
          }

          // Report duplicates if any
          if (duplicateEmails.length > 0) {
            const uniqueDuplicates = Array.from(new Set(duplicateEmails));
            console.warn(`Found ${duplicateEmails.length} duplicate emails in CSV. Removed duplicates: ${uniqueDuplicates.join(', ')}`);
          }

          // Check batch size limit
          if (users.length > BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH) {
            reject(new Error(`CSV contains ${users.length} users (after removing duplicates), which exceeds the maximum limit of ${BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users per batch. Please split your CSV into smaller files with a maximum of ${BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users each.`));
            return;
          }

          resolve({ 
            users, 
            duplicateCount: duplicateEmails.length, 
            duplicateEmails: Array.from(new Set(duplicateEmails))
          });
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
      console.log('🔴 FRONTEND: Calling /admin/bulk-invitations/validate - Creates records in INVITATION TABLE');
      console.log('🔴 FRONTEND: Number of invitations being validated:', users.length);
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

  const validateFullUsers = async (users: FullCSVUser[]): Promise<FullUserValidationResult> => {
    try {
      console.log('🟢 FRONTEND: Calling /admin/bulk-users/validate - Should validate for USER TABLE');
      console.log('🟢 FRONTEND: Number of users being validated:', users.length);
      const response = await apiService.post<{ success: boolean; data: FullUserValidationResult }>('/admin/bulk-users/validate', { users });
      return response.data;
    } catch (error: any) {
      console.error('Full user validation error:', error);
      if (error.response?.data?.error === 'INVALID_CSV_FORMAT') {
        throw new Error('Invalid CSV format. Please check your CSV structure.');
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
      console.log('🔴 FRONTEND: Calling /admin/bulk-invitations/send - Creates records in INVITATION TABLE');
      console.log('🔴 FRONTEND: Number of invitations being sent:', users.length);
      const response = await apiService.post<{ success: boolean; data: SendResult; message: string }>('/admin/bulk-invitations/send', { users });
      console.log('🔴 FRONTEND: API Response:', response);
      return response.data; // Extract the data from the response
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

  const createFullUsers = async (users: FullCSVUser[]): Promise<SendResult> => {
    try {
      console.log('🟢 FRONTEND: Calling /admin/bulk-users/create - Should create users in USER TABLE');
      console.log('🟢 FRONTEND: Number of users being created:', users.length);
      const response = await apiService.post<{ success: boolean; data: SendResult; message: string }>('/admin/bulk-users/create', { users });
      console.log('🟢 FRONTEND: API Response:', response);
      return response.data; // Extract the data from the response
    } catch (error: any) {
      console.error('Create users error:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your login status.');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(error.response?.data?.message || 'Failed to create users');
    }
  };

  const handleSendEmailInvitations = async () => {
    if (!inviteCsvFile) {
      toast.warning('Please upload a CSV file before sending email invitations.');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      // Parse CSV
      const parseResult = await parseInviteCSV(inviteCsvFile);
      const { users, duplicateCount, duplicateEmails } = parseResult;
      setProgress(30);

      // Show duplicate notification if any
      if (duplicateCount > 0) {
        const uniqueDuplicates = Array.from(new Set(duplicateEmails));
        toast.info(`Found ${duplicateCount} duplicate emails in CSV. Removed duplicates: ${uniqueDuplicates.join(', ')}`);
      }

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

  const handleCreateFullUsers = async () => {
    if (!createCsvFile) {
      toast.warning('Please upload a CSV file before creating users.');
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      // Parse CSV
      const parseResult = await parseFullUserCSV(createCsvFile);
      const { users, duplicateCount, duplicateEmails } = parseResult;
      setProgress(30);

      // Show duplicate notification if any
      if (duplicateCount > 0) {
        const uniqueDuplicates = Array.from(new Set(duplicateEmails));
        toast.info(`Found ${duplicateCount} duplicate emails in CSV. Removed duplicates: ${uniqueDuplicates.join(', ')}`);
      }

      // Validate users
      const validation = await validateFullUsers(users);
      setFullUserValidationResult(validation);
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
    const currentFile = activeTab === 'invite' ? inviteCsvFile : createCsvFile;
    if (!currentFile) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      if (activeTab === 'invite' && validationResult) {
        // Get only new users for sending invitations
        const newUsers = validationResult.results
          .filter(result => !result.isExisting)
          .map(result => ({ fullName: result.fullName, email: result.email }));

        if (newUsers.length === 0) {
          toast.warning('All users are already registered. No invitations will be sent.');
          clearFileAndResults();
          return;
        }

        // Send invitations
        const result = await sendInvitations(newUsers);
        setSendResult(result);
        clearFileAndResults();

        // Show success popup
        setSuccessCount(result.successCount);
        setShowSuccessPopup(true);

        // Show success notification
        toast.success(result.message);

      } else if (activeTab === 'create' && fullUserValidationResult) {
        // Parse CSV once to get all users data
        const parseResult = await parseFullUserCSV(createCsvFile!);
        const { users: allUsers } = parseResult;
        
        // Get only valid new users for creation
        const validUsers = fullUserValidationResult.results
          .filter(result => !result.isExisting && result.isValid)
          .map(result => allUsers.find(u => u.email === result.email))
          .filter(Boolean) as FullCSVUser[];

        if (validUsers.length === 0) {
          toast.warning('No valid new users to create.');
          clearFileAndResults();
          return;
        }

        // Create full users
        const result = await createFullUsers(validUsers);
        setSendResult(result);
        clearFileAndResults();

        // Show success popup
        setSuccessCount(result.successCount);
        setShowSuccessPopup(true);

        // Show success notification
        toast.success(result.message);
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadSampleCSV = () => {
    let csvContent = '';
    
    if (activeTab === 'invite') {
      csvContent = `Full Name,Email
John Doe,john.doe@example.com
Jane Smith,jane.smith@example.com
Bob Johnson,bob.johnson@example.com
Alice Brown,alice.brown@example.com
Charlie Wilson,charlie.wilson@example.com
# Note: Maximum 50 users per CSV file`;
    } else {
      csvContent = `Full Name,Email,Username,Phone,Job Title,Company,Website,Bio,Additional Emails,Additional Phones,Street,City,State,Zip Code,Country,LinkedIn,X,Instagram,Custom Social Links
John Doe,john.doe@example.com,johndoe,+1-555-0123,Senior Developer,TechCorp,https://johndoe.dev,Passionate developer with 5+ years experience,john.d@example.com,+1-555-0124,"123 Tech Street","San Francisco",CA,94105,"United States",https://linkedin.com/in/johndoe,https://x.com/johndoe,https://instagram.com/johndoe,"TikTok:https://tiktok.com/@johndoe;GitHub:https://github.com/johndoe"
Jane Smith,jane.smith@example.com,janesmith,+1-555-0125,Product Manager,InnovateInc,https://janesmith.com,Product strategy and user experience expert,jane.s@example.com,+1-555-0126,"456 Innovation Ave","New York",NY,10001,"United States",https://linkedin.com/in/janesmith,https://x.com/janesmith,https://instagram.com/janesmith,"Medium:https://medium.com/@janesmith"
Bob Johnson,bob.johnson@example.com,bobjohnson,+44-20-7946-0958,Marketing Director,CreativeAgency,,Creative marketer with a passion for storytelling,bob.j@example.com,,"789 Creative Lane",London,"",SW1A 1AA,"United Kingdom",https://linkedin.com/in/bobjohnson,https://x.com/bobjohnson,,
# Note: Maximum 50 users per CSV file
# REQUIRED FIELDS: Full Name, Email, Username, Phone
# OPTIONAL FIELDS: All other fields
# Custom Social Links format: Platform:URL;Platform:URL (semicolon separated)
# Additional Emails/Phones: comma or semicolon separated`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeTab === 'invite' ? 'sample_bulk_invitations.csv' : 'sample_bulk_users.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getConfirmationMessage = () => {
    if (activeTab === 'invite' && validationResult) {
      const { totalUsers, existingUsers, newUsers } = validationResult;

      if (newUsers === 0) {
        return 'All users are already registered. No invitations will be sent.';
      } else if (existingUsers === 0) {
        return `All users are new. Confirm to send invitations to ${newUsers} users?`;
      } else {
        return `${existingUsers} user(s) already registered. Confirm to send invitations to ${newUsers} new user(s)?`;
      }
    } else if (activeTab === 'create' && fullUserValidationResult) {
      const { totalUsers, validUsers, missingFieldsUsers, duplicateUsers } = fullUserValidationResult;

      if (validUsers === 0) {
        return 'No valid new users to create.';
      } else {
        let message = `Confirm to create ${validUsers} valid user(s) out of ${totalUsers} uploaded records?`;
        
        const issues = [];
        if (missingFieldsUsers > 0) {
          issues.push(`${missingFieldsUsers} missing required fields`);
        }
        if (duplicateUsers > 0) {
          issues.push(`${duplicateUsers} duplicates`);
        }
        
        if (issues.length > 0) {
          message += ` (${issues.join(' and ')} will be skipped)`;
        }
        
        return message;
      }
    }
    return '';
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('invite')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'invite'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Invite via Email
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'create'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Import Full User Details
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Tab Content */}
          {activeTab === 'invite' ? (
            <>
              {/* Info Alert - Invite Tab */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Email Invitation Process</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Upload a CSV file with Full Name and Email columns. The system will send onboarding links to new users only.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Info Alert - Create Tab */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Full User Import Process</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Upload a comprehensive CSV file to create complete user profiles directly. The system will check for duplicates and create QR codes automatically.
                    </p>
                    <div className="text-xs text-green-600 mt-2">
                      <p><strong>Required:</strong> Full Name, Email, Username, Phone</p>
                      <p><strong>Optional:</strong> Job Title, Company, Website, Bio, Address, Social Links, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Limits Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">Bulk Import Limits</h3>
                <div className="text-sm text-gray-700 mt-2 space-y-1">
                  <p>• Maximum <span className="font-semibold">{BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users</span> per CSV file</p>
                  <p>• Maximum <span className="font-semibold">{BULK_INVITATION_LIMITS.MAX_DAILY_INVITATIONS} {activeTab === 'invite' ? 'invitations' : 'users'}</span> per day</p>
                  <p className="text-xs text-gray-600 mt-2">
                    💡 If you have more than {BULK_INVITATION_LIMITS.MAX_USERS_PER_BATCH} users, split them into multiple CSV files
                  </p>
                </div>
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
                  onChange={activeTab === 'invite' ? handleInviteFileChange : handleCreateFileChange}
                      className="hidden"
                  id="csv-file-upload"
                    />
                <label htmlFor="csv-file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                      {activeTab === 'invite' 
                        ? (inviteCsvFile ? inviteCsvFile.name : 'Click to upload or drag and drop')
                        : (createCsvFile ? createCsvFile.name : 'Click to upload or drag and drop')
                      }
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
              onClick={activeTab === 'invite' ? handleSendEmailInvitations : handleCreateFullUsers}
              disabled={!(activeTab === 'invite' ? inviteCsvFile : createCsvFile) || isProcessing}
                  className="btn-primary flex items-center w-full sm:w-auto"
                >
              {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                    </>
                  ) : (
                <>
                  {activeTab === 'invite' ? (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Email Invitations
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User Profiles
                    </>
                  )}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {activeTab === 'invite' ? 'Invitation Results' : 'User Creation Results'}
              </h3>
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
              
              {/* Detailed Results */}
              {sendResult.results && sendResult.results.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Detailed Results</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sendResult.results.map((result, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="px-3 py-2">{result.fullName}</td>
                            <td className="px-3 py-2">{result.email}</td>
                            <td className="px-3 py-2">
                              {result.success ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Success
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Failed
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-gray-600">
                              {result.success 
                                ? `${activeTab === 'invite' ? 'Invitation sent' : 'User created'} successfully`
                                : result.error || 'Unknown error'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (validationResult || fullUserValidationResult) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-medium text-gray-900">
                Confirm {activeTab === 'invite' ? 'Invitation' : 'User Creation'}
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              {getConfirmationMessage()}
            </p>

            {/* Validation Details */}
            {activeTab === 'invite' && validationResult && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>Total Users: <span className="font-medium">{validationResult.totalUsers}</span></div>
                  <div>New Users: <span className="font-medium text-green-600">{validationResult.newUsers}</span></div>
                  <div>Existing Users: <span className="font-medium text-yellow-600">{validationResult.existingUsers}</span></div>
                </div>

                {/* Show existing users list */}
                {validationResult.existingUsers > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">📋 Existing Users Found</h4>
                    
                    {/* Summary of existing users */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">The following users already exist and will not receive invitations:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {validationResult.results.some(r => r.existingUser) && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">👤 Already registered users</span>
                        )}
                        {validationResult.results.some(r => r.existingInvitation && !r.existingUser) && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">📧 Invitations already sent</span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      <table className="min-w-full text-sm border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Name</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Email</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validationResult.results
                            .filter(result => result.isExisting)
                            .map((result, index) => {
                              let statusBadge = '';
                              let bgColor = '';
                              let statusText = '';
                              
                              if (result.existingUser) {
                                // User exists in users table - show as "Already Registered"
                                statusBadge = 'bg-blue-100 text-blue-800';
                                statusText = 'Already Registered';
                                bgColor = 'bg-blue-50';
                              } else if (result.existingInvitation) {
                                // User only exists in invitations table - show as "Invitation Already Sent"
                                statusBadge = 'bg-orange-100 text-orange-800';
                                statusText = 'Invitation Already Sent';
                                bgColor = 'bg-orange-50';
                              }
                              
                              return (
                                <tr key={index} className={`border-b border-gray-200 ${bgColor}`}>
                                  <td className="px-3 py-2 border-r border-gray-200">
                                    <div className="font-medium text-gray-900">
                                      {result.fullName}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 border-r border-gray-200 break-words">
                                    <div className="text-sm text-gray-700">
                                      {result.email}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusBadge}`}>
                                      {result.existingUser && (
                                        <>
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          {statusText}
                                        </>
                                      )}
                                      {!result.existingUser && result.existingInvitation && (
                                        <>
                                          <Clock className="w-3 h-3 mr-1" />
                                          {statusText}
                                        </>
                                      )}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Help text */}
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      💡 <strong>What happens next:</strong> Only the {validationResult.newUsers} new users will receive email invitations. Existing users will be skipped.
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'create' && fullUserValidationResult && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>Total Users: <span className="font-medium">{fullUserValidationResult.totalUsers}</span></div>
                  <div>Valid Users: <span className="font-medium text-green-600">{fullUserValidationResult.validUsers}</span></div>
                  <div>Missing Fields: <span className="font-medium text-orange-600">{fullUserValidationResult.missingFieldsUsers || 0}</span></div>
                  <div>Duplicate Users: <span className="font-medium text-red-600">{fullUserValidationResult.duplicateUsers || 0}</span></div>
              </div>

                {/* Show detailed validation results */}
                {fullUserValidationResult.invalidUsers > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">📋 Invalid Records Found</h4>
                    
                    {/* Summary of issues */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">The following records cannot be created due to issues:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {fullUserValidationResult.results.some(r => r.reason === 'MISSING_FIELDS') && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">⚠️ Missing required fields</span>
                        )}
                        {fullUserValidationResult.results.some(r => r.duplicateFields?.email) && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">📧 Email conflicts</span>
                        )}
                        {fullUserValidationResult.results.some(r => r.duplicateFields?.username) && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">👤 Username conflicts</span>
                        )}
                        {fullUserValidationResult.results.some(r => r.duplicateFields?.phone) && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">📱 Phone conflicts</span>
                        )}
                  </div>
                </div>
                    <div className="max-h-80 overflow-y-auto">
                      <table className="min-w-full text-sm border border-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Name</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Email</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Username</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Phone</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Issues</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fullUserValidationResult.results
                            .filter(result => !result.isValid)
                            .map((result, index) => {
                              const isMissingFields = result.reason === 'MISSING_FIELDS';
                              const bgColor = isMissingFields ? 'bg-orange-50' : 'bg-red-50';
                              
                              return (
                                <tr key={index} className={`border-b border-gray-200 ${bgColor}`}>
                                  <td className="px-3 py-2 border-r border-gray-200">
                                    <div className="font-medium text-gray-900">
                                      {result.fullName === 'N/A' ? (
                                        <span className="text-gray-400 italic">Missing</span>
                                      ) : (
                                        result.fullName
                                      )}
                                    </div>
                                    {result.missingFields?.includes('fullName') && (
                                      <div className="text-xs text-orange-600 mt-1">Required field missing</div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 border-r border-gray-200 break-words">
                                    <div className="text-sm text-gray-700">
                                      {result.email === 'N/A' ? (
                                        <span className="text-gray-400 italic">Missing</span>
                                      ) : (
                                        result.email
                                      )}
                                    </div>
                                    {result.duplicateFields?.email && (
                                      <div className="text-xs text-red-600 mt-1">Already exists</div>
                                    )}
                                    {result.missingFields?.includes('email') && (
                                      <div className="text-xs text-orange-600 mt-1">Required field missing</div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 border-r border-gray-200">
                                    <div className="text-sm text-gray-700">
                                      {result.username === 'N/A' ? (
                                        <span className="text-gray-400 italic">Missing</span>
                                      ) : (
                                        `@${result.username}`
                                      )}
                                    </div>
                                    {result.duplicateFields?.username && (
                                      <div className="text-xs text-red-600 mt-1">Already exists</div>
                                    )}
                                    {result.missingFields?.includes('username') && (
                                      <div className="text-xs text-orange-600 mt-1">Required field missing</div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2 border-r border-gray-200">
                                    <div className="text-sm text-gray-700">
                                      {result.phone === 'N/A' ? (
                                        <span className="text-gray-400 italic">Missing</span>
                                      ) : (
                                        result.phone
                                      )}
                                    </div>
                                    {result.duplicateFields?.phone && (
                                      <div className="text-xs text-red-600 mt-1">Already exists</div>
                                    )}
                                    {result.missingFields?.includes('phone') && (
                                      <div className="text-xs text-orange-600 mt-1">Required field missing</div>
                                    )}
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="flex flex-wrap gap-1">
                                      {/* Missing fields badges */}
                                      {result.missingFields?.map((field, idx) => (
                                        <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                          ⚠️ {field === 'fullName' ? 'Name' : field === 'email' ? 'Email' : field === 'username' ? 'Username' : 'Phone'}
                                        </span>
                                      ))}
                                      
                                      {/* Duplicate fields badges */}
                                      {result.duplicateFields?.email && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                                          📧 Email
                                        </span>
                                      )}
                                      {result.duplicateFields?.username && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                          👤 Username
                                        </span>
                                      )}
                                      {result.duplicateFields?.phone && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                          📱 Phone
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Help text */}
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      💡 <strong>What happens next:</strong> Only the {fullUserValidationResult.validUsers} valid records will be created if you proceed. Records with missing required fields or duplicates will be skipped.
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3">
              {(activeTab === 'invite' && validationResult?.newUsers === 0) || 
               (activeTab === 'create' && fullUserValidationResult?.validUsers === 0) ? (
                // Show only Close button when no action needed
                <button
                  onClick={clearFileAndResults}
                  className="btn-secondary flex-1"
                  >
                  Close
                  </button>
              ) : (
                // Show Cancel and Confirm buttons for normal cases
                <>
                  <button
                    onClick={clearFileAndResults}
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
                        {activeTab === 'invite' ? 'Sending...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        {activeTab === 'invite' ? (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Confirm & Send
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                            Confirm & Create
                          </>
                        )}
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
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'invite' ? 'Invitations Sent Successfully!' : 'Users Created Successfully!'}
              </h3>
                    </div>
            
            <p className="text-gray-600 mb-6">
              {activeTab === 'invite' 
                ? `Invitations have been sent to ${successCount} user(s).`
                : `${successCount} user profile(s) have been created successfully with invitations.`
              }
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