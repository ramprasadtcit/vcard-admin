import { UserRole } from './user';

// Dashboard Stats
export interface DashboardStats {
  // Super Admin & Platform Admin Stats
  totalOrganizations: number;
  activeOrganizations: number;
  pendingOrganizations: number;
  totalB2CUsers: number;
  activeB2CUsers: number;
  totalNFCRequests: number;
  pendingNFCRequests: number;
  totalRevenue: number;
  monthlyRevenue: number;
  
  // Org Admin Stats
  totalUsers: number;
  activeUsers: number;
  totalCards: number;
  totalCardViews: number;
  totalCardShares: number;
  nfcCardsConfigured: number;
  nfcCardsPending: number;
  
  // Org Sub Admin Stats
  assignedUsers: number;
  assignedCards: number;
  recentActivity: number;
}

export interface OrgAdminDashboardStats {
  // User Stats (End Users Only - Excluding Sub Admins)
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  viewerCount: number;
  lastLoginData: {
    date: string;
    count: number;
  }[];
}

export interface Analytics {
  id: string;
  type: 'card_views' | 'card_shares' | 'user_activity' | 'revenue' | 'subscriptions';
  data: Record<string, any>;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  targetType: 'user' | 'organization' | 'card' | 'settings' | 'nfc' | 'template' | 'subscription';
  targetId: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  targetType: 'user' | 'organization' | 'card' | 'settings' | 'nfc' | 'template' | 'subscription';
  targetId: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ViewerLog {
  id: string;
  cardId: string;
  cardTitle: string;
  viewerIp?: string;
  viewerLocation?: string;
  viewerDevice?: string;
  action: 'view' | 'share' | 'save' | 'contact';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface OrgViewerLog {
  id: string;
  organizationId: string;
  cardId: string;
  cardTitle: string;
  viewedUser: string;
  viewerIp?: string;
  viewerLocation?: string;
  viewerDevice?: string;
  source: 'qr' | 'direct_link' | 'nfc';
  timestamp: string;
  metadata?: Record<string, any>;
} 