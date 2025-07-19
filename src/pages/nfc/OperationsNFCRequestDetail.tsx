import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  Truck, 
  Copy,
  Download,
  Eye,
  Calendar,
  MapPin,
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  Edit
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { NFCRequest } from '../../types/nfc';
import { mockOrgNFCRequests } from '../../data/mockData';

const OperationsNFCRequestDetail: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  const [request, setRequest] = useState<NFCRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    if (requestId) {
      // In real app, this would be an API call
      const foundRequest = mockOrgNFCRequests.find(r => r.id === requestId);
      if (foundRequest) {
        setRequest(foundRequest);
      }
      setLoading(false);
    }
  }, [requestId]);

  const handleStatusUpdate = () => {
    if (!request || !newStatus) return;

    const updatedRequest = {
      ...request,
      status: newStatus as any,
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
          updatedBy: currentUser?.id || '',
          notes: statusNotes
        }
      ]
    };

    setRequest(updatedRequest);
    setShowStatusModal(false);
    setNewStatus('');
    setStatusNotes('');

    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: `Request status has been updated to ${newStatus}.`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'printed': return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'printed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addNotification({
      type: 'success',
      title: 'URL Copied',
      message: 'Card URL has been copied to clipboard.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h2>
          <p className="text-gray-600 mb-6">The NFC request you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/operations/nfc-requests')}
            className="btn-primary"
          >
            Back to Requests
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
            onClick={() => navigate('/operations/nfc-requests')}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NFC Request Details</h1>
            <p className="text-gray-600">Request ID: {request.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            <span className="ml-2 capitalize">{request.status}</span>
          </span>
          <button
            onClick={() => setShowStatusModal(true)}
            className="btn-primary flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Requester</label>
                  <div className="flex items-center space-x-3">
                    {request.requestType === 'b2b' ? 
                      <Building2 className="w-5 h-5 text-blue-600" /> : 
                      <User className="w-5 h-5 text-purple-600" />
                    }
                    <div>
                      <p className="font-medium text-gray-900">{request.userName}</p>
                      <p className="text-sm text-gray-500">{request.userEmail}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Request Type</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.requestType === 'b2b' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {request.requestType.toUpperCase()}
                  </span>
                </div>
                {request.organizationName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Organization</label>
                    <p className="text-gray-900">{request.organizationName}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Delivery Address</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-900">{request.deliveryAddress}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Requested At</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{new Date(request.requestedAt).toLocaleString()}</p>
                  </div>
                </div>
                {request.approvedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Approved At</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{new Date(request.approvedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {request.processedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Processed By</label>
                    <p className="text-gray-900">{request.processedBy}</p>
                  </div>
                )}
                {request.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <p className="text-gray-900">{request.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Card Preview</h2>
            
            {/* Show uploaded/designed card if available */}
            {request.designImage ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                  <div className="max-w-md mx-auto">
                    <img 
                      src={request.designImage} 
                      alt="Card Design"
                      className="w-full h-auto rounded-lg shadow-lg border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-center py-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Design image could not be loaded</p>
                    </div>
                  </div>
                </div>
                
                {/* Card Information */}
                {request.cardPreview && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Card Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.cardPreview.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Title:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.cardPreview.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.cardPreview.company}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.cardPreview.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.cardPreview.phone}</span>
                      </div>
                      {request.cardPreview.website && (
                        <div>
                          <span className="text-gray-500">Website:</span>
                          <span className="ml-2 font-medium text-gray-900">{request.cardPreview.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Show theme-based preview if no design image */
              request.cardPreview && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                  <div className="max-w-sm mx-auto">
                    <div 
                      className="bg-white rounded-lg shadow-lg p-6"
                      style={{
                        background: `linear-gradient(135deg, ${request.cardPreview.theme.primaryColor}20, ${request.cardPreview.theme.secondaryColor}20)`,
                        fontFamily: request.cardPreview.theme.fontFamily
                      }}
                    >
                      <div className="text-center">
                        {request.cardPreview.avatar && (
                          <img 
                            src={request.cardPreview.avatar} 
                            alt={request.cardPreview.name}
                            className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                          />
                        )}
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{request.cardPreview.name}</h3>
                        <p className="text-gray-600 mb-3">{request.cardPreview.title}</p>
                        <p className="text-sm text-gray-500 mb-4">{request.cardPreview.company}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{request.cardPreview.email}</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{request.cardPreview.phone}</span>
                          </div>
                          {request.cardPreview.website && (
                            <div className="flex items-center justify-center space-x-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{request.cardPreview.website}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            
            {/* No preview available */}
            {!request.designImage && !request.cardPreview && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No card preview available</p>
              </div>
            )}
          </div>

          {/* Status History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status History</h2>
            <div className="space-y-4">
              {request.statusHistory.map((history, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(history.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 capitalize">{history.status}</p>
                      <p className="text-sm text-gray-500">{new Date(history.date).toLocaleString()}</p>
                    </div>
                    {history.updatedBy && (
                      <p className="text-sm text-gray-500">Updated by: {history.updatedBy}</p>
                    )}
                    {history.notes && (
                      <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {request.cardUrl && (
                <button
                  onClick={() => handleCopyUrl(request.cardUrl!)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Card URL
                </button>
              )}
              {request.designImage && (
                <button
                  onClick={() => setShowDesignModal(true)}
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Design
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Print Details
              </button>
            </div>
          </div>

          {/* Rejection Details */}
          {request.status === 'rejected' && request.rejectedReason && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Rejection Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-1">Reason</label>
                  <p className="text-red-800">{request.rejectedReason}</p>
                </div>
                {request.suggestions && request.suggestions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">Suggestions</label>
                    <ul className="list-disc list-inside space-y-1">
                      {request.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-red-800">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="printed">Printed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add any notes about this status change..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={!newStatus}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Design Preview Modal */}
      {showDesignModal && request?.designImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Card Design Preview</h3>
              <button
                onClick={() => setShowDesignModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="flex justify-center">
                <img 
                  src={request.designImage} 
                  alt="Card Design"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-center py-12">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Eye className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">Design image could not be loaded</p>
                </div>
              </div>
              
              {request.cardPreview && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Card Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 font-medium text-gray-900">{request.cardPreview.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Title:</span>
                      <span className="ml-2 font-medium text-gray-900">{request.cardPreview.title}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Company:</span>
                      <span className="ml-2 font-medium text-gray-900">{request.cardPreview.company}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{request.cardPreview.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <span className="ml-2 font-medium text-gray-900">{request.cardPreview.phone}</span>
                    </div>
                    {request.cardPreview.website && (
                      <div>
                        <span className="text-gray-500">Website:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.cardPreview.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDesignModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsNFCRequestDetail; 