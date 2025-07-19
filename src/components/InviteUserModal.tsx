import React, { useState } from 'react';
import { X, Mail, UserPlus, Shield, Palette, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { UserInvitation } from '../types';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  subOrgId?: string;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ 
  isOpen, 
  onClose, 
  organizationId, 
  subOrgId 
}) => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'editor' as const,
    permissions: {
      canEditProfile: true,
      canEditTheme: false,
      canManageUsers: false,
      canViewAnalytics: false,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: 'org_admin', label: 'Org Admin', description: 'Full organization access' },
    { value: 'sub_admin', label: 'Sub Admin', description: 'Manage sub-organization' },
    { value: 'editor', label: 'Editor', description: 'Create and edit content' },
    { value: 'viewer', label: 'Viewer', description: 'View-only access' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create invitation (in a real app, this would be sent to the server)
      const invitation: UserInvitation = {
        id: Date.now().toString(),
        email: formData.email,
        role: formData.role,
        organizationId,
        invitedBy: currentUser?.id || '',
        invitedByName: currentUser?.name || '',
        status: 'pending',
        token: `inv_${Math.random().toString(36).substr(2, 9)}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      // In a real app, you would send this to your API
      console.log('Inviting user:', invitation);

      addNotification({
        type: 'success',
        title: 'User Invited',
        message: `Invitation sent to ${formData.email}`,
        isRead: false,
        userId: currentUser?.id || '',
      });

      // Reset form and close modal
      setFormData({
        email: '',
        role: 'editor',
        permissions: {
          canEditProfile: true,
          canEditTheme: false,
          canManageUsers: false,
          canViewAnalytics: false,
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to invite user:', error);
      addNotification({
        type: 'error',
        title: 'Invitation Failed',
        message: 'Failed to send invitation. Please try again.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermissions = (permission: keyof typeof formData.permissions) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Invite User</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label} - {role.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canEditProfile}
                  onChange={() => updatePermissions('canEditProfile')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Can edit profile</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canEditTheme}
                  onChange={() => updatePermissions('canEditTheme')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Can edit theme</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canManageUsers}
                  onChange={() => updatePermissions('canManageUsers')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Can manage users</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canViewAnalytics}
                  onChange={() => updatePermissions('canViewAnalytics')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Can view analytics</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Invitation Process</p>
                <p className="text-sm text-blue-700 mt-1">
                  The user will receive an email with a secure link to set up their password and complete their account.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal; 