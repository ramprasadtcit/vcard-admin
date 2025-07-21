import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Globe, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube, 
  Github,
  Camera,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Mail,
  Plus,
  X
} from 'lucide-react';
import { FFUser } from '../../types/user';

interface ProfileFormData {
  // Basic Info
  fullName: string;
  jobTitle: string;
  company: string;
  website: string;
  profileUrl: string;
  
  // Contact Details
  email: string;
  additionalEmails: string[];
  phone: string;
  additionalPhones: string[];
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Social Links
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
    github: string;
    [key: string]: string;
  };
  
  // Custom Social Links
  customSocialLinks: Array<{
    platform: string;
    url: string;
  }>;
  
  // Profile Picture
  profilePicture: string;
  
  // Bio
  bio: string;
}

const FFUserProfileSetup: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    jobTitle: '',
    company: '',
    website: '',
    profileUrl: '',
    email: '',
    additionalEmails: [''],
    phone: '',
    additionalPhones: [''],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      youtube: '',
      github: ''
    },
    customSocialLinks: [],
    profilePicture: '',
    bio: ''
  });

  // Simulate token validation
  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock token validation
      if (token === 'ff-token-expired-123') {
        setTokenExpired(true);
        setTokenValid(false);
      } else if (token && token.startsWith('ff-token-')) {
        setTokenValid(true);
        setTokenExpired(false);
        
                 // Mock user data
         const mockUser: FFUser = {
           id: 'ff-1',
           fullName: 'Sarah Johnson',
           email: 'sarah.johnson@example.com',
           status: 'in_progress',
           onboardingToken: token,
           onboardingLink: `https://twintik.com/onboard/${token}`,
           invitedBy: 'john@twintik.com',
           invitedAt: '2024-01-15T10:00:00Z',
           tokenExpiresAt: '2024-01-22T10:00:00Z',
           profileData: {
             jobTitle: 'Senior Developer',
             company: 'TechCorp Solutions',
             website: 'https://sarahjohnson.dev',
             profileUrl: 'twintik.com/card/sarahjohnson',
             phone: '+1-555-0123',
             additionalPhones: ['+1-555-0124'],
             email: 'sarah.johnson@example.com',
             additionalEmails: ['sarah.j@example.com'],
             address: {
               street: '123 Tech Street',
               city: 'San Francisco',
               state: 'CA',
               zipCode: '94105',
               country: 'United States'
             },
             socialLinks: {
               linkedin: 'https://linkedin.com/in/sarahjohnson',
               twitter: 'https://twitter.com/sarahj',
               github: 'https://github.com/sarahj'
             },
             customSocialLinks: [
               { platform: 'TikTok', url: 'https://tiktok.com/@sarahj' },
               { platform: 'Snapchat', url: 'https://snapchat.com/add/sarahj' }
             ],
             profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
             bio: 'Passionate about creating innovative digital solutions.'
           }
         };
        
                 // User data is set in formData, no need for separate user state
        
                 // Pre-fill form with existing data
         if (mockUser.profileData) {
           setFormData({
             fullName: mockUser.fullName,
             jobTitle: mockUser.profileData.jobTitle || '',
             company: mockUser.profileData.company || '',
             website: mockUser.profileData.website || '',
             profileUrl: mockUser.profileData.profileUrl || '',
             email: mockUser.profileData.email || '',
             additionalEmails: mockUser.profileData.additionalEmails || [''],
             phone: mockUser.profileData.phone || '',
             additionalPhones: mockUser.profileData.additionalPhones || [''],
             address: {
               street: mockUser.profileData.address?.street || '',
               city: mockUser.profileData.address?.city || '',
               state: mockUser.profileData.address?.state || '',
               zipCode: mockUser.profileData.address?.zipCode || '',
               country: mockUser.profileData.address?.country || ''
             },
             socialLinks: {
               linkedin: mockUser.profileData.socialLinks?.linkedin || '',
               twitter: mockUser.profileData.socialLinks?.twitter || '',
               facebook: mockUser.profileData.socialLinks?.facebook || '',
               instagram: mockUser.profileData.socialLinks?.instagram || '',
               youtube: mockUser.profileData.socialLinks?.youtube || '',
               github: mockUser.profileData.socialLinks?.github || ''
             },
             customSocialLinks: mockUser.profileData.customSocialLinks || [],
             profilePicture: mockUser.profileData.profilePicture || '',
             bio: mockUser.profileData.bio || ''
           });
         }
      } else {
        setTokenValid(false);
        setTokenExpired(false);
      }
      
      setLoading(false);
    };

    validateToken();
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleAdditionalPhoneChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalPhones: prev.additionalPhones.map((phone, i) => 
        i === index ? value : phone
      )
    }));
  };

  const addAdditionalPhone = () => {
    setFormData(prev => ({
      ...prev,
      additionalPhones: [...prev.additionalPhones, '']
    }));
  };

  const removeAdditionalPhone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalPhones: prev.additionalPhones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to confirmation page
      navigate(`/onboard/${token}/confirmation`);
      
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  if (tokenExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This invitation link has expired. Please contact the administrator to request a new invitation.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            This invitation link is not valid. Please check the link or contact the administrator.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                TwinTik Digital Card Setup
              </h1>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Complete Your Digital Card Profile
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Fill in your details to create your personalized digital business card. Our team will review and configure your NFC card for sharing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Profile Picture Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-purple-600" />
                Profile Picture
              </h3>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.profilePicture ? (
                    <img 
                      src={formData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFormData(prev => ({
                            ...prev,
                            profilePicture: e.target?.result as string
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a professional headshot (recommended: 400x400px)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile URL
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      twintik.com/card/
                    </span>
                    <input
                      type="text"
                      value={formData.profileUrl.replace('twintik.com/card/', '')}
                      onChange={(e) => handleInputChange('profileUrl', `twintik.com/card/${e.target.value}`)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="yourusername"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Contact Information
              </h3>
              
              {/* Email Section */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="sarah.johnson@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Emails
                  </label>
                  <div className="space-y-2">
                    {formData.additionalEmails.map((email, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            const newEmails = [...formData.additionalEmails];
                            newEmails[index] = e.target.value;
                            setFormData(prev => ({ ...prev, additionalEmails: newEmails }));
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="sarah.j@example.com"
                        />
                        {formData.additionalEmails.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newEmails = formData.additionalEmails.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, additionalEmails: newEmails }));
                            }}
                            className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, additionalEmails: [...prev.additionalEmails, ''] }))}
                      className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add another email
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1-555-0123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Phone Numbers
                  </label>
                  <div className="space-y-2">
                    {formData.additionalPhones.map((phone, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => handleAdditionalPhoneChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="+1-555-0124"
                        />
                        {formData.additionalPhones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAdditionalPhone(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAdditionalPhone}
                      className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add another phone number
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Youtube className="w-4 h-4 mr-2 text-red-600" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Github className="w-4 h-4 mr-2 text-gray-800" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>

            {/* Custom Social Media Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                Custom Social Media Links
              </h3>
              <div className="space-y-3">
                {formData.customSocialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = [...formData.customSocialLinks];
                          newLinks[index] = { ...newLinks[index], platform: e.target.value };
                          setFormData(prev => ({ ...prev, customSocialLinks: newLinks }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                          const newLinks = [...formData.customSocialLinks];
                          newLinks[index] = { ...newLinks[index], url: e.target.value };
                          setFormData(prev => ({ ...prev, customSocialLinks: newLinks }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/yourprofile"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, customSocialLinks: prev.customSocialLinks.filter((_, i) => i !== index) }))}
                      className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors self-end"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, customSocialLinks: [...prev.customSocialLinks, { platform: '', url: '' }] }))}
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add custom social media link
                </button>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    What happens next?
                  </h4>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-2">
                      Once you submit your profile, our team will:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Review your profile information</li>
                      <li>Configure your NFC card with your details</li>
                      <li>Set up your digital card for sharing</li>
                      <li>Send you a confirmation email with next steps</li>
                    </ul>
                    <p className="mt-3 text-blue-600 font-medium">
                      This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Submit Profile for Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FFUserProfileSetup; 