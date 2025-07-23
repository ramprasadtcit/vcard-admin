import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  CreditCard, 
  Smartphone, 
  Eye, 
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  XCircle,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts';
import { DashboardStats, OrgAdminDashboardStats } from '../../types';
import { mockOrgAdminDashboardStats } from '../../data/mockData';
import { ComingSoonOverlay } from '../../components';

const Dashboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orgAdminStats, setOrgAdminStats] = useState<OrgAdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    const loadStats = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStats: DashboardStats = {
          // Super Admin & Platform Admin Stats
          totalOrganizations: 156,
          activeOrganizations: 142,
          pendingOrganizations: 14,
          totalB2CUsers: 2847,
          activeB2CUsers: 2653,
          totalNFCRequests: 89,
          pendingNFCRequests: 23,
          totalRevenue: 125000,
          monthlyRevenue: 18500,
          
          // Org Admin Stats
          totalUsers: 45,
          activeUsers: 42,
          totalCards: 156,
          totalCardViews: 2847,
          totalCardShares: 892,
          nfcCardsConfigured: 23,
          nfcCardsPending: 5,
          
          // Org Sub Admin Stats
          assignedUsers: 12,
          assignedCards: 34,
          recentActivity: 156,
        };
        
        setStats(mockStats);
        setOrgAdminStats(mockOrgAdminDashboardStats);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Org Admin Dashboard Component
  const OrgAdminDashboard: React.FC = () => {
    if (!orgAdminStats) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Org Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your organization's end users and virtual cards</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Organization:</span> TechCorp Inc.
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{orgAdminStats.totalUsers}</p>
                <p className="text-xs text-gray-500">End users only</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{orgAdminStats.activeUsers}</p>
                <p className="text-xs text-gray-500">Currently active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-gray-900">{orgAdminStats.inactiveUsers}</p>
                <p className="text-xs text-gray-500">Deactivated users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Viewer Count</p>
                <p className="text-2xl font-bold text-gray-900">{orgAdminStats.viewerCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total unique views</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Daily Logins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(orgAdminStats.lastLoginData.reduce((sum, day) => sum + day.count, 0) / 7)}
                </p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Last Login Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Last Login Activity (7 Days)</h3>
            <div className="text-sm text-gray-500">
              Total: {orgAdminStats.lastLoginData.reduce((sum, day) => sum + day.count, 0)} logins
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orgAdminStats.lastLoginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  formatter={(value) => [`${value} logins`, 'Login Count']}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="w-5 h-5 text-blue-600 mr-3" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Add User</div>
                <div className="text-sm text-gray-500">Invite new end user</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-green-600 mr-3" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-500">View all end users</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <UserCheck className="w-5 h-5 text-purple-600 mr-3" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Sub Admins</div>
                <div className="text-sm text-gray-500">Manage team access</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-5 h-5 text-yellow-600 mr-3" />
              <div className="text-left">
                <div className="font-medium text-gray-900">View Analytics</div>
                <div className="text-sm text-gray-500">Card performance</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getRoleSpecificStats = () => {
    if (!stats) return [];

    switch (currentUser?.role) {
      case 'super_admin':
      case 'platform_admin':
        return [
          {
            title: 'Total Organizations',
            value: stats.totalOrganizations,
            change: '+12%',
            changeType: 'positive',
            icon: Building2,
            color: 'blue',
          },
          {
            title: 'Active B2C Users',
            value: stats.activeB2CUsers,
            change: '+8%',
            changeType: 'positive',
            icon: Users,
            color: 'green',
          },
          {
            title: 'Pending NFC Requests',
            value: stats.pendingNFCRequests,
            change: '-5%',
            changeType: 'negative',
            icon: Smartphone,
            color: 'yellow',
          },
          {
            title: 'Monthly Revenue',
            value: `$${stats.monthlyRevenue.toLocaleString()}`,
            change: '+15%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'purple',
          },
        ];
      
      case 'org_admin':
        // Return empty array for org_admin as we're using the new dashboard
        return [];
      
      case 'org_sub_admin':
        return [
          {
            title: 'Assigned Users',
            value: stats.assignedUsers,
            change: '+1',
            changeType: 'positive',
            icon: Users,
            color: 'blue',
          },
          {
            title: 'Assigned Cards',
            value: stats.assignedCards,
            change: '+3',
            changeType: 'positive',
            icon: CreditCard,
            color: 'green',
          },
          {
            title: 'Recent Activity',
            value: stats.recentActivity,
            change: '+23',
            changeType: 'positive',
            icon: Activity,
            color: 'purple',
          },
        ];
      
      default:
        return [];
    }
  };

  const getQuickActions = () => {
    switch (currentUser?.role) {
      case 'super_admin':
        return [
          { label: 'Add Platform Admin', icon: Plus, path: '/platform-admins' },
          { label: 'Review NFC Requests', icon: Smartphone, path: '/nfc-requests' },
          { label: 'Create Subscription Plan', icon: CreditCard, path: '/subscription-plans' },
          { label: 'Send Broadcast', icon: TrendingUp, path: '/broadcasts' },
        ];
      
      case 'platform_admin':
        return [
          { label: 'Review Organizations', icon: Building2, path: '/organizations' },
          { label: 'Process NFC Requests', icon: Smartphone, path: '/nfc-requests' },
          { label: 'Manage B2C Users', icon: Users, path: '/b2c-users' },
          { label: 'View Activity Logs', icon: Activity, path: '/activity-logs' },
        ];
      
      case 'org_admin':
        return [
          { label: 'Add User', icon: Plus, path: '/org/users' },
          { label: 'Manage Sub Admins', icon: UserCheck, path: '/org/sub-admins' },
          { label: 'View Analytics', icon: Eye, path: '/org/analytics' },
          { label: 'Customize Theme', icon: TrendingUp, path: '/org/customization' },
        ];
      
      case 'org_sub_admin':
        return [
          { label: 'View Assigned Users', icon: Users, path: '/assigned-users' },
          { label: 'Manage Cards', icon: CreditCard, path: '/cards' },
          { label: 'View Activity', icon: Activity, path: '/activity' },
        ];
      
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show coming soon for all roles - only F&F onboarding is functional
  return (
    <ComingSoonOverlay 
      title="Dashboard"
      description="Dashboard features are currently being developed. Only F&F onboarding functionality is available."
      phase="Phase 2"
    />
  );

  // Original dashboard for other roles
  const roleStats = getRoleSpecificStats();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Role:</span> {currentUser?.role?.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roleStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <IconComponent className="w-5 h-5 text-blue-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{action.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 