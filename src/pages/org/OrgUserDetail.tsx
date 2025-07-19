import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Bot,
  Edit,
  Eye,
  Download,
  Copy,
  Globe,
  Building2,
  Smartphone,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { EndUser } from '../../types/user';
import { mockEndUsers } from '../../data/mockData';

const OrgUserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  const [user, setUser] = useState<EndUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  useEffect(() => {
    if (userId) {
      // In real app, this would be an API call
      const foundUser = mockEndUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setEditForm({
          name: foundUser.name,
          email: foundUser.email,
          status: foundUser.status
        });
      }
      setLoading(false);
    }
  }, [userId]);

  const handleEditUser = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...editForm
    };

    setUser(updatedUser);
    setShowEditModal(false);

    addNotification({
      type: 'success',
      title: 'User Updated',
      message: `${updatedUser.name}'s information has been updated successfully.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleBotToggle = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      botEnabled: !user.botEnabled
    };

    setUser(updatedUser);

    addNotification({
      type: 'success',
      title: 'Bot Access Updated',
      message: `Bot access ${updatedUser.botEnabled ? 'enabled' : 'disabled'} for ${updatedUser.name}.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleResendInvite = () => {
    if (!user) return;

    addNotification({
      type: 'success',
      title: 'Invitation Resent',
      message: `Invitation email sent to ${user.email}.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleCopyEmail = () => {
    if (!user) return;
    
    navigator.clipboard.writeText(user.email);
    addNotification({
      type: 'success',
      title: 'Email Copied',
      message: 'Email address has been copied to clipboard.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="w-4 h-4 mr-2" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-4 h-4 mr-2" />
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-4 h-4 mr-2" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/org/users')}
            className="btn-primary"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/org/users')}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">User ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(user.status)}
          <button
            onClick={() => setShowEditModal(true)}
            className="btn-primary flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <p className="text-gray-900">{user.email}</p>
                    <button
                      onClick={handleCopyEmail}
                      className="text-gray-400 hover:text-gray-600 p-1 transition-colors duration-200"
                      title="Copy email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  {getStatusBadge(user.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Joined Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'user' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {user.role === 'user' ? 'End User' : 'Sub Admin'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Activity Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.totalBotInteractions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Bot Interactions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{user.cardStatus}</p>
                <p className="text-sm text-gray-500">Card Status</p>
              </div>
            </div>
          </div>

          {/* Bot Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bot Configuration</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bot className={`w-6 h-6 ${user.botEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="font-medium text-gray-900">Bot Access</p>
                  <p className="text-sm text-gray-500">
                    {user.botEnabled ? 'Enabled' : 'Disabled'} - {user.totalBotInteractions} interactions
                  </p>
                </div>
              </div>
              <button
                onClick={handleBotToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  user.botEnabled 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {user.botEnabled ? 'Disable' : 'Enable'} Bot
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleResendInvite}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend Invitation
              </button>
              <button
                onClick={() => window.print()}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </button>
            </div>
          </div>

          {/* User Card Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Card Preview</h3>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <div 
                className="bg-white rounded-lg shadow-lg p-4"
                style={{
                  background: `linear-gradient(135deg, #2563eb20, #1e40af20)`,
                  fontFamily: 'Inter'
                }}
              >
                <div className="text-center">
                  {user.avatar && (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full mx-auto mb-3 border-2 border-white shadow-md"
                    />
                  )}
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h4>
                  <p className="text-gray-600 mb-2">Professional</p>
                  <p className="text-sm text-gray-500 mb-3">TechCorp Solutions</p>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditUser}
                  className="flex-1 btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgUserDetail; 