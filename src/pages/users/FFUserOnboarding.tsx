import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown
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
  fullName?: string; // Add fullName field
  emailAddress: string;
  status: string;
  nfcStatus?: string;
  updatedAt?: string;
  tokenExpiresAt?: string;
  userId?: string; // Use userId for completed invitations
  // add other fields as needed
}

type SortField = 'username' | 'fullName' | 'emailAddress' | 'status' | 'nfcStatus' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const FFUserOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const { ffUsers, addFFUsers, updateFFUser, deleteFFUser } = useFFUsers();
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  useEffect(() => {
    if (location.state?.showToast) {
      toast.success('User profile updated successfully');
      // Remove the state so the toast doesn't show again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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

  // Sorting function
  const sortUsers = (users: Invitation[]) => {
    return [...users].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'username':
          aValue = a.username?.toLowerCase() || '';
          bValue = b.username?.toLowerCase() || '';
          break;
        case 'fullName':
          aValue = a.fullName?.toLowerCase() || '';
          bValue = b.fullName?.toLowerCase() || '';
          break;
        case 'emailAddress':
          aValue = a.emailAddress?.toLowerCase() || '';
          bValue = b.emailAddress?.toLowerCase() || '';
          break;
        case 'status':
          aValue = getCurrentStatus(a);
          bValue = getCurrentStatus(b);
          break;
        case 'nfcStatus':
          aValue = a.nfcStatus || '';
          bValue = b.nfcStatus || '';
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt || 0);
          bValue = new Date(b.updatedAt || 0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter and search logic with expired token checking
  const filteredUsers = useMemo(() => {
    const filtered = invitations.filter(user => {
      const userStatus = getCurrentStatus(user);
      const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
    
    return sortUsers(filtered);
  }, [invitations, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  // Statistics - Dynamic calculation based on actual invitation data
  const stats = useMemo(() => {
    const invited = invitations.filter(user => getCurrentStatus(user) === 'invited').length;
    const completed = invitations.filter(user => getCurrentStatus(user) === 'completed').length;
    const inviteExpired = invitations.filter(user => getCurrentStatus(user) === 'expired').length;
    
    return { invited, completed, inviteExpired };
  }, [invitations]);

  // Only Super Admin can access this page
  if (currentUser?.role !== 'superadmin') {
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
        fullName: inviteData.fullName,
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
    // Navigate to FFUserDetail with edit state
    navigate(`/admin/fnf-onboarding/user/${idToUse}`, { state: { edit: true } });
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
      toast.success(`User ${selectedUser.username} deleted successfully`);
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchInvitations(); // Refresh the list
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to delete user. Please try again.';
      toast.error(errorMsg);
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

  const getNFCStatusBadge = (nfcStatus: string | undefined) => {
    if (!nfcStatus) {
      return <span className="text-gray-400 text-sm">-</span>;
    }

    const nfcStatusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      configured: { color: 'bg-blue-100 text-blue-800', text: 'Configured' },
      shipped: { color: 'bg-purple-100 text-purple-800', text: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Delivered' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
    };

    const config = nfcStatusConfig[nfcStatus as keyof typeof nfcStatusConfig];
    
    if (!config) {
      return <span className="text-gray-400 text-sm">{nfcStatus}</span>;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Invited</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.invited}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inviteExpired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="invited">Invited</option>
              <option value="completed">Completed</option>
              <option value="expired">Invite Expired</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {getSortIcon('fullName')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('emailAddress')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {getSortIcon('emailAddress')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('nfcStatus')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>NFC Status</span>
                      {getSortIcon('nfcStatus')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('updatedAt')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Updated Date</span>
                      {getSortIcon('updatedAt')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingInvitations ? (
                  <tr><td colSpan={6} className="text-center py-8">Loading invitations...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                        <p className="text-gray-600">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filter criteria.'
                            : 'Start by inviting your first F&F user.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.fullName || user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.emailAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(getCurrentStatus(user))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getNFCStatusBadge(user.nfcStatus)}
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
                          
                          {(getCurrentStatus(user) === 'completed' || getCurrentStatus(user) === 'expired') && (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Controls */}
        {!loadingInvitations && filteredUsers.length > 0 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Resend Invitation</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to resend the onboarding invitation to <strong>{selectedUser.emailAddress}</strong>?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResendModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmResendInvite}
                disabled={isLoading}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Resending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Invitation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedUser.fullName || ''}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="btn-danger flex-1 flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default FFUserOnboarding; 