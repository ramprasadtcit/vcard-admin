import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreVertical, 
  Users, 
  Building2, 
  Globe, 
  XCircle,
  CheckCircle,
  Calendar,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { mockOrganizations, mockUsers, mockSubscriptionPlans, mockSubscriptions } from '../../data/mockData';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { Organization } from '../../types';

const Organizations: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<string>('');
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    adminEmail: '',
    logo: '',
    extraUsersPurchased: 0,
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      domain: '',
      adminEmail: '',
      logo: '',
      extraUsersPurchased: 0,
    });
    setSelectedSubscriptionPlan('');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgsData, usersData] = await Promise.all([
          Promise.resolve(mockOrganizations),
          Promise.resolve(mockUsers),
        ]);
        setOrganizations(orgsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to load organizations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Only Super Admin can access this page
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You don't have permission to view this page.</p>
      </div>
    );
  }

  const getFilteredOrganizations = () => {
    return organizations.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getOrganizationStats = (orgId: string) => {
    const orgUsers = users.filter(user => user.organizationId === orgId);
    const activeUsers = orgUsers.filter(user => user.status === 'active').length;
    const totalUsers = orgUsers.length;
    
    return { activeUsers, totalUsers };
  };

  const getSubscriptionPlan = (orgId: string) => {
    const subscription = mockSubscriptions.find(sub => sub.organizationId === orgId);
    
    if (!subscription) {
      return null;
    }
    
    const plan = mockSubscriptionPlans.find(plan => plan.id === subscription.planId);
    
    return { subscription, plan };
  };

  const getSubscriptionBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Calendar },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  const getOrganizationUsers = (orgId: string) => {
    return users.filter(user => user.organizationId === orgId);
  };

  const handleViewUsers = (organization: Organization) => {
    setSelectedOrganization(organization);
    setShowUsersModal(true);
  };

  const handleCreateOrganization = (formData: any) => {
    // Get the selected plan to determine max users
    const selectedPlan = mockSubscriptionPlans.find(plan => plan.id === selectedSubscriptionPlan);
    const planMaxUsers = selectedPlan?.features.maxUsers || 10;
    const totalMaxUsers = planMaxUsers + (formData.extraUsersPurchased || 0);

    // Create new organization ID
    const newOrgId = (organizations.length + 1).toString();

    // In a real app, this would make an API call
    const newOrganization: Organization = {
      id: `org-${Date.now()}`,
      name: formData.name,
      domain: formData.domain,
      adminId: formData.adminEmail,
      status: 'pending',
      logo: formData.logo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      extraUsersPurchased: formData.extraUsersPurchased || 0,
      subscriptionPlanId: selectedSubscriptionPlan,
      subscriptionStatus: 'pending',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      subOrgs: [],
      settings: {
        allowUserInvites: true,
        requireApproval: false,
        maxUsers: selectedPlan?.features.maxUsers || 0,
        allowNFC: selectedPlan?.features.nfcEnabled || false,
        allowCustomTemplates: selectedPlan?.features.customTemplates || false,
        allowBranding: selectedPlan?.features.branding || false,
      },
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1F2937',
        fontFamily: 'Inter',
      },
      features: {
        nfcEnabled: selectedPlan?.features.nfcEnabled || false,
        customTemplates: selectedPlan?.features.customTemplates || false,
        advancedAnalytics: selectedPlan?.features.advancedAnalytics || false,
        apiAccess: selectedPlan?.features.apiAccess || false,
        prioritySupport: selectedPlan?.features.prioritySupport || false,
      },
    };

    // Add the new organization to the list
    setOrganizations(prev => [newOrganization, ...prev]);
    
    // Reset form and close modal
    setShowCreateModal(false);
    resetForm();

    addNotification({
      type: 'success',
      title: 'Organization Created',
      message: `${formData.name} has been created successfully with the selected subscription plan.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading organizations...</div>
      </div>
    );
  }

  const filteredOrganizations = getFilteredOrganizations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">B2B Organizations</h1>
          <p className="text-gray-600">Manage registered business organizations</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-900">{organizations.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockSubscriptions.filter(sub => sub.status === 'active').length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${mockSubscriptions
                  .filter(sub => sub.status === 'active')
                  .reduce((sum, sub) => sum + sub.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganizations.map((organization) => {
                const stats = getOrganizationStats(organization.id);
                const admin = users.find(user => user.id === organization.adminId);
                const subscriptionData = getSubscriptionPlan(organization.id);
                const { plan } = subscriptionData || {};
                
                return (
                  <tr key={organization.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {organization.logo ? (
                          <img
                            src={organization.logo}
                            alt={organization.name}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{organization.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {organization.domain}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admin?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{admin?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{plan?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">
                        {plan?.features.maxUsers === -1 ? 'Unlimited' : `${plan?.features.maxUsers} users`}
                      </div>
                      {subscriptionData?.subscription && (
                        <div className="mt-1">
                          {getSubscriptionBadge(subscriptionData.subscription.status)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {stats.activeUsers}/{stats.totalUsers}
                      </div>
                      <div className="text-xs text-gray-400">
                        {organization.extraUsersPurchased || 0} extra slots
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(organization.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/organization/${organization.id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleViewUsers(organization)}
                          className="text-purple-600 hover:text-purple-900 p-1"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Organization</h2>
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
                  if (selectedSubscriptionPlan) {
                    handleCreateOrganization(formData);
                  }
                }}
              >
                {/* Organization Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter organization name"
                        required
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="example.com"
                        required
                        value={formData.domain}
                        onChange={(e) => handleFormChange('domain', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="admin@example.com"
                        required
                        value={formData.adminEmail}
                        onChange={(e) => handleFormChange('adminEmail', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Optional)</label>
                      <input
                        type="url"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com/logo.png"
                        value={formData.logo}
                        onChange={(e) => handleFormChange('logo', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Plan Selection */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(() => {
                      const b2bPlans = mockSubscriptionPlans.filter(plan => plan.type === 'b2b');
                      return b2bPlans.map(plan => (
                        <div
                          key={plan.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedSubscriptionPlan === plan.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setSelectedSubscriptionPlan(plan.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{plan.name}</h4>
                            {selectedSubscriptionPlan === plan.id && (
                              <CheckCircle className="w-5 h-5 text-primary-600" />
                            )}
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            ${plan.price}
                            <span className="text-sm font-normal text-gray-500">/{plan.billingCycle}</span>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Up to {plan.features.maxUsers === -1 ? 'Unlimited' : plan.features.maxUsers} users</li>
                            <li>• {plan.features.nfcEnabled ? 'NFC enabled' : 'No NFC'}</li>
                            <li>• {plan.features.avatarEnabled ? 'AI Avatar enabled' : 'No Avatar'}</li>
                            <li>• {plan.features.customTemplates ? 'Custom templates' : 'Standard templates'}</li>
                          </ul>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Organization Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Settings</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Extra Users</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0"
                        min="0"
                        value={formData.extraUsersPurchased}
                        onChange={(e) => handleFormChange('extraUsersPurchased', parseInt(e.target.value, 10))}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Additional user slots beyond plan limit (includes extra NFC cards)
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
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
                disabled={!selectedSubscriptionPlan}
                className={`btn-primary ${!selectedSubscriptionPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Create Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Users Modal */}
      {showUsersModal && selectedOrganization && (
        <div className="modal-overlay">
          <div className="modal-content max-w-4xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Users - {selectedOrganization.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedOrganization.domain} • {getOrganizationUsers(selectedOrganization.id).length} users
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUsersModal(false);
                  setSelectedOrganization(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getOrganizationUsers(selectedOrganization.id).map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <Users className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'org_admin' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'sub_admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'editor' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => navigate(`/org-user/${user.id}`)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-1">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {getOrganizationUsers(selectedOrganization.id).length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
                  <p className="text-gray-600">This organization doesn't have any users yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizations; 