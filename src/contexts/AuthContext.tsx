import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { ROLES, ROLE_PERMISSIONS } from '../constants/roles';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for stored auth token
        const token = localStorage.getItem('authToken');
        if (token) {
          // In a real app, validate token with backend
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock login - in real app, this would be an API call
      const mockUsers = [
        {
          id: '1',
          name: 'Super Admin',
          email: 'john@twintik.com',
          role: ROLES.SUPER_ADMIN,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Platform Admin',
          email: 'alex.johnson@twintik.com',
          role: ROLES.PLATFORM_ADMIN,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Org Admin',
          email: 'sarah@techcorp.com',
          role: ROLES.ORG_ADMIN,
          organizationId: 'org1',
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Org Sub Admin',
          email: 'mike@techcorp.com',
          role: ROLES.ORG_SUB_ADMIN,
          organizationId: 'org1',
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        },
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('authToken', 'mock-token');
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userRole = user.role;
    const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
    
    return rolePermissions ? (rolePermissions as readonly string[]).includes(permission) : false;
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 