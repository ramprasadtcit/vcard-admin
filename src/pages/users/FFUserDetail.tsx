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
  AlertCircle
} from 'lucide-react';
import apiService from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  username: string;
  fullName: string;
  email: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  profilePicture?: string;
  additionalEmails?: string[];
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
  website?: string;
  nfcStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

const FFUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

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
      l => !['LinkedIn','Twitter','Facebook','Instagram','YouTube','GitHub'].includes(l.platform)
    ) || [];
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/admin/fnf-onboarding')} className="btn btn-secondary">Back to List</button>
            <div>
              <span className="font-bold text-xl">{userProfile?.fullName || '-'}</span>
              <div className="text-sm text-gray-500">F&F User Profile Details</div>
              <div className="flex items-center mt-1">
                <span className="text-green-600 font-medium mr-2">Status: Profile Completed</span>
                <span className="text-yellow-600 font-medium">NFC Pending</span>
              </div>
            </div>
            <button onClick={() => navigate(`/admin/fnf-onboarding/user/${userId}/edit`)} className="btn btn-primary">Edit Profile</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Profile Picture */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Profile Picture</div>
              <img src={userProfile?.profilePicture || '/default-avatar.png'} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
              <div className="text-xs text-gray-500 break-all">{userProfile?.profilePicture || '-'}</div>
            </div>
            {/* Basic Information */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Basic Information</div>
              <div className="mb-1">Full Name: <span className="font-medium">{userProfile?.fullName || '-'}</span></div>
              <div className="mb-1">Email: <span className="font-medium">{userProfile?.email || '-'}</span></div>
            </div>
            {/* Profile Information */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Profile Information</div>
              <div className="mb-1">Job Title: <span className="font-medium">{userProfile?.jobTitle || '-'}</span></div>
              <div className="mb-1">Company: <span className="font-medium">{userProfile?.company || '-'}</span></div>
              <div className="mb-1">Website: <span className="font-medium">{userProfile?.website || '-'}</span></div>
              <div className="mb-1">Card URL: <span className="font-medium">{userProfile?.username ? `twintik.com/${userProfile.username}` : '-'}</span></div>
              <div className="mb-1">Bio: <span className="font-medium">{userProfile?.bio || '-'}</span></div>
            </div>
            {/* Address Information */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Address Information</div>
              <div className="mb-1">Street Address: <span className="font-medium">{userProfile?.address?.street || '-'}</span></div>
              <div className="mb-1">City: <span className="font-medium">{userProfile?.address?.city || '-'}</span></div>
              <div className="mb-1">State/Province: <span className="font-medium">{userProfile?.address?.state || '-'}</span></div>
              <div className="mb-1">ZIP/Postal Code: <span className="font-medium">{userProfile?.address?.zipCode || '-'}</span></div>
            </div>
            {/* Contact Information */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Contact Information</div>
              <div className="mb-1">Primary Email: <span className="font-medium">{userProfile?.email || '-'}</span></div>
              <div className="mb-1">Additional Emails: <span className="font-medium">{userProfile?.additionalEmails?.join(', ') || '-'}</span></div>
              <div className="mb-1">Primary Phone: <span className="font-medium">{userProfile?.phoneNumber?.value || '-'}</span></div>
              <div className="mb-1">Additional Phones: <span className="font-medium">{userProfile?.phoneNumbers?.map(p => p.value).join(', ') || '-'}</span></div>
            </div>
            {/* Social Links */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Social Links</div>
              <div className="mb-1">LinkedIn: <span className="font-medium">{userProfile?.socialLinks?.find(l => l.platform === 'LinkedIn')?.url || '-'}</span></div>
              <div className="mb-1">Twitter: <span className="font-medium">{userProfile?.socialLinks?.find(l => l.platform === 'Twitter')?.url || '-'}</span></div>
              <div className="mb-1">Facebook: <span className="font-medium">{userProfile?.socialLinks?.find(l => l.platform === 'Facebook')?.url || '-'}</span></div>
              <div className="mb-1">Instagram: <span className="font-medium">{userProfile?.socialLinks?.find(l => l.platform === 'Instagram')?.url || '-'}</span></div>
              <div className="mb-1">YouTube: <span className="font-medium">{userProfile?.socialLinks?.find(l => l.platform === 'YouTube')?.url || '-'}</span></div>
              <div className="mb-1">GitHub: <span className="font-medium">{userProfile?.socialLinks?.find(l => l.platform === 'GitHub')?.url || '-'}</span></div>
            </div>
            {/* Custom Social Links */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Custom Social Links</div>
              {customLinks.length > 0 ? (
                customLinks.map((l, idx) => (
                  <div key={idx} className="mb-1">{l.platform}: <span className="font-medium">{l.url}</span></div>
                ))
              ) : (
                <div className="mb-1">-</div>
              )}
            </div>
            {/* NFC Configuration */}
            <div className="col-span-2 bg-yellow-50 rounded shadow p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">NFC Configuration</div>
                <div className="text-yellow-700">NFC Configuration Pending</div>
                <div className="text-xs text-gray-500">User's profile is complete. NFC card needs to be configured manually.</div>
              </div>
              <button className="btn btn-warning">Mark as Configured</button>
            </div>
            {/* Onboarding Timeline */}
            <div className="col-span-1 bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Onboarding Timeline</div>
              <div className="mb-1">Invitation Sent: <span className="font-medium">-</span></div>
              <div className="mb-1">Profile Completed: <span className="font-medium">-</span></div>
              <div className="mb-1">NFC Configuration Pending: <span className="font-medium">-</span></div>
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