import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  User,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Globe,
  MapPin,
  CheckCircle,
  XCircle,
  Bot,
  CreditCard,
  QrCode,
  Image as ImageIcon
} from 'lucide-react';
import { apiService } from '../../services/api';
import { B2CUserDetail as B2CUserDetailType } from '../../types';
import { toast } from 'react-toastify';

const B2CUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<B2CUserDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserDetails();
    }
  }, [userId]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getB2CUserById(userId!);
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        toast.error('User not found');
        navigate('/b2c-users');
      }
    } catch (error) {
      console.error('Failed to load user details:', error);
      toast.error('Failed to load user details');
      navigate('/b2c-users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      // Logic: isActive: false = user is ACTIVE, isActive: true = user is INACTIVE
      // To toggle: if user is ACTIVE (isActive: false), we want to make them INACTIVE (isActive: true)
      // If user is INACTIVE (isActive: true), we want to make them ACTIVE (isActive: false)
      const newStatus = !user.isActive; // Flip the current status
      const response = await apiService.updateB2CUserStatus(user._id, newStatus);
      
      if (response.success) {
        // Update the user data with the response
        setUser({ ...user, isActive: response.user.isActive });
        // Show the API message in toast
        toast.success(response.message);
      } else {
        toast.error('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    // Note: isActive: false = user is ACTIVE, isActive: true = user is INACTIVE
    if (!isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading user details...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
        <p className="text-gray-600">The requested user could not be found.</p>
        <button
          onClick={() => navigate('/b2c-users')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/b2c-users')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Users
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600">View and manage user information</p>
        </div>
      </div>

      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg text-white p-8">
        <div className="flex flex-col xl:flex-row xl:items-start xl:space-x-8">
          {/* Left Section - Profile Info */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 mb-6 xl:mb-0">
            {/* Avatar */}
            <div className="flex justify-center lg:justify-start mb-4 lg:mb-0">
              <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-xl border-4 border-white/30">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-3xl">
                    {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">
                {user.fullName || 'N/A'}
              </h2>
              <p className="text-blue-100 text-lg mb-4">@{user.username}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <div className="flex items-center justify-center lg:justify-start">
                  {getStatusBadge(user.isActive)}
                </div>
                {updating ? (
                  <div className="flex items-center justify-center lg:justify-start text-blue-100">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm">Updating...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleStatusToggle}
                    className={`relative inline-flex items-center justify-center lg:justify-start h-10 px-6 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                      !user.isActive
                        ? 'bg-red-500/20 text-red-100 hover:bg-red-500/30 border border-red-400/30'
                        : 'bg-green-500/20 text-green-100 hover:bg-green-500/30 border border-green-400/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Toggle Switch Visual */}
                      <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        !user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                          !user.isActive ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </div>
                      
                      {/* Status Text */}
                      <span className="font-medium">
                        {!user.isActive ? 'Deactivate User' : 'Activate User'}
                      </span>
                      
                      {/* Icon */}
                      {!user.isActive ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Info Cards and QR */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:space-x-6">
            {/* Vertical Info Cards */}
            <div className="flex-1 space-y-4 mb-6 lg:mb-0">
              {/* Email Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Mail className="w-6 h-6 text-blue-200" />
                  <div className="flex-1">
                    <p className="text-blue-100 text-sm">Email</p>
                    <p className="text-white font-medium text-sm truncate">{user.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Position Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6 text-blue-200" />
                  <div className="flex-1">
                    <p className="text-blue-100 text-sm">Position</p>
                    <p className="text-white font-medium text-sm truncate">{user.jobTitle || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Company Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6 text-blue-200" />
                  <div className="flex-1">
                    <p className="text-blue-100 text-sm">Company</p>
                    <p className="text-white font-medium text-sm truncate">{user.company || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code - Right Corner */}
            {(user.qrCodeUrl || user.logo) && (
              <div className="flex flex-col items-center lg:items-end space-y-4">
                {user.qrCodeUrl && (
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg bg-white/10 backdrop-blur-sm p-2 mb-2">
                      <img 
                        src={user.qrCodeUrl} 
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-blue-100 text-xs">QR Code</p>
                  </div>
                )}
                {user.logo && (
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg bg-white/10 backdrop-blur-sm p-2 mb-2">
                      <img 
                        src={user.logo} 
                        alt="Company Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-blue-100 text-xs">Company Logo</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact & Professional Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Mail className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Email Address</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-gray-900">{user.email || 'N/A'}</p>
                  {user.isEmailVerified ? (
                    <span title="Email Verified" className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </span>
                  ) : (
                    <span title="Email Not Verified" className="flex items-center">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user.phoneNumbers && user.phoneNumbers.length > 0 && (
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Phone Numbers</p>
                  <div className="space-y-2 mt-1">
                    {user.phoneNumbers.map((phone, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <p className="text-gray-900">{phone.value}</p>
                        <span className="text-xs text-gray-500">({phone.country})</span>
                        {user.isPhoneVerified ? (
                          <span title="Phone Verified" className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </span>
                        ) : (
                          <span title="Phone Not Verified" className="flex items-center">
                            <XCircle className="w-4 h-4 text-red-500" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {user.website && (
              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Website</p>
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Last Login</p>
                <p className="text-gray-900 text-sm mt-1">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account & Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Account & Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Subscription</p>
                  <p className="text-gray-900 text-sm capitalize">{user.subscription.plan}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                user.subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.subscription.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Chat Feature</p>
                  <p className="text-gray-900 text-sm">Bot Integration</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                user.isChatEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.isChatEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600">Bot Configuration</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chat Bot:</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    user.botConfig.isChatEnable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.botConfig.isChatEnable ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avatar Bot:</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    user.botConfig.isAvatorEnable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.botConfig.isAvatorEnable ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Language</p>
                  <p className="text-gray-900 text-sm">{user.preferredLanguage.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Technical Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">User ID</p>
            <p className="text-gray-900 font-mono text-sm bg-gray-50 p-3 rounded-lg border">{user._id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Username</p>
            <p className="text-gray-900 font-medium text-sm bg-gray-50 p-3 rounded-lg border">@{user.username}</p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default B2CUserDetail;
