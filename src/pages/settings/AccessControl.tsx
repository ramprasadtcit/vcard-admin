import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts';
import { User, Organization } from '../../types';
import { ROLES, ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS } from '../../constants/roles';
import { apiService } from '../../services/api';
import UserAvatar from '../../components/UserAvatar';
import SimpleTable from '../../components/SimpleTable';
import ComingSoonOverlay from '../../components/ComingSoonOverlay';

const AccessControl: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, orgsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getOrganizations(),
      ]);
      setUsers(usersData);
      setOrganizations(orgsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const updatedUser = await apiService.updateUser(userId, { role: newRole as any });
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const updatedUser = await apiService.updateUser(userId, { status: newStatus as any });
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getOrganizationName = (orgId?: string) => {
    if (!orgId) return 'N/A';
    const org = organizations.find(o => o.id === orgId);
    return org?.name || 'Unknown';
  };

  const canManageUser = (targetUser: User) => {
    if (!currentUser) return false;
    
    // Super admin can manage everyone
    if (currentUser.role === ROLES.SUPER_ADMIN) return true;
    
    // Org admin can manage users in their organization
    if (currentUser.role === ROLES.ORG_ADMIN) {
      return targetUser.organizationId === currentUser.organizationId;
    }
    
    return false;
  };

  const userColumns = [
    {
      key: 'user',
      label: 'User',
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} size="sm" />
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">
            {ROLE_DISPLAY_NAMES[user.role as keyof typeof ROLE_DISPLAY_NAMES]}
          </span>
          {canManageUser(user) && (
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              {Object.entries(ROLE_DISPLAY_NAMES).map(([role, displayName]) => (
                <option key={role} value={role}>
                  {displayName}
                </option>
              ))}
            </select>
          )}
        </div>
      ),
    },
    {
      key: 'organization',
      label: 'Organization',
      render: (user: User) => (
        <span className="text-sm text-gray-900">
          {getOrganizationName(user.organizationId)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : user.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
          {canManageUser(user) && (
            <select
              value={user.status}
              onChange={(e) => handleStatusChange(user.id, e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          )}
        </div>
      ),
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (user: User) => (
        <div className="text-sm text-gray-600">
          {user.permissions ? 
            `${Object.values(user.permissions).filter(Boolean).length} of ${Object.keys(user.permissions).length} enabled` :
            'No permissions set'
          }
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: User) => (
        <div className="flex space-x-2">
          {canManageUser(user) && (
            <>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowUserModal(true);
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                className={`text-xs ${
                  user.status === 'active' 
                    ? 'text-red-600 hover:text-red-800' 
                    : 'text-green-600 hover:text-green-800'
                }`}
              >
                {user.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading access control data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Access Control</h1>
        <p className="text-gray-600 mt-2">Manage user roles, permissions, and access levels</p>
      </div>

      {/* Role Overview */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Role Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(ROLE_DISPLAY_NAMES).map(([role, displayName]) => {
              const roleUsers = users.filter(u => u.role === role);
              return (
                <div key={role} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{displayName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{roleUsers.length}</span>
                    <span className="text-sm text-gray-500">users</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Search users..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {hasPermission('manage_users') && (
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Add User
                </button>
              )}
            </div>
          </div>

          <SimpleTable
            data={users}
            columns={userColumns}
            emptyMessage="No users found"
          />
        </div>
      </div>

      {/* Advanced Permissions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 relative">
        <ComingSoonOverlay title="Advanced Permissions" />
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Advanced Permissions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Custom Permission Sets</h3>
                <p className="text-sm text-gray-500">Create custom permission combinations</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Configure
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Permission Templates</h3>
                <p className="text-sm text-gray-500">Save and reuse permission configurations</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Manage
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Audit Logs</h3>
                <p className="text-sm text-gray-500">Track permission changes and access</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                View Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl; 