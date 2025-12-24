import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users as UsersIcon,
  Building2,
  UserCheck,
  Mail,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { apiService } from '../../services/api';
import { B2CUserData } from '../../types';
import { toast } from 'react-toastify';

const B2CUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<B2CUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadB2CUsers();
  }, [currentPage, pageSize]);

  const loadB2CUsers = async () => {
    try {
      setLoading(true);
      console.log('Starting to load B2C users...');
      console.log('Auth token:', localStorage.getItem('authToken'));
      console.log('Current page:', currentPage, 'Page size:', pageSize);
      
      const response = await apiService.getAllB2CUsers(currentPage, pageSize);
      console.log('API Response:', response); // Debug log
      
      // Use the API response structure
      setUsers(response.users);
      setTotalUsers(response.totalUsers);
      setActiveUsers(response.activeUsers);
      setInactiveUsers(response.inactiveUsers);
      setTotalPages(response.totalPages);
      
      console.log('Setting users data:', response.users);
      console.log('Total users from API:', response.totalUsers);
      console.log('Active users from API:', response.activeUsers);
      console.log('Inactive users from API:', response.inactiveUsers);
      console.log('Total pages from API:', response.totalPages);
      
    } catch (error) {
      console.error('Failed to load B2C users:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setUsers([]); // Ensure users is always an array
      setTotalUsers(0);
      setActiveUsers(0);
      setInactiveUsers(0);
      setTotalPages(1);
      toast.error(`Failed to load B2C users: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdatingUsers(prev => new Set(prev).add(userId));
      
      // Logic: isActive: false = user is ACTIVE, isActive: true = user is INACTIVE
      // To toggle: if user is ACTIVE (isActive: false), we want to make them INACTIVE (isActive: true)
      // If user is INACTIVE (isActive: true), we want to make them ACTIVE (isActive: false)
      const newStatus = !currentStatus; // Flip the current status
      const response = await apiService.updateB2CUserStatus(userId, newStatus);
      
      if (response.success) {
        // Optimistically update the user in the list
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, isActive: response.user.isActive } : user
          )
        );
        
        // Show the API message in toast
        toast.success(response.message);
      } else {
        toast.error('Failed to update user status. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status. Please try again.');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (userId: string) => {
    navigate(`/b2c-users/${userId}`);
  };

  const getStatusBadge = (isActive: boolean) => {
    // Note: isActive: false = user is ACTIVE, isActive: true = user is INACTIVE
    if (!isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
        Inactive
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading B2C users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">B2C Users Management</h1>
          <p className="text-gray-600">
            Manage B2C users and their active status
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeUsers}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {inactiveUsers}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>


      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(user.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName || 'N/A'}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900" style={{ whiteSpace: 'normal' }}>
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {user.phoneNumber?.value || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900" style={{ whiteSpace: 'normal' }}>
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      {user.jobTitle || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900" style={{ whiteSpace: 'normal' }}>
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      {user.company || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      {updatingUsers.has(user.id) ? (
                        <div className="flex items-center text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span className="text-xs">Updating...</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleStatusToggle(user.id, user.isActive);
                          }}
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {user.isActive ? (
                            <>
                              <ToggleRight className="w-4 h-4" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">No B2C users are available at the moment.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls - Bottom */}
      {users.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing page size
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default B2CUsers; 