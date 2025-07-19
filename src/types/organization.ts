import { UserRole } from './user';

// Organization Types
export interface Organization {
  id: string;
  name: string;
  domain: string;
  adminId: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  logo?: string;
  createdAt: string;
  updatedAt: string;
  extraUsersPurchased?: number;
  subscriptionPlanId: string;
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'pending';
  subscriptionExpiresAt?: string;
  subOrgs?: SubOrganization[];
  settings: {
    allowUserInvites: boolean;
    requireApproval: boolean;
    maxUsers: number;
    allowNFC: boolean;
    allowCustomTemplates: boolean;
    allowBranding: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logo?: string;
  };
  features: {
    nfcEnabled: boolean;
    customTemplates: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
}

export interface SubOrganization {
  id: string;
  name: string;
  organizationId: string;
  adminId: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  settings: {
    allowUserInvites: boolean;
    maxUsers: number;
    allowNFC: boolean;
  };
}

export interface OrganizationFormData {
  name: string;
  domain: string;
  adminEmail: string;
  subscriptionPlanId: string;
  settings: {
    allowUserInvites: boolean;
    requireApproval: boolean;
    maxUsers: number;
    allowNFC: boolean;
    allowCustomTemplates: boolean;
    allowBranding: boolean;
  };
}

export interface OrgSettings {
  id: string;
  organizationId: string;
  name: string;
  country: string;
  industry: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  subAdmins: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrgCustomization {
  id: string;
  organizationId: string;
  logo?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  allowUserCustomization: boolean;
  allowLogoUpload: boolean;
  allowColorChanges: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrgAvatarSettings {
  id: string;
  organizationId: string;
  enableTextBasedAvatar: boolean;
  allowPhotoBasedAvatars: boolean;
  avatarUsageCost: number;
  avatarUsageLimit: number;
  currentUsage: number;
  createdAt: string;
  updatedAt: string;
}

// Re-export the unified NFCRequest interface
export type { NFCRequest as OrgNFCRequest } from './nfc';

export interface BotSettings {
  id: string;
  organizationId: string;
  botType: 'text_chat' | 'avatar';
  isEnabled: boolean;
  avatarConfig?: AvatarConfig;
  knowledgeDocuments: KnowledgeDocument[];
  userActivations: UserBotActivation[];
  createdAt: string;
  updatedAt: string;
}

export interface AvatarConfig {
  id: string;
  name: string;
  photoUrl?: string;
  backgroundUrl?: string;
  backgroundColor?: string;
  isConfigured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  uploadTime: string;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
  errorMessage?: string;
}

export interface UserBotActivation {
  userId: string;
  userName: string;
  userEmail: string;
  isEnabled: boolean;
  lastInteraction?: string;
  totalInteractions: number;
} 