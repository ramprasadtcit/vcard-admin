// User Types
export type UserRole = 'super_admin' | 'platform_admin' | 'org_admin' | 'org_sub_admin' | 'sub_admin' | 'editor' | 'viewer';

export interface PlatformAdmin {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: {
    canManageOrganizations: boolean;
    canManagePlatformAdmins: boolean;
    canManageSubscriptionPlans: boolean;
    canViewAnalytics: boolean;
    canManageNFCRequests: boolean;
    canManageBroadcasts: boolean;
    canManageSupportTickets: boolean;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  subOrgId?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  invitedBy?: string;
  invitationToken?: string;
  invitationExpires?: string;
  permissions?: {
    canEditProfile: boolean;
    canEditTheme: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canManageNFC: boolean;
    canManageTemplates: boolean;
  };
}

export interface B2CUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  subscriptionId?: string;
  subscriptionPlanId?: string;
  subscriptionPlan?: any; // Will be imported from subscription types
  nfcCards: any[]; // Will be imported from nfc types
  nfcCardId?: string;
  totalViews: number;
  createdAt: string;
  lastLogin?: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  status: 'active' | 'inactive';
}

// Org Admin Types
export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'sub_admin';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  invitedBy: string;
  invitationStatus: 'pending' | 'accepted' | 'expired';
  cardCount: number;
  totalViews: number;
  permissions: {
    canEditProfile: boolean;
    canEditTheme: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canManageNFC: boolean;
  };
}

export interface EndUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'sub_admin';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  invitedBy: string;
  invitationStatus: 'pending' | 'accepted' | 'expired';
  cardStatus: 'published' | 'draft' | 'none';
  cardId?: string;
  totalViews: number;
  permissions: {
    canEditProfile: boolean;
    canEditTheme: boolean;
    canViewAnalytics: boolean;
    canManageNFC: boolean;
  };
  botEnabled: boolean;
  lastBotInteraction?: string;
  totalBotInteractions: number;
}

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: 'org_sub_admin';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  invitedBy: string;
  invitationStatus: 'pending' | 'accepted' | 'expired';
  permissions: {
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canManageNFC: boolean;
    canManageSettings: boolean;
  };
} 