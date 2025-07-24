// User Types
export type UserRole = 'superadmin' | 'platform_admin' | 'org_admin' | 'org_sub_admin' | 'sub_admin' | 'editor' | 'viewer';

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

export interface FFUser {
  id: string;
  fullName: string;
  email: string;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  onboardingToken: string;
  onboardingLink: string;
  invitedBy: string;
  invitedAt: string;
  linkOpenedAt?: string;
  profileSubmittedAt?: string;
  nfcConfiguredAt?: string;
  tokenExpiresAt: string;
  profileData?: {
    // Basic Info
    jobTitle?: string;
    company?: string;
    website?: string;
    profileUrl?: string;
    
    // Contact Details
    email?: string;
    additionalEmails?: string[];
    phone?: string;
    additionalPhones?: string[];
    
    // Address
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    
    // Social Links
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
      github?: string;
      [key: string]: string | undefined;
    };
    
    // Custom Social Links
    customSocialLinks?: Array<{
      platform: string;
      url: string;
    }>;
    
    // Profile Picture
    profilePicture?: string;
    
    // Bio
    bio?: string;
  };
  settings?: {
    autoExpiryDays: number;
    isActive: boolean;
  };
}

export interface FFUserInviteData {
  fullName: string;
  email: string;
}

export interface FFUserSettings {
  maxActiveSlots: number;
  autoExpiryDays: number;
  isEnabled: boolean;
}

export interface FFUserToken {
  token: string;
  userId: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
} 