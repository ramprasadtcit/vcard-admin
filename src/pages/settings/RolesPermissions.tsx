import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Check,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

const RolesPermissions: React.FC = () => {
  const { addNotification } = useNotifications();
  const { user: currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Mock permissions data
  const permissions: Permission[] = [
    // User Management
    { id: 'users.view', name: 'View Users', description: 'Can view user list and details', category: 'User Management' },
    { id: 'users.create', name: 'Create Users', description: 'Can create new users', category: 'User Management' },
    { id: 'users.edit', name: 'Edit Users', description: 'Can edit user information', category: 'User Management' },
    { id: 'users.delete', name: 'Delete Users', description: 'Can delete users', category: 'User Management' },
    { id: 'users.invite', name: 'Invite Users', description: 'Can send user invitations', category: 'User Management' },
    
    // Organization Management
    { id: 'org.view', name: 'View Organization', description: 'Can view organization details', category: 'Organization' },
    { id: 'org.edit', name: 'Edit Organization', description: 'Can edit organization settings', category: 'Organization' },
    { id: 'org.branding', name: 'Manage Branding', description: 'Can customize organization branding', category: 'Organization' },
    
    // Card Management
    { id: 'cards.view', name: 'View Cards', description: 'Can view digital cards', category: 'Cards' },
    { id: 'cards.create', name: 'Create Cards', description: 'Can create new digital cards', category: 'Cards' },
    { id: 'cards.edit', name: 'Edit Cards', description: 'Can edit digital cards', category: 'Cards' },
    { id: 'cards.delete', name: 'Delete Cards', description: 'Can delete digital cards', category: 'Cards' },
    { id: 'cards.assign', name: 'Assign Cards', description: 'Can assign cards to users', category: 'Cards' },
    
    // Analytics
    { id: 'analytics.view', name: 'View Analytics', description: 'Can view analytics and reports', category: 'Analytics' },
    { id: 'analytics.export', name: 'Export Analytics', description: 'Can export analytics data', category: 'Analytics' },
    
    // Settings
    { id: 'settings.view', name: 'View Settings', description: 'Can view system settings', category: 'Settings' },
    { id: 'settings.edit', name: 'Edit Settings', description: 'Can modify system settings', category: 'Settings' },
    
    // Roles & Permissions
    { id: 'roles.view', name: 'View Roles', description: 'Can view roles and permissions', category: 'Roles & Permissions' },
    { id: 'roles.create', name: 'Create Roles', description: 'Can create new roles', category: 'Roles & Permissions' },
    { id: 'roles.edit', name: 'Edit Roles', description: 'Can edit existing roles', category: 'Roles & Permissions' },
    { id: 'roles.delete', name: 'Delete Roles', description: 'Can delete roles', category: 'Roles & Permissions' },
  ];

  // Mock roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'superadmin',
      name: 'Super Admin',
      description: 'Full access to all features and settings',
      permissions: permissions.map(p => p.id),
      userCount: 2,
      isSystem: true,
    },
    {
      id: 'org_admin',
      name: 'Organization Admin',
      description: 'Manage organization, users, and cards',
      permissions: [
        'users.view', 'users.create', 'users.edit', 'users.invite',
        'org.view', 'org.edit', 'org.branding',
        'cards.view', 'cards.create', 'cards.edit', 'cards.delete', 'cards.assign',
        'analytics.view', 'analytics.export',
        'settings.view',
        'roles.view',
      ],
      userCount: 5,
      isSystem: true,
    },
    {
      id: 'sub_admin',
      name: 'Sub-Organization Admin',
      description: 'Manage users and cards within sub-organization',
      permissions: [
        'users.view', 'users.create', 'users.edit',
        'org.view',
        'cards.view', 'cards.create', 'cards.edit', 'cards.assign',
        'analytics.view',
      ],
      userCount: 8,
      isSystem: true,
    },
    {
      id: 'user_manager',
      name: 'User Manager',
      description: 'Manage users and basic card operations',
      permissions: [
        'users.view', 'users.create', 'users.edit',
        'cards.view', 'cards.assign',
      ],
      userCount: 3,
      isSystem: false,
    },
  ]);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const handleCreateRole = () => {
    if (!newRole.name.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Role name is required',
        isRead: false,
        userId: currentUser?.id || '',
      });
      return;
    }

    const role: Role = {
      id: `role_${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      userCount: 0,
      isSystem: false,
    };

    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setShowCreateModal(false);
    
    addNotification({
      type: 'success',
      title: 'Role Created',
      message: `Role "${role.name}" has been created successfully`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    setRoles(prev => prev.map(role => 
      role.id === editingRole.id ? editingRole : role
    ));
    setEditingRole(null);
    
    addNotification({
      type: 'success',
      title: 'Role Updated',
      message: `Role "${editingRole.name}" has been updated successfully`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.isSystem) {
      addNotification({
        type: 'error',
        title: 'Cannot Delete',
        message: 'System roles cannot be deleted',
        isRead: false,
        userId: currentUser?.id || '',
      });
      return;
    }

    setRoles(prev => prev.filter(r => r.id !== roleId));
    
    addNotification({
      type: 'success',
      title: 'Role Deleted',
      message: `Role "${role.name}" has been deleted successfully`,
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId],
        };
      }
      return role;
    }));
  };

  const RoleForm: React.FC<{ 
    role: Partial<Role>, 
    onSave: () => void, 
    onCancel: () => void,
    title: string 
  }> = ({ role, onSave, onCancel, title }) => {
    const [formData, setFormData] = useState({
      name: role.name || '',
      description: role.description || '',
      permissions: role.permissions || [],
    });

    const categories = getPermissionsByCategory();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter role name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter role description"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.entries(categories).map(([category, perms]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                      <div className="space-y-2">
                        {perms.map((permission) => (
                          <label key={permission.id} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    permissions: [...prev.permissions, permission.id],
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    permissions: prev.permissions.filter(p => p !== permission.id),
                                  }));
                                }
                              }}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button onClick={onCancel} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (editingRole) {
                    setEditingRole({ ...editingRole, ...formData });
                  } else {
                    setNewRole(formData);
                  }
                  onSave();
                }}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Role
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600">Manage user roles and their associated permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(role => role.isSystem).length}
              </p>
            </div>
            <Lock className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Custom Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(role => !role.isSystem).length}
              </p>
            </div>
            <Unlock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Permissions</p>
              <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            </div>
            <Settings className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles</h3>
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{role.name}</h4>
                    {role.isSystem && (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        <Lock className="w-3 h-3 mr-1" />
                        System
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      <Users className="w-3 h-3 mr-1" />
                      {role.userCount} users
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 5).map((permissionId) => {
                      const permission = permissions.find(p => p.id === permissionId);
                      return permission ? (
                        <span key={permissionId} className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          {permission.name}
                        </span>
                      ) : null;
                    })}
                    {role.permissions.length > 5 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                        +{role.permissions.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit role"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!role.isSystem && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Permissions</h3>
        <div className="space-y-4">
          {Object.entries(getPermissionsByCategory()).map(([category, perms]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {perms.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{permission.id}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <RoleForm
          role={{}}
          onSave={handleCreateRole}
          onCancel={() => setShowCreateModal(false)}
          title="Create New Role"
        />
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <RoleForm
          role={editingRole}
          onSave={handleUpdateRole}
          onCancel={() => setEditingRole(null)}
          title="Edit Role"
        />
      )}
    </div>
  );
};

export default RolesPermissions; 