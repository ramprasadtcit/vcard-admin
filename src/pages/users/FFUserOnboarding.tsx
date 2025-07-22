import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  Eye, 
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Trash2,
  Upload,
  X
} from 'lucide-react';
import { useAuth, useFFUsers } from '../../contexts';
import { useNotifications } from '../../contexts';
import { FFUser, FFUserInviteData } from '../../types/user';
import InviteFFUserModal from '../../components/InviteFFUserModal';
// Settings modal removed as per requirements
import apiService from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Invitation {
  _id: string;
  username: string;
  emailAddress: string;
  status: string;
  nfcStatus?: string;
  updatedAt?: string;
  tokenExpiresAt?: string;
  userId?: string; // Use userId for completed invitations
  // add other fields as needed
}

const FFUserOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const { ffUsers, addFFUsers, updateFFUser, deleteFFUser, getStats } = useFFUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchInvitations = () => {
    setLoadingInvitations(true);
    apiService.get('/invitation/getAllInvitations')
      .then(response => {
        setInvitations(response.data);
        setLoadingInvitations(false);
      })
      .catch(err => {
        setLoadingInvitations(false);
        console.error('Failed to fetch invitations', err);
      });
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // Helper function to get current status (including expired)
  const getCurrentStatus = (user: Invitation) => {
    // Check if token is expired for pending users
    if (user.status === 'pending' && user.tokenExpiresAt) {
      const now = new Date();
      const expiresAt = new Date(user.tokenExpiresAt);
      if (now > expiresAt) {
        return 'expired';
      }
    }
    // Map pending and in_progress to invited for display
    if (user.status === 'pending' || user.status === 'in_progress') {
      return 'invited';
    }
    return user.status;
  };

  // Filter and search logic with expired token checking
  const filteredUsers = useMemo(() => {
    return invitations.filter(user => {
      const userStatus = getCurrentStatus(user);
      const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invitations, searchTerm, statusFilter]);

  // Statistics - Clear and aligned with table status
  const stats = useMemo(() => getStats(), [getStats]);

  // Only Super Admin can access this page
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only super administrators can access F&F User Onboarding.</p>
      </div>
    );
  }

  // Action handlers
  const handleInviteUser = async (inviteData: FFUserInviteData) => {
    setIsLoading(true);
    try {
      // Call backend API to create invitation
      const response = await apiService.post('/invitation', {
        username: inviteData.fullName,
        emailAddress: inviteData.email,
      });

      setShowInviteModal(false);
      addNotification({
        type: 'success',
        title: 'Invitation Sent',
        message: response.data.message || `Onboarding link has been sent to ${inviteData.email}`,
        isRead: false,
        userId: currentUser?.id || '',
      });
      toast.success(response.data.message || 'Invitation sent successfully!');
      fetchInvitations();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to send invitation. Please try again.';
      addNotification({
        type: 'error',
        title: 'Invitation Failed',
        message: errorMsg,
        isRead: false,
        userId: currentUser?.id || '',
      });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = (user: Invitation) => {
    setSelectedUser(user);
    setShowResendModal(true);
  };

  const confirmResendInvite = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      await apiService.post(`/invitation/${selectedUser._id}/resend`);
      // No need to refresh invitations list, just show toast
      toast.success(`Invitation resent successfully to ${selectedUser.emailAddress}`);
      // Close modal
      setShowResendModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to resend invitation. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Unused functions removed for cleaner code

  const handleViewProfile = (invitation: Invitation) => {
    const idToUse = invitation.status === 'completed' && invitation.userId ? invitation.userId : invitation._id;
    navigate(`/admin/fnf-onboarding/user/${idToUse}`);
  };

  const handleEditUser = (invitation: Invitation) => {
    const idToUse = invitation.status === 'completed' && invitation.userId ? invitation.userId : invitation._id;
    navigate(`/admin/fnf-onboarding/user/${idToUse}/edit`);
  };

  // Edit functionality is now combined with view in the profile modal

  const handleDeleteUser = (user: Invitation) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      await apiService.delete(`/invitation/${selectedUser._id}`);
      fetchInvitations();
      setShowDeleteModal(false);
      setSelectedUser(null);
      toast.success('Invitation deleted successfully');
    } catch (error) {
      toast.error('Failed to delete invitation');
    } finally {
      setDeleting(false);
    }
  };

  // NFC status update moved to profile modal

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      invited: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      expired: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.invited;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status === 'invited' ? 'Invited' : 
         status === 'completed' ? 'Completed' : 
         status === 'expired' ? 'Invite Expired' : status}
      </span>
    );
  };

  // Status description removed as it's not used

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">F&F User Onboarding</h1>
          <p className="text-gray-600 mt-1">
            Manage Friends & Family user invitations and track onboarding progress
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn-primary flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite New User
          </button>
          <button
            onClick={() => navigate('/admin/fnf-onboarding/bulk-import')}
            className="btn-secondary flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Invited</p>
              <p className="text-2xl font-bold text-gray-900">{stats.invited}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Invite Expired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inviteExpired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="invited">Invited</option>
              <option value="completed">Completed</option>
              <option value="expired">Invite Expired</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {invitations.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NFC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingInvitations ? (
                <tr><td colSpan={6} className="text-center py-8">Loading invitations...</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.emailAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(getCurrentStatus(user))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* You can add nfcStatus or other fields here if needed */}
                    {user.nfcStatus || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Not available'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {getCurrentStatus(user) === 'invited' && (
                        <>
                          <button
                            onClick={() => handleResendLink(user)}
                            disabled={isLoading}
                            className="inline-flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-800 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                            title="Resend Onboarding Link"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {getCurrentStatus(user) === 'completed' && (
                        <>
                          <button
                            onClick={() => handleViewProfile(user)}
                            className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="inline-flex items-center justify-center w-8 h-8 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors"
                            title="Edit User Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by inviting your first F&F user.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showInviteModal && (
        <InviteFFUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteUser}
          isLoading={isLoading}
        />
      )}

      {/* Resend Confirmation Modal */}
      {showResendModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Resend Invitation</h3>
                  <p className="text-sm text-gray-600">Send a new onboarding link</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">User Details:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedUser.username}</p>
                  <p><strong>Email:</strong> {selectedUser.emailAddress}</p>
                  <p><strong>Status:</strong> {getCurrentStatus(selectedUser) === 'invited' ? 'Invited' : 
                                             getCurrentStatus(selectedUser) === 'completed' ? 'Completed' : 'Invite Expired'}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                A new onboarding invitation will be sent to <strong>{selectedUser.emailAddress}</strong>. 
                The previous link will be invalidated.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowResendModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResendInvite}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Resend Invitation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedUser.username}</strong>? 
                This will permanently remove their profile and all associated data.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  disabled={deleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
    </>
  );
};

export default FFUserOnboarding; 