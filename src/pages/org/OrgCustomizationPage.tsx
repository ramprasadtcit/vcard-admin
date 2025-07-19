import React, { useState } from 'react';
import { 
  Palette,
  Upload,
  Save,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Image,
  Building,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import type { OrgCustomization } from '../../types';
import { mockOrgCustomization } from '../../data/mockData';

const OrgCustomizationPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  const [customization, setCustomization] = useState<OrgCustomization>(mockOrgCustomization);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const colorPresets = [
    { name: 'Blue', primary: '#3B82F6', accent: '#10B981', background: '#F8FAFC' },
    { name: 'Purple', primary: '#8B5CF6', accent: '#F59E0B', background: '#FAFAFA' },
    { name: 'Green', primary: '#10B981', accent: '#3B82F6', background: '#F0FDF4' },
    { name: 'Red', primary: '#EF4444', accent: '#F59E0B', background: '#FEF2F2' },
    { name: 'Orange', primary: '#F97316', accent: '#8B5CF6', background: '#FFF7ED' },
    { name: 'Teal', primary: '#14B8A6', accent: '#F59E0B', background: '#F0FDFA' },
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Lato', value: 'Lato' },
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (type: 'primary' | 'accent' | 'background', color: string) => {
    setCustomization(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryColor' : type === 'accent' ? 'accentColor' : 'backgroundColor']: color
    }));
  };

  const handleFontChange = (font: string) => {
    setCustomization(prev => ({
      ...prev,
      fontFamily: font
    }));
  };

  const handleToggleRestriction = (restriction: 'allowUserCustomization' | 'allowLogoUpload' | 'allowColorChanges') => {
    setCustomization(prev => ({
      ...prev,
      [restriction]: !prev[restriction]
    }));
  };

  const handleSave = () => {
    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Organization customization settings have been updated successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCustomization(mockOrgCustomization);
    setLogoPreview(null);
    setIsEditing(false);
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setCustomization(prev => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.background
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customization</h1>
          <p className="text-gray-600 mt-1">Manage your organization's branding and theme settings</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`btn-secondary flex items-center ${previewMode ? 'bg-primary-50 text-primary-700 border-primary-200' : ''}`}
          >
            {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {previewMode ? 'Hide Preview' : 'Preview'}
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <Palette className="w-4 h-4 mr-2" />
              Edit Settings
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Organization Logo</h2>
              <div className="flex items-center space-x-2">
                {customization.allowLogoUpload ? (
                  <Unlock className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-500">
                  {customization.allowLogoUpload ? 'Users can upload' : 'Users cannot upload'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {logoPreview || customization.logo ? (
                    <img 
                      src={logoPreview || customization.logo} 
                      alt="Organization Logo" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Image className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your organization logo. Recommended size: 200x100px, PNG or JPG.
                  </p>
                  {isEditing && (
                    <label className="btn-secondary cursor-pointer inline-flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleRestriction('allowLogoUpload')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      customization.allowLogoUpload
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {customization.allowLogoUpload ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>
                      {customization.allowLogoUpload ? 'Allow User Uploads' : 'Restrict User Uploads'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Color Scheme</h2>
              <div className="flex items-center space-x-2">
                {customization.allowColorChanges ? (
                  <Unlock className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-gray-500">
                  {customization.allowColorChanges ? 'Users can customize' : 'Users cannot customize'}
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      disabled={!isEditing}
                      className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded border border-gray-200" 
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded border border-gray-200" 
                            style={{ backgroundColor: preset.accent }}
                          />
                          <div 
                            className="w-4 h-4 rounded border border-gray-200" 
                            style={{ backgroundColor: preset.background }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customization.primaryColor}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      disabled={!isEditing}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      value={customization.primaryColor}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customization.accentColor}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      disabled={!isEditing}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      value={customization.accentColor}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={customization.backgroundColor}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      disabled={!isEditing}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      value={customization.backgroundColor}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      disabled={!isEditing}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleRestriction('allowColorChanges')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      customization.allowColorChanges
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {customization.allowColorChanges ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>
                      {customization.allowColorChanges ? 'Allow User Customization' : 'Restrict User Customization'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Typography</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={customization.fontFamily}
                  onChange={(e) => handleFontChange(e.target.value)}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div style={{ fontFamily: customization.fontFamily }}>
                  <p className="text-2xl font-bold text-gray-900">Heading Text</p>
                  <p className="text-lg text-gray-700">Subheading Text</p>
                  <p className="text-base text-gray-600">Body text with the selected font family.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {previewMode && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              <div 
                className="p-6 rounded-lg border-2 border-dashed border-gray-300"
                style={{ backgroundColor: customization.backgroundColor }}
              >
                <div className="text-center space-y-4">
                  {logoPreview || customization.logo ? (
                    <img 
                      src={logoPreview || customization.logo} 
                      alt="Logo Preview" 
                      className="mx-auto max-h-12"
                    />
                  ) : (
                    <div className="w-24 h-12 mx-auto bg-gray-200 rounded flex items-center justify-center">
                      <Building className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div style={{ fontFamily: customization.fontFamily }}>
                    <h4 className="text-lg font-semibold" style={{ color: customization.primaryColor }}>
                      Organization Name
                    </h4>
                    <p className="text-sm" style={{ color: customization.accentColor }}>
                      Sample user card preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Permissions</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${customization.allowUserCustomization ? 'bg-green-100' : 'bg-red-100'}`}>
                    {customization.allowUserCustomization ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Customization</p>
                    <p className="text-xs text-gray-500">Users can edit their profile cards</p>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleToggleRestriction('allowUserCustomization')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      customization.allowUserCustomization
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {customization.allowUserCustomization ? 'Enabled' : 'Disabled'}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${customization.allowLogoUpload ? 'bg-green-100' : 'bg-red-100'}`}>
                    {customization.allowLogoUpload ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Logo Upload</p>
                    <p className="text-xs text-gray-500">Users can upload custom logos</p>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleToggleRestriction('allowLogoUpload')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      customization.allowLogoUpload
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {customization.allowLogoUpload ? 'Enabled' : 'Disabled'}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${customization.allowColorChanges ? 'bg-green-100' : 'bg-red-100'}`}>
                    {customization.allowColorChanges ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Color Changes</p>
                    <p className="text-xs text-gray-500">Users can customize colors</p>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleToggleRestriction('allowColorChanges')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      customization.allowColorChanges
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {customization.allowColorChanges ? 'Enabled' : 'Disabled'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Important Note</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>When "Allow user profile customization" is disabled, users cannot update their profile card details. This ensures brand consistency across your organization.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgCustomizationPage; 