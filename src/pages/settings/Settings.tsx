import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  CreditCard, 
  Shield, 
  Bell, 
  Globe, 
  Building2,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import ProfilePictureModal from '../../components/ProfilePictureModal';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  current: boolean;
  popular?: boolean;
}

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
}

const Settings: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [subscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'basic',
      name: 'Basic',
      price: '$9/month',
      features: ['Up to 10 users', 'Basic analytics', 'Standard support'],
      current: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$29/month',
      features: ['Up to 50 users', 'Advanced analytics', 'Priority support', 'Custom branding'],
      current: true,
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99/month',
      features: ['Unlimited users', 'Full analytics suite', '24/7 support', 'Custom integrations'],
      current: false,
    },
  ]);

  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([
    {
      id: 'qr_sharing',
      name: 'QR Code Sharing',
      description: 'Allow users to share cards via QR codes',
      enabled: true,
      category: 'Card Features',
    },
    {
      id: 'avatar_upload',
      name: 'Avatar Upload',
      description: 'Enable profile picture uploads for users',
      enabled: true,
      category: 'User Features',
    },
    {
      id: 'public_profiles',
      name: 'Public Profiles',
      description: 'Allow public access to user profiles',
      enabled: false,
      category: 'Privacy',
    },
    {
      id: 'analytics_export',
      name: 'Analytics Export',
      description: 'Allow users to export analytics data',
      enabled: true,
      category: 'Analytics',
    },
    {
      id: 'two_factor_auth',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all users',
      enabled: false,
      category: 'Security',
    },
    {
      id: 'api_access',
      name: 'API Access',
      description: 'Enable API access for integrations',
      enabled: true,
      category: 'Integrations',
    },
  ]);

  const handleFeatureToggle = (featureId: string) => {
    setFeatureToggles(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
    
    addNotification({
      type: 'success',
      title: 'Feature Updated',
      message: 'Feature setting has been updated successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your settings have been saved successfully.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTabs = () => {
    const baseTabs = [
      { id: 'general', name: 'General', icon: SettingsIcon },
      { id: 'security', name: 'Security', icon: Shield },
      { id: 'notifications', name: 'Notifications', icon: Bell },
    ];

    if (currentUser?.role === 'super_admin') {
      return [
        ...baseTabs,
        { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
        { id: 'features', name: 'Feature Toggles', icon: Globe },
        { id: 'integrations', name: 'Integrations', icon: Building2 },
      ];
    } else if (currentUser?.role === 'org_admin') {
      return [
        ...baseTabs,
        { id: 'subscriptions', name: 'Subscription', icon: CreditCard },
        { id: 'features', name: 'Features', icon: Globe },
      ];
    }

    return baseTabs;
  };

  const tabs = getTabs();

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        
        {/* Profile Picture Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=1'}
                alt={currentUser?.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                onClick={() => setShowProfileModal(true)}
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full transition-all duration-200 flex items-center justify-center"
              >
                <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Click on the image to update your profile picture
              </p>
              <p className="text-xs text-gray-500">
                Recommended size: 200x200px • Max size: 2MB • Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={currentUser?.name}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={currentUser?.email}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
              <option>GMT (Greenwich Mean Time)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Enable 2FA</p>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button className="btn-secondary">Configure</button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Chrome on MacBook Pro</p>
              <p className="text-sm text-gray-600">Last active 2 hours ago</p>
            </div>
            <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Safari on iPhone</p>
              <p className="text-sm text-gray-600">Last active 1 day ago</p>
            </div>
            <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">New User Invitations</p>
              <p className="text-sm text-gray-600">Get notified when users accept invitations</p>
            </div>
            <button className="btn-primary">Enabled</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Card Activity</p>
              <p className="text-sm text-gray-600">Receive updates about card views and shares</p>
            </div>
            <button className="btn-secondary">Disabled</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">System Updates</p>
              <p className="text-sm text-gray-600">Important platform updates and maintenance</p>
            </div>
            <button className="btn-primary">Enabled</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">In-App Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Real-time Updates</p>
              <p className="text-sm text-gray-600">Show notifications in the app</p>
            </div>
            <button className="btn-primary">Enabled</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Sound Alerts</p>
              <p className="text-sm text-gray-600">Play sound for new notifications</p>
            </div>
            <button className="btn-secondary">Disabled</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">Professional Plan</h4>
              <p className="text-blue-700">$29/month • Up to 50 users</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Next billing: Dec 15, 2024</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm">Manage Billing</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div key={plan.id} className={`border rounded-lg p-6 ${
              plan.current ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
            } ${plan.popular ? 'relative' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full mt-6 py-2 px-4 rounded-lg font-medium ${
                  plan.current 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'btn-primary'
                }`}>
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFeatureToggles = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Management</h3>
        <p className="text-sm text-gray-600 mb-6">
          Enable or disable features for your organization. Changes will affect all users.
        </p>
        
        <div className="space-y-6">
          {['Card Features', 'User Features', 'Privacy', 'Analytics', 'Security', 'Integrations'].map((category) => {
            const categoryFeatures = featureToggles.filter(f => f.category === category);
            if (categoryFeatures.length === 0) return null;
            
            return (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                <div className="space-y-4">
                  {categoryFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h5 className="font-medium text-gray-900">{feature.name}</h5>
                          {feature.enabled && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <button
                        onClick={() => handleFeatureToggle(feature.id)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium ${
                          feature.enabled 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {feature.enabled ? (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            <span>Enabled</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Access</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-900">API Key</h5>
              <p className="text-sm text-gray-600">Use this key to access the API</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value="sk_live_1234567890abcdef"
                readOnly
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
              <button className="btn-secondary text-sm">Regenerate</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Services</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Slack Integration</h5>
                <p className="text-sm text-gray-600">Connected to workspace: acme-corp</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700 text-sm">Disconnect</button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Zapier</h5>
                <p className="text-sm text-gray-600">Not connected</p>
              </div>
            </div>
            <button className="btn-primary text-sm">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'subscriptions':
        return renderSubscriptionSettings();
      case 'features':
        return renderFeatureToggles();
      case 'integrations':
        return renderIntegrations();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and organization preferences</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="btn-primary flex items-center mt-4 sm:mt-0"
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

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={(imageData) => {
          // In a real app, you would upload this to your server
          addNotification({
            type: 'success',
            title: 'Profile Picture Updated',
            message: 'Your profile picture has been updated successfully.',
            isRead: false,
            userId: currentUser?.id || '',
          });
        }}
        currentImage={currentUser?.avatar}
      />
    </div>
  );
};

export default Settings; 