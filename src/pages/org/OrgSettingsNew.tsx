import React, { useState } from 'react';
import { 
  Settings,
  Save,
  Building,
  MapPin,
  Globe,
  Phone,
  Mail,
  Users,
  UserCheck,
  AlertCircle,
  Info,
  Edit,
  X,
  Plus,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import type { OrgSettings, OrgUser } from '../../types';
import { mockOrgSettings, mockOrgUsers } from '../../data/mockData';

const OrgSettingsNew: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  // Form states
  const [orgSettings, setOrgSettings] = useState<OrgSettings>(mockOrgSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [showSubAdminModal, setShowSubAdminModal] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<string>('');

  // User control settings
  const [userControlSettings, setUserControlSettings] = useState({
    allowProfileEdit: true,
    allowAvatarCustomization: false,
    enforceOrgTheme: true,
  });
  const [isSavingUserSettings, setIsSavingUserSettings] = useState(false);

  // Get sub admin users
  const subAdminUsers = mockOrgUsers.filter(user => 
    orgSettings.subAdmins.includes(user.id) && user.role === 'sub_admin'
  );

  const handleSave = () => {
    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Organization settings have been updated successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setOrgSettings(mockOrgSettings);
    setIsEditing(false);
  };

  const handleSaveUserControlSettings = async () => {
    setIsSavingUserSettings(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        title: 'User Settings Saved',
        message: 'User control settings have been saved successfully.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save user control settings.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } finally {
      setIsSavingUserSettings(false);
    }
  };

  const handleRemoveSubAdmin = (userId: string) => {
    const user = mockOrgUsers.find(u => u.id === userId);
    if (user) {
      setOrgSettings(prev => ({
        ...prev,
        subAdmins: prev.subAdmins.filter(id => id !== userId)
      }));
      
      addNotification({
        type: 'success',
        title: 'Sub Admin Removed',
        message: `${user.name} has been removed as a sub admin.`,
        isRead: false,
        userId: currentUser?.id || '',
      });
    }
  };

  const handleAddSubAdmin = () => {
    if (!selectedSubAdmin) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a user to promote to sub admin.',
        isRead: false,
        userId: currentUser?.id || '',
      });
      return;
    }

    const user = mockOrgUsers.find(u => u.id === selectedSubAdmin);
    if (user) {
      setOrgSettings(prev => ({
        ...prev,
        subAdmins: [...prev.subAdmins, selectedSubAdmin]
      }));
      
      addNotification({
        type: 'success',
        title: 'Sub Admin Added',
        message: `${user.name} has been promoted to sub admin.`,
        isRead: false,
        userId: currentUser?.id || '',
      });
      
      setSelectedSubAdmin('');
      setShowSubAdminModal(false);
    }
  };

  const availableUsers = mockOrgUsers.filter(user => 
    user.status === 'active' && 
    user.role === 'user' && 
    !orgSettings.subAdmins.includes(user.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
          <p className="text-gray-600 mt-1">Manage your organization's basic information and sub admins</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Settings
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Organization Details */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-600">Organization details and contact information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                <input
                  type="text"
                  value={orgSettings.name}
                  onChange={(e) => setOrgSettings(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  value={orgSettings.country}
                  onChange={(e) => setOrgSettings(prev => ({ ...prev, country: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Mexico">Mexico</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  value={orgSettings.industry}
                  onChange={(e) => setOrgSettings(prev => ({ ...prev, industry: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={orgSettings.website}
                  onChange={(e) => setOrgSettings(prev => ({ ...prev, website: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                <input
                  type="email"
                  value={orgSettings.contactEmail}
                  onChange={(e) => setOrgSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={orgSettings.contactPhone}
                  onChange={(e) => setOrgSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={orgSettings.address}
                onChange={(e) => setOrgSettings(prev => ({ ...prev, address: e.target.value }))}
                disabled={!isEditing}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter complete address"
              />
            </div>
          </div>

          {/* Sub Admin Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Sub Admin Management</h2>
                  <p className="text-sm text-gray-600">Assign and manage sub administrators</p>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => setShowSubAdminModal(true)}
                  className="btn-secondary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sub Admin
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {subAdminUsers.length > 0 ? (
                subAdminUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSubAdmin(user.id)}
                        className="text-red-400 hover:text-red-600 p-1 transition-colors duration-200"
                        title="Remove Sub Admin"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Sub Admins</h3>
                  <p className="text-gray-600">You haven't assigned any sub admins yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Info & Stats */}
        <div className="space-y-6">
          {/* Organization Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Total Users</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{mockOrgUsers.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Sub Admins</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{subAdminUsers.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Industry</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{orgSettings.industry}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Country</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{orgSettings.country}</span>
              </div>
            </div>
          </div>

          {/* User Control Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Control Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Manage permissions and controls for all users in your organization</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Allow users to edit profile info</h4>
                  <p className="text-sm text-gray-600">Users can modify their personal information</p>
                </div>
                <button
                  onClick={() => setUserControlSettings(prev => ({ ...prev, allowProfileEdit: !prev.allowProfileEdit }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userControlSettings.allowProfileEdit ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    userControlSettings.allowProfileEdit ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Allow avatar customization</h4>
                  <p className="text-sm text-gray-600">Users can upload and customize their profile pictures</p>
                </div>
                <button
                  onClick={() => setUserControlSettings(prev => ({ ...prev, allowAvatarCustomization: !prev.allowAvatarCustomization }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userControlSettings.allowAvatarCustomization ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    userControlSettings.allowAvatarCustomization ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Enforce Org theme globally</h4>
                  <p className="text-sm text-gray-600">Users cannot override organization branding</p>
                </div>
                <button
                  onClick={() => setUserControlSettings(prev => ({ ...prev, enforceOrgTheme: !prev.enforceOrgTheme }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userControlSettings.enforceOrgTheme ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    userControlSettings.enforceOrgTheme ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveUserControlSettings}
                  disabled={isSavingUserSettings}
                  className="btn-primary flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingUserSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Sub Admin Permissions</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Sub admins can manage assigned users, view analytics, and customize themes. They cannot:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Add or remove other sub admins</li>
                    <li>Change organization settings</li>
                    <li>Access billing information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{orgSettings.contactEmail}</span>
              </div>
              
              {orgSettings.contactPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{orgSettings.contactPhone}</span>
                </div>
              )}
              
              {orgSettings.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a 
                    href={orgSettings.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    {orgSettings.website}
                  </a>
                </div>
              )}
              
              {orgSettings.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600">{orgSettings.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Sub Admin Modal */}
      {showSubAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Sub Admin</h3>
                <button
                  onClick={() => setShowSubAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                  <select
                    value={selectedSubAdmin}
                    onChange={(e) => setSelectedSubAdmin(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choose a user</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                {availableUsers.length === 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">No Available Users</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          All active users are already sub admins or have different roles.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSubAdminModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubAdmin}
                  disabled={!selectedSubAdmin || availableUsers.length === 0}
                  className="btn-primary"
                >
                  Add Sub Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgSettingsNew; 