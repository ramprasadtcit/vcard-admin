import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  CreditCard,
  Users,
  Calendar,
  Mail,
  Activity,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { mockUsers, mockOrganizations } from '../../data/mockData';
import { User } from '../../types';

const OrganizationUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const foundUser = mockUsers.find(u => u.id === userId);
      setUser(foundUser || null);
      setLoading(false);
    }
  }, [userId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      org_admin: { color: 'bg-blue-100 text-blue-800', label: 'ORG ADMIN' },
      sub_admin: { color: 'bg-purple-100 text-purple-800', label: 'SUB ADMIN' },
      editor: { color: 'bg-green-100 text-green-800', label: 'EDITOR' },
      viewer: { color: 'bg-gray-100 text-gray-800', label: 'VIEWER' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleActivateUser = () => {
    if (!user) return;
    addNotification({
      type: 'success',
      title: 'User Activated',
      message: 'User has been successfully activated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleDeactivateUser = () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      addNotification({
        type: 'success',
        title: 'User Deactivated',
        message: 'User has been successfully deactivated.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    }
  };

  const handleDeleteUser = () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      addNotification({
        type: 'success',
        title: 'User Deleted',
        message: 'User has been successfully deleted.',
        isRead: false,
        userId: currentUser?.id || '',
      });
      navigate('/organizations');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/organizations')}
          className="mt-4 btn-primary"
        >
          Back to Organizations
        </button>
      </div>
    );
  }

  const organization = mockOrganizations.find(org => org.id === user.organizationId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/organizations')}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">User Details</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  addNotification({
                    type: 'info',
                    title: 'Feature Coming Soon',
                    message: 'Edit user functionality will be available soon.',
                    isRead: false,
                    userId: currentUser?.id || '',
                  });
                }}
                className="btn-secondary flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </button>
              {user.status === 'active' ? (
                <button
                  onClick={handleDeactivateUser}
                  className="btn-secondary text-red-600 hover:text-red-700"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={handleActivateUser}
                  className="btn-primary"
                >
                  Activate
                </button>
              )}
              <button
                onClick={handleDeleteUser}
                className="btn-secondary text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  {getStatusBadge(user.status)}
                  {getRoleBadge(user.role)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{organization?.name || 'Unknown Organization'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Basic Details</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">User ID</dt>
                      <dd className="text-sm text-gray-900 font-mono">{user.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="text-sm text-gray-900">{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{user.email}</dd>
                    </div>
                    
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Account Status</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">{getStatusBadge(user.status)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="text-sm text-gray-900">{getRoleBadge(user.role)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Organization</dt>
                      <dd className="text-sm text-gray-900">{organization?.name || 'Unknown'}</dd>
                    </div>
                    
                  </dl>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Timeline</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Login</dt>
                      <dd className="text-sm text-gray-900">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </dd>
                    </div>
                    
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Permissions</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Can Invite Users</dt>
                      <dd className="text-sm text-gray-900">
                        {user.role === 'org_admin' || user.role === 'sub_admin' ? 'Yes' : 'No'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Can Manage Cards</dt>
                      <dd className="text-sm text-gray-900">
                        {user.role === 'org_admin' || user.role === 'sub_admin' || user.role === 'editor' ? 'Yes' : 'No'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Can View Analytics</dt>
                      <dd className="text-sm text-gray-900">
                        {user.role === 'org_admin' || user.role === 'sub_admin' ? 'Yes' : 'No'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Can Manage Settings</dt>
                      <dd className="text-sm text-gray-900">
                        {user.role === 'org_admin' ? 'Yes' : 'No'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Organization Information */}
            {organization && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Organization Details</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                        <dd className="text-sm text-gray-900">{organization.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Domain</dt>
                        <dd className="text-sm text-gray-900">{organization.domain}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            organization.status === 'active' ? 'bg-green-100 text-green-800' :
                            organization.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Subscription</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Plan</dt>
                        <dd className="text-sm text-gray-900">{organization.subscriptionPlanId || 'No Plan'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Subscription Status</dt>
                        <dd className="text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            organization.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {organization.subscriptionStatus.charAt(0).toUpperCase() + organization.subscriptionStatus.slice(1)}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Expires</dt>
                        <dd className="text-sm text-gray-900">
                          {organization.subscriptionExpiresAt ? 
                            new Date(organization.subscriptionExpiresAt).toLocaleDateString() : 
                            'Not set'
                          }
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationUserDetail; 