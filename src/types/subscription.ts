// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'b2b' | 'b2c';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  currency: string;
  description?: string;
  features: {
    maxUsers: number;
    nfcEnabled: boolean;
    avatarEnabled: boolean;
    customTemplates: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    branding: boolean;
    storageGB: number;
  };
  isPopular?: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId?: string;
  organizationId?: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  currency: string;
  paymentMethod?: string;
  autoRenew: boolean;
  createdAt: string;
  cancelledAt?: string;
  usersLimit: number;
  usersOnboarded: number;
  nfcStatus: 'none' | 'requested' | 'configured' | 'external';
  avatarUsage: boolean;
}

export interface SubscriptionPlanFormData {
  name: string;
  type: 'b2b' | 'b2c';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  currency: string;
  description?: string;
  features: {
    maxUsers: number;
    nfcEnabled: boolean;
    avatarEnabled: boolean;
    customTemplates: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    branding: boolean;
    storageGB: number;
  };
  isPopular?: boolean;
  isActive: boolean;
} 