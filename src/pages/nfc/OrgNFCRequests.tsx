import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Smartphone,
  User,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Package,
  Truck,
  MapPin,
  Upload,
  Save,
  X,
  Palette,
  Image,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { NFCRequest } from '../../types/nfc';
import { OrgUser } from '../../types/user';
import { mockOrgNFCRequests, mockOrgUsers } from '../../data/mockData';

// Card Preview Component
const CardPreview: React.FC<{ 
  user: OrgUser | null; 
  customDesign?: File | null;
  showPreview: boolean;
}> = ({ user, customDesign, showPreview }) => {
  if (!user || !showPreview) return null;

  const theme = {
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontFamily: 'Inter'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <Palette className="w-4 h-4 mr-2" />
        Card Preview
      </h4>
      
      {customDesign ? (
        <div className="text-center">
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
            <img 
              src={URL.createObjectURL(customDesign)} 
              alt="Custom design preview"
              className="max-w-full max-h-full object-contain rounded"
            />
          </div>
          <p className="text-sm text-gray-600">Custom Design Uploaded</p>
        </div>
      ) : (
        <div 
          className="w-full h-48 rounded-lg border-2 border-gray-200 relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
            fontFamily: theme.fontFamily
          }}
        >
          <div className="absolute inset-0 p-4 text-white">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{user.name}</h3>
                <p className="text-sm opacity-90 mb-2">Senior Software Engineer</p>
                <p className="text-xs opacity-75">{user.email}</p>
                <p className="text-xs opacity-75">+1-555-0101</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <p className="text-xs mt-2 opacity-75">TechCorp Solutions</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        {customDesign ? (
          <p>Custom design will be used for this card</p>
        ) : (
          <p>Theme-based design using organization colors</p>
        )}
      </div>
    </div>
  );
};

