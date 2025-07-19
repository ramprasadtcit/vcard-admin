import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Building2, 
  CreditCard, 
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  Eye,
  Edit,
  DollarSign,
  User,
  Crown,
  Sparkles,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Star,
  Settings,
  MessageSquare,
  FileText
} from 'lucide-react';
import { mockSubscriptions, mockSubscriptionPlans, mockOrganizations, mockUsers, mockB2CUsers } from '../../data/mockData';
import { Subscription, SubscriptionPlan } from '../../types';
import ComingSoonOverlay from '../../components/ComingSoonOverlay';

interface SubscriptionWithDetails extends Subscription {
  subscriberName: string;
  subscriberEmail: string;
  subscriberType: 'b2b' | 'b2c';
  plan: SubscriptionPlan;
  organizationName?: string;
  organizationDomain?: string;
}

const SubscriptionManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [mainTypeFilter, setMainTypeFilter] = useState<'all' | 'b2b' | 'b2c'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'b2b' | 'b2c'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled' | 'pending'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionWithDetails | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'b2c' | 'b2b'>('overview');

  // Enhanced subscription data with details
  const subscriptionsWithDetails: SubscriptionWithDetails[] = useMemo(() => {
    return mockSubscriptions.map(sub => {
      const plan = mockSubscriptionPlans.find(p => p.id === sub.planId);
      
      if (sub.organizationId) {
        // B2B Subscription
        const org = mockOrganizations.find(o => o.id === sub.organizationId);
        return {
          ...sub,
          subscriberName: org?.name || 'Unknown Organization',
          subscriberEmail: 'admin@' + (org?.domain || 'example.com'),
          subscriberType: 'b2b' as const,
          plan: plan!,
          organizationName: org?.name,
          organizationDomain: org?.domain,
        };
      } else {
        // B2C Subscription
        const user = mockB2CUsers.find(u => u.id === sub.userId);
        return {
          ...sub,
          subscriberName: user?.name || 'Unknown User',
          subscriberEmail: user?.email || 'unknown@example.com',
          subscriberType: 'b2c' as const,
          plan: plan!,
        };
      }
    });
  }, []);

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptionsWithDetails;

    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.subscriberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.subscriberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply main type filter (B2B/B2C selector)
    if (mainTypeFilter !== 'all') {
      filtered = filtered.filter(sub => sub.subscriberType === mainTypeFilter);
    }

    // Apply additional filters (from filter section)
    if (typeFilter !== 'all') {
      filtered = filtered.filter(sub => sub.subscriberType === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    return filtered;
  }, [subscriptionsWithDetails, searchTerm, mainTypeFilter, typeFilter, statusFilter]);

  // Statistics
  const totalSubscriptions = subscriptionsWithDetails.length;
  const activeSubscriptions = subscriptionsWithDetails.filter(sub => sub.status === 'active').length;
  const b2bSubscriptions = subscriptionsWithDetails.filter(sub => sub.subscriberType === 'b2b').length;
  const b2cSubscriptions = subscriptionsWithDetails.filter(sub => sub.subscriberType === 'b2c').length;
  const totalRevenue = subscriptionsWithDetails.reduce((sum, sub) => sum + sub.amount, 0);
  const nfcConfigured = subscriptionsWithDetails.filter(sub => sub.nfcStatus === 'configured').length;
  const avatarUsage = subscriptionsWithDetails.filter(sub => sub.avatarUsage).length;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      expired: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      b2b: { color: 'bg-blue-100 text-blue-800', icon: Building2 },
      b2c: { color: 'bg-purple-100 text-purple-800', icon: Users },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.b2c;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {type.toUpperCase()}
      </span>
    );
  };

  const getNFCBadge = (status: string) => {
    const nfcConfig = {
      none: { color: 'bg-gray-100 text-gray-800', text: 'None' },
      requested: { color: 'bg-yellow-100 text-yellow-800', text: 'Requested' },
      configured: { color: 'bg-green-100 text-green-800', text: 'Configured' },
      external: { color: 'bg-blue-100 text-blue-800', text: 'External' },
    };
    
    const config = nfcConfig[status as keyof typeof nfcConfig] || nfcConfig.none;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {status !== 'none' && <Wifi className="w-3 h-3 mr-1" />}
        {config.text}
      </span>
    );
  };

  const getAvatarBadge = (enabled: boolean) => {
    if (enabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Sparkles className="w-3 h-3 mr-1" />
          Enabled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Disabled
      </span>
    );
  };

  const handleUpgradePlan = (subscriptionId: string) => {
    addNotification({
      type: 'success',
      title: 'Plan Upgrade',
      message: 'Plan upgrade request has been submitted.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleRequestNFC = (subscriptionId: string) => {
    addNotification({
      type: 'success',
      title: 'NFC Request',
      message: 'NFC card request has been submitted.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    addNotification({
      type: 'success',
      title: 'Subscription Cancelled',
      message: 'Subscription has been cancelled successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    addNotification({
      type: 'success',
      title: 'Subscription Renewed',
      message: 'Subscription has been renewed successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600">Manage B2C and B2B subscriptions across the platform</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="btn-secondary flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* B2B/B2C Selector */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Subscription Type:</label>
            <select
              value={mainTypeFilter}
              onChange={(e) => setMainTypeFilter(e.target.value as 'all' | 'b2b' | 'b2c')}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Subscriptions</option>
              <option value="b2b">B2B Subscriptions</option>
              <option value="b2c">B2C Subscriptions</option>
            </select>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Showing:</span>
            <span className="font-medium">
              {mainTypeFilter === 'all' && 'All Subscriptions'}
              {mainTypeFilter === 'b2b' && 'B2B Subscriptions'}
              {mainTypeFilter === 'b2c' && 'B2C Subscriptions'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('b2c')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'b2c'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            B2C Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('b2b')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'b2b'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            B2B Subscriptions
          </button>
        </nav>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubscriptions}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wifi className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">NFC Configured</p>
              <p className="text-2xl font-bold text-gray-900">{nfcConfigured}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Types Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">B2B Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{b2bSubscriptions}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">B2C Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{b2cSubscriptions}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avatar Usage</p>
              <p className="text-2xl font-bold text-gray-900">{avatarUsage}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
              />
            </div>
            <button
              onClick={() => {
                console.log('Filter button clicked, current showFilters:', showFilters);
                setShowFilters(!showFilters);
                console.log('Setting showFilters to:', !showFilters);
              }}
              className="btn-secondary flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters {showFilters ? '(Open)' : '(Closed)'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as 'all' | 'b2b' | 'b2c')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="b2b">B2B</option>
                  <option value="b2c">B2C</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'cancelled' | 'pending')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Debug: Filter section is visible (showFilters = {showFilters.toString()})
            </div>
          </div>
        )}
      </div>

      {/* Subscriptions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell font-medium text-gray-900">Subscriber</th>
                <th className="table-cell font-medium text-gray-900">Type</th>
                <th className="table-cell font-medium text-gray-900">Plan</th>
                <th className="table-cell font-medium text-gray-900">Status</th>
                <th className="table-cell font-medium text-gray-900">Users</th>
                <th className="table-cell font-medium text-gray-900">NFC</th>
                <th className="table-cell font-medium text-gray-900">Avatar</th>
                <th className="table-cell font-medium text-gray-900">Amount</th>
                <th className="table-cell font-medium text-gray-900">Start Date</th>
                <th className="table-cell font-medium text-gray-900">End Date</th>
                <th className="table-cell font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="table-row">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{subscription.subscriberName}</p>
                      <p className="text-sm text-gray-500">{subscription.subscriberEmail}</p>
                      {subscription.organizationDomain && (
                        <p className="text-xs text-gray-400">{subscription.organizationDomain}</p>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    {getTypeBadge(subscription.subscriberType)}
                  </td>
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{subscription.plan.name}</p>
                      <p className="text-sm text-gray-500">{subscription.plan.description}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(subscription.status)}
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    {subscription.usersOnboarded}/{subscription.usersLimit === -1 ? '∞' : subscription.usersLimit}
                  </td>
                  <td className="table-cell">
                    {getNFCBadge(subscription.nfcStatus)}
                  </td>
                  <td className="table-cell">
                    {getAvatarBadge(subscription.avatarUsage)}
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    ${subscription.amount}
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          setShowDetailsModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpgradePlan(subscription.id)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Upgrade Plan"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      {subscription.plan.features.nfcEnabled && subscription.nfcStatus === 'none' && (
                        <button
                          onClick={() => handleRequestNFC(subscription.id)}
                          className="text-orange-600 hover:text-orange-700 p-1"
                          title="Request NFC"
                        >
                          <Wifi className="w-4 h-4" />
                        </button>
                      )}
                      {subscription.status === 'active' ? (
                        <button
                          onClick={() => handleCancelSubscription(subscription.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Cancel Subscription"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRenewSubscription(subscription.id)}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="Renew Subscription"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscriptions Found</h3>
            <p className="text-gray-600">No subscriptions match your current filters.</p>
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Management</h3>
        </div>
        <ComingSoonOverlay 
          title="Payment Processing"
          description="Integrated payment processing and billing management"
          phase="Phase 2"
        />
      </div>

      {/* Subscription Analytics */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Subscription Analytics</h3>
        </div>
        <ComingSoonOverlay 
          title="Advanced Analytics"
          description="Detailed subscription analytics and insights"
          phase="Phase 2"
        />
      </div>
    </div>
  );
};

export default SubscriptionManagement; 