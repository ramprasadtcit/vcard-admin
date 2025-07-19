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
  Wifi,
  Users,
  Calendar,
  Mail,
  Activity,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { mockB2CUsers, mockSubscriptionPlans, mockSubscriptions } from '../../data/mockData';
import { B2CUser } from '../../types';

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [user, setUser] = useState<B2CUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const foundUser = mockB2CUsers.find(u => u.id === userId);
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

  const getPlanBadge = (planId?: string) => {
    if (!planId) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Plan
        </span>
      );
    }

    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    if (!plan) return null;

    const color = plan.type === 'b2c' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {plan.name}
      </span>
    );
  };

  const handleActivateUser = () => {
    if (!user) return;
    addNotification({
      type: 'success',
      title: 'User Activated',
      message: 'B2C user has been successfully activated.',
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
        message: 'B2C user has been successfully deactivated.',
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
        message: 'B2C user has been successfully deleted.',
        isRead: false,
        userId: currentUser?.id || '',
      });
      navigate('/b2c-users');
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
          onClick={() => navigate('/b2c-users')}
          className="mt-4 btn-primary"
        >
          Back to B2C Users
        </button>
      </div>
    );
  }

  const subscription = mockSubscriptions.find(sub => sub.userId === user.id);
  const plan = user.subscriptionPlanId ? mockSubscriptionPlans.find(p => p.id === user.subscriptionPlanId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/b2c-users')}
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
                <img
                  src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  {getStatusBadge(user.status)}
                  {getPlanBadge(user.subscriptionPlanId)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-xl font-bold text-gray-900">{user.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Wifi className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">NFC Card</p>
                    <p className="text-xl font-bold text-gray-900">{user.nfcCardId ? 'Yes' : 'No'}</p>
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
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Usage Summary</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Total Views:</span>
                        <span className="font-medium">{user.totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">NFC Status:</span>
                        <span className="font-medium">{user.nfcCardId ? 'Configured' : 'Not Configured'}</span>
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

export default UserDetail; 