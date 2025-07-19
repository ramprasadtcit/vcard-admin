import React, { useState } from 'react';
import { 
  Palette, 
  Upload, 
  Trash2, 
  Save, 
  Eye, 
  Download,
  Image,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { mockOrganizations } from '../../data/mockData';

const Branding: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const organization = mockOrganizations.find(org => org.id === currentUser?.organizationId);
  
  const [brandingData, setBrandingData] = useState({
    logo: organization?.logo || '',
    primaryColor: organization?.theme.primaryColor || '#3b82f6',
    secondaryColor: organization?.theme.secondaryColor || '#1e40af',
    fontFamily: organization?.theme.fontFamily || 'Inter',
    customCSS: '',
  });

  // Only Org Admin can access this page
  if (currentUser?.role !== 'org_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only organization admins can access branding settings.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        title: 'Branding Updated',
        message: 'Your organization branding has been updated successfully.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update branding settings. Please try again.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandingData(prev => ({
          ...prev,
          logo: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setBrandingData(prev => ({
      ...prev,
      logo: '',
    }));
  };

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Default)' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Poppins', label: 'Poppins' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding Settings</h1>
          <p className="text-gray-600">Customize your organization's appearance and branding</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="btn-secondary flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary flex items-center"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branding Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Logo</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {brandingData.logo ? (
                  <div className="relative">
                    <img
                      src={brandingData.logo}
                      alt="Organization logo"
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <label className="btn-secondary flex items-center w-fit">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended size: 200x200px, Max size: 2MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Scheme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingData.primaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandingData.secondaryColor}
                    onChange={(e) => setBrandingData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="#1e40af"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                value={brandingData.fontFamily}
                onChange={(e) => setBrandingData(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom CSS */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom CSS</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional CSS Styles
              </label>
              <textarea
                value={brandingData.customCSS}
                onChange={(e) => setBrandingData(prev => ({ ...prev, customCSS: e.target.value }))}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder="/* Add your custom CSS here */"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add custom CSS to further customize your organization's appearance
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            {previewMode ? (
              <div 
                className="border border-gray-200 rounded-lg p-4"
                style={{
                  '--primary-color': brandingData.primaryColor,
                  '--secondary-color': brandingData.secondaryColor,
                  fontFamily: brandingData.fontFamily,
                } as React.CSSProperties}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {brandingData.logo && (
                    <img
                      src={brandingData.logo}
                      alt="Logo"
                      className="w-8 h-8 rounded"
                    />
                  )}
                  <h4 className="font-semibold" style={{ color: brandingData.primaryColor }}>
                    {organization?.name || 'Organization Name'}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <button 
                    className="w-full py-2 px-4 rounded-lg text-white font-medium"
                    style={{ backgroundColor: brandingData.primaryColor }}
                  >
                    Primary Button
                  </button>
                  
                  <button 
                    className="w-full py-2 px-4 rounded-lg border font-medium"
                    style={{ 
                      borderColor: brandingData.secondaryColor,
                      color: brandingData.secondaryColor 
                    }}
                  >
                    Secondary Button
                  </button>
                  
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${brandingData.primaryColor}10` }}>
                    <p className="text-sm">Sample content with your custom colors</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <p>Click "Show Preview" to see your branding changes</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Branding
              </button>
              <button className="w-full flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branding; 