const OrgNFCRequests: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<NFCRequest | null>(null);

  // Form states for new request
  const [newRequestForm, setNewRequestForm] = useState({
    userId: '',
    cardDesign: null as File | null,
    deliveryAddress: '',
    notes: '',
    useCustomDesign: false
  });

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  // Mock data
  const requests: NFCRequest[] = useMemo(() => mockOrgNFCRequests, []);
  const users: OrgUser[] = useMemo(() => mockOrgUsers.filter(u => u.status === 'active'), []);

  // Get selected user for preview
  const selectedUser = useMemo(() => 
    users.find(u => u.id === newRequestForm.userId), 
    [users, newRequestForm.userId]
  );

  // Filter requests based on search and filters
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    return filtered;
  }, [requests, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'printed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Package className="w-3 h-3 mr-1" />
            Printed
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const handleSubmitRequest = () => {
    if (!newRequestForm.userId || !newRequestForm.deliveryAddress) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
        isRead: false,
        userId: currentUser?.id || '',
      });
      return;
    }

    // Create new request with proper structure
    const newRequest = {
      id: `org-nfc-${Date.now()}`,
      organizationId: 'org-1', // Current organization
      userId: newRequestForm.userId,
      userName: selectedUser?.name || '',
      userEmail: selectedUser?.email || '',
      cardDesign: newRequestForm.cardDesign ? URL.createObjectURL(newRequestForm.cardDesign) : undefined,
      deliveryAddress: newRequestForm.deliveryAddress,
      notes: newRequestForm.notes,
      status: 'pending' as const,
      requestedAt: new Date().toISOString(),
      requestType: 'b2b' as const,
      organizationName: 'TechCorp Solutions',
      subscriptionPlan: 'Business Plan',
      designImage: newRequestForm.cardDesign ? URL.createObjectURL(newRequestForm.cardDesign) : undefined,
      statusHistory: [
        { 
          status: 'pending', 
          date: new Date().toISOString(),
          updatedBy: currentUser?.email || ''
        }
      ],
      cardPreview: selectedUser ? {
        name: selectedUser.name,
        title: 'Senior Software Engineer', // Default title
        company: 'TechCorp Solutions',
        email: selectedUser.email,
        phone: '+1-555-0101', // Default phone
        website: 'https://techcorp.com',
        avatar: selectedUser.avatar,
        theme: {
          primaryColor: '#2563eb',
          secondaryColor: '#1e40af',
          fontFamily: 'Inter'
        }
      } : undefined
    };

    // In real app, this would be an API call
    addNotification({
      type: 'success',
      title: 'Request Submitted',
      message: 'NFC card request has been submitted successfully. You will be notified once it\'s approved.',
      isRead: false,
      userId: currentUser?.id || '',
    });

    setNewRequestForm({ userId: '', cardDesign: null, deliveryAddress: '', notes: '', useCustomDesign: false });
    setShowRequestModal(false);
    setShowPreview(false);
  };

  const handleCardDesignUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewRequestForm(prev => ({ 
        ...prev, 
        cardDesign: file,
        useCustomDesign: true 
      }));
    }
  };

  const handleUserSelection = (userId: string) => {
    setNewRequestForm(prev => ({ 
      ...prev, 
      userId,
      cardDesign: null,
      useCustomDesign: false 
    }));
    setShowPreview(true);
  };

  const handleExportRequests = () => {
    addNotification({
      type: 'success',
      title: 'Export Successful',
      message: 'NFC requests have been exported to CSV.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">NFC Requests</h1>
          <p className="text-gray-600 mt-1">Submit and track NFC card requests for your team</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Smartphone className="w-4 h-4" />
            <span>{filteredRequests.length} of {requests.length} requests</span>
          </div>
          <button 
            onClick={handleExportRequests}
            className="btn-secondary flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowRequestModal(true)}
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Production</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => ['approved', 'printed'].includes(r.status)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'shipped').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by user name, email, or request ID..."
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="printed">Printed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NFC Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card URL</th>
                <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-medium text-gray-900">{request.id}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{request.userName}</p>
                        <p className="text-xs text-gray-500 truncate">{request.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600 truncate max-w-48">{request.deliveryAddress}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {request.cardUrl ? (
                      <a 
                        href={request.cardUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 underline"
                      >
                        View Card
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">Not available</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-gray-400 hover:text-gray-600 p-1 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-gray-400 hover:text-gray-600 p-1 transition-colors duration-200"
                        title="Edit Request"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NFC Requests Found</h3>
            <p className="text-gray-600">
              {requests.length === 0 
                ? "You haven't submitted any NFC requests yet. Click 'New Request' to get started."
                : "No requests match your current filters."
              }
            </p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">New NFC Request</h3>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setShowPreview(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select User *</label>
                    <select
                      value={newRequestForm.userId}
                      onChange={(e) => handleUserSelection(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Choose a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Design Options</label>
                    <div className="space-y-4">
                      {/* Theme-based Design Option */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Palette className="w-5 h-5 text-primary-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">Theme-based Design</h4>
                              <p className="text-sm text-gray-600">Use organization colors and branding</p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="designOption"
                            checked={!newRequestForm.useCustomDesign}
                            onChange={() => setNewRequestForm(prev => ({ 
                              ...prev, 
                              useCustomDesign: false,
                              cardDesign: null 
                            }))}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      
                      {/* Custom Design Option */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Image className="w-5 h-5 text-primary-600 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">Custom Design</h4>
                              <p className="text-sm text-gray-600">Upload your own card design</p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="designOption"
                            checked={newRequestForm.useCustomDesign}
                            onChange={() => setNewRequestForm(prev => ({ 
                              ...prev, 
                              useCustomDesign: true 
                            }))}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                        
                        {newRequestForm.useCustomDesign && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Upload a custom card design. Recommended size: 400x250px, PNG or JPG.
                            </p>
                            <label className="btn-secondary cursor-pointer inline-flex items-center">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCardDesignUpload}
                                className="hidden"
                              />
                            </label>
                            {newRequestForm.cardDesign && (
                              <p className="text-sm text-green-600 mt-2">
                                ✓ {newRequestForm.cardDesign.name}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                    <textarea
                      value={newRequestForm.deliveryAddress}
                      onChange={(e) => setNewRequestForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter complete delivery address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                      value={newRequestForm.notes}
                      onChange={(e) => setNewRequestForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Any additional notes or special requirements"
                    />
                  </div>
                </div>
                
                {/* Right Column - Preview */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Card Preview</h4>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      {showPreview ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Show Preview
                        </>
                      )}
                    </button>
                  </div>
                  
                  {showPreview && selectedUser && (
                    <CardPreview 
                      user={selectedUser}
                      customDesign={newRequestForm.cardDesign}
                      showPreview={showPreview}
                    />
                  )}
                  
                  {!showPreview && (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Select a user to see the card preview</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setShowPreview(false);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  className="btn-primary flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">NFC Request Details</h3>
                  <p className="text-sm text-gray-600 mt-1">Request ID: {selectedRequest.id}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Request Information */}
                <div className="space-y-6">
                  {/* User Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">User Information</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedRequest.userName}</p>
                        <p className="text-sm text-gray-600">{selectedRequest.userEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Request Details</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Requested Date</label>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(selectedRequest.requestedAt).toLocaleDateString()} at{' '}
                          {new Date(selectedRequest.requestedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {selectedRequest.processedBy && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Processed By</label>
                          <p className="text-sm text-gray-900 mt-1">{selectedRequest.processedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Delivery Information</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedRequest.deliveryAddress}</p>
                      </div>
                      {selectedRequest.notes && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Notes</label>
                          <p className="text-sm text-gray-900 mt-1">{selectedRequest.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Card Preview</h4>
                    
                    {/* Show uploaded/designed card if available */}
                    {selectedRequest.designImage ? (
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3">
                          <img 
                            src={selectedRequest.designImage} 
                            alt="Card Design"
                            className="w-full h-auto rounded border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden text-center py-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <Eye className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500">Design image could not be loaded</p>
                          </div>
                        </div>
                        
                        {/* Card Information */}
                        {selectedRequest.cardPreview && (
                          <div className="bg-white rounded-lg p-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Card Details</h5>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Name:</span>
                                <span className="ml-2 font-medium text-gray-900">{selectedRequest.cardPreview.name}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Title:</span>
                                <span className="ml-2 font-medium text-gray-900">{selectedRequest.cardPreview.title}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Company:</span>
                                <span className="ml-2 font-medium text-gray-900">{selectedRequest.cardPreview.company}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Email:</span>
                                <span className="ml-2 font-medium text-gray-900">{selectedRequest.cardPreview.email}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Phone:</span>
                                <span className="ml-2 font-medium text-gray-900">{selectedRequest.cardPreview.phone}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Show theme-based preview if no design image */
                      selectedRequest.cardPreview ? (
                        <div className="bg-white rounded-lg p-3">
                          <div 
                            className="w-full h-32 rounded border-2 border-gray-200 relative overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${selectedRequest.cardPreview.theme.primaryColor} 0%, ${selectedRequest.cardPreview.theme.secondaryColor} 100%)`,
                              fontFamily: selectedRequest.cardPreview.theme.fontFamily
                            }}
                          >
                            <div className="absolute inset-0 p-3 text-white">
                              <div className="flex items-center justify-between h-full">
                                <div className="flex-1">
                                  <h5 className="text-sm font-semibold mb-1">{selectedRequest.cardPreview.name}</h5>
                                  <p className="text-xs opacity-90 mb-1">{selectedRequest.cardPreview.title}</p>
                                  <p className="text-xs opacity-75">{selectedRequest.cardPreview.email}</p>
                                </div>
                                <div className="text-right">
                                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <p className="text-xs mt-1 opacity-75">{selectedRequest.cardPreview.company}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">No card preview available</p>
                        </div>
                      )
                    )}
                    
                    {/* Card URL */}
                    {selectedRequest.cardUrl && (
                      <div className="mt-3">
                        <label className="text-sm font-medium text-gray-700">Card URL</label>
                        <div className="mt-1">
                          <a 
                            href={selectedRequest.cardUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 underline"
                          >
                            View Virtual Card
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Status Timeline & Actions */}
                <div className="space-y-6">
                  {/* Status Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Status Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Request Submitted</p>
                          <p className="text-xs text-gray-500">
                            {new Date(selectedRequest.requestedAt).toLocaleDateString()} at{' '}
                            {new Date(selectedRequest.requestedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      {selectedRequest.approvedAt && (
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Request Approved</p>
                            <p className="text-xs text-gray-500">
                              {new Date(selectedRequest.approvedAt).toLocaleDateString()} at{' '}
                              {new Date(selectedRequest.approvedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedRequest.printedAt && (
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Card Printed</p>
                            <p className="text-xs text-gray-500">
                              {new Date(selectedRequest.printedAt).toLocaleDateString()} at{' '}
                              {new Date(selectedRequest.printedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedRequest.shippedAt && (
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Card Shipped</p>
                            <p className="text-xs text-gray-500">
                              {new Date(selectedRequest.shippedAt).toLocaleDateString()} at{' '}
                              {new Date(selectedRequest.shippedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedRequest.deliveredAt && (
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Card Delivered</p>
                            <p className="text-xs text-gray-500">
                              {new Date(selectedRequest.deliveredAt).toLocaleDateString()} at{' '}
                              {new Date(selectedRequest.deliveredAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedRequest.rejectedAt && (
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Request Rejected</p>
                            <p className="text-xs text-gray-500">
                              {new Date(selectedRequest.rejectedAt).toLocaleDateString()} at{' '}
                              {new Date(selectedRequest.rejectedAt).toLocaleTimeString()}
                            </p>
                            {selectedRequest.rejectedReason && (
                              <p className="text-xs text-red-600 mt-1">
                                Reason: {selectedRequest.rejectedReason}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                    <div className="space-y-2">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <button className="w-full btn-primary text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Request
                          </button>
                          <button className="w-full btn-secondary text-sm">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Request
                          </button>
                        </>
                      )}
                      
                      {selectedRequest.status === 'approved' && (
                        <button className="w-full btn-primary text-sm">
                          <Package className="w-4 h-4 mr-2" />
                          Mark as Printed
                        </button>
                      )}
                      
                      {selectedRequest.status === 'printed' && (
                        <button className="w-full btn-primary text-sm">
                          <Truck className="w-4 h-4 mr-2" />
                          Mark as Shipped
                        </button>
                      )}
                      
                      {selectedRequest.status === 'shipped' && (
                        <button className="w-full btn-primary text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Delivered
                        </button>
                      )}
                      
                      <button className="w-full btn-secondary text-sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Request
                      </button>
                      
                      <button className="w-full btn-secondary text-sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgNFCRequests; 