import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Edit,
  Clock,
  AlertCircle,
  Pencil,
  Save,
  X as Close,
  Plus,
  X,
  Copy
} from 'lucide-react';
import apiService from '../../services/api';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAvatar from '../../components/UserAvatar';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';
import { countries } from '../../data';
import { isValidPhoneNumber } from 'react-phone-number-input';

// Custom styles for react-select to match the existing design
const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    border: state.isFocused ? '2px solid #8b5cf6' : '1px solid #d1d5db',
    borderRadius: '0.375rem',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none',
    minHeight: '42px',
    '&:hover': {
      border: '1px solid #8b5cf6'
    },
    '&:focus-within': {
      border: '2px solid #8b5cf6',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
    }
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#f3f4f6' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    padding: '8px 12px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: state.isSelected ? '#8b5cf6' : '#f3f4f6'
    }
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#374151'
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#374151'
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#6b7280'
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: '#d1d5db'
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#9ca3af'
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    '&:hover': {
      color: '#6b7280'
    }
  })
};

interface Invitation {
  _id: string;
  username: string;
  emailAddress: string;
  status: string;
  nfcStatus?: string;
  updatedAt?: string;
  tokenExpiresAt?: string;
  token?: string;
  createdAt?: string;
  userId?: string;
}

interface UserProfile {
  _id: string;
  id?: string;
  username: string;
  fullName: string;
  email: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  profilePicture?: string;
  additionalEmails?: string | string[];
  website?: string;
  cardColor?: string;
  qrCodeUrl?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  orgType?: string;
  phoneNumber?: { value: string; country: string };
  phoneNumbers?: { value: string; country: string }[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  socialLinks?: { platform: string; url: string }[];
  googleWallet?: { objectId: string };
  stats?: { views: number; shares: number; connections: number; saves: number };
  subscription?: { plan: string; status: string };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const FFUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  // Add state for additionalPhones for edit mode
  const [additionalPhones, setAdditionalPhones] = useState<{ value: string, country: string }[]>([]);
  const [additionalEmails, setAdditionalEmails] = useState<{ value: string }[]>([]);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [customSocialLinks, setCustomSocialLinks] = useState<{ platform: string; url: string }[]>([]);

  useEffect(() => {
    if (location.state?.editMode || location.state?.edit) {
      setEditMode(true);
    }
  }, [location.state]);

  console.info(editMode,'edit')

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setAuthError('');
      
      try {
          const userRes = await apiService.get(`/profile/admin/${userId}`);
          setUserProfile(userRes.data);
      } catch (error: any) {
        const errorMsg = error?.response?.data?.error?.message || error?.response?.data?.message || 'Failed to load user profile';
          setAuthError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    // Initialize additionalPhones from profile in edit mode
    if (userProfile && userProfile.data && userProfile.data.user && Array.isArray(userProfile.data.user.phoneNumbers)) {
      setAdditionalPhones(userProfile.data.user.phoneNumbers.map((p: { value: string, country: string }) => ({ value: p.value, country: p.country || '' })));
    }
    // Initialize additionalEmails from profile in edit mode
    if (userProfile && userProfile.data && userProfile.data.user) {
      const emails = userProfile.data.user.additionalEmails;
      if (Array.isArray(emails)) {
        setAdditionalEmails(emails.map((e: any) => typeof e === 'string' ? { value: e } : e));
      } else if (typeof emails === 'string' && emails.trim()) {
        setAdditionalEmails(emails.split(',').map((e: string) => ({ value: e.trim() })));
      } else {
        setAdditionalEmails([]);
      }
    }
    // Initialize customSocialLinks from profile in edit mode
    if (userProfile && userProfile.data && userProfile.data.user && Array.isArray(userProfile.data.user.socialLinks)) {
      const customLinks = userProfile.data.user.socialLinks.filter(
        (l: { platform: string; url: string }) => !['linkedin','x','instagram'].includes(l.platform)
      );
      setCustomSocialLinks(customLinks);
    }
  }, [userProfile]);

  useEffect(() => {
    if (editMode && userProfile && userProfile.data && userProfile.data.user) {
      setEditedProfile({ ...userProfile.data.user });
    }
  }, [editMode, userProfile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStatus = (invitation: Invitation) => {
    if (invitation.status === 'pending' && invitation.tokenExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(invitation.tokenExpiresAt);
      if (now > expiresAt) {
        return 'expired';
      }
    }
    return invitation.status;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      invited: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      expired: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.invited;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status === 'invited' ? 'Invited' : 
         status === 'completed' ? 'Completed' : 
         status === 'expired' ? 'Invite Expired' : status}
      </span>
    );
  };

