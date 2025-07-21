import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Save,
  X,
  Plus,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Github,
  Camera
} from 'lucide-react';
import { FFUser } from '../../types/user';
import { mockFFUsers } from '../../data/mockData';

const FFUserEdit: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<FFUser | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [emails, setEmails] = useState<string[]>(['']);
  const [phones, setPhones] = useState<string[]>(['']);
  const [customSocialLinks, setCustomSocialLinks] = useState<Array<{platform: string, url: string}>>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Find user from mock data
    const foundUser = mockFFUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      // Initialize form data with user data
      setFormData({
        fullName: foundUser.fullName,
        email: foundUser.email,
        jobTitle: foundUser.profileData?.jobTitle || '',
        company: foundUser.profileData?.company || '',
        website: foundUser.profileData?.website || '',
        profileUrl: foundUser.profileData?.profileUrl || '',
        bio: foundUser.profileData?.bio || '',
        profilePicture: foundUser.profileData?.profilePicture || '',
        phone: foundUser.profileData?.phone || '',
        street: foundUser.profileData?.address?.street || '',
        city: foundUser.profileData?.address?.city || '',
        state: foundUser.profileData?.address?.state || '',
        zipCode: foundUser.profileData?.address?.zipCode || '',
        country: foundUser.profileData?.address?.country || '',
        linkedin: foundUser.profileData?.socialLinks?.linkedin || '',
        twitter: foundUser.profileData?.socialLinks?.twitter || '',
        facebook: foundUser.profileData?.socialLinks?.facebook || '',
        instagram: foundUser.profileData?.socialLinks?.instagram || '',
        youtube: foundUser.profileData?.socialLinks?.youtube || '',
        github: foundUser.profileData?.socialLinks?.github || ''
      });
      
      // Initialize multiple emails and phones
      setEmails([foundUser.email, ...(foundUser.profileData?.additionalEmails || [])]);
      setPhones([foundUser.profileData?.phone || '', ...(foundUser.profileData?.additionalPhones || [])]);
      
      // Initialize custom social links
      setCustomSocialLinks(foundUser.profileData?.customSocialLinks || []);
    }
  }, [userId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmail = () => {
    setEmails([...emails, '']);
  };

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const addPhone = () => {
    setPhones([...phones, '']);
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      const newPhones = phones.filter((_, i) => i !== index);
      setPhones(newPhones);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically update the user via API
      console.log('Saving user data:', formData);
      
      // Navigate back to detail page
      navigate(`/admin/fnf-onboarding/user/${userId}`);
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/fnf-onboarding/user/${userId}`);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
        <p className="text-gray-600">The requested user could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/admin/fnf-onboarding/user/${userId}`)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit {user.fullName}</h1>
            <p className="text-gray-600">Update F&F User Profile Information</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Image */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-purple-600" />
            Profile Picture
          </h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-purple-100">
                {formData.profilePicture ? (
                  <img 
                    src={formData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                <input
                  type="url"
                  value={formData.profilePicture || ''}
                  onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://example.com/profile.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a valid image URL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter full name"
              />
            </div>
            
            {/* Multiple Emails */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Addresses *</label>
              {emails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    disabled={user.status === 'completed' && index === 0}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                      user.status === 'completed' && index === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    placeholder={`Email ${index + 1}`}
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmail(index)}
                      className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove email"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addEmail}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Email
              </button>
              {user.status === 'completed' && (
                <p className="text-xs text-gray-500 mt-1">Primary email cannot be changed once profile is completed</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-600" />
            Profile Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={formData.jobTitle || ''}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile URL</label>
              <input
                type="text"
                value={formData.profileUrl || ''}
                onChange={(e) => handleInputChange('profileUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="yourusername"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
              <input
                type="url"
                value={formData.profilePicture || ''}
                onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com/profile.jpg"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-green-600" />
            Contact Information
          </h4>
          <div className="space-y-4">
            {/* Multiple Phones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers</label>
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={`Phone ${index + 1}`}
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove phone"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhone}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Phone
              </button>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-600" />
            Address Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.street || ''}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter state"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                value={formData.zipCode || ''}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter ZIP code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-purple-600" />
            Social Links
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                Twitter
              </label>
              <input
                type="url"
                value={formData.twitter || ''}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://twitter.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook
              </label>
              <input
                type="url"
                value={formData.facebook || ''}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://facebook.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                Instagram
              </label>
              <input
                type="url"
                value={formData.instagram || ''}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Youtube className="w-4 h-4 mr-2 text-red-600" />
                YouTube
              </label>
              <input
                type="url"
                value={formData.youtube || ''}
                onChange={(e) => handleInputChange('youtube', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://youtube.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Github className="w-4 h-4 mr-2 text-gray-800" />
                GitHub
              </label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => handleInputChange('github', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>

        {/* Custom Social Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-indigo-600" />
            Custom Social Links
          </h4>
          <div className="space-y-3">
            {customSocialLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => {
                      const newLinks = [...customSocialLinks];
                      newLinks[index] = { ...newLinks[index], platform: e.target.value };
                      setCustomSocialLinks(newLinks);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., TikTok, Snapchat, Medium"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Profile URL
                  </label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...customSocialLinks];
                      newLinks[index] = { ...newLinks[index], url: e.target.value };
                      setCustomSocialLinks(newLinks);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/yourprofile"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCustomSocialLinks(customSocialLinks.filter((_, i) => i !== index))}
                  className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors self-end"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setCustomSocialLinks([...customSocialLinks, { platform: '', url: '' }])}
              className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add custom social media link
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default FFUserEdit; 