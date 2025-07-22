import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  X as Close
} from 'lucide-react';
import apiService from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAvatar from '../../components/UserAvatar';

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
  userId?: string; // Added userId to the interface
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
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);


  console.info(invitation,'invitation');
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        // For completed invitations, fetch user profile directly
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

  // Helper function to display '-' for blank values in view mode
  const displayValue = (value: string | undefined | null) => {
    return value && value.trim() !== '' ? value : '-';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading details...</p>
      </div>
    );
  }


  // Show user profile if available
  if (userProfile) {
    const customLinks = userProfile?.socialLinks?.filter(
      (l: { platform: string; url: string }) => !['LinkedIn','Twitter','Facebook','Instagram','YouTube','GitHub'].includes(l.platform)
    ) || [];
    const standardLinks = userProfile?.socialLinks?.filter(
      (l: { platform: string; url: string }) => ['LinkedIn','Twitter','Facebook','Instagram','YouTube','GitHub'].includes(l.platform)
    ) || [];

    const handleEdit = () => {
      setEditMode(true);
      setEditedProfile({ ...userProfile });
    };
    const handleCancel = () => {
      setEditMode(false);
      setEditedProfile(null);
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
        const custom = links.filter(l => !['LinkedIn','Twitter','Facebook','Instagram','YouTube','GitHub'].includes(l.platform));
        const all = links.filter(l => ['LinkedIn','Twitter','Facebook','Instagram','YouTube','GitHub'].includes(l.platform));
        custom[idx] = { ...custom[idx], url: value };
        return { ...prev, socialLinks: [...all, ...custom] };
      });
    };
    const handleSave = async () => {
      // TODO: Save editedProfile to backend
      setEditMode(false);
      setEditedProfile(null);
      toast.success('Profile updated (not persisted in this demo)');
    };
    const profile = editMode && editedProfile ? editedProfile : userProfile.data.user;

    console.info(profile,'profile');  
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
          {/* Change the main grid for the profile and information cards to two columns on md and up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <div className="font-semibold mb-2 w-full">Profile Picture</div>
              <UserAvatar user={{ name: profile?.fullName || '-', avatar: profile?.profilePicture }} size="xl" className="mb-2" />
             
            </div>
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Basic Information</div>
              <label className="block text-xs text-gray-500 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.fullName || '') : displayValue(profile?.fullName)}
                disabled={!editMode}
                onChange={e => handleChange('fullName', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-2 py-1 border border-gray-200 rounded"
                value={editMode ? (profile?.email || '') : displayValue(profile?.email)}
                disabled={!editMode}
                onChange={e => handleChange('email', e.target.value)}
              />
            </div>
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Profile Information</div>
              <label className="block text-xs text-gray-500 mb-1">Job Title</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.jobTitle || '') : displayValue(profile?.jobTitle)}
                disabled={!editMode}
                onChange={e => handleChange('jobTitle', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">Company</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.company || '') : displayValue(profile?.company)}
                disabled={!editMode}
                onChange={e => handleChange('company', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">Website</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.website || '') : displayValue(profile?.website)}
                disabled={!editMode}
                onChange={e => handleChange('website', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">Profile URL</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={profile?.username ? `twintik.com/card/${profile.username}` : (editMode ? '' : '-')}
                disabled
              />
              <label className="block text-xs text-gray-500 mb-1">Bio</label>
              <textarea
                className="w-full px-2 py-1 border border-gray-200 rounded"
                value={editMode ? (profile?.bio || '') : displayValue(profile?.bio)}
                disabled={!editMode}
                onChange={e => handleChange('bio', e.target.value)}
                rows={2}
              />
            </div>
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Contact Information</div>
              <label className="block text-xs text-gray-500 mb-1">Primary Email</label>
              <input
                type="email"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.email || '') : displayValue(profile?.email)}
                disabled={!editMode}
                onChange={e => handleChange('email', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">Primary Phone</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.phoneNumber?.value || '') : displayValue(profile?.phoneNumber?.value)}
                disabled={!editMode}
                onChange={e => handleNestedChange('phoneNumber', 'value', e.target.value)}
              />
            </div>
            {/* Additional Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Additional Contact Information</div>
              <label className="block text-xs text-gray-500 mb-1">Additional Phone Numbers</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode
                  ? (Array.isArray(profile?.phoneNumbers) ? profile.phoneNumbers.map((p: { value: string; country: string }) => p.value).join(', ') : '')
                  : (Array.isArray(profile?.phoneNumbers) && profile.phoneNumbers.length > 0
                      ? profile.phoneNumbers.map((p: { value: string; country: string }) => p.value).join(', ')
                      : '-')}
                disabled={!editMode}
                onChange={e => handleChange('phoneNumbers', e.target.value.split(',').map((s: string) => ({ value: s.trim(), country: '' })))}
              />
              <label className="block text-xs text-gray-500 mb-1">Additional Emails</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded"
                value={editMode
                  ? (Array.isArray(profile?.additionalEmails) ? profile.additionalEmails.join(', ') : (profile?.additionalEmails || ''))
                  : (Array.isArray(profile?.additionalEmails)
                      ? (profile.additionalEmails.length > 0 ? profile.additionalEmails.join(', ') : '-')
                      : (profile?.additionalEmails && profile.additionalEmails.trim() !== '' ? profile.additionalEmails : '-'))}
                disabled={!editMode}
                onChange={e => handleChange('additionalEmails', e.target.value.split(',').map((s: string) => s.trim()))}
              />
            </div>
            {/* Address Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Address Information</div>
              <label className="block text-xs text-gray-500 mb-1">Street Address</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.address?.street || '') : displayValue(profile?.address?.street)}
                disabled={!editMode}
                onChange={e => handleNestedChange('address', 'street', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">City</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.address?.city || '') : displayValue(profile?.address?.city)}
                disabled={!editMode}
                onChange={e => handleNestedChange('address', 'city', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">State/Province</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                value={editMode ? (profile?.address?.state || '') : displayValue(profile?.address?.state)}
                disabled={!editMode}
                onChange={e => handleNestedChange('address', 'state', e.target.value)}
              />
              <label className="block text-xs text-gray-500 mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded"
                value={editMode ? (profile?.address?.zipCode || '') : displayValue(profile?.address?.zipCode)}
                disabled={!editMode}
                onChange={e => handleNestedChange('address', 'zipCode', e.target.value)}
              />
            </div>
            {/* Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Social Links</div>
              {["LinkedIn", "Twitter", "Instagram"].map((platform: string) => (
                <div key={platform} className="mb-2">
                  <label className="block text-xs text-gray-500 mb-1">{platform}</label>
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-gray-200 rounded"
                    value={editMode ? (profile?.socialLinks?.find((l: { platform: string; url: string }) => l.platform === platform)?.url || '') : displayValue(profile?.socialLinks?.find((l: { platform: string; url: string }) => l.platform === platform)?.url)}
                    disabled={!editMode}
                    onChange={e => handleSocialLinkChange(platform, e.target.value)}
                  />
                </div>
              ))}
            </div>
            {/* Custom Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Custom Social Links</div>
              {customLinks.length > 0 ? (
                customLinks.map((l: { platform: string; url: string }, idx: number) => (
                  <div key={idx} className="mb-2">
                    <label className="block text-xs text-gray-500 mb-1">{l.platform}</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-200 rounded"
                      value={l.url || ''}
                      disabled={!editMode}
                      onChange={e => handleCustomLinkChange(idx, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <div className="mb-1 text-gray-400">No custom links</div>
              )}
            </div>
            {/* Subscription Info */}
            {profile?.subscription && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-2">Subscription Information</div>
                <label className="block text-xs text-gray-500 mb-1">Subscription Plan</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-200 rounded mb-2"
                  value={profile?.subscription?.plan || ''}
                  disabled={!editMode}
                  onChange={e => handleNestedChange('subscription', 'plan', e.target.value)}
                />
                <label className="block text-xs text-gray-500 mb-1">Subscription Status</label>
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-200 rounded"
                  value={profile?.subscription?.status || ''}
                  disabled={!editMode}
                  onChange={e => handleNestedChange('subscription', 'status', e.target.value)}
                />
              </div>
            )}
          </div>
          {/* NFC Configuration & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* NFC Configuration */}
            <div className="md:col-span-2 bg-yellow-50 rounded-lg shadow p-6 flex flex-col justify-between">
              <div>
                <div className="font-semibold mb-1">NFC Configuration</div>
                <div className="text-yellow-700 font-medium mb-1">NFC Configuration Pending</div>
                <div className="text-xs text-gray-500 mb-2">User's profile is complete. NFC card needs to be configured manually.</div>
              </div>
              <button className="btn btn-warning self-end mt-2">Mark as Configured</button>
            </div>
            {/* Onboarding Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="font-semibold mb-2">Onboarding Timeline</div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="font-medium">Invitation Sent</div>
                    <div className="text-xs text-gray-500">{userProfile?.createdAt ? formatDate(userProfile.createdAt) : '-'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="font-medium">Profile Completed</div>
                    <div className="text-xs text-gray-500">{userProfile?.updatedAt ? formatDate(userProfile.updatedAt) : '-'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="font-medium">NFC Configuration Pending</div>
                    <div className="text-xs text-gray-500">-</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show invitation details only if invitation exists and userProfile does not
  if (invitation) {
    const currentStatus = getCurrentStatus(invitation);
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/fnf-onboarding')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{invitation.username}</h1>
                <p className="text-gray-600">F&F User Invitation Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/admin/fnf-onboarding/user/${userId}/edit`)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-200 rounded-md hover:bg-purple-200 hover:text-purple-800 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    currentStatus === 'completed' ? 'bg-green-500' : 
                    currentStatus === 'expired' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    Status: {currentStatus === 'completed' ? 'Profile Completed' : 
                            currentStatus === 'expired' ? 'Invite Expired' : 'Pending'}
                  </span>
                </div>
                {currentStatus === 'completed' && (
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      invitation.nfcStatus ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      NFC: {invitation.nfcStatus || 'Pending'}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Invited: {invitation.createdAt ? formatDate(invitation.createdAt) : 'N/A'}
              </div>
            </div>
          </div>

          {authError && (
            <div className="text-center text-red-600 font-semibold my-4">
              {authError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={invitation.username}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={invitation.emailAddress}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="mt-1">{getStatusBadge(currentStatus)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NFC Status</label>
                  <input
                    type="text"
                    value={invitation.nfcStatus || 'Not configured'}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Invitation Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Invitation Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invitation ID</label>
                  <input
                    type="text"
                    value={invitation._id}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                  <input
                    type="text"
                    value={invitation.token ? `${invitation.token.substring(0, 20)}...` : 'Not available'}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <input
                    type="text"
                    value={invitation.createdAt ? formatDate(invitation.createdAt) : 'Not available'}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <input
                    type="text"
                    value={invitation.updatedAt ? formatDate(invitation.updatedAt) : 'Not available'}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                {invitation.tokenExpiresAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Token Expires At</label>
                    <input
                      type="text"
                      value={formatDate(invitation.tokenExpiresAt)}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invitation Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              Invitation Timeline
            </h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Invitation Created</p>
                  <p className="text-sm text-gray-600">
                    {invitation.createdAt ? formatDate(invitation.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
              
              {currentStatus === 'completed' && (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Profile Completed</p>
                    <p className="text-sm text-gray-600">
                      {invitation.updatedAt ? formatDate(invitation.updatedAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              
              {currentStatus === 'expired' && (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Invitation Expired</p>
                    <p className="text-sm text-gray-600">
                      {invitation.tokenExpiresAt ? formatDate(invitation.tokenExpiresAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              
              {currentStatus === 'invited' && (
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Awaiting Response</p>
                    <p className="text-sm text-gray-600">
                      Invitation sent, waiting for user to complete profile
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // If neither, show not found
  return (
    <div className="text-center text-red-500 font-semibold py-8">User or Invitation Not Found</div>
  );
};

export default FFUserDetail; 