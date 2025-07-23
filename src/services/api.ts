import axios, { InternalAxiosRequestConfig } from 'axios';
import { User, Organization, NFCCard, CardTemplate, Subscription, Analytics } from '../types';
import { 
  mockUsers, 
  mockOrganizations, 
  mockNFCCards, 
  mockCardTemplates, 
  mockSubscriptions 
} from '../data/mockData';

// Configure axios defaults
const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log(api.defaults.baseURL);

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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Removed redirect
      // Optionally, show a toast or set an error state here
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
          // Mock login - in real app, this would be a POST request
      const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      return { user: foundUser, token: 'mock-token' };
    }
    
    throw new Error('Invalid credentials');
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
};

export default api; 