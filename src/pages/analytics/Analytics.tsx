import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Share2, 
  Bookmark,
  Calendar,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { mockAnalytics, mockCards, mockUsers } from '../../data/mockData';

const Analytics: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);

  const getRoleBasedAnalytics = () => {
    if (!currentUser) return mockAnalytics;

    if (currentUser.role === 'org_admin') {
      const orgCards = mockCards.filter(card => card.organizationId === currentUser.organizationId);
      const orgUsers = mockUsers.filter(user => user.organizationId === currentUser.organizationId);
      
      return {
        id: 'org_analytics',
        type: 'card_views',
        data: {
          totalUsers: orgUsers.length,
          totalCards: orgCards.length,
          totalViews: orgCards.reduce((sum, card) => sum + card.views, 0),
          totalShares: orgCards.reduce((sum, card) => sum + card.shares, 0),
          totalSaves: orgCards.reduce((sum, card) => sum + card.saves, 0),
          activeUsers: orgUsers.length,
          activeOrganizations: 1,
          pendingOrganizations: 0,
        },
        period: 'monthly',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        createdAt: '2024-01-31T23:59:59Z',
      };
    }

    if (currentUser.role === 'sub_admin') {
      const subOrgCards = mockCards.filter(card => card.organizationId === currentUser.organizationId);
      const subOrgUsers = mockUsers.filter(user => 
        user.organizationId === currentUser.organizationId && 
        user.subOrgId === currentUser.subOrgId
      );
      
      return {
        id: 'sub_org_analytics',
        type: 'card_views',
        data: {
          totalUsers: subOrgUsers.length,
          totalCards: subOrgCards.length,
          totalViews: subOrgCards.reduce((sum, card) => sum + card.views, 0),
          totalShares: subOrgCards.reduce((sum, card) => sum + card.shares, 0),
          totalSaves: subOrgCards.reduce((sum, card) => sum + card.saves, 0),
          activeUsers: subOrgUsers.length,
          activeOrganizations: 1,
          pendingOrganizations: 0,
        },
        period: 'monthly',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        createdAt: '2024-01-31T23:59:59Z',
      };
    }

    return mockAnalytics;
  };

  const analytics = getRoleBasedAnalytics();

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartCard: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const SimpleBarChart: React.FC<{
    data: { label: string; value: number }[];
    color: string;
  }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1">
              <div className="relative">
                <div 
                  className={`h-2 rounded-full ${color}`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const getTopCards = () => {
    let cards = mockCards;
    
    if (currentUser?.role === 'org_admin') {
      cards = cards.filter(card => card.organizationId === currentUser.organizationId);
    } else if (currentUser?.role === 'sub_admin') {
      cards = cards.filter(card => card.organizationId === currentUser.organizationId);
    }
    
    return cards
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(card => ({
        label: card.title,
        value: card.views,
      }));
  };

  const getActivityData = () => {
    // Mock activity data for the last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      label: day,
      value: Math.floor(Math.random() * 100) + 20,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track performance and engagement metrics</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Views"
          value={analytics.data.totalViews.toLocaleString()}
          change="+12% from last period"
          icon={<Eye className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Total Shares"
          value={analytics.data.totalShares.toLocaleString()}
          change="+8% from last period"
          icon={<Share2 className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Total Saves"
          value={analytics.data.totalSaves.toLocaleString()}
          change="+15% from last period"
          icon={<Bookmark className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <MetricCard
          title="Active Users"
          value={analytics.data.activeUsers}
          change="+5% from last period"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top Performing Cards">
          <SimpleBarChart
            data={getTopCards()}
            color="bg-primary-500"
          />
        </ChartCard>
        
        <ChartCard title="Daily Activity">
          <SimpleBarChart
            data={getActivityData()}
            color="bg-green-500"
          />
        </ChartCard>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Engagement Rate">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Views per Card</span>
              <span className="font-semibold">
                {analytics.data.totalCards > 0 ? Math.round(analytics.data.totalViews / analytics.data.totalCards) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Shares per Card</span>
              <span className="font-semibold">
                {analytics.data.totalCards > 0 ? Math.round(analytics.data.totalShares / analytics.data.totalCards) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Saves per Card</span>
              <span className="font-semibold">
                {analytics.data.totalCards > 0 ? Math.round(analytics.data.totalSaves / analytics.data.totalCards) : 0}
              </span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="User Distribution">
          <div className="space-y-4">
            {currentUser?.role === 'super_admin' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Organizations</span>
                  <span className="font-semibold">{analytics.data.activeOrganizations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Organizations</span>
                  <span className="font-semibold">{analytics.data.pendingOrganizations}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Cards</span>
                  <span className="font-semibold">{analytics.data.totalCards}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold">{analytics.data.activeUsers}</span>
                </div>
              </>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Recent Activity">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New card created</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">User joined</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Card shared</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Export Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Analytics</h3>
            <p className="text-sm text-gray-600">Download reports and data</p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button className="btn-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 