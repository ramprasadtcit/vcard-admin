import React, { useState } from 'react';
import { 
  Plus,
  CreditCard,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Users,
  Wifi,
  Palette,
  Zap,
  Shield,
  Globe,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { mockSubscriptionPlans } from '../../data/mockData';
import { SubscriptionPlan } from '../../types';

const SubscriptionPlans: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planTypeFilter, setPlanTypeFilter] = useState<'all' | 'b2b' | 'b2c'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Only Super Admin and Platform Admin can access this page
  if (!['super_admin', 'platform_admin'].includes(currentUser?.role || '')) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only administrators can manage subscription plans.</p>
      </div>
    );
  }

  // Filter plans based on search and filters
  const filteredPlans = plans.filter(plan => {
    if (planTypeFilter !== 'all' && plan.type !== planTypeFilter) return false;
    if (searchTerm && !plan.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      b2b: { color: 'bg-blue-100 text-blue-800', icon: Shield },
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

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  const handleCreatePlan = (formData: any) => {
    const newPlan: SubscriptionPlan = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      price: formData.price,
      billingCycle: formData.billingCycle,
      currency: formData.currency,
      description: formData.description,
      features: formData.features,
      isPopular: formData.isPopular,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
    };

    setPlans(prev => [newPlan, ...prev]);
    setShowPlanModal(false);
    
    addNotification({
      type: 'success',
      title: 'Plan Created',
      message: `${formData.name} has been created successfully.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== planId));
    
    addNotification({
      type: 'success',
      title: 'Plan Deleted',
      message: 'Subscription plan has been deleted successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleToggleActive = (planId: string) => {
    setPlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? { ...plan, isActive: !plan.isActive }
          : plan
      )
    );
    
    addNotification({
      type: 'success',
      title: 'Plan Status Updated',
      message: 'Subscription plan status has been updated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600">Create and manage subscription plans for B2B and B2C users</p>
        </div>
        <button
          onClick={() => setShowPlanModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">B2B Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.type === 'b2b').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">B2C Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(plan => plan.type === 'b2c').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 w-full">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={planTypeFilter}
              onChange={e => setPlanTypeFilter(e.target.value as 'all' | 'b2b' | 'b2c')}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="all">All Plans</option>
              <option value="b2b">B2B Plans</option>
              <option value="b2c">B2C Plans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="card relative">
            {plan.isPopular && (
              <div className="absolute -top-2 -right-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  <Zap className="w-3 h-3 mr-1" />
                  Popular
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                {getTypeBadge(plan.type)}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-500">/{plan.billingCycle}</span>
                </div>
                <div className="text-sm text-gray-500">{plan.currency}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Features:</div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  {plan.features.maxUsers === -1 ? 'Unlimited' : `Up to ${plan.features.maxUsers}`} users
                </li>
                <li className="flex items-center">
                  <Wifi className="w-4 h-4 mr-2 text-gray-400" />
                  {plan.features.nfcEnabled ? 'NFC enabled' : 'No NFC'}
                </li>
                <li className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-gray-400" />
                  {plan.features.avatarEnabled ? 'AI Avatar enabled' : 'No Avatar'}
                </li>
                <li className="flex items-center">
                  <Palette className="w-4 h-4 mr-2 text-gray-400" />
                  {plan.features.customTemplates ? 'Custom templates' : 'Standard templates'}
                </li>
                <li className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-gray-400" />
                  {plan.features.advancedAnalytics ? 'Advanced analytics' : 'Basic analytics'}
                </li>
                {plan.features.apiAccess && (
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-gray-400" />
                    API access
                  </li>
                )}
                {plan.features.prioritySupport && (
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-gray-400" />
                    Priority support
                  </li>
                )}
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-gray-400">💾</span>
                  {plan.features.storageGB}GB storage
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {getStatusBadge(plan.isActive)}
                <button
                  onClick={() => handleToggleActive(plan.id)}
                  className={`text-xs px-2 py-1 rounded ${
                    plan.isActive 
                      ? 'text-red-600 hover:text-red-700' 
                      : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    // setSelectedPlan(plan); // This line is removed
                    setShowPlanModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 p-1"
                  title="Edit Plan"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Plans Found</h3>
          <p className="text-gray-600">No subscription plans match your current filters.</p>
        </div>
      )}

      {/* Create Plan Modal */}
      {showPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Plan</h2>
              <button
                onClick={() => setShowPlanModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., B2B Professional"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="b2b">B2B</option>
                        <option value="b2c">B2C</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="29"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Users</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="10"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="nfcEnabled"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="nfcEnabled" className="ml-2 block text-sm text-gray-900">
                          NFC Enabled
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="customTemplates"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="customTemplates" className="ml-2 block text-sm text-gray-900">
                          Custom Templates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="advancedAnalytics"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="advancedAnalytics" className="ml-2 block text-sm text-gray-900">
                          Advanced Analytics
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="apiAccess"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="apiAccess" className="ml-2 block text-sm text-gray-900">
                          API Access
                        </label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="prioritySupport"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="prioritySupport" className="ml-2 block text-sm text-gray-900">
                          Priority Support
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="branding"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="branding" className="ml-2 block text-sm text-gray-900">
                          Custom Branding
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPopular"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-900">
                          Mark as Popular
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isActive"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Active Plan
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Storage (GB)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="5"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPlanModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreatePlan({})}
                className="btn-primary"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans; 