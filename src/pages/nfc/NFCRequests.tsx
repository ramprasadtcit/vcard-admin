import React, { useState } from 'react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Wifi,
  User,
  Building2,
  Package,
  Truck
} from 'lucide-react';
import { mockNFCRequests, mockUsers, mockOrganizations } from '../../data/mockData';
import { NFCRequest } from '../../types/nfc';

const NFCRequests: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [requests, setRequests] = useState<NFCRequest[]>(mockNFCRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<NFCRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.notes && request.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = typeFilter === 'all' || request.requestType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: Clock },
      card_sent: { color: 'bg-purple-100 text-purple-800', icon: Wifi },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      b2c: { color: 'bg-purple-100 text-purple-800', icon: User },
      b2b: { color: 'bg-indigo-100 text-indigo-800', icon: Building2 },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.b2c;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {type.toUpperCase()}
      </span>
    );
  };

  const handleStatusUpdate = (requestId: string, newStatus: 'pending' | 'approved' | 'printed' | 'shipped' | 'delivered' | 'rejected') => {
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: newStatus, 
              ...(newStatus === 'approved' && { approvedAt: new Date().toISOString() }),
              ...(newStatus === 'printed' && { printedAt: new Date().toISOString() }),
              ...(newStatus === 'shipped' && { shippedAt: new Date().toISOString() }),
              ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() }),
              ...(newStatus === 'rejected' && { rejectedAt: new Date().toISOString() }),
              processedBy: currentUser?.id || '',
              statusHistory: [
                ...request.statusHistory,
                { 
                  status: newStatus, 
                  date: new Date().toISOString(),
                  updatedBy: currentUser?.id || ''
                }
              ]
            }
          : request
      )
    );
    
    const statusMessages = {
      approved: 'NFC request has been approved successfully.',
      in_progress: 'NFC request is now in progress.',
      card_sent: 'NFC card has been sent to the requester.',
      delivered: 'NFC card has been delivered successfully.',
      rejected: 'NFC request has been rejected.',
    };
    
    addNotification({
      type: 'success',
      title: `Request ${newStatus.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      message: statusMessages[newStatus as keyof typeof statusMessages] || 'Request status updated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleRequestMoreCards = (requestId: string) => {
    addNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Request more cards functionality will be available soon.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const RequestDetailModal: React.FC = () => {
    if (!selectedRequest) return null;

    const user = mockUsers.find(u => u.id === selectedRequest.userId);
    const org = selectedRequest.organizationId ? 
      mockOrganizations.find(o => o.id === selectedRequest.organizationId) : null;

    // Get card entitlement information
    const getCardEntitlement = () => {
      if (selectedRequest.requestType === 'b2c') {
        // For B2C users, they get 1 card by default
        const defaultCards = 1;
        return { defaultCards, extraCards: 0, totalAllowed: defaultCards };
      } else {
        // For B2B organizations, check org's extra users (which equals extra cards)
        const orgExtraCards = org?.extraUsersPurchased || 0;
        const defaultCards = 1; // Default to 1 card per request
        const totalAllowed = defaultCards + orgExtraCards;
        return { defaultCards, extraCards: orgExtraCards, totalAllowed };
      }
    };

    const cardEntitlement = getCardEntitlement();

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">NFC Request Details</h2>
            <button
              onClick={() => setShowRequestModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Request Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Request ID</dt>
                    <dd className="text-sm text-gray-900 font-mono">{selectedRequest.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">{getStatusBadge(selectedRequest.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900">{getTypeBadge(selectedRequest.requestType)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Request Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{selectedRequest.requestType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                    <dd className="text-sm text-gray-900">1</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                    <dd className="text-sm text-gray-900">{selectedRequest.notes}</dd>
                  </div>
                  {selectedRequest.cardUrl && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Card URL</dt>
                      <dd className="text-sm text-gray-900 break-all">{selectedRequest.cardUrl}</dd>
                    </div>
                  )}
                </dl>

                {/* Card Entitlement Information */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Card Entitlement</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Default Cards:</span>
                      <span className="font-medium">{cardEntitlement.defaultCards}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Extra Cards:</span>
                      <span className="font-medium">{cardEntitlement.extraCards}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 border-t border-gray-200 pt-2 mt-2">
                      <span>Total Allowed:</span>
                      <span>{cardEntitlement.totalAllowed}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700">
                      <strong>Note:</strong> NFC cards are requested separately by organization admins through the portal. 
                      Each user gets 1 card by default, with additional cards available based on extra user slots purchased.
                    </p>
                  </div>
                  <button
                    onClick={() => handleRequestMoreCards(selectedRequest.id)}
                    className="mt-3 w-full btn-secondary text-sm"
                  >
                    Request More Cards
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Requested At</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(selectedRequest.requestedAt).toLocaleString()}
                    </dd>
                  </div>
                  {selectedRequest.approvedAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Approved At</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(selectedRequest.approvedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {selectedRequest.notes && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Notes</dt>
                      <dd className="text-sm text-gray-900">{selectedRequest.notes}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Requester</h3>
                  {user && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  )}
                  {org && (
                    <div className="mt-3 flex items-center space-x-3">
                      <img
                        src={org.logo || 'https://i.pravatar.cc/150?img=1'}
                        alt={org.name}
                        className="w-8 h-8 rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{org.name}</p>
                        <p className="text-sm text-gray-500">{org.domain}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedRequest.status === 'pending' && (
              <div className="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedRequest.id, 'rejected');
                    setShowRequestModal(false);
                  }}
                  className="btn-secondary text-red-600 hover:text-red-700"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedRequest.id, 'approved');
                    setShowRequestModal(false);
                  }}
                  className="btn-primary"
                >
                  Approve Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Only Super Admin and Platform Admin can access this page
  if (currentUser?.role !== 'super_admin' && currentUser?.role !== 'platform_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wifi className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only super administrators and platform administrators can access NFC requests.</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
  const completedRequests = requests.filter(r => r.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NFC Requests</h1>
          <p className="text-gray-600">Manage and process NFC card requests from users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedRequests}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="b2c">B2C</option>
                  <option value="b2b">B2B</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell font-medium text-gray-900">Requester</th>
                <th className="table-cell font-medium text-gray-900">Type</th>
                <th className="table-cell font-medium text-gray-900">Purpose</th>
                <th className="table-cell font-medium text-gray-900">Quantity</th>
                <th className="table-cell font-medium text-gray-900">Status</th>
                <th className="table-cell font-medium text-gray-900">Requested</th>
                <th className="table-cell font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="table-row">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{request.userName}</p>
                      <p className="text-sm text-gray-500">{request.userEmail}</p>
                      {request.organizationName && (
                        <p className="text-xs text-gray-400">{request.organizationName}</p>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    {getTypeBadge(request.requestType)}
                  </td>
                  <td className="table-cell">
                    <p className="text-sm text-gray-900">{request.notes}</p>
                    {request.cardUrl && (
                      <p className="text-xs text-gray-500 break-all">{request.cardUrl}</p>
                    )}
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    1
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRequestModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-700 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Approve Request"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'printed')}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Mark as Printed"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                      )}
                      {request.status === 'printed' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'shipped')}
                          className="text-purple-600 hover:text-purple-700 p-1"
                          title="Mark as Shipped"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                      )}
                      {request.status === 'shipped' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'delivered')}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="Mark as Delivered"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NFC Requests Found</h3>
            <p className="text-gray-600">No requests match your current filters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showRequestModal && <RequestDetailModal />}
    </div>
  );
};

export default NFCRequests; 