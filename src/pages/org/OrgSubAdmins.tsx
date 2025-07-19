import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Activity,
  Shield,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { SubAdmin } from '../../types';
import { mockSubAdmins } from '../../data/mockData';

const OrgSubAdmins: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSubAdminModal, setShowAddSubAdminModal] = useState(false);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<SubAdmin | null>(null);

  // Form states for adding new sub admin
  const [newSubAdminForm, setNewSubAdminForm] = useState({
    name: '',
    email: '',
    permissions: {
      canManageUsers: true,
      canViewAnalytics: true,
      canManageNFC: false,
      canManageSettings: false,
    },
  });

  // Mock data - in real app, this would come from API
  const subAdmins: SubAdmin[] = useMemo(() => mockSubAdmins, []);

  // Filter sub admins based on search and filters
  const filteredSubAdmins = useMemo(() => {
    let filtered = subAdmins;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(subAdmin =>
        subAdmin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subAdmin.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(subAdmin => subAdmin.status === statusFilter);
    }

    return filtered;
  }, [subAdmins, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = () => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <Shield className="w-3 h-3 mr-1" />
        Org Sub Admin
      </span>
    );
  };

  const handleAddSubAdmin = () => {
    if (!newSubAdminForm.name || !newSubAdminForm.email) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
        isRead: false,
        userId: currentUser?.id || '',
      });
      return;
    }

    // In real app, this would be an API call
    addNotification({
      type: 'success',
      title: 'Sub Admin Invited',
      message: `Invitation sent to ${newSubAdminForm.email}. They will receive an email with admin access instructions.`,
      isRead: false,
      userId: currentUser?.id || '',
    });

    setNewSubAdminForm({ 
      name: '', 
      email: '', 
      permissions: {
        canManageUsers: true,
        canViewAnalytics: true,
        canManageNFC: false,
        canManageSettings: false,
      }
    });
    setShowAddSubAdminModal(false);
  };

  const handleToggleStatus = (subAdminId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: `Sub Admin status changed to ${newStatus}.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleResendInvite = (subAdminId: string, email: string) => {
    addNotification({
      type: 'success',
      title: 'Invitation Resent',
      message: `Admin invitation email sent to ${email}.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleUpdatePermissions = (subAdminId: string, subAdminName: string) => {
    addNotification({
      type: 'success',
      title: 'Permissions Updated',
      message: `Permissions updated for ${subAdminName}.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sub Admins</h1>
          <p className="text-gray-600 mt-1">Manage team members with admin access to TwinTik portal</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>{filteredSubAdmins.length} of {subAdmins.length} sub admins</span>
          </div>
          <button 
            onClick={() => setShowAddSubAdminModal(true)}
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sub Admin
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sub Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {subAdmins.filter(sa => sa.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Can Manage Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {subAdmins.filter(sa => sa.permissions.canManageUsers).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Can View Analytics</p>
              <p className="text-2xl font-bold text-gray-900">
                {subAdmins.filter(sa => sa.permissions.canViewAnalytics).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Can Manage Settings</p>
              <p className="text-2xl font-bold text-gray-900">
                {subAdmins.filter(sa => sa.permissions.canManageSettings).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sub admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sub Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubAdmins.map((subAdmin) => (
                <tr key={subAdmin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={subAdmin.avatar || `https://ui-avatars.com/api/?name=${subAdmin.name}&background=random`}
                          alt={subAdmin.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{subAdmin.name}</div>
                        <div className="text-sm text-gray-500">{subAdmin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(subAdmin.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subAdmin.lastLogin ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(subAdmin.lastLogin).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {subAdmin.permissions.canManageUsers && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                          Users
                        </span>
                      )}
                      {subAdmin.permissions.canViewAnalytics && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                          Analytics
                        </span>
                      )}
                      {subAdmin.permissions.canManageNFC && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700">
                          NFC
                        </span>
                      )}
                      {subAdmin.permissions.canManageSettings && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700">
                          Settings
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleStatus(subAdmin.id, subAdmin.status)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {subAdmin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      {subAdmin.invitationStatus === 'pending' && (
                        <button
                          onClick={() => handleResendInvite(subAdmin.id, subAdmin.email)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Resend Invite
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdatePermissions(subAdmin.id, subAdmin.name)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Permissions
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sub Admin Modal */}
      {showAddSubAdminModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Sub Admin</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newSubAdminForm.name}
                    onChange={(e) => setNewSubAdminForm({ ...newSubAdminForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newSubAdminForm.email}
                    onChange={(e) => setNewSubAdminForm({ ...newSubAdminForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions Overview
                  </label>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      Manage end users (add, edit, deactivate)
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      View analytics and reports
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1 text-gray-400" />
                      Manage NFC settings (limited)
                    </div>
                    <div className="flex items-center">
                      <XCircle className="w-3 h-3 mr-1 text-gray-400" />
                      Manage organization settings (limited)
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddSubAdminModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubAdmin}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  Send Admin Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgSubAdmins; 