import React, { createContext, useContext, useState, useMemo } from 'react';
import { FFUser } from '../types/user';
import { mockFFUsers } from '../data/mockData';

interface FFUsersContextType {
  ffUsers: FFUser[];
  addFFUsers: (users: FFUser[]) => void;
  updateFFUser: (userId: string, updates: Partial<FFUser>) => void;
  deleteFFUser: (userId: string) => void;
  getStats: () => {
    invited: number;
    completed: number;
    inviteExpired: number;
  };
}

const FFUsersContext = createContext<FFUsersContextType | undefined>(undefined);

export const useFFUsers = () => {
  const context = useContext(FFUsersContext);
  if (context === undefined) {
    throw new Error('useFFUsers must be used within a FFUsersProvider');
  }
  return context;
};

interface FFUsersProviderProps {
  children: React.ReactNode;
}

export const FFUsersProvider: React.FC<FFUsersProviderProps> = ({ children }) => {
  const [ffUsers, setFFUsers] = useState<FFUser[]>(mockFFUsers);

  const addFFUsers = (users: FFUser[]) => {
    setFFUsers(prev => [...users, ...prev]);
  };

  const updateFFUser = (userId: string, updates: Partial<FFUser>) => {
    setFFUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const deleteFFUser = (userId: string) => {
    setFFUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getStats = () => {
    // Invited: Total number of invitations sent
    const invited = ffUsers.length;
    // Completed: People who have completed their profile
    const completed = ffUsers.filter(u => u.status === 'completed').length;
    // Invite Expired: People with expired invitations
    const inviteExpired = ffUsers.filter(user => {
      if (user.status === 'pending' && user.tokenExpiresAt) {
        const now = new Date();
        const expiresAt = new Date(user.tokenExpiresAt);
        return now > expiresAt;
      }
      return user.status === 'expired';
    }).length;

    return { invited, completed, inviteExpired };
  };

  const value = useMemo(() => ({
    ffUsers,
    addFFUsers,
    updateFFUser,
    deleteFFUser,
    getStats,
  }), [ffUsers]);

  return (
    <FFUsersContext.Provider value={value}>
      {children}
    </FFUsersContext.Provider>
  );
}; 