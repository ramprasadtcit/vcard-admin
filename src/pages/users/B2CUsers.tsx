import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  XCircle, 
  CheckCircle, 
  Trash2, 
  UserPlus, 
  Wifi,
  Clock,
  CreditCard
} from 'lucide-react';
import { mockB2CUsers, mockSubscriptionPlans } from '../../data/mockData';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';

const B2CUsers: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subscriptionPlanId: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
  });

  // Filter B2C users based on search criteria
  const filteredUsers = useMemo(() => {
    let users = mockB2CUsers;

    // Search filter
    if (searchTerm) {
      users = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      users = users.filter(user => user.status === statusFilter);
    }

    // Plan filter
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
    if (!plan) return null;

    const color = plan.type === 'b2c' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {plan.name}
      </span>
    );
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

  const handleDeactivateUser = (userId: string) => {
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

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      addNotification({
        type: 'success',
        title: 'User Deleted',
        message: 'B2C user has been successfully deleted.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subscriptionPlanId: '',
      status: 'active',
    });
  };

  const handleCreateUser = () => {
    if (!formData.name || !formData.email || !formData.subscriptionPlanId) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
        isRead: false,
        userId: currentUser?.id || '',
      });
      return;
    }

    // In a real app, this would make an API call
    const newUser = {
      id: `b2c-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      status: formData.status,
      subscriptionId: `sub-b2c-${Date.now()}`,
      subscriptionPlanId: formData.subscriptionPlanId,
      nfcCards: [],
      totalViews: 0,
      createdAt: new Date().toISOString(),
      lastLogin: undefined,
    };

    // Add to mock data (in real app, this would be an API call)
    mockB2CUsers.push(newUser);

    // Close modal and reset form
    setShowCreateModal(false);
    resetForm();

    addNotification({
      type: 'success',
      title: 'User Created',
      message: `${formData.name} has been created successfully.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };


  // Only Super Admin can access this page
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only super administrators can access B2C user management.</p>
      </div>
    );
  }

  // Calculate stats
  const activeUsers = filteredUsers.filter(user => user.status === 'active').length;
  const usersWithNFC = filteredUsers.filter(user => user.nfcCardId).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">B2C User Management</h1>
          <p className="text-gray-600">Manage individual B2C users and their subscriptions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add B2C User
        </button>
      </div>

      {/* Stats and Filters in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total B2C Users</p>
              <p className="text-xl font-bold text-gray-900">{filteredUsers.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wifi className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">NFC Users</p>
              <p className="text-xl font-bold text-gray-900">{usersWithNFC}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search B2C users..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
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
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell font-medium text-gray-900">User</th>
                <th className="table-cell font-medium text-gray-900">Status</th>
                <th className="table-cell font-medium text-gray-900">Subscription</th>
                <th className="table-cell font-medium text-gray-900">Views</th>
                <th className="table-cell font-medium text-gray-900">NFC</th>
                <th className="table-cell font-medium text-gray-900">Created</th>
                <th className="table-cell font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell py-2">
                    <div className="flex items-center space-x-2">
                      <img
                        src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell py-2">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="table-cell py-2">
                    {getPlanBadge(user.subscriptionPlanId)}
                  </td>
                  <td className="table-cell py-2 text-xs text-gray-600">
                    {user.totalViews.toLocaleString()}
                  </td>
                  <td className="table-cell py-2">
                    {user.nfcCardId ? (
                      <span className="inline-flex items-center text-green-600 text-xs">
                        <Wifi className="w-3 h-3 mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="table-cell py-2 text-xs text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell py-2 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/user/${user.id}`)}
                        className="text-primary-600 hover:text-primary-700 p-1"
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
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleDeactivateUser(user.id)}
                          className="text-yellow-600 hover:text-yellow-700 p-1"
                          title="Deactivate User"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="Activate User"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
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

      {/* Create B2C User Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New B2C User</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form 
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateUser();
                }}
              >
                {/* User Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter full name"
                        required
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter email address"
                        required
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.status}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subscription Plan */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(() => {
                      const b2cPlans = mockSubscriptionPlans.filter(plan => plan.type === 'b2c');
                      return b2cPlans.map(plan => (
                        <div
                          key={plan.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            formData.subscriptionPlanId === plan.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => handleFormChange('subscriptionPlanId', plan.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{plan.name}</h4>
                            {formData.subscriptionPlanId === plan.id && (
                              <CheckCircle className="w-5 h-5 text-primary-600" />
                            )}
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            ${plan.price}
                            <span className="text-sm font-normal text-gray-500">/{plan.billingCycle}</span>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Virtual card included</li>
                            <li>• {plan.features.nfcEnabled ? 'NFC enabled' : 'No NFC'}</li>
                            <li>• {plan.features.avatarEnabled ? 'AI Avatar enabled' : 'No Avatar'}</li>
                            <li>• {plan.features.customTemplates ? 'Custom templates' : 'Standard templates'}</li>
                            <li>• {plan.features.advancedAnalytics ? 'Advanced analytics' : 'Basic analytics'}</li>
                            <li>• {plan.features.storageGB}GB storage</li>
                          </ul>
                        </div>
                      ));
                    })()}
                  </div>
                  
                  {!formData.subscriptionPlanId && (
                    <p className="text-sm text-gray-500 mt-2">Please select a subscription plan to continue.</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.subscriptionPlanId}
                    className={`btn-primary ${!formData.subscriptionPlanId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default B2CUsers; 