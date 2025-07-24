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
      try {
        if (userId) {
          const userRes = await apiService.get(`/profile/admin/${userId}`);
          setUserProfile(userRes.data);
          setAuthError('');
        }
      } catch (error: any) {
        const errorMsg = error?.response?.data?.error?.message || error?.response?.data?.message || 'Failed to fetch details';
        if (errorMsg === 'Invalid token') {
          toast.error('Your session has expired or you are not authorized. Please log in again as a super admin.');
          setAuthError('Your session has expired or you are not authorized. Please log in again as a super admin.');
        } else {
          toast.error(errorMsg);
          setAuthError(errorMsg);
        }
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

    const handleCustomLinkChange = (idx: number, value: string) => {
      setEditedProfile(prev => {
        if (!prev) return prev;
        const links = prev.socialLinks ? [...prev.socialLinks] : [];
        const custom = links.filter(l => !['linkedin','x','instagram'].includes(l.platform));
        const all = links.filter(l => ['linkedin','x','instagram'].includes(l.platform));
        custom[idx] = { ...custom[idx], url: value };
        return { ...prev, socialLinks: [...all, ...custom] };
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
      
      // Prepare the updated data
      const updatedData = {
        ...editedProfile,
        phoneNumbers: additionalPhones.map(p => ({ value: p.value, country: p.country })),
        // Send additionalEmails as array
        additionalEmails: additionalEmails.filter(e => e.value && e.value.trim()).map(e => e.value).join(', '),
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.jobTitle || '') : displayValue(profile?.jobTitle)}
                      disabled={!editMode}
                      onChange={e => handleChange('jobTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.company || '') : displayValue(profile?.company)}
                      disabled={!editMode}
                      onChange={e => handleChange('company', e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Second row: Website and Profile URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.website || '') : displayValue(profile?.website)}
                      disabled={!editMode}
                      onChange={e => handleChange('website', e.target.value)}
                    />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editMode ? (profile?.email || '') : displayValue(profile?.email)}
                    disabled={true}
                    onChange={e => handleChange('email', e.target.value)}
                  />
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
                          {additionalEmails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAdditionalEmail(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors self-start mt-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                  {editMode ? (
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="AE"
                      value={editedProfile?.phoneNumber?.value || ''}
                      onChange={handlePrimaryPhoneChange}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                    />
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
                              }}
                              onCountryChange={country => {
                                handleAdditionalPhoneChange(index, phone.value, country || 'AE');
                              }}
                              placeholder="Enter phone number"
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                            />
                          </div>
                          {additionalPhones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAdditionalPhone(index)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors self-start mt-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
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
                      onChange={e => handleNestedChange('address', 'city', e.target.value)}
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
                      onChange={e => handleNestedChange('address', 'state', e.target.value)}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editMode ? (profile?.socialLinks?.find((l: { platform: string; url: string }) => l.platform === key)?.url || '') : displayValue(profile?.socialLinks?.find((l: { platform: string; url: string }) => l.platform === key)?.url)}
                      disabled={!editMode}
                      onChange={e => handleSocialLinkChange(key, e.target.value)}
                    />
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
                {customLinks.length > 0 ? (
                  customLinks.map((l: { platform: string; url: string }, idx: number) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{l.platform}</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={l.url || ''}
                        disabled={!editMode}
                        onChange={e => handleCustomLinkChange(idx, e.target.value)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No custom links</div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile?.subscription?.plan || ''}
                      disabled={!editMode}
                      onChange={e => handleNestedChange('subscription', 'plan', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Status</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={profile?.subscription?.status || ''}
                      disabled={!editMode}
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