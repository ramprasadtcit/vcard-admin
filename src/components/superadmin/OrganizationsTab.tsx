import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Users, 
  Wifi, 
  UserCheck, 
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
import { mockOrganizations, mockUsers, mockSubscriptionPlans } from '../../data/mockData';

const OrganizationsTab: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalOrgs = mockOrganizations.length;
    const activeOrgs = mockOrganizations.filter(org => org.status === 'active').length;
    const totalUsers = mockUsers.length;
    const nfcRequests = 0; // Will be calculated from NFC requests data
    const avatarEnabled = mockUsers.filter(user => user.avatar).length;

    return {
      totalOrganizations: { count: totalOrgs, change: '+12%', trend: 'up' },
      activeOrganizations: { count: activeOrgs, change: '+8%', trend: 'up' },
      totalUsers: { count: totalUsers, change: '+15%', trend: 'up' },
      nfcRequests: { count: nfcRequests, change: '+5%', trend: 'up' },
      avatarEnabled: { count: avatarEnabled, change: '+20%', trend: 'up' }
    };
  }, []);

  // Filter organizations
  const filteredOrganizations = useMemo(() => {
    let orgs = mockOrganizations;

    if (searchTerm) {
      orgs = orgs.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      orgs = orgs.filter(org => org.status === statusFilter);
    }

    if (planFilter !== 'all') {
      orgs = orgs.filter(org => org.subscriptionPlanId === planFilter);
    }

    return orgs;
  }, [searchTerm, statusFilter, planFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
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

  const getOrganizationUsers = (orgId: string) => {
    return mockUsers.filter(user => user.organizationId === orgId);
  };

  const getNFCStatus = (orgId: string) => {
    const users = getOrganizationUsers(orgId);
    const configured = 0; // Will be calculated from NFC cards data
    const total = users.length;
    return { configured, total };
  };

  const getAvatarStatus = (orgId: string) => {
    const users = getOrganizationUsers(orgId);
    const enabled = users.filter(user => user.avatar).length;
    const total = users.length;
    return { enabled, total };
  };

  const handleViewOrganization = (orgId: string) => {
    navigate(`/superadmin/organization/${orgId}`);
  };

  const handleSuspendOrganization = (orgId: string) => {
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

  const handleActivateOrganization = (orgId: string) => {
    addNotification({
      type: 'success',
      title: 'Organization Activated',
      message: 'Organization has been successfully activated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalOrganizations.count}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {kpis.totalOrganizations.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className="text-sm text-gray-600">{kpis.totalOrganizations.change}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.activeOrganizations.count}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {kpis.activeOrganizations.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
            )}
            <span className="text-sm text-gray-600">{kpis.activeOrganizations.change}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalUsers.count}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search organizations..."
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
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Plans</option>
                  {mockSubscriptionPlans
                    .filter(plan => plan.type === 'b2b')
                    .map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell font-medium text-gray-900">Organization</th>
                <th className="table-cell font-medium text-gray-900">Type</th>
                <th className="table-cell font-medium text-gray-900">Subscription Plan</th>
                <th className="table-cell font-medium text-gray-900">Users</th>
                <th className="table-cell font-medium text-gray-900">NFC Cards</th>
                <th className="table-cell font-medium text-gray-900">Avatar Enabled</th>
                <th className="table-cell font-medium text-gray-900">Status</th>
                <th className="table-cell font-medium text-gray-900">Last Activity</th>
                <th className="table-cell font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrganizations.map((org) => {
                const users = getOrganizationUsers(org.id);
                const nfcStatus = getNFCStatus(org.id);
                const avatarStatus = getAvatarStatus(org.id);
                const plan = mockSubscriptionPlans.find(p => p.id === org.subscriptionPlanId);

                return (
                  <tr key={org.id} className="table-row">
                    <td className="table-cell py-3">
                      <div className="flex items-center space-x-3">
                        {org.logo ? (
                          <img
                            src={org.logo}
                            alt={org.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{org.name}</p>
                          <p className="text-xs text-gray-500">{org.domain}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        B2B
                      </span>
                    </td>
                    <td className="table-cell py-3">
                      <span className="text-sm text-gray-900">{plan?.name || 'No Plan'}</span>
                    </td>
                    <td className="table-cell py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{users.length}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((users.length / 50) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">/50</span>
                      </div>
                    </td>
                    <td className="table-cell py-3">
                      <span className="text-sm text-gray-900">
                        {nfcStatus.configured}/{nfcStatus.total}
                      </span>
                    </td>
                    <td className="table-cell py-3">
                      <span className="text-sm text-gray-900">
                        {avatarStatus.enabled}/{avatarStatus.total}
                      </span>
                    </td>
                    <td className="table-cell py-3">
                      {getStatusBadge(org.status)}
                    </td>
                    <td className="table-cell py-3 text-sm text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewOrganization(org.id)}
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
                              message: 'Edit organization functionality will be available soon.',
                              isRead: false,
                              userId: currentUser?.id || '',
                            });
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Edit Organization"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {org.status === 'active' ? (
                          <button
                            onClick={() => handleSuspendOrganization(org.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Suspend Organization"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateOrganization(org.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Activate Organization"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Organizations Found</h3>
            <p className="text-gray-600">No organizations match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationsTab; 