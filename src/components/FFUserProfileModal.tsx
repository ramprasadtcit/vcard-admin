import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Globe, Calendar, CheckCircle, AlertCircle, Edit, Save } from 'lucide-react';
import { FFUser } from '../types/user';

interface FFUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FFUser;
}

const FFUserProfileModal: React.FC<FFUserProfileModalProps> = ({
  isOpen,
  onClose,
  user
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nfcConfigured, setNfcConfigured] = useState(!!user.nfcConfiguredAt);

  const handleNFCStatusUpdate = async () => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
              <p className="text-sm text-gray-600">F&F User Profile Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 border border-purple-200 rounded-md hover:bg-purple-200 hover:text-purple-800 transition-colors"
            >
              {isEditing ? <Save className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    user.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    Status: {user.status === 'completed' ? 'Profile Completed' : 'Pending'}
                  </span>
                </div>
                {user.status === 'completed' && (
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

          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user.fullName}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Profile Details - Only show if completed */}
          {user.status === 'completed' && user.profileData && (
            <>
              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-600" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={user.profileData.phone || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Phones</label>
                    <input
                      type="text"
                      value={user.profileData.additionalPhones?.join(', ') || ''}
                      disabled={!isEditing}
                      placeholder="Separate with commas"
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={user.profileData.address?.street || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={user.profileData.address?.city || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <input
                      type="text"
                      value={user.profileData.address?.state || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={user.profileData.address?.zipCode || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={user.profileData.socialLinks?.linkedin || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">X</label>
                    <input
                      type="url"
                      value={user.profileData.socialLinks?.x || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input
                      type="url"
                      value={user.profileData.socialLinks?.instagram || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={user.profileData.socialLinks?.website || ''}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* NFC Configuration Section */}
          {user.status === 'completed' && (
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
              
              {user.nfcConfiguredAt && (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FFUserProfileModal; 