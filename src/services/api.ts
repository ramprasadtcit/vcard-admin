import axios, { InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { User, Organization, NFCCard, CardTemplate, Subscription, Analytics, B2CUserData } from '../types';
import { 
  mockUsers, 
  mockOrganizations, 
  mockNFCCards, 
  mockCardTemplates, 
  mockSubscriptions 
} from '../data/mockData';
import { normalizePhoneData } from '../utils/phoneUtils';

// Configure axios defaults
console.log('API URL:', process.env.REACT_APP_API_URL);
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  // baseURL: 'https://api.twintik.com/api/v1',
  // baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and normalize phone data
api.interceptors.response.use(
  (response: any) => {
    // Normalize phone data in responses to fix country code issues
    if (response.data && typeof response.data === 'object') {
      response.data = normalizePhoneData(response.data);
    }
    return response;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      
      // Clear stored auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Show session expired toaster
      if (typeof window !== 'undefined') {
        toast.error('Session expired. Please login again.');
        
        // Navigate to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    // Real backend call
    const response = await api.post('/admin/login', { email, password });
    if (response.data && response.data.success && response.data.token) {
      return { user: response.data.user, token: response.data.token };
    }
    throw new Error(response.data?.message || 'Invalid credentials');
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, 500);
    });
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'sub_admin',
      status: 'pending',
      createdAt: new Date().toISOString(),
      permissions: userData.permissions || {
        canEditProfile: false,
        canEditTheme: false,
        canManageUsers: false,
        canViewAnalytics: true,
        canManageNFC: false,
        canManageTemplates: false,
      },
      ...userData,
    };
    
    return newUser;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    // Mock update
    const updatedUser: User = {
      id,
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'sub_admin',
      status: userData.status || 'active',
      createdAt: new Date().toISOString(),
      permissions: userData.permissions || {
        canEditProfile: false,
        canEditTheme: false,
        canManageUsers: false,
        canViewAnalytics: true,
        canManageNFC: false,
        canManageTemplates: false,
      },
      ...userData,
    };
    
    return updatedUser;
  },

  deleteUser: async (id: string): Promise<void> => {
    // Mock delete
    console.log('Deleting user:', id);
  },

  // Organizations
  getOrganizations: async (): Promise<Organization[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOrganizations);
      }, 500);
    });
  },

  createOrganization: async (orgData: Partial<Organization>): Promise<Organization> => {
    const newOrg: Organization = {
      id: `org${Date.now()}`,
      name: orgData.name || '',
      domain: orgData.domain || '',
      logo: orgData.logo || '',
      theme: orgData.theme || {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter',
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminId: orgData.adminId || '',
      subOrgs: [],
      settings: {
        allowUserInvites: true,
        requireApproval: false,
        maxUsers: 50,
        allowNFC: false,
        allowCustomTemplates: false,
        allowBranding: false,
      },
      subscriptionPlanId: 'plan2',
      subscriptionStatus: 'pending',
      features: {
        nfcEnabled: false,
        customTemplates: false,
        advancedAnalytics: false,
        apiAccess: false,
        prioritySupport: false,
      },
      ...orgData,
    };
    
    return newOrg;
  },

  updateOrganization: async (id: string, orgData: Partial<Organization>): Promise<Organization> => {
    // Mock update
    const updatedOrg: Organization = {
      id,
      name: orgData.name || '',
      domain: orgData.domain || '',
      logo: orgData.logo || '',
      theme: orgData.theme || {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        fontFamily: 'Inter',
      },
      status: orgData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminId: orgData.adminId || '',
      subOrgs: [],
      settings: orgData.settings || {
        allowUserInvites: true,
        requireApproval: false,
        maxUsers: 50,
        allowNFC: false,
        allowCustomTemplates: false,
        allowBranding: false,
      },
      subscriptionPlanId: orgData.subscriptionPlanId || 'plan2',
      subscriptionStatus: orgData.subscriptionStatus || 'active',
      features: orgData.features || {
        nfcEnabled: false,
        customTemplates: false,
        advancedAnalytics: false,
        apiAccess: false,
        prioritySupport: false,
      },
      ...orgData,
    };
    
    return updatedOrg;
  },

  // NFC Cards
  getNFCCards: async (): Promise<NFCCard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNFCCards);
      }, 500);
    });
  },

  configureNFC: async (nfcData: Partial<NFCCard>): Promise<NFCCard> => {
    const newNFC: NFCCard = {
      id: `nfc${Date.now()}`,
      userId: nfcData.userId || '',
      userName: nfcData.userName || '',
      customUrl: nfcData.customUrl || '',
      status: 'pending',
      cardType: nfcData.cardType || 'individual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...nfcData,
    };
    
    return newNFC;
  },

  // Card Templates
  getCardTemplates: async (): Promise<CardTemplate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCardTemplates);
      }, 500);
    });
  },

  // Subscriptions
  getSubscriptions: async (): Promise<Subscription[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSubscriptions);
      }, 500);
    });
  },

  // Analytics
  getAnalytics: async (): Promise<Analytics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAnalytics: Analytics = {
          id: 'analytics_1',
          type: 'card_views',
          data: {
            totalViews: 1247,
            totalShares: 456,
            totalSaves: 234,
            totalCards: 89,
            activeUsers: 150,
            activeOrganizations: 12,
            pendingOrganizations: 3,
          },
          period: 'monthly',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
          createdAt: '2024-01-31T23:59:59Z',
        };
        resolve(mockAnalytics);
      }, 500);
    });
  },

  // Generic API methods for real backend integration
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get(url);
    return response.data;
  },

  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await api.post(url, data);
    return response.data;
  },

  put: async <T>(url: string, data: any): Promise<T> => {
    const response = await api.put(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete(url);
    return response.data;
  },

  // Username/URL check and suggestion
  checkUsernameAvailability: async (username: string) => {
    const response = await api.get(`/auth/check-username/${encodeURIComponent(username)}`);
    return response.data;
  },

  getUsernameSuggestions: async (email: string) => {
    const response = await api.get(`/auth/username-suggestions?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // B2C Users
  getAllB2CUsers: async (page: number = 1, limit: number = 10): Promise<{ users: B2CUserData[], totalUsers: number, activeUsers: number, inactiveUsers: number, totalPages: number }> => {
    const response = await api.get(`/admin/getAllUser?page=${page}&limit=${limit}`);
    console.log('Raw API response:', response.data);
    console.log('Request params - page:', page, 'limit:', limit);
    
    // Handle the new API response format: { success: true, result: { userList: [...], totalUsers: X, activeUsers: Y, inactiveUsers: Z } }
    if (response.data && response.data.success && response.data.result) {
      const result = response.data.result;
      console.log('Found result in response:', result);
      
      const totalPages = Math.ceil((result.totalUsers || 0) / limit);
      
      return {
        users: result.userList || [],
        totalUsers: result.totalUsers || 0,
        activeUsers: result.activeUsers || 0,
        inactiveUsers: result.inactiveUsers || 0,
        totalPages: totalPages
      };
    } else {
      console.error('Unexpected API response format:', response.data);
      console.error('Available keys in response.data:', response.data ? Object.keys(response.data) : 'No data');
      return {
        users: [],
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        totalPages: 0
      };
    }
  },

  updateB2CUserStatus: async (userId: string, isActive: boolean): Promise<{ success: boolean, user: B2CUserData, message: string }> => {
    const response = await api.patch(`/admin/updateUserIsActive/${userId}`, { isActive });
    return response.data;
  },

  // Get user details by ID
  getB2CUserById: async (userId: string): Promise<any> => {
    const response = await api.get(`/admin/getUserDetailById/${userId}`);
    console.log('User details API response:', response.data);
    return response.data;
  },
};

export default api; 