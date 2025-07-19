import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye,
  Calendar,
  Download,
  MapPin,
  Smartphone,
  User,
  Globe,
  QrCode,
  Link,
  Wifi,
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  Globe2,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import type { OrgViewerLog } from '../../types';
import { mockOrgViewerLogs } from '../../data/mockData';

const OrgLogs: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const logs: OrgViewerLog[] = useMemo(() => mockOrgViewerLogs, []);

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.viewedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.cardTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.viewerIp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.viewerLocation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(log => log.source === sourceFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (dateFilter) {
          case 'today':
            return logDate >= today;
          case 'yesterday':
            return logDate >= yesterday && logDate < today;
          case 'last_week':
            return logDate >= lastWeek;
          case 'last_month':
            return logDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [logs, searchTerm, sourceFilter, dateFilter]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'qr':
        return <QrCode className="w-4 h-4 text-blue-500" />;
      case 'direct_link':
        return <Link className="w-4 h-4 text-green-500" />;
      case 'nfc':
        return <Wifi className="w-4 h-4 text-purple-500" />;
      default:
        return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceBadge = (source: string) => {
    const sourceLabels = {
      qr: 'QR Code',
      direct_link: 'Direct Link',
      nfc: 'NFC'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        source === 'qr' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
        source === 'direct_link' ? 'bg-green-50 text-green-700 border border-green-200' :
        'bg-purple-50 text-purple-700 border border-purple-200'
      }`}>
        {getSourceIcon(source)}
        <span className="ml-1">{sourceLabels[source as keyof typeof sourceLabels]}</span>
      </span>
    );
  };

  const handleExportLogs = () => {
    addNotification({
      type: 'success',
      title: 'Export Successful',
      message: 'Viewer logs have been exported to CSV.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const getTopViewedUsers = () => {
    const userViews = logs.reduce((acc, log) => {
      acc[log.viewedUser] = (acc[log.viewedUser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getTopSources = () => {
    const sourceCounts = logs.reduce((acc, log) => {
      acc[log.source] = (acc[log.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Viewer Logs</h1>
          <p className="text-gray-600 mt-1">Track who viewed your organization's cards and when</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            <span>{filteredLogs.length} of {logs.length} views</span>
          </div>
          <button 
            onClick={handleExportLogs}
            className="btn-primary flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Viewers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(logs.map(log => log.viewerIp)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(logs.map(log => log.viewerLocation?.split(', ').pop()).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(log => {
                  const logDate = new Date(log.timestamp);
                  const today = new Date();
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by user, card, IP, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn-secondary flex items-center ${showFilters ? 'bg-primary-50 text-primary-700 border-primary-200' : ''}`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Sources</option>
                      <option value="qr">QR Code</option>
                      <option value="direct_link">Direct Link</option>
                      <option value="nfc">NFC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="last_week">Last 7 Days</option>
                      <option value="last_month">Last 30 Days</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Viewer Logs Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viewed User</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{log.viewedUser}</p>
                            <p className="text-xs text-gray-500 truncate">{log.viewerIp}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900 truncate max-w-32">{log.cardTitle}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate max-w-32">
                            {log.viewerLocation || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate max-w-32">
                            {log.viewerDevice || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getSourceBadge(log.source)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="text-sm text-gray-600">
                            <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Viewer Logs Found</h3>
                <p className="text-gray-600">
                  {logs.length === 0 
                    ? "No card views have been recorded yet."
                    : "No logs match your current filters."
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          {/* Top Viewed Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Viewed Users</h3>
            
            <div className="space-y-3">
              {getTopViewedUsers().map(([user, views], index) => (
                <div key={user} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user}</p>
                      <p className="text-xs text-gray-500">{views} views</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Distribution</h3>
            
            <div className="space-y-3">
              {getTopSources().map(([source, count]) => (
                <div key={source} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getSourceIcon(source)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {source === 'qr' ? 'QR Code' : 
                         source === 'direct_link' ? 'Direct Link' : 'NFC'}
                      </p>
                      <p className="text-xs text-gray-500">{count} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {Math.round((count / logs.length) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {getSourceIcon(log.source)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{log.viewedUser}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgLogs; 