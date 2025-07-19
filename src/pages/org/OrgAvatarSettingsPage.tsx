import React, { useState } from 'react';
import { 
  User,
  AlertCircle,
  Info,
  Save,
  DollarSign,
  BarChart3,
  Users,
  Image,
  Paperclip,
  Loader2,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import type { OrgAvatarSettings } from '../../types';
import { mockOrgAvatarSettings } from '../../data/mockData';

const OrgAvatarSettingsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  const [avatarSettings, setAvatarSettings] = useState<OrgAvatarSettings>(mockOrgAvatarSettings);
  const [isEditing, setIsEditing] = useState(false);

  // Avatar upload and training state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<'not_trained' | 'training' | 'ready'>('not_trained');
  const [testInput, setTestInput] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [enableTextChat, setEnableTextChat] = useState(true);

  const handleToggleSetting = (setting: 'enableTextBasedAvatar' | 'allowPhotoBasedAvatars') => {
    setAvatarSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Avatar settings have been updated successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setAvatarSettings(mockOrgAvatarSettings);
    setIsEditing(false);
  };

  const getUsagePercentage = () => {
    return Math.round((avatarSettings.currentUsage / avatarSettings.avatarUsageLimit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-amber-600';
    return 'text-green-600';
  };

  // Handle avatar file upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setTrainingStatus('not_trained');
    }
  };

  // Simulate training
  const handleTrainAvatar = () => {
    setTrainingStatus('training');
    setTimeout(() => {
      setTrainingStatus('ready');
      addNotification({
        type: 'success',
        title: 'Avatar Trained',
        message: 'Your avatar has been trained and is ready for use.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    }, 2000);
  };

  // Simulate test chat
  const handleTestChat = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResponse(`(AI) Response to: "${testInput}"`);
      setIsTesting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Avatar Settings</h1>
          <p className="text-gray-600 mt-1">Configure avatar usage and restrictions for your organization</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
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
          {/* Avatar Upload & Training */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Org-wide Avatar Model</h2>
            <p className="text-sm text-gray-600 mb-4">Upload and train your organization’s avatar. This avatar will be used by all users in your org for chat and profile features.</p>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 mb-2">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="object-cover w-full h-full" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={!isEditing}
                  />
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}> 
                    <Paperclip className="w-4 h-4 mr-1" />
                    {avatarFile ? 'Change Photo' : 'Upload Photo'}
                  </span>
                </label>
              </div>
              <div className="flex-1 space-y-2">
                <button
                  onClick={handleTrainAvatar}
                  disabled={!avatarFile || trainingStatus === 'training' || !isEditing}
                  className={`btn-primary flex items-center ${(!avatarFile || trainingStatus === 'training' || !isEditing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {trainingStatus === 'training' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  {trainingStatus === 'ready' ? 'Avatar Ready' : trainingStatus === 'training' ? 'Training...' : 'Train Avatar'}
                </button>
                <div className="text-xs text-gray-500 mt-1">
                  {trainingStatus === 'not_trained' && 'Upload a photo and click Train Avatar to start.'}
                  {trainingStatus === 'training' && 'Training in progress...'}
                  {trainingStatus === 'ready' && 'Avatar is trained and ready for use.'}
                </div>
              </div>
            </div>
          </div>

          {/* Test Avatar Chat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Avatar Chat</h2>
            <p className="text-sm text-gray-600 mb-4">Try chatting with your trained avatar. This is how users will interact with the org avatar in the app.</p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={trainingStatus !== 'ready'}
                />
                <button
                  onClick={handleTestChat}
                  disabled={!testInput || trainingStatus !== 'ready' || isTesting}
                  className="btn-primary flex items-center"
                >
                  {isTesting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MessageCircle className="w-4 h-4 mr-2" />}
                  Send
                </button>
              </div>
              {testResponse && (
                <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800">
                  <span className="font-semibold text-blue-600">Avatar:</span> {testResponse}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Text-Based Chat Avatar</h2>
                  <p className="text-sm text-gray-600">AI-generated avatars for chat interactions</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting('enableTextBasedAvatar')}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  avatarSettings.enableTextBasedAvatar ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    avatarSettings.enableTextBasedAvatar ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      When enabled, users can generate AI-powered avatars for chat interactions. 
                      These avatars are created based on user preferences and can be customized with different styles.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Cost per avatar</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${avatarSettings.avatarUsageCost}</p>
                  <p className="text-xs text-gray-500">Per generated avatar</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Usage limit</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{avatarSettings.avatarUsageLimit}</p>
                  <p className="text-xs text-gray-500">Avatars per month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Image className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Photo-Based Avatars</h2>
                  <p className="text-sm text-gray-600">Allow users to upload profile photos</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleSetting('allowPhotoBasedAvatars')}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  avatarSettings.allowPhotoBasedAvatars ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    avatarSettings.allowPhotoBasedAvatars ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-800">Photo uploads</h3>
                    <p className="text-sm text-purple-700 mt-1">
                      When enabled, users can upload their own profile photos. 
                      Photos are automatically resized and optimized for best performance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Image className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Supported formats</p>
                  <p className="text-xs text-gray-500">JPG, PNG, GIF</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Max file size</p>
                  <p className="text-xs text-gray-500">5 MB</p>
                </div>
                
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Resolution</p>
                  <p className="text-xs text-gray-500">400x400px</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Avatar Configuration</h2>
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={enableTextChat}
                  onChange={() => setEnableTextChat(v => !v)}
                  disabled={!isEditing}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Enable Text Chat with Avatar</span>
              </label>
              <label className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Usage Limit:</span>
                <input
                  type="number"
                  min={1}
                  value={avatarSettings.avatarUsageLimit}
                  onChange={e => setAvatarSettings(prev => ({ ...prev, avatarUsageLimit: Number(e.target.value) }))}
                  disabled={!isEditing}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                />
              </label>
            </div>
            <div className="text-xs text-gray-500">
              These settings apply to all users in your organization.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Current Usage</span>
                  <span className={`text-sm font-bold ${getUsageColor(getUsagePercentage())}`}>
                    {avatarSettings.currentUsage} / {avatarSettings.avatarUsageLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      getUsagePercentage() >= 90 ? 'bg-red-500' :
                      getUsagePercentage() >= 75 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${getUsagePercentage()}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getUsagePercentage()}% of monthly limit used
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border border-gray-200 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{avatarSettings.currentUsage}</p>
                  <p className="text-xs text-gray-500">Used this month</p>
                </div>
                <div className="text-center p-3 border border-gray-200 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    ${(avatarSettings.currentUsage * avatarSettings.avatarUsageCost).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Total cost</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Avatar Usage Cost</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>Text-based avatars are charged per generation. Photo uploads are free but count towards your storage quota.</p>
                  <p className="mt-2 font-medium">Current rate: ${avatarSettings.avatarUsageCost} per avatar</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Comparison</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Text-Based</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">AI Generated</p>
                  <p className="text-xs text-gray-500">${avatarSettings.avatarUsageCost} each</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Photo-Based</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">User Upload</p>
                  <p className="text-xs text-gray-500">Free</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAvatarSettingsPage; 