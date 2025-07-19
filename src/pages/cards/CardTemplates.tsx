import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  Palette,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Copy,
  Users,
  Building2,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { mockCardTemplates, mockOrganizations } from '../../data/mockData';
import { CardTemplate } from '../../types';
import ComingSoonOverlay from '../../components/ComingSoonOverlay';

const CardTemplates: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Filter templates based on user role and search criteria
  const filteredTemplates = useMemo(() => {
    let templates = mockCardTemplates;

    // Filter by organization for Org Admins
    if (currentUser?.role === 'org_admin' && currentUser.organizationId) {
      templates = templates.filter(template => 
        template.isGlobal || template.organizationId === currentUser.organizationId
      );
    }

    // Apply search filter
    if (searchTerm) {
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      templates = templates.filter(template => template.category === categoryFilter);
    }

    // Apply scope filter
    if (scopeFilter !== 'all') {
      templates = templates.filter(template => 
        scopeFilter === 'global' ? template.isGlobal : !template.isGlobal
      );
    }

    return templates;
  }, [searchTerm, categoryFilter, scopeFilter, currentUser]);

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      business: { color: 'bg-blue-100 text-blue-800', icon: Building2 },
      creative: { color: 'bg-purple-100 text-purple-800', icon: Palette },
      minimal: { color: 'bg-gray-100 text-gray-800', icon: Eye },
      premium: { color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];
    const Icon = config?.icon || Palette;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const getScopeBadge = (isGlobal: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isGlobal ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
      }`}>
        {isGlobal ? (
          <>
            <Users className="w-3 h-3 mr-1" />
            Global
          </>
        ) : (
          <>
            <Building2 className="w-3 h-3 mr-1" />
            Organization
          </>
        )}
      </span>
    );
  };

  const handleDuplicateTemplate = (templateId: string) => {
    addNotification({
      type: 'success',
      title: 'Template Duplicated',
      message: 'Template has been successfully duplicated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      addNotification({
        type: 'success',
        title: 'Template Deleted',
        message: 'Template has been successfully deleted.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    }
  };

  const handleToggleActive = (templateId: string) => {
    addNotification({
      type: 'success',
      title: 'Template Status Updated',
      message: 'Template status has been updated.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const TemplateDetailModal: React.FC = () => {
    if (!selectedTemplate) return null;

    const org = selectedTemplate.organizationId ? 
      mockOrganizations.find(o => o.id === selectedTemplate.organizationId) : null;

    return (
      <div className="modal-overlay">
        <div className="modal-content max-w-4xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Template Details</h2>
            <button
              onClick={() => setShowTemplateModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedTemplate.preview}
                    alt={selectedTemplate.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getCategoryBadge(selectedTemplate.category)}
                      {getScopeBadge(selectedTemplate.isGlobal)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Template Information</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Template ID</dt>
                        <dd className="text-sm text-gray-900 font-mono">{selectedTemplate.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="text-sm text-gray-900">
                          {selectedTemplate.isActive ? (
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600">
                              <XCircle className="w-4 h-4 mr-1" />
                              Inactive
                            </span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Usage Count</dt>
                        <dd className="text-sm text-gray-900">{selectedTemplate.usage} times</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {org && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Organization</h4>
                      <div className="flex items-center space-x-3">
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
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Template Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Layout</h5>
                    <p className="text-sm text-gray-900 capitalize">{selectedTemplate.config.layout}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Colors</h5>
                    <div className="flex space-x-2">
                      {selectedTemplate.config.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Fonts</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.config.fonts.map((font, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {font}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Sections</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.config.sections.map((section, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Preview</h4>
                  <img
                    src={selectedTemplate.preview}
                    alt={selectedTemplate.name}
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => handleDuplicateTemplate(selectedTemplate.id)}
                className="btn-secondary flex items-center"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </button>
              <button
                onClick={() => handleToggleActive(selectedTemplate.id)}
                className={`btn-primary flex items-center ${
                  selectedTemplate.isActive ? 'bg-red-600 hover:bg-red-700' : ''
                }`}
              >
                {selectedTemplate.isActive ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Only Super Admin and Org Admin can access this page
  if (currentUser?.role !== 'super_admin' && currentUser?.role !== 'org_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only administrators can access template management.</p>
      </div>
    );
  }

  const activeTemplates = filteredTemplates.filter(template => template.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Card Templates</h1>
          <p className="text-gray-600">Manage card templates for B2B and B2C users</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Palette className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTemplates.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900">{activeTemplates}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <ComingSoonOverlay 
            title="Advanced Analytics"
            description="Template usage analytics and insights"
            phase="Phase 2"
          />
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
                placeholder="Search templates..."
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
          <div className="flex items-center space-x-2">
            <ComingSoonOverlay 
              title="Bulk Operations"
              description="Export and import template data"
              phase="Phase 2"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Categories</option>
                  <option value="business">Business</option>
                  <option value="creative">Creative</option>
                  <option value="minimal">Minimal</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
                <select
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Scopes</option>
                  <option value="global">Global</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="card">
            <div className="relative">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                {getCategoryBadge(template.category)}
                {getScopeBadge(template.isGlobal)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{template.usage} uses</span>
                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center text-sm ${
                  template.isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {template.isActive ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateModal(true);
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template.id)}
                  className="btn-secondary flex items-center"
                  title="Duplicate Template"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(template.id)}
                  className={`btn-secondary flex items-center ${
                    template.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                  }`}
                  title={template.isActive ? 'Deactivate' : 'Activate'}
                >
                  {template.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="btn-secondary text-red-600 hover:text-red-700"
                  title="Delete Template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
          <p className="text-gray-600">No templates match your current filters.</p>
        </div>
      )}

      {/* Modals */}
      {showTemplateModal && <TemplateDetailModal />}
    </div>
  );
};

export default CardTemplates; 