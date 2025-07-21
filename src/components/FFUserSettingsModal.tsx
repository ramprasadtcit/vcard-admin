import React, { useState } from 'react';
import { X, Settings, Users, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import { FFUserSettings } from '../types/user';

interface FFUserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FFUserSettings;
  onSave: (settings: FFUserSettings) => void;
}

const FFUserSettingsModal: React.FC<FFUserSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [formData, setFormData] = useState<FFUserSettings>(settings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
      onClose();
    } catch (error) {
      // Error handling would go here
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(settings); // Reset to original values
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">F&F Onboarding Settings</h2>
              <p className="text-sm text-gray-600">Configure invitation limits and expiry</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">F&F Onboarding</h3>
                <p className="text-xs text-gray-600">Enable or disable the feature</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Max Active Slots */}
          <div>
            <label htmlFor="maxSlots" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Active Slots
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                id="maxSlots"
                min="1"
                max="1000"
                value={formData.maxActiveSlots}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  maxActiveSlots: parseInt(e.target.value) || 1 
                }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
                disabled={!formData.isEnabled}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Maximum number of active F&F user invitations at any time
            </p>
          </div>

          {/* Auto Expiry Days */}
          <div>
            <label htmlFor="expiryDays" className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Expiry (Days)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                id="expiryDays"
                min="1"
                max="365"
                value={formData.autoExpiryDays}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  autoExpiryDays: parseInt(e.target.value) || 1 
                }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                disabled={!formData.isEnabled}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Number of days before invitation links expire automatically
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Settings Information</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Active slots limit concurrent invitations</li>
                  <li>• Expired links require manual resend</li>
                  <li>• Changes apply to new invitations only</li>
                  <li>• Existing invitations follow previous settings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FFUserSettingsModal; 