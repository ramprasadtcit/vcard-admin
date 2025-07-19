import React, { useState } from 'react';
import { 
  Bot, 
  Upload, 
  FileText, 
  Trash2, 
  MessageSquare,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Send,
  Mic,
  Volume2,
  Power,
  PowerOff
} from 'lucide-react';
import { useAuth } from '../../contexts';
import { useNotifications } from '../../contexts';
import { 
  BotSettings, 
  KnowledgeDocument, 
  AvatarConfig 
} from '../../types/organization';
import { 
  mockBotSettings, 
  mockKnowledgeDocuments, 
  mockAvatarConfig 
} from '../../data/mockData';

const OrgBotSettings: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  
  // State management
  const [botSettings, setBotSettings] = useState<BotSettings>(mockBotSettings);
  const [knowledgeDocuments, setKnowledgeDocuments] = useState<KnowledgeDocument[]>(mockKnowledgeDocuments);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(mockAvatarConfig);
  
  // Form states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [avatarName, setAvatarName] = useState(avatarConfig.name);
  const [backgroundColor, setBackgroundColor] = useState(avatarConfig.backgroundColor || '#3B82F6');
  
  // Bot testing states
  const [testMessages, setTestMessages] = useState<Array<{
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: string;
    avatar?: string;
  }>>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm ${avatarConfig.name || 'your AI assistant'}. How can I help you today?`,
      timestamp: new Date().toISOString(),
      avatar: avatarConfig.photoUrl,
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingBot, setIsUpdatingBot] = useState(false);

  // Check if user has access
  if (currentUser?.role !== 'org_admin') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only organization administrators can access bot settings.</p>
      </div>
    );
  }

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles((prev: File[]) => [...prev, ...files]);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDocuments: KnowledgeDocument[] = selectedFiles.map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        filename: file.name,
        originalName: file.name,
        size: file.size,
        uploadTime: new Date().toISOString(),
        status: Math.random() > 0.1 ? 'ready' : 'error',
        errorMessage: Math.random() > 0.1 ? undefined : 'File format not supported',
      }));

      setKnowledgeDocuments(prev => [...prev, ...newDocuments]);
      setSelectedFiles([]);
      
      addNotification({
        type: 'success',
        title: 'Files Uploaded',
        message: `${selectedFiles.length} file(s) uploaded successfully.`,
        isRead: false,
        userId: currentUser?.id || '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload files. Please try again.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setKnowledgeDocuments((prev: KnowledgeDocument[]) => prev.filter(doc => doc.id !== documentId));
    addNotification({
      type: 'success',
      title: 'Document Deleted',
      message: 'Document removed successfully.',
      isRead: false,
      userId: currentUser?.id || '',
    });
  };

  // Avatar configuration handlers
  const handleAvatarSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedConfig: AvatarConfig = {
        ...avatarConfig,
        name: avatarName,
        backgroundColor,
        isConfigured: true,
        updatedAt: new Date().toISOString(),
      };
      
      setAvatarConfig(updatedConfig);
      setBotSettings(prev => ({ ...prev, avatarConfig: updatedConfig }));
      
      addNotification({
        type: 'success',
        title: 'Avatar Saved',
        message: 'Avatar configuration saved successfully.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save avatar configuration.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Bot type change handler
  const handleBotTypeChange = (type: 'text_chat' | 'avatar') => {
    setBotSettings(prev => ({ ...prev, botType: type }));
  };

  // Bot testing handlers
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    setTestMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(currentMessage);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot' as const,
        content: botResponse,
        timestamp: new Date().toISOString(),
        avatar: avatarConfig.photoUrl,
      };

      setTestMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Simulate speaking for avatar
      if (botSettings.botType === 'avatar' && voiceEnabled) {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000);
      }
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  // Bot enable/disable handler
  const handleBotToggle = async () => {
    setIsUpdatingBot(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSettings = {
        ...botSettings,
        isEnabled: !botSettings.isEnabled,
        updatedAt: new Date().toISOString(),
      };
      
      setBotSettings(updatedSettings);
      
      addNotification({
        type: 'success',
        title: `Bot ${updatedSettings.isEnabled ? 'Enabled' : 'Disabled'}`,
        message: `AI assistant has been ${updatedSettings.isEnabled ? 'activated' : 'deactivated'} for your organization users.`,
        isRead: false,
        userId: currentUser?.id || '',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update bot status. Please try again.',
        isRead: false,
        userId: currentUser?.id || '',
      });
    } finally {
      setIsUpdatingBot(false);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const responses = [
      "Based on the uploaded documents, I can help you with that. Let me provide you with the relevant information.",
      "I found some information about that in our knowledge base. Here's what I can tell you...",
      "According to our documentation, the answer to your question is...",
      "I understand your question. Let me search through our knowledge base for the most accurate response.",
      "That's a great question! Based on our uploaded materials, here's what I know...",
      "I can help you with that. Let me reference our knowledge base for the specific details.",
      "Thank you for your question. I found relevant information in our documents that should help.",
      "I have information about that topic in our knowledge base. Here's what I can share with you...",
    ];

    // Simple keyword-based responses
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return `Hello! I'm ${avatarConfig.name || 'your AI assistant'}. How can I help you today?`;
    }
    if (userMessage.toLowerCase().includes('help')) {
      return "I'm here to help! I can answer questions based on the documents you've uploaded. What would you like to know?";
    }
    if (userMessage.toLowerCase().includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceToggle = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const handleStartListening = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setIsListening(false);
      setCurrentMessage("Can you tell me about the company policies?");
    }, 2000);
  };

  const handleTestModeToggle = () => {
    setIsTesting(!isTesting);
    if (!isTesting) {
      // Reset messages when starting test
      setTestMessages([{
        id: '1',
        type: 'bot',
        content: `Hello! I'm ${avatarConfig.name || 'your AI assistant'}. How can I help you today?`,
        timestamp: new Date().toISOString(),
        avatar: avatarConfig.photoUrl,
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bot Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure AI assistant for your organization users
          </p>
        </div>
      </div>

      {/* Bot Status Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${botSettings.isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              {botSettings.isEnabled ? (
                <Power className="w-6 h-6 text-green-600" />
              ) : (
                <PowerOff className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bot Status</h2>
              <p className="text-sm text-gray-600">
                {botSettings.isEnabled 
                  ? 'AI assistant is active and available to your users' 
                  : 'AI assistant is disabled and not accessible to users'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleBotToggle}
            disabled={isUpdatingBot}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg transition-colors ${
              botSettings.isEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-red-50'
                : 'bg-green-100 text-green-700 hover:bg-green-200 disabled:bg-green-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpdatingBot ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                {botSettings.isEnabled ? (
                  <>
                    <PowerOff className="w-4 h-4 mr-2" />
                    Disable Bot
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-2" />
                    Enable Bot
                  </>
                )}
              </>
            )}
          </button>
        </div>
        
        {/* Status Info */}
        <div className={`mt-4 p-4 rounded-lg ${
          botSettings.isEnabled 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-start space-x-3">
            {botSettings.isEnabled ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
            )}
            <div className="text-sm">
              <p className={`font-medium ${botSettings.isEnabled ? 'text-green-900' : 'text-gray-900'}`}>
                {botSettings.isEnabled ? 'Bot is Active' : 'Bot is Inactive'}
              </p>
              <p className={`${botSettings.isEnabled ? 'text-green-800' : 'text-gray-700'}`}>
                {botSettings.isEnabled 
                  ? 'Users can interact with the AI assistant. All configuration changes will be applied immediately.'
                  : 'Users cannot access the AI assistant. Enable the bot to make it available to your organization.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bot Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              botSettings.botType === 'text_chat' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleBotTypeChange('text_chat')}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Text Chat</h3>
                <p className="text-sm text-gray-600">Basic Q&A chatbot based on uploaded documents</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              botSettings.botType === 'avatar' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleBotTypeChange('avatar')}
          >
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Avatar</h3>
                <p className="text-sm text-gray-600">Visual AI bot with speaking animation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base</h2>
        
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
            <p className="text-gray-600 mb-4">
              Upload PDF files to train your bot. Supported formats: PDF only.
            </p>
            
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Select Files
            </label>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Selected Files:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    </div>
                    <button
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleFileUpload}
                disabled={isUploading}
                className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          )}
        </div>

        {/* File List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Uploaded Documents ({knowledgeDocuments.length})
          </h4>
          <div className="space-y-2">
            {knowledgeDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="font-medium text-gray-900">{doc.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(doc.size)} • Uploaded {new Date(doc.uploadTime).toLocaleDateString()}
                    </p>
                    {doc.errorMessage && (
                      <p className="text-sm text-red-600">{doc.errorMessage}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar Setup - Only show if Avatar is selected */}
      {botSettings.botType === 'avatar' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Avatar Configuration</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar Name
                </label>
                <input
                  type="text"
                  value={avatarName}
                  onChange={(e) => setAvatarName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter avatar name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar Photo
                </label>
                <div className="flex items-center space-x-4">
                  {avatarConfig.photoUrl && (
                    <img
                      src={avatarConfig.photoUrl}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAvatarSave}
                disabled={isSaving}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
            
            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div 
                className="w-full h-64 rounded-lg flex items-center justify-center relative overflow-hidden"
                style={{ backgroundColor }}
              >
                {avatarConfig.photoUrl ? (
                  <img
                    src={avatarConfig.photoUrl}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">{avatarName}</p>
                  <p className="text-xs text-gray-600">AI Assistant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bot Testing Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Test Your Bot</h2>
          <button
            onClick={handleTestModeToggle}
            disabled={!botSettings.isEnabled}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              !botSettings.isEnabled
                ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
                : isTesting 
                  ? 'text-red-700 bg-red-100 hover:bg-red-200' 
                  : 'text-green-700 bg-green-100 hover:bg-green-200'
            }`}
          >
            {!botSettings.isEnabled ? 'Bot Disabled' : isTesting ? 'Stop Testing' : 'Start Testing'}
          </button>
        </div>
        
        {!botSettings.isEnabled && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900">Bot Testing Unavailable</p>
                <p className="text-yellow-800">
                  Enable the bot first to test its functionality. Users cannot access the AI assistant while it's disabled.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isTesting ? (
          <div className="space-y-4">
            {/* Voice Controls for Avatar */}
            {botSettings.botType === 'avatar' && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleVoiceToggle}
                    className={`p-2 rounded-full ${
                      voiceEnabled 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-sm text-gray-600">
                    Voice: {voiceEnabled ? 'On' : 'Off'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartListening}
                    disabled={isListening}
                    className={`p-2 rounded-full ${
                      isListening 
                        ? 'bg-red-100 text-red-600 animate-pulse' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <span className="text-sm text-gray-600">
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </span>
                </div>
                
                {isSpeaking && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-600">Speaking...</span>
                  </div>
                )}
              </div>
            )}

            {/* Chat Interface */}
            <div className="border border-gray-200 rounded-lg h-96 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {testMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {message.type === 'bot' && botSettings.botType === 'avatar' && (
                        <div className="flex-shrink-0">
                          <div 
                            className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                            style={{ 
                              backgroundImage: message.avatar ? `url(${message.avatar})` : 'none',
                              backgroundColor: backgroundColor 
                            }}
                          >
                            {!message.avatar && (
                              <User className="w-4 h-4 text-white mx-auto mt-1" />
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className={`px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      {botSettings.botType === 'avatar' && (
                        <div className="flex-shrink-0">
                          <div 
                            className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
                            style={{ 
                              backgroundImage: avatarConfig.photoUrl ? `url(${avatarConfig.photoUrl})` : 'none',
                              backgroundColor: backgroundColor 
                            }}
                          >
                            {!avatarConfig.photoUrl && (
                              <User className="w-4 h-4 text-white mx-auto mt-1" />
                            )}
                          </div>
                        </div>
                      )}
                      <div className="px-4 py-2 rounded-lg bg-gray-100">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Ask ${avatarConfig.name || 'your AI assistant'} anything...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={1}
                      disabled={isTyping}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Testing Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Testing Information</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Bot Type: <span className="font-medium">{botSettings.botType === 'text_chat' ? 'Text Chat' : 'Avatar'}</span></p>
                <p>• Knowledge Documents: <span className="font-medium">{knowledgeDocuments.filter(doc => doc.status === 'ready').length} ready</span></p>
                <p>• Avatar: <span className="font-medium">{avatarConfig.isConfigured ? avatarConfig.name : 'Not configured'}</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {botSettings.isEnabled ? (
              <>
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Test</h3>
                <p className="text-gray-600 mb-4">
                  Click "Start Testing" to interact with your configured bot and see how it responds to user queries.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Bot Ready</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Knowledge Base: {knowledgeDocuments.filter(doc => doc.status === 'ready').length} docs</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <PowerOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bot is Disabled</h3>
                <p className="text-gray-600 mb-4">
                  Enable the bot to start testing its functionality and make it available to your users.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Bot Disabled</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Knowledge Base: {knowledgeDocuments.filter(doc => doc.status === 'ready').length} docs</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgBotSettings; 