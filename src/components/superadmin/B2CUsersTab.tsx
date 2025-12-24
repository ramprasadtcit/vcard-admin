import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Wifi, 
  CreditCard, 
  UserCheck, 
  // Wallet, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Pause,
  Play,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts/NotificationContext';
import { mockB2CUsers, mockSubscriptionPlans } from '../../data/mockData';

const B2CUsersTab: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalUsers = mockB2CUsers.length;
    const nfcRequests = mockB2CUsers.filter(user => user.nfcCardId).length;
    const avatarEnabled = mockB2CUsers.filter(user => user.avatar).length;
    // const walletAdds = mockB2CUsers.length; // Mock data - in real app this would be from wallet events

    return {
      totalUsers: { count: totalUsers, change: '+18%', trend: 'up' },
      nfcRequests: { count: nfcRequests, change: '+12%', trend: 'up' },
      avatarEnabled: { count: avatarEnabled, change: '+30%', trend: 'up' },
      // walletAdds: { count: walletAdds, change: '+15%', trend: 'up' }
    };
  }, []);

  // Filter B2C users
  const filteredUsers = useMemo(() => {
    let users = mockB2CUsers;

    if (searchTerm) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      users = users.filter(user => user.status === statusFilter);
    }

    if (planFilter !== 'all') {
      users = users.filter(user => user.subscriptionPlanId === planFilter);
    }

    return users;
  }, [searchTerm, statusFilter, planFilter]);

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
    if (!plan) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Invalid Plan
        </span>
      );
    }

    const color = plan.type === 'b2c' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {plan.name}
      </span>
    );
  };

  const handleViewUser = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleSuspendUser = (userId: string) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      addNotification({
        type: 'success',
        title: 'User Suspended',
        message: 'B2C user has been successfully suspended.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    }
  };

  const handleActivateUser = (userId: string) => {
    addNotification({
      type: 'success',
      title: 'User Activated',
      message: 'B2C user has been successfully activated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleUpgradePlan = (userId: string) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Plan upgrade functionality will be available soon.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleResetAccess = (userId: string) => {
    if (window.confirm('Are you sure you want to reset access for this user?')) {
      addNotification({
        type: 'success',
        title: 'Access Reset',
        message: 'User access has been successfully reset.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total B2C Users</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalUsers.count}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {kpis.totalUsers.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className="text-sm text-gray-600">{kpis.totalUsers.change}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">NFC Requests</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.nfcRequests.count}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wifi className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {kpis.nfcRequests.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className="text-sm text-gray-600">{kpis.nfcRequests.change}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avatar Enabled</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.avatarEnabled.count}</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {kpis.avatarEnabled.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className="text-sm text-gray-600">{kpis.avatarEnabled.change}</span>
          </div>
        </div>

        {/* Wallet Adds KPI - Commented out for future use
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wallet Adds</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.walletAdds.count}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {kpis.walletAdds.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className="text-sm text-gray-600">{kpis.walletAdds.change}</span>
          </div>
        </div>
        */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Plans</option>
                  {mockSubscriptionPlans
                    .filter(plan => plan.type === 'b2c')
                    .map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* B2C Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell font-medium text-gray-900">User</th>
                <th className="table-cell font-medium text-gray-900">Plan</th>
                <th className="table-cell font-medium text-gray-900">NFC Status</th>
                <th className="table-cell font-medium text-gray-900">Avatar Enabled</th>
                <th className="table-cell font-medium text-gray-900">Status</th>
                <th className="table-cell font-medium text-gray-900">Last Access</th>
                <th className="table-cell font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell py-3">
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
                  <td className="table-cell py-3">
                    {getPlanBadge(user.subscriptionPlanId)}
                  </td>
                  <td className="table-cell py-3">
                    {user.nfcCardId ? (
                      <span className="inline-flex items-center text-green-600 text-xs">
                        <Wifi className="w-3 h-3 mr-1" />
                        Configured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not Configured</span>
                    )}
                  </td>
                  <td className="table-cell py-3">
                    {user.avatar ? (
                      <span className="inline-flex items-center text-green-600 text-xs">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="table-cell py-3">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="table-cell py-3 text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="table-cell py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Suspend User"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Activate User"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleUpgradePlan(user.id)}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="Upgrade Plan"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetAccess(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Reset Access"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No B2C Users Found</h3>
            <p className="text-gray-600">No B2C users match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default B2CUsersTab; 