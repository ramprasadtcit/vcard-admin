import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts';
import { AuditLog } from '../../types';
import SimpleTable from '../../components/SimpleTable';
import ComingSoonOverlay from '../../components/ComingSoonOverlay';

// Mock audit logs data
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'user_login',
    userId: '2',
    userName: 'John Doe',
    targetType: 'user',
    targetId: '2',
    details: 'User logged in successfully',
    timestamp: '2024-01-25T10:30:00Z',
    metadata: {
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
  },
  {
    id: '2',
    action: 'user_created',
    userId: '1',
    userName: 'Super Admin',
    targetType: 'user',
    targetId: '3',
    details: 'Created new user: Jane Smith',
    timestamp: '2024-01-25T09:15:00Z',
    metadata: {
      userEmail: 'jane@company.com',
      userRole: 'sub_admin',
    },
  },
  {
    id: '3',
    action: 'organization_updated',
    userId: '1',
    userName: 'Super Admin',
    targetType: 'organization',
    targetId: 'org1',
    details: 'Updated organization settings',
    timestamp: '2024-01-25T08:45:00Z',
    metadata: {
      changes: ['maxUsers', 'allowNFC'],
    },
  },
  {
    id: '4',
    action: 'nfc_configured',
    userId: '2',
    userName: 'John Doe',
    targetType: 'nfc',
    targetId: 'nfc1',
    details: 'Configured NFC card for user',
    timestamp: '2024-01-24T16:20:00Z',
    metadata: {
      cardType: 'individual',
      redirectUrl: 'https://twintik.com/card/john-doe',
    },
  },
  {
    id: '5',
    action: 'user_deactivated',
    userId: '1',
    userName: 'Super Admin',
    targetType: 'user',
    targetId: '4',
    details: 'Deactivated user account',
    timestamp: '2024-01-24T14:30:00Z',
    metadata: {
      reason: 'Inactive account',
    },
  },
];

const Logs: React.FC = () => {
  const { hasPermission } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    targetType: '',
    userId: '',
    dateRange: '7d',
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLogs(mockAuditLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionDisplayName = (action: string) => {
    const actionMap: Record<string, string> = {
      user_login: 'User Login',
      user_logout: 'User Logout',
      user_created: 'User Created',
      user_updated: 'User Updated',
      user_deactivated: 'User Deactivated',
      organization_created: 'Organization Created',
      organization_updated: 'Organization Updated',
      nfc_configured: 'NFC Configured',
      permission_changed: 'Permission Changed',
    };
    return actionMap[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTargetTypeDisplayName = (targetType: string) => {
    const typeMap: Record<string, string> = {
      user: 'User',
      organization: 'Organization',
      card: 'Card',
      settings: 'Settings',
      nfc: 'NFC',
      template: 'Template',
      subscription: 'Subscription',
    };
    return typeMap[targetType] || targetType.charAt(0).toUpperCase() + targetType.slice(1);
  };

  const getSeverityColor = (action: string) => {
    const criticalActions = ['user_deactivated', 'organization_deleted', 'permission_changed'];
    const warningActions = ['user_updated', 'organization_updated', 'nfc_configured'];
    
    if (criticalActions.includes(action)) {
      return 'bg-red-100 text-red-800';
    } else if (warningActions.includes(action)) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  const logColumns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (log: AuditLog) => (
        <div className="text-sm text-gray-900">
          {new Date(log.timestamp).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (log: AuditLog) => (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.action)}`}>
            {getActionDisplayName(log.action)}
          </span>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (log: AuditLog) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{log.userName}</div>
          <div className="text-gray-500">ID: {log.userId}</div>
        </div>
      ),
    },
    {
      key: 'target',
      label: 'Target',
      render: (log: AuditLog) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{getTargetTypeDisplayName(log.targetType)}</div>
          <div className="text-gray-500">ID: {log.targetId}</div>
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      render: (log: AuditLog) => (
        <div className="text-sm text-gray-900 max-w-xs truncate" title={log.details}>
          {log.details}
        </div>
      ),
    },
    {
      key: 'metadata',
      label: 'Metadata',
      render: (log: AuditLog) => (
        <div className="text-xs text-gray-500">
          {log.metadata && Object.keys(log.metadata).length > 0 ? (
            <span className="cursor-pointer hover:text-gray-700" title={JSON.stringify(log.metadata, null, 2)}>
              {Object.keys(log.metadata).length} fields
            </span>
          ) : (
            'None'
          )}
        </div>
      ),
    },
  ];

  const filteredLogs = logs.filter(log => {
    if (filters.action && !log.action.includes(filters.action)) return false;
    if (filters.targetType && log.targetType !== filters.targetType) return false;
    if (filters.userId && log.userId !== filters.userId) return false;
    
    // Date range filter
    const logDate = new Date(log.timestamp);
    const now = new Date();
    const daysAgo = parseInt(filters.dateRange.replace('d', ''));
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    if (logDate < cutoffDate) return false;
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading activity logs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-2">Monitor user activities and system events</p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <input
                type="text"
                placeholder="Filter by action..."
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Type</label>
              <select
                value={filters.targetType}
                onChange={(e) => setFilters(prev => ({ ...prev, targetType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="user">User</option>
                <option value="organization">Organization</option>
                <option value="card">Card</option>
                <option value="settings">Settings</option>
                <option value="nfc">NFC</option>
                <option value="template">Template</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                placeholder="Filter by user ID..."
                value={filters.userId}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredLogs.length} of {logs.length} logs
            </div>
            <button
              onClick={() => setFilters({ action: '', targetType: '', userId: '', dateRange: '7d' })}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>
            <div className="flex space-x-3">
              <button
                onClick={loadLogs}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh
              </button>
              {hasPermission('view_usage_logs') && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Export Logs
                </button>
              )}
            </div>
          </div>

          <SimpleTable
            data={filteredLogs}
            columns={logColumns}
            emptyMessage="No logs found matching the current filters"
          />
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 relative">
        <ComingSoonOverlay title="Advanced Analytics" />
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Log Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Most Active Users</h3>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Action Distribution</h3>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Security Events</h3>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs; 