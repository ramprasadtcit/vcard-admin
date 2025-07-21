import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  CheckCircle, 
  Edit,
  Camera
} from 'lucide-react';
import { FFUser } from '../../types/user';
import { mockFFUsers } from '../../data/mockData';

const FFUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<FFUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nfcConfigured, setNfcConfigured] = useState(false);

  useEffect(() => {
    // Find user from mock data
    const foundUser = mockFFUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setNfcConfigured(!!foundUser.nfcConfiguredAt);
    }
  }, [userId]);

  const handleNFCStatusUpdate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNfcConfigured(!nfcConfigured);
      
      // Here you would typically update the user in the parent component
      // For now, we'll just update the local state
    } catch (error) {
      console.error('Failed to update NFC status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStatus = (user: FFUser) => {
    if (user.status === 'pending' && user.tokenExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(user.tokenExpiresAt);
      if (now > expiresAt) {
        return 'expired';
      }
    }
    return user.status;
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
        <p className="text-gray-600">The requested user could not be found.</p>
      </div>
    );
  }

  const currentStatus = getCurrentStatus(user);

  return (
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
            <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-gray-600">F&F User Profile Details</p>
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
                  nfcConfigured ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  NFC: {nfcConfigured ? 'Configured' : 'Pending'}
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Invited: {user.invitedAt ? formatDate(user.invitedAt) : 'N/A'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Image */}
        {currentStatus === 'completed' && user.profileData?.profilePicture && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-purple-600" />
              Profile Picture
            </h4>
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-purple-100">
                <img 
                  src={user.profileData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Camera className="w-12 h-12 text-gray-400 hidden" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                <input
                  type="url"
                  value={user.profileData.profilePicture}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.fullName}
                disabled={true}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled={true}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Profile Details - Only show if completed */}
        {currentStatus === 'completed' && user.profileData && (
          <>
            {/* Basic Profile Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Profile Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={user.profileData.jobTitle || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={user.profileData.company || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={user.profileData.website || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile URL</label>
                  <input
                    type="text"
                    value={user.profileData.profileUrl || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={user.profileData.bio || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Contact Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={user.profileData.email || user.email || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Emails</label>
                  <input
                    type="text"
                    value={user.profileData.additionalEmails?.join(', ') || ''}
                    disabled={true}
                    placeholder="Separate with commas"
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                  <input
                    type="tel"
                    value={user.profileData.phone || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Phones</label>
                  <input
                    type="text"
                    value={user.profileData.additionalPhones?.join(', ') || ''}
                    disabled={true}
                    placeholder="Separate with commas"
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-600" />
                Address Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={user.profileData.address?.street || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={user.profileData.address?.city || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    value={user.profileData.address?.state || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={user.profileData.address?.zipCode || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                Social Links
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={user.profileData.socialLinks?.linkedin || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={user.profileData.socialLinks?.twitter || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={user.profileData.socialLinks?.facebook || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={user.profileData.socialLinks?.instagram || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                  <input
                    type="url"
                    value={user.profileData.socialLinks?.youtube || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={user.profileData.socialLinks?.github || ''}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Custom Social Links */}
            {user.profileData.customSocialLinks && user.profileData.customSocialLinks.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                  Custom Social Links
                </h4>
                <div className="space-y-3">
                  {user.profileData.customSocialLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Platform
                        </label>
                        <input
                          type="text"
                          value={link.platform}
                          disabled={true}
                          className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          disabled={true}
                          className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* NFC Configuration Section */}
      {currentStatus === 'completed' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-orange-600" />
            NFC Configuration
          </h4>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  nfcConfigured ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <h5 className="font-medium text-gray-900">
                    {nfcConfigured ? 'NFC Card Configured' : 'NFC Configuration Pending'}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {nfcConfigured 
                      ? 'User\'s NFC card has been configured and is ready for use.'
                      : 'User\'s profile is complete. NFC card needs to be configured manually.'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleNFCStatusUpdate}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  nfcConfigured
                    ? 'text-orange-700 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-800'
                    : 'text-white bg-orange-600 border border-transparent hover:bg-orange-700'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {nfcConfigured ? 'Mark as Pending' : 'Mark as Configured'}
              </button>
            </div>
            {nfcConfigured && user.nfcConfiguredAt && (
              <div className="mt-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 inline mr-1" />
                Configured on: {formatDate(user.nfcConfiguredAt)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onboarding Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
          Onboarding Timeline
        </h4>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Invitation Sent</p>
              <p className="text-sm text-gray-600">
                {user.invitedAt ? formatDate(user.invitedAt) : 'N/A'}
              </p>
            </div>
          </div>
          
          {user.profileSubmittedAt && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Profile Completed</p>
                <p className="text-sm text-gray-600">
                  {formatDate(user.profileSubmittedAt)}
                </p>
              </div>
            </div>
          )}
          
          {nfcConfigured && user.nfcConfiguredAt && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">NFC Configured</p>
                <p className="text-sm text-gray-600">
                  {formatDate(user.nfcConfiguredAt)}
                </p>
              </div>
            </div>
          )}
          
          {currentStatus === 'completed' && !nfcConfigured && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-500">NFC Configuration Pending</p>
                <p className="text-sm text-gray-400">
                  Awaiting manual configuration
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FFUserDetail; 