  const displayValue = (value: string | undefined | null) => {
    return value && value.trim() !== '' ? value : '-';
  };

  // Function to generate initials from fullName
  const getInitials = (fullName: string | undefined) => {
    if (!fullName || fullName.trim() === '') return '??';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      // If only one name, use first and last character
      const name = names[0];
      return name.length >= 2 ? `${name[0]}${name[name.length - 1]}`.toUpperCase() : name.toUpperCase();
    }
    
    // Use first letter of first name and first letter of last name
    const firstInitial = names[0][0] || '';
    const lastInitial = names[names.length - 1][0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading details...</p>
      </div>
    );
  }

  if (userProfile) {
    const profile = editMode && editedProfile ? editedProfile : userProfile.data.user;
    const invitationData = userProfile.data.invitation;
    
    const customLinks = profile?.socialLinks?.filter(
      (l: { platform: string; url: string }) => !['linkedin','x','instagram'].includes(l.platform)
    ) || [];
    const standardLinks = profile?.socialLinks?.filter(
      (l: { platform: string; url: string }) => ['linkedin','x','instagram'].includes(l.platform)
    ) || [];

    // Add a handler for copying the profile URL (now in scope)
    const handleCopyProfileUrl = () => {
      const url = profile?.username ? `https://twintik.com/${profile.username}` : '';
      if (url) {
        navigator.clipboard.writeText(url);
        toast.success('Profile URL copied!');
      }
    };

    const handleEdit = () => {
      setEditMode(true);
      setEditedProfile({ ...userProfile.data.user });
    };

    const handleCancel = () => {
      setEditMode(false);
      setEditedProfile(null);
      setSelectedProfilePicture(null);
      setProfilePicturePreview(null);
      setValidationErrors({});
      // Reset custom social links to original state
      if (userProfile && userProfile.data && userProfile.data.user && Array.isArray(userProfile.data.user.socialLinks)) {
        const customLinks = userProfile.data.user.socialLinks.filter(
          (l: { platform: string; url: string }) => !['linkedin','x','instagram'].includes(l.platform)
        );
        setCustomSocialLinks(customLinks);
      } else {
        setCustomSocialLinks([]);
      }
      // Clear the file input
      const fileInput = document.getElementById('profile-picture-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    };

    const handleChange = (field: string, value: any) => {
      setEditedProfile(prev => prev ? { ...prev, [field]: value } : prev);
    };

    const handleNestedChange = (section: string, field: string, value: any) => {
      setEditedProfile(prev => prev ? {
        ...prev,
        [section]: {
          ...((prev as any)[section] || {}),
          [field]: value
        }
      } : prev);
    };

    const handleSocialLinkChange = (platform: string, value: string) => {
      setEditedProfile(prev => {
        if (!prev) return prev;
        const links = prev.socialLinks ? [...prev.socialLinks] : [];
        const idx = links.findIndex(l => l.platform === platform);
        if (idx >= 0) {
          links[idx] = { ...links[idx], url: value };
        } else {
          links.push({ platform, url: value });
        }
        return { ...prev, socialLinks: links };
      });
    };

    const handleCustomLinkChange = (idx: number, field: 'platform' | 'url', value: string) => {
      setCustomSocialLinks(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [field]: value };
        return updated;
      });
      
      // Also update the editedProfile to keep it in sync
      setEditedProfile(prev => {
        if (!prev) return prev;
        const links = prev.socialLinks ? [...prev.socialLinks] : [];
        const standard = links.filter(l => ['linkedin','x','instagram'].includes(l.platform));
        const updatedCustomLinks = [...customSocialLinks];
        updatedCustomLinks[idx] = { ...updatedCustomLinks[idx], [field]: value };
        return { ...prev, socialLinks: [...standard, ...updatedCustomLinks] };
      });
    };

    const addCustomSocialLink = () => {
      setCustomSocialLinks(prev => [...prev, { platform: '', url: '' }]);
    };

    const removeCustomSocialLink = (index: number) => {
      setCustomSocialLinks(prev => prev.filter((_, i) => i !== index));
      
      // Also update the editedProfile to keep it in sync
      setEditedProfile(prev => {
        if (!prev) return prev;
        const links = prev.socialLinks ? [...prev.socialLinks] : [];
        const standard = links.filter(l => ['linkedin','x','instagram'].includes(l.platform));
        const updatedCustomLinks = customSocialLinks.filter((_, i) => i !== index);
        return { ...prev, socialLinks: [...standard, ...updatedCustomLinks] };
      });
    };

    const handlePrimaryPhoneChange = (value: string) => {
      setEditedProfile(prev => prev ? {
        ...prev,
        phoneNumber: { value, country: prev.phoneNumber?.country || '' }
      } : prev);
    };

    const handleAdditionalPhoneChange = (index: number, value: string, country: string) => {
      setAdditionalPhones(prev => {
        const updated = [...prev];
        updated[index] = { value, country };
        return updated;
      });
    };

    const addAdditionalPhone = () => {
      setAdditionalPhones(prev => [...prev, { value: '', country: '' }]);
    };

    const removeAdditionalPhone = (index: number) => {
      setAdditionalPhones(prev => prev.filter((_, i) => i !== index));
    };

    const handleAdditionalEmailChange = (index: number, value: string) => {
      setAdditionalEmails(prev => {
        const updated = [...prev];
        updated[index] = { value };
        return updated;
      });
    };

    const addAdditionalEmail = () => {
      setAdditionalEmails(prev => [...prev, { value: '' }]);
    };

    const removeAdditionalEmail = (index: number) => {
      setAdditionalEmails(prev => prev.filter((_, i) => i !== index));
    };

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select a valid image file');
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }

        setSelectedProfilePicture(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfilePicturePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const removeProfilePicture = () => {
      setSelectedProfilePicture(null);
      setProfilePicturePreview(null);
      // Clear the file input
      const fileInput = document.getElementById('profile-picture-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    };

    const handleSave = async () => {
      if (!userProfile || !userProfile.data || !userProfile.data.user) return;
      const userId = userProfile.data.user._id || userProfile.data.user.id;
      
      // Clear previous validation errors
      setValidationErrors({});
      
      // Validation checks similar to mobile app
      const errors: { [key: string]: string } = {};
      
      // Required field validations
      if (!editedProfile?.jobTitle?.trim()) {
        errors.jobTitle = 'Job Title is required';
      }
      
      if (!editedProfile?.company?.trim()) {
        errors.company = 'Company is required';
      }
      
      if (!editedProfile?.email?.trim()) {
        errors.email = 'Primary Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedProfile.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      // Primary phone number validation (required, must not be just country code)
      if (!editedProfile?.phoneNumber?.value || !editedProfile.phoneNumber.value.trim()) {
        errors.phoneNumber = 'Primary Phone Number is required';
      } else {
        const value = editedProfile.phoneNumber.value.trim();
        // Remove all non-digit characters except leading +
        const digits = value.replace(/^\+/, '').replace(/\D/g, '');
        if (!digits) {
          errors.phoneNumber = 'Primary Phone Number is required';
        } else if (/[a-zA-Z]/.test(value)) {
          errors.phoneNumber = 'Phone number cannot contain alphabets';
        } else if (!isValidPhoneNumber(value)) {
          errors.phoneNumber = 'Please enter a valid phone number';
        }
      }
      
      if (!editedProfile?.address?.country?.trim()) {
        errors.addressCountry = 'Country is required';
      }
      
      // Phone number format validation (no alphabets and must be valid for country)
      if (editedProfile?.phoneNumber?.value) {
        if (/[a-zA-Z]/.test(editedProfile.phoneNumber.value)) {
          errors.phoneNumber = 'Phone number cannot contain alphabets';
        } else if (!isValidPhoneNumber(editedProfile.phoneNumber.value)) {
          errors.phoneNumber = 'Please enter a valid phone number';
        }
      }
      
      // Additional phone numbers validation (ignore if empty or only country code)
      additionalPhones.forEach((phone, index) => {
        const value = phone.value ? phone.value.trim() : '';
        // Get the country code (e.g., '+91')
        const countryCode = value.match(/^(\+\d{1,4})/)?.[1] || '';
        // If value is empty or exactly the country code, skip validation
        if (!value || value === countryCode) return;
        if (/[a-zA-Z]/.test(value)) {
          errors[`additionalPhone${index}`] = 'Phone number cannot contain alphabets';
        } else if (!isValidPhoneNumber(value)) {
          errors[`additionalPhone${index}`] = 'Please enter a valid phone number';
        }
      });
      
      // Website URL validation
      if (editedProfile?.website && editedProfile.website.trim()) {
        if (!/^https?:\/\/.+/.test(editedProfile.website)) {
          errors.website = 'Please enter a valid website URL starting with http:// or https://';
        }
      }
      
      // Social links validation (simple: must contain http or https if filled)
      if (editedProfile?.socialLinks) {
        editedProfile.socialLinks.forEach((link: any) => {
          if (link.url && link.url.trim()) {
            const url = link.url.trim();
            if (!/^https?:\/\//i.test(url)) {
              errors[`socialLink${link.platform}`] = 'URL must start with http:// or https://';
            }
          }
        });
      }
      // Custom social links validation (simple: must contain http or https if filled)
      if (customSocialLinks && Array.isArray(customSocialLinks)) {
        customSocialLinks.forEach((link: any, idx: number) => {
          // Validate platform name
          if (!link.platform || !link.platform.trim()) {
            errors[`customSocialLinkPlatform${idx}`] = 'Platform name is required';
          }
          // If platform is filled but url is empty, show error for url
          if (link.platform && link.platform.trim() && (!link.url || !link.url.trim())) {
            errors[`customSocialLinkUrl${idx}`] = 'Profile URL is required';
          }
          // Validate URL if platform is provided and url is filled
          if (link.platform && link.platform.trim() && link.url && link.url.trim()) {
            if (!/^https?:\/\//i.test(link.url)) {
              errors[`customSocialLinkUrl${idx}`] = 'URL must start with http:// or https://';
            }
          }
        });
      }
      
      // Show validation errors if any
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error('Please fill the required fields');
        return;
      }
      
      // Defensive filter for phoneNumbers before sending to backend (must have digits after country code, and correct country)
      const filteredPhones = additionalPhones
        .filter(p => {
          if (!p || typeof p.value !== 'string') return false;
          const value = p.value.trim();
          const countryCode = value.match(/^(\+\d{1,4})/)?.[1] || '';
          // Only include if there are digits after the country code
          return value && value !== countryCode;
        })
        .map(p => ({ value: p.value, country: p.country }));
      console.log('Filtered phoneNumbers to be sent:', filteredPhones);
      
      // Prepare the updated data with custom social links
      const updatedData = {
        ...editedProfile,
        phoneNumbers: filteredPhones,
        // Send additionalEmails as array
        additionalEmails: additionalEmails.filter(e => e.value && e.value.trim()).map(e => e.value).join(', '),
        // Combine standard social links with custom social links
        socialLinks: [
          ...(editedProfile?.socialLinks?.filter((l: any) => ['linkedin','x','instagram'].includes(l.platform)) || []),
          ...customSocialLinks.filter(link => link.platform && link.platform.trim())
        ],
        updatedBy: 'superadmin', // Always send 'superadmin' from FFUserDetail
      };

      // Add profile picture if selected
      if (selectedProfilePicture) {
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Data = e.target?.result as string;
          updatedData.profilePicture = base64Data;
          
          // Continue with the save process
          await performSave(updatedData, userId);
        };
        reader.readAsDataURL(selectedProfilePicture);
        return;
      }

      // If no new profile picture, save directly
      await performSave(updatedData, userId);
    };

    const performSave = async (updatedData: any, userId: string) => {
      // Remove fields that should not be updated
      const fieldsToRemove = [
        '_id', 'id', 'createdAt', 'updatedAt', '__v', 'stats', 'qrCodeUrl', 'googleWallet'
      ];
      fieldsToRemove.forEach(field => {
        delete updatedData[field];
      });
      
      try {
        const response = await api.put(`/profile/admin/${userId}`, updatedData, {
          headers: { 'x-twintik-client': 'web' }
        });
        toast.success('User profile updated successfully');
        // Update local state with new data
        setUserProfile((prev: any) => ({
          ...prev,
          data: {
            ...prev.data,
            user: response.data.user
          }
        }));
      setEditMode(false);
      setEditedProfile(null);
        setSelectedProfilePicture(null);
        setProfilePicturePreview(null);
        // Re-initialize additionalPhones and additionalEmails from updated data
        if (response.data.user) {
          setAdditionalPhones(Array.isArray(response.data.user.phoneNumbers)
            ? response.data.user.phoneNumbers.map((p: { value: string, country: string }) => ({ value: p.value, country: p.country || '' }))
            : []);
          const emails = response.data.user.additionalEmails;
          if (Array.isArray(emails)) {
            setAdditionalEmails(emails.map((e: any) => typeof e === 'string' ? { value: e } : e));
          } else if (typeof emails === 'string' && emails.trim()) {
            setAdditionalEmails(emails.split(',').map((e: string) => ({ value: e.trim() })));
          } else {
            setAdditionalEmails([]);
          }
        }
        // Navigate to previous screen and pass showToast state
        navigate('/admin/fnf-onboarding', { state: { showToast: true } });
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || 'Failed to update user profile';
        toast.error(errorMsg);
      }
    };

    const handleMarkAsConfigured = async () => {
      try {
        if (!invitationData) {
          toast.error('No invitation data found');
          return;
        }

        // Find the invitation by userId or email
        const invitationId = invitationData._id || userProfile.data.invitation?._id;
        if (!invitationId) {
          toast.error('Invitation ID not found');
          return;
        }

        const response = await apiService.put(`/invitation/${invitationId}/nfc-status`, {
          nfcStatus: 'configured'
        });

        if (response.data.success) {
          toast.success('NFC marked as configured successfully');
          
          // Update the local state to reflect the change
          setUserProfile(prev => ({
            ...prev,
            data: {
              ...prev.data,
              invitation: {
                ...prev.data.invitation,
                nfcStatus: 'configured',
                nfcConfiguredAt: response.data.nfcConfiguredAt
              }
            }
          }));
        }
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || 'Failed to update NFC status';
        toast.error(errorMsg);
      }
    };

    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate('/admin/fnf-onboarding')} className="btn btn-secondary">Back to List</button>
            <div className="flex flex-col items-center flex-1">
              <span className="font-bold text-xl">{profile?.fullName || '-'}</span>
              <div className="text-sm text-gray-500">FF User Profile Details</div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 font-medium mr-2">Status: Profile Completed</span>
                <span className="text-yellow-600 font-medium">NFC Pending</span>
              </div>
            </div>
            {!editMode ? (
              <button onClick={handleEdit} className="btn btn-primary flex items-center"><Pencil className="w-4 h-4 mr-1" /> Edit Profile</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} className="btn btn-success flex items-center"><Save className="w-4 h-4 mr-1" /> Save</button>
                <button onClick={handleCancel} className="btn btn-secondary flex items-center"><Close className="w-4 h-4 mr-1" /> Cancel</button>
              </div>
            )}
          </div>

          {/* Profile Picture and Basic Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="font-semibold mb-6 flex items-center justify-center">
                <User className="w-6 h-6 mr-2 text-purple-600" />
                <span className="text-lg">Profile Picture</span>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex-shrink-0 relative">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {profilePicturePreview ? (
                      <img 
                        src={profilePicturePreview} 
                        alt="Profile Preview" 
                        className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                      />
                    ) : profile?.profilePicture ? (
                      <img 
                        src={profile.profilePicture} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                        <span className="text-white text-3xl font-bold">
                          {getInitials(profile?.fullName)}
                        </span>
                      </div>
                    )}
                  </div>
                  

                  
                  {/* Remove current picture button in edit mode */}
                  {editMode && profile?.profilePicture && !profilePicturePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditedProfile(prev => prev ? { ...prev, profilePicture: null } : prev);
                        setSelectedProfilePicture(null);
                        setProfilePicturePreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                      title="Remove profile picture"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800">
                    {profilePicturePreview ? (
                      <span className="text-blue-600">New image selected</span>
                    ) : (
                      <span className="text-gray-700">{profile?.fullName || 'User Name'}</span>
                    )}
                  </div>
                </div>
                
                {/* Profile Picture Upload in Edit Mode */}
                {editMode && (
                  <div className="w-full max-w-xs space-y-3">
                    <div className="flex items-center justify-center">
                      <label 
                        htmlFor="profile-picture-input"
                        className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {profilePicturePreview ? 'Change Picture' : 'Update Picture'}
                      </label>
                  <input
                        id="profile-picture-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                  />
                </div>
                    
                    {profilePicturePreview && (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 text-center">
                      Recommended: Square image, max 5MB
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Section */}
            {profile?.qrCodeUrl && (
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
              <div className="font-semibold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="2" />
                  </svg>
                  Profile QR Code
              </div>
                <img
                  src={profile.qrCodeUrl}
                  alt="Profile QR Code"
                  className="w-40 h-40 object-contain border border-gray-200 rounded-lg"
                />
                <div className="mt-2 text-xs text-gray-500 break-all text-center">
                  {`https://twintik.com/${profile.username}`}
                </div>
                </div>
            )}
          </div>

          {/* Profile and Contact Information Cards - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Profile Information
              </div>
              <div className="space-y-4">
                {/* First row: Job Title and Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.jobTitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={editMode ? (profile?.jobTitle || '') : displayValue(profile?.jobTitle)}
                      disabled={!editMode}
                      onChange={e => {
                        // Only allow alphabets and spaces for job title
                        const value = e.target.value.replace(/[^A-Za-z ]/g, '');
                        handleChange('jobTitle', value);
                        // Clear error when user starts typing
                        if (validationErrors.jobTitle) {
                          setValidationErrors(prev => ({ ...prev, jobTitle: '' }));
                        }
                      }}
                    />
                    {validationErrors.jobTitle && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.jobTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.company ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={editMode ? (profile?.company || '') : displayValue(profile?.company)}
                      disabled={!editMode}
                      onChange={e => {
                        // Only allow alphabets and spaces for company
                        const value = e.target.value.replace(/[^A-Za-z ]/g, '');
                        handleChange('company', value);
                        // Clear error when user starts typing
                        if (validationErrors.company) {
                          setValidationErrors(prev => ({ ...prev, company: '' }));
                        }
                      }}
                    />
                    {validationErrors.company && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.company}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Second row: Website and Profile URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.website ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={editMode ? (profile?.website || '') : displayValue(profile?.website)}
                      disabled={!editMode}
                      onChange={e => {
                        handleChange('website', e.target.value);
                        // Clear error when user starts typing
                        if (validationErrors.website) {
                          setValidationErrors(prev => ({ ...prev, website: '' }));
                        }
                      }}
                      placeholder="https://example.com"
                    />
                    {validationErrors.website && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors.website}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile URL</label>
                    <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        value={profile?.username ? `https://twintik.com/${profile.username}` : '-'}
                      disabled
                    />
                      {profile?.username && (
                        <button type="button" onClick={handleCopyProfileUrl} className="p-2 hover:bg-gray-200 rounded">
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Third row: Bio (full width) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <div className="relative">
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      value={editMode ? (profile?.bio || '') : displayValue(profile?.bio)}
                      disabled={!editMode}
                      onChange={e => handleChange('bio', e.target.value)}
                      rows={3}
                    />
                    {editMode && (
                      <Pencil className="w-4 h-4 text-gray-400 absolute bottom-2 right-2" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Contact Information
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={editMode ? (profile?.email || '') : displayValue(profile?.email)}
                    disabled={true}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Emails</label>
                  {editMode ? (
                    <div className="space-y-2">
                      {additionalEmails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                            value={email.value}
                            onChange={e => handleAdditionalEmailChange(index, e.target.value)}
                            placeholder="Enter additional email"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalEmail(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors self-start mt-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addAdditionalEmail}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add additional email
                      </button>
                    </div>
                  ) : (
                    (() => {
                    const emails = profile?.additionalEmails ? profile.additionalEmails.split(',').map((e: string) => e.trim()).filter((e: string) => e) : [];
                    if (emails.length === 0) {
                      return (
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={editMode ? '' : '-'}
                          disabled={!editMode}
                          onChange={e => handleChange('additionalEmails', e.target.value)}
                        />
                      );
                    }
                    return emails.map((email: string, index: number) => (
                      <input
                        key={index}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                        value={editMode ? email : email}
                        disabled={!editMode}
                        onChange={e => {
                          const newEmails = [...emails];
                          newEmails[index] = e.target.value;
                          handleChange('additionalEmails', newEmails.join(', '));
                        }}
                      />
                    ));
                    })()
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone <span className="text-red-500">*</span></label>
                  {editMode ? (
                    <>
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="AE"
                        value={editedProfile?.phoneNumber?.value || ''}
                        onChange={(value) => {
                          handlePrimaryPhoneChange(value);
                          // Clear error when user starts typing
                          if (validationErrors.phoneNumber) {
                            setValidationErrors(prev => ({ ...prev, phoneNumber: '' }));
                          }
                        }}
                        placeholder="Enter phone number"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.phoneNumber && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {validationErrors.phoneNumber}
                        </p>
                      )}
                    </>
                  ) : (
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="AE"
                      value={profile?.phoneNumber?.value || ''}
                      onChange={() => {}}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Phones</label>
                  {editMode ? (
                    <div className="space-y-2">
                      {additionalPhones.map((phone, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="flex-1">
                            <PhoneInput
                              international
                              countryCallingCodeEditable={false}
                              defaultCountry={(phone.country && phone.country.length === 2 ? phone.country : 'AE') as any}
                              value={phone.value}
                              onChange={value => {
                                const country = phone.country && phone.country.length === 2 ? phone.country : 'AE';
                                handleAdditionalPhoneChange(index, value || '', country);
                                // Clear error when user starts typing
                                if (validationErrors[`additionalPhone${index}`]) {
                                  setValidationErrors(prev => ({ ...prev, [`additionalPhone${index}`]: '' }));
                                }
                              }}
                              onCountryChange={country => {
                                handleAdditionalPhoneChange(index, phone.value, country || '');
                              }}
                              placeholder="Enter phone number"
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                validationErrors[`additionalPhone${index}`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {validationErrors[`additionalPhone${index}`] && (
                              <p className="text-red-600 text-xs mt-1 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {validationErrors[`additionalPhone${index}`]}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAdditionalPhone(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors self-start mt-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addAdditionalPhone}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add another phone number
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(Array.isArray(profile?.phoneNumbers) && profile.phoneNumbers.length > 0
                        ? profile.phoneNumbers
                        : []).map((p: { value: string }, idx: number) => (
                          <PhoneInput
                            key={idx}
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="AE"
                            value={p.value}
                            onChange={() => {}}
                            disabled
                            className="w-full px-3 py-2 border rounded-md bg-gray-50 border-gray-200"
                          />
                        ))}
                      {(!profile?.phoneNumbers || profile.phoneNumbers.length === 0) && (
                        <div className="text-gray-400 text-sm">No additional phones</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Address Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Address Information
              </div>
              <div className="space-y-4">
                {/* First row: Street Address and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.address?.street || '') : displayValue(profile?.address?.street)}
                      disabled={!editMode}
                      onChange={e => handleNestedChange('address', 'street', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.address?.city || '') : displayValue(profile?.address?.city)}
                      disabled={!editMode}
                      onChange={e => {
                        // Only allow alphabets and spaces for city
                        const value = e.target.value.replace(/[^A-Za-z ]/g, '');
                        handleNestedChange('address', 'city', value);
                      }}
                    />
                  </div>
                </div>
                
                {/* Second row: State/Province and ZIP/Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.address?.state || '') : displayValue(profile?.address?.state)}
                      disabled={!editMode}
                      onChange={e => {
                        // Only allow alphabets and spaces for state
                        const value = e.target.value.replace(/[^A-Za-z ]/g, '');
                        handleNestedChange('address', 'state', value);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.address?.zipCode || '') : displayValue(profile?.address?.zipCode)}
                      disabled={!editMode}
                      onChange={e => handleNestedChange('address', 'zipCode', e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Third row: Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
                  {editMode ? (
                    <>
                      <Select
                        options={countries}
                        value={profile?.address?.country ? countries.find(c => c.label === profile?.address?.country) : null}
                        onChange={(selectedOption) => {
                          handleNestedChange('address', 'country', selectedOption?.label || '');
                          // Clear error when user selects
                          if (validationErrors.addressCountry) {
                            setValidationErrors(prev => ({ ...prev, addressCountry: '' }));
                          }
                        }}
                        placeholder="Select a country"
                        styles={{
                          ...selectStyles,
                          control: (provided: any, state: any) => ({
                            ...selectStyles.control(provided, state),
                            border: validationErrors.addressCountry ? '1px solid #ef4444' : selectStyles.control(provided, state).border
                          })
                        }}
                        isSearchable={true}
                        isClearable={true}
                        className="w-full"
                        classNamePrefix="react-select"
                        formatOptionLabel={(option: any) => (
                          <div className="flex items-center">
                            <span className="mr-2">{option.flag}</span>
                            <span>{option.label}</span>
                          </div>
                        )}
                      />
                      {validationErrors.addressCountry && (
                        <p className="text-red-600 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {validationErrors.addressCountry}
                        </p>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value={displayValue(profile?.address?.country)}
                      disabled
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Social Links
              </div>
              <div className="space-y-4">
                {[
                  { display: "LinkedIn", key: "linkedin" },
                  { display: "X", key: "x" },
                  { display: "Instagram", key: "instagram" }
                ].map(({ display, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{display}</label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors[`socialLink${key}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={editMode ? (profile?.socialLinks?.find((l: { platform: string; url: string }) => l.platform === key)?.url || '') : displayValue(profile?.socialLinks?.find((l: { platform: string; url: string }) => l.platform === key)?.url)}
                      disabled={!editMode}
                      onChange={e => {
                        handleSocialLinkChange(key, e.target.value);
                        // Clear error when user starts typing
                        if (validationErrors[`socialLink${key}`]) {
                          setValidationErrors(prev => ({ ...prev, [`socialLink${key}`]: '' }));
                        }
                      }}
                      placeholder={`https://${key.toLowerCase()}.com/yourprofile`}
                    />
                    {validationErrors[`socialLink${key}`] && (
                      <p className="text-red-600 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {validationErrors[`socialLink${key}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Social Links & Subscription */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Custom Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Custom Social Links
              </div>
              <div className="space-y-4">
                {customSocialLinks.length > 0 ? (
                  customSocialLinks.map((l: { platform: string; url: string }, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              validationErrors[`customSocialLinkPlatform${idx}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            value={l.platform || ''}
                            disabled={!editMode}
                            onChange={e => {
                              handleCustomLinkChange(idx, 'platform', e.target.value);
                              // Clear error when user starts typing
                              if (validationErrors[`customSocialLinkPlatform${idx}`]) {
                                setValidationErrors(prev => ({ ...prev, [`customSocialLinkPlatform${idx}`]: '' }));
                              }
                            }}
                            placeholder="e.g., Facebook, YouTube, TikTok"
                          />
                          {validationErrors[`customSocialLinkPlatform${idx}`] && (
                            <p className="text-red-600 text-xs flex items-center mt-1">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {validationErrors[`customSocialLinkPlatform${idx}`]}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                          <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              validationErrors[`customSocialLinkUrl${idx}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            value={l.url || ''}
                            disabled={!editMode}
                            onChange={e => {
                              handleCustomLinkChange(idx, 'url', e.target.value);
                              // Clear error when user starts typing
                              if (validationErrors[`customSocialLinkUrl${idx}`]) {
                                setValidationErrors(prev => ({ ...prev, [`customSocialLinkUrl${idx}`]: '' }));
                              }
                            }}
                            placeholder="https://example.com/yourprofile"
                          />
                          {validationErrors[`customSocialLinkUrl${idx}`] && (
                            <p className="text-red-600 text-xs flex items-center mt-1">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {validationErrors[`customSocialLinkUrl${idx}`]}
                            </p>
                          )}
                        </div>

                        {editMode && (
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => removeCustomSocialLink(idx)}
                              className="h-10 px-3 py-2 hover:bg-gray-200 rounded-md text-red-600 hover:text-red-800 transition-colors border border-gray-300 mt-6"
                              title="Remove custom social link"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No custom links</div>
                )}
                {editMode && (
                  <button
                    type="button"
                    onClick={addCustomSocialLink}
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors mt-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add custom social link
                  </button>
                )}
              </div>
            </div>

            {/* Subscription Info */}
            {profile?.subscription && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Subscription Information
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value={profile?.subscription?.plan || ''}
                      disabled={true}
                      onChange={e => handleNestedChange('subscription', 'plan', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Status</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value={profile?.subscription?.status || ''}
                      disabled={true}
                      onChange={e => handleNestedChange('subscription', 'status', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NFC Configuration & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* NFC Configuration */}
            <div className="md:col-span-2 bg-yellow-50 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold mb-1">NFC Configuration</div>
                  <div className={`font-medium mb-1 ${invitationData?.nfcStatus === 'configured' ? 'text-green-700' : 'text-yellow-700'}`}>
                    {invitationData?.nfcStatus === 'configured' ? 'NFC Configuration Completed' : 'NFC Configuration Pending'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {invitationData?.nfcStatus === 'configured' 
                      ? `NFC card configured on ${invitationData?.nfcConfiguredAt ? formatDate(invitationData.nfcConfiguredAt) : 'N/A'}`
                      : "User's profile is complete. NFC card needs to be configured manually."
                    }
                  </div>
                </div>
                {invitationData?.nfcStatus !== 'configured' && (
                  <button 
                    onClick={handleMarkAsConfigured}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Mark as Configured
                  </button>
                )}
              </div>
            </div>
            {/* Onboarding Timeline */}
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <div className="font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Onboarding Timeline
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-sm">Invitation Sent</div>
                    <div className="text-xs text-gray-500">
                      {invitationData?.invitationSentAt ? formatDate(invitationData.invitationSentAt) : '-'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium text-sm">Profile Completed</div>
                    <div className="text-xs text-gray-500">
                      {invitationData?.profileCompletedAt ? formatDate(invitationData.profileCompletedAt) : '-'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invitationData?.nfcStatus === 'configured' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <div className="font-medium text-sm">
                      {invitationData?.nfcStatus === 'configured' ? 'NFC Completed' : 'NFC Pending'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {invitationData?.nfcStatus === 'configured' 
                        ? (invitationData?.nfcConfiguredAt ? formatDate(invitationData.nfcConfiguredAt) : 'N/A')
                        : 'pending'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default FFUserDetail; 