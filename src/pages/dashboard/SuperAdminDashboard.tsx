import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import OrganizationsTab from '../../components/superadmin/OrganizationsTab';
import B2CUsersTab from '../../components/superadmin/B2CUsersTab';

const SuperAdminDashboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'organizations' | 'b2c-users'>('organizations');

  // Only Super Admin can access this page
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only super administrators can access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage B2B organizations and B2C users</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'Feature Coming Soon',
                message: 'Bulk operations will be available soon.',
                isRead: false,
                userId: currentUser?.id || '',
              });
            }}
            className="btn-secondary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Bulk Operations
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('organizations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'organizations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Organizations</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('b2c-users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'b2c-users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>B2C Users</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'organizations' && <OrganizationsTab />}
        {activeTab === 'b2c-users' && <B2CUsersTab />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 