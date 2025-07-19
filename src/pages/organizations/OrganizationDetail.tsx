import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Users, 
  Building2, 
  Globe, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  CreditCard,
  Trash2,
  Clock,
  Eye,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { mockOrganizations, mockUsers, mockSubscriptionPlans, mockSubscriptions } from '../../data/mockData';
import { Organization } from '../../types';

const OrganizationDetail: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizationId) {
      const foundOrg = mockOrganizations.find(org => org.id === organizationId);
      setOrganization(foundOrg || null);
      setLoading(false);
    }
  }, [organizationId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      suspended: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
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

  const getPlanBadge = (planId?: string) => {
    if (!planId) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Plan
        </span>
      );
    }

    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Invalid Plan
        </span>
      );
    }

    const color = plan.type === 'b2b' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {plan.name}
      </span>
    );
  };

  const handleEditOrganization = () => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Edit organization functionality will be available soon.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleSuspendOrganization = () => {
    if (!organization) return;
    if (window.confirm('Are you sure you want to suspend this organization?')) {
      addNotification({
        type: 'success',
        title: 'Organization Suspended',
        message: 'Organization has been successfully suspended.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    }
  };

  const handleActivateOrganization = () => {
    if (!organization) return;
    addNotification({
      type: 'success',
      title: 'Organization Activated',
      message: 'Organization has been successfully activated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleDeleteOrganization = () => {
    if (!organization) return;
    if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      addNotification({
        type: 'success',
        title: 'Organization Deleted',
        message: 'Organization has been successfully deleted.',
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

  if (!organization) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Not Found</h3>
        <p className="text-gray-600">The organization you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/organizations')}
          className="mt-4 btn-primary"
        >
          Back to Organizations
        </button>
      </div>
    );
  }

  const subscription = mockSubscriptions.find(sub => sub.organizationId === organization.id);
  const plan = organization.subscriptionPlanId ? mockSubscriptionPlans.find(p => p.id === organization.subscriptionPlanId) : null;
  const orgUsers = mockUsers.filter(user => user.organizationId === organization.id);
  const adminUser = mockUsers.find(user => user.id === organization.adminId);

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
                <h1 className="text-xl font-semibold text-gray-900">Organization Details</h1>
                <p className="text-sm text-gray-600">{organization.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditOrganization}
                className="btn-secondary flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Organization
              </button>
              {organization.status === 'active' ? (
                <button
                  onClick={handleSuspendOrganization}
                  className="btn-secondary text-red-600 hover:text-red-700"
                >
                  Suspend
                </button>
              ) : (
                <button
                  onClick={handleActivateOrganization}
                  className="btn-primary"
                >
                  Activate
                </button>
              )}
              <button
                onClick={handleDeleteOrganization}
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
          {/* Left Column - Organization Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <img
                  src={organization.logo || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=100&fit=crop'}
                  alt={organization.name}
                  className="w-24 h-24 rounded-lg mx-auto mb-4 object-cover"
                />
                <h2 className="text-xl font-semibold text-gray-900">{organization.name}</h2>
                <p className="text-gray-600">{organization.domain}</p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  {getStatusBadge(organization.status)}
                  {getPlanBadge(organization.subscriptionPlanId)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{organization.domain}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Created {new Date(organization.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {orgUsers.length} users
                  </span>
                </div>
                {adminUser && (
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Admin: {adminUser.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-xl font-bold text-gray-900">{orgUsers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-xl font-bold text-gray-900">
                      {orgUsers.filter(user => user.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Extra Users</p>
                    <p className="text-xl font-bold text-gray-900">{organization.extraUsersPurchased || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Features Information */}
            {plan && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Available Features</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">NFC Enabled</span>
                        {plan.features.nfcEnabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">AI Avatar</span>
                        {plan.features.avatarEnabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Custom Templates</span>
                        {plan.features.customTemplates ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Advanced Analytics</span>
                        {plan.features.advancedAnalytics ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">API Access</span>
                        {plan.features.apiAccess ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Priority Support</span>
                        {plan.features.prioritySupport ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Branding</span>
                        {plan.features.branding ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">User Limits</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Max Users:</span>
                        <span className="font-medium">
                          {plan.features.maxUsers === -1 ? 'Unlimited' : plan.features.maxUsers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Extra Users:</span>
                        <span className="font-medium">{organization.extraUsersPurchased || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Storage:</span>
                        <span className="font-medium">{plan.features.storageGB}GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Information */}
            {subscription && plan && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Plan Information</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Plan Name</dt>
                        <dd className="text-sm text-gray-900">{plan.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Amount</dt>
                        <dd className="text-sm text-gray-900">${subscription.amount}/{subscription.billingCycle}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Users Limit</dt>
                        <dd className="text-sm text-gray-900">
                          {subscription.usersLimit === -1 ? 'Unlimited' : subscription.usersLimit}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Users Onboarded</dt>
                        <dd className="text-sm text-gray-900">{subscription.usersOnboarded}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Billing Period</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(subscription.startDate).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">End Date</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Days Remaining</dt>
                        <dd className="text-sm text-gray-900">
                          {Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Auto Renew</dt>
                        <dd className="text-sm text-gray-900">
                          {subscription.autoRenew ? 'Yes' : 'No'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {/* Organization Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">User Management</h4>
                  <dl className="space-y-2">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">Allow User Invites</dt>
                      <dd className="text-sm text-gray-900">
                        {organization.settings.allowUserInvites ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">Require Approval</dt>
                      <dd className="text-sm text-gray-900">
                        {organization.settings.requireApproval ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">Max Users</dt>
                      <dd className="text-sm text-gray-900">{organization.settings.maxUsers}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Features</h4>
                  <dl className="space-y-2">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">NFC Enabled</dt>
                      <dd className="text-sm text-gray-900">
                        {organization.settings.allowNFC ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">Custom Templates</dt>
                      <dd className="text-sm text-gray-900">
                        {organization.settings.allowCustomTemplates ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm font-medium text-gray-500">Branding</dt>
                      <dd className="text-sm text-gray-900">
                        {organization.settings.allowBranding ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Organization Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Organization Users</h3>
                <button
                  onClick={() => navigate(`/organizations/${organization.id}/users`)}
                  className="btn-secondary text-sm"
                >
                  View All Users
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orgUsers.slice(0, 5).map((user) => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => navigate(`/org-user/${user.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orgUsers.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate(`/organizations/${organization.id}/users`)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    View all {orgUsers.length} users →
                  </button>
                </div>
              )}
            </div>

            {/* Theme Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Colors</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded border border-gray-200"
                        style={{ backgroundColor: organization.theme.primaryColor }}
                      />
                      <span className="text-sm text-gray-600">Primary: {organization.theme.primaryColor}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded border border-gray-200"
                        style={{ backgroundColor: organization.theme.secondaryColor }}
                      />
                      <span className="text-sm text-gray-600">Secondary: {organization.theme.secondaryColor}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Typography</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Font Family</dt>
                      <dd className="text-sm text-gray-900">{organization.theme.fontFamily}</dd>
                    </div>
                    {organization.theme.logo && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Custom Logo</dt>
                        <dd className="text-sm text-gray-900">Configured</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail; 