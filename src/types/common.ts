import { UserRole } from './user';

// Card Types
export interface Card {
  id: string;
  title: string;
  userId: string;
  userName: string;
  organizationId?: string;
  organizationName?: string;
  templateId?: string;
  status: 'active' | 'inactive' | 'draft';
  views: number;
  shares: number;
  saves: number;
  createdAt: string;
  updatedAt: string;
  data: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    website?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
    bio?: string;
    avatar?: string;
  };
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'creative' | 'minimal' | 'premium';
  isGlobal: boolean;
  organizationId?: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  preview: string;
  config: {
    layout: string;
    colors: string[];
    fonts: string[];
    sections: string[];
  };
  usage: number;
}

// Support & Tickets
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  organizationId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface SupportTicketFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
}

// Broadcasts & Announcements
export interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'maintenance' | 'update' | 'alert';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'superadmin' | 'platform_admin' | 'org_admin' | 'org_sub_admin' | 'b2c';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdBy: string;
  createdAt: string;
  readBy: string[];
}

export interface BroadcastFormData {
  title: string;
  message: string;
  type: 'announcement' | 'maintenance' | 'update' | 'alert';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'superadmin' | 'platform_admin' | 'org_admin' | 'org_sub_admin' | 'b2c';
  startDate: string;
  endDate?: string;
}

// Theme Manager
export interface ThemeSettings {
  id: string;
  organizationId: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logo?: string;
  customCSS?: string;
  restrictions: {
    allowUserCustomization: boolean;
    allowLogoUpload: boolean;
    allowColorChanges: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ThemeFormData {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logo?: File;
  restrictions: {
    allowUserCustomization: boolean;
    allowLogoUpload: boolean;
    allowColorChanges: boolean;
  };
}

// Platform Settings
export interface PlatformSettings {
  id: string;
  key: string;
  value: string;
  category: 'general' | 'security' | 'billing' | 'features' | 'notifications';
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
  comingSoon?: boolean;
  children?: NavigationItem[];
} 