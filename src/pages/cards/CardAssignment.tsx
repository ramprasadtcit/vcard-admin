import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Eye,
  Share2,
  UserPlus,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { mockCards, mockUsers, mockOrganizations } from '../../data/mockData';
import { Card } from '../../types';

const CardAssignment: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const getFilteredCards = () => {
    let filtered = mockCards;
    
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getAssignedUsers = (card: Card) => {
    // In a real app, this would fetch assigned users from the API
    return mockUsers.filter(user => user.organizationId === card.organizationId);
  };



  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      draft: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Calendar },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const handleAssignCard = (cardId: string, userId: string) => {
    addNotification({
      type: 'success',
      title: 'Card Assigned',
      message: 'Card has been successfully assigned to user',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleUnassignCard = (cardId: string, userId: string) => {
    addNotification({
      type: 'success',
      title: 'Card Unassigned',
      message: 'Card has been removed from user',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const CardItem: React.FC<{ card: Card }> = ({ card }) => {
    const assignedUsers = getAssignedUsers(card);

    return (
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              {getStatusBadge(card.status)}
            </div>
            <p className="text-sm text-gray-600 mb-3">{card.title}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium capitalize">{card.status}</p>
              </div>
              <div>
                <span className="text-gray-500">Template:</span>
                <p className="font-medium capitalize">{card.templateId}</p>
              </div>
              <div>
                <span className="text-gray-500">Views:</span>
                <p className="font-medium">{card.views}</p>
              </div>
              <div>
                <span className="text-gray-500">Shares:</span>
                <p className="font-medium">{card.shares}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Assigned Users */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Assigned Users ({assignedUsers.length})</h4>
            <button
              onClick={() => {
                setSelectedCard(card);
                setShowAssignmentModal(true);
              }}
              className="btn-primary text-sm px-3 py-1 flex items-center"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Assign
            </button>
          </div>
          
          {assignedUsers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {assignedUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                  <img
                    src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button
                    onClick={() => handleUnassignCard(card.id, user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No users assigned to this card</p>
          )}
        </div>
      </div>
    );
  };

  const filteredCards = getFilteredCards();
  const totalCards = filteredCards.length;
  const activeCards = filteredCards.filter(card => card.status === 'active').length;
  const totalViews = filteredCards.reduce((sum, card) => sum + card.views, 0);
  const totalShares = filteredCards.reduce((sum, card) => sum + card.shares, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Card Assignment</h1>
          <p className="text-gray-600">Manage digital cards and their user assignments</p>
        </div>
        <button className="btn-primary flex items-center mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Card
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cards</p>
              <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cards</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeCards}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shares</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalShares}
              </p>
            </div>
            <Share2 className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {totalCards} of {mockCards.length} cards
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {totalCards === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Assign Card</h2>
              <button
                onClick={() => setShowAssignmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-4">{selectedCard.title}</h3>
              
              <div className="space-y-3">
                {mockUsers
                  .filter(user => 
                    user.organizationId === currentUser?.organizationId && 
                    user.id !== currentUser?.id
                  )
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleAssignCard(selectedCard.id, user.id);
                          setShowAssignmentModal(false);
                        }}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardAssignment; 