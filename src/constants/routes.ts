import { UserRole } from '../types/user';

export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Main routes
  DASHBOARD: '/dashboard',
  
  // Super Admin & Platform Admin routes
  PLATFORM_ADMINS: '/platform-admins',
  SUBSCRIPTION_PLANS: '/subscription-plans',
  ORGANIZATIONS: '/organizations',
  NFC_REQUESTS: '/nfc-requests',
  OPERATIONS_NFC_REQUESTS: '/operations/nfc-requests',
  OPERATIONS_NFC_REQUEST_DETAIL: '/operations/nfc-requests/:requestId',
  BROADCASTS: '/broadcasts',
  ACTIVITY_LOGS: '/activity-logs',
  SUPPORT_TICKETS: '/support-tickets',
  B2C_USERS: '/b2c-users',
  FNF_ONBOARDING: '/admin/fnf-onboarding',
  FNF_USER_DETAIL: '/admin/fnf-onboarding/user/:userId',
  FNF_USER_EDIT: '/admin/fnf-onboarding/user/:userId/edit',
  FNF_BULK_IMPORT: '/admin/fnf-onboarding/bulk-import',
  
  // Org Admin routes
  USERS: '/users',
  CARD_TEMPLATES: '/card-templates',
  NFC_SETTINGS: '/nfc-settings',
  THEME_MANAGER: '/theme-manager',
  SUBSCRIPTION_DETAILS: '/subscription-details',
  VIEWER_LOGS: '/viewer-logs',
  ORG_SETTINGS: '/org-settings',
  
  // New Org Admin routes
  ORG_USERS: '/org/users',
  ORG_USER_DETAIL: '/org/users/:userId',
  ORG_SUB_ADMINS: '/org/sub-admins',
  ORG_CUSTOMIZATION: '/org/customization',
  ORG_NFC_REQUESTS: '/org/nfc-requests',
  ORG_AVATAR_SETTINGS: '/org/avatar-settings',
  ORG_BOT_SETTINGS: '/org/bot-settings',
  ORG_LOGS: '/org/logs',
  ORG_SETTINGS_NEW: '/org/settings',
  
  // Org Sub Admin routes
  ASSIGNED_USERS: '/assigned-users',
  
  // Common routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const ROUTE_PERMISSIONS = {
  [ROUTES.DASHBOARD]: ['super_admin', 'platform_admin', 'org_admin', 'org_sub_admin'],
  [ROUTES.PLATFORM_ADMINS]: ['super_admin'],
  [ROUTES.SUBSCRIPTION_PLANS]: ['super_admin', 'platform_admin'],
  [ROUTES.ORGANIZATIONS]: ['super_admin', 'platform_admin'],
  [ROUTES.NFC_REQUESTS]: ['super_admin', 'platform_admin'],
  [ROUTES.OPERATIONS_NFC_REQUESTS]: ['super_admin', 'platform_admin'],
  [ROUTES.OPERATIONS_NFC_REQUEST_DETAIL]: ['super_admin', 'platform_admin'],
  [ROUTES.BROADCASTS]: ['super_admin', 'platform_admin'],
  [ROUTES.ACTIVITY_LOGS]: ['super_admin', 'platform_admin'],
  [ROUTES.SUPPORT_TICKETS]: ['super_admin', 'platform_admin', 'org_admin', 'org_sub_admin'],
  [ROUTES.B2C_USERS]: ['super_admin', 'platform_admin'],
  [ROUTES.FNF_ONBOARDING]: ['super_admin'],
  [ROUTES.FNF_USER_DETAIL]: ['super_admin'],
  [ROUTES.FNF_USER_EDIT]: ['super_admin'],
  [ROUTES.FNF_BULK_IMPORT]: ['super_admin'],
  [ROUTES.USERS]: ['org_admin'],
  [ROUTES.CARD_TEMPLATES]: ['org_admin'],
  [ROUTES.NFC_SETTINGS]: ['org_admin'],
  [ROUTES.THEME_MANAGER]: ['org_admin'],
  [ROUTES.SUBSCRIPTION_DETAILS]: ['org_admin'],
  [ROUTES.VIEWER_LOGS]: ['org_admin', 'org_sub_admin'],
  [ROUTES.ORG_SETTINGS]: ['org_admin'],
  [ROUTES.ASSIGNED_USERS]: ['org_sub_admin'],
  [ROUTES.PROFILE]: ['super_admin', 'platform_admin', 'org_admin', 'org_sub_admin'],
  [ROUTES.SETTINGS]: ['super_admin', 'platform_admin', 'org_admin'],
  
  // New Org Admin route permissions
  [ROUTES.ORG_USERS]: ['org_admin'],
  [ROUTES.ORG_USER_DETAIL]: ['org_admin'],
  [ROUTES.ORG_SUB_ADMINS]: ['org_admin'],
  [ROUTES.ORG_CUSTOMIZATION]: ['org_admin'],
  [ROUTES.ORG_NFC_REQUESTS]: ['org_admin'],
  [ROUTES.ORG_AVATAR_SETTINGS]: ['org_admin'],
  [ROUTES.ORG_BOT_SETTINGS]: ['org_admin'],
  [ROUTES.ORG_LOGS]: ['org_admin'],
  [ROUTES.ORG_SETTINGS_NEW]: ['org_admin'],
} as const;

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
  comingSoon?: boolean;
  children?: NavigationItem[];
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'Home',
    roles: ['super_admin', 'platform_admin', 'org_admin', 'org_sub_admin'],
  },
  
  // Super Admin & Platform Admin Navigation
  {
    label: 'Platform Management',
    path: '/platform',
    icon: 'Shield',
    roles: ['super_admin', 'platform_admin'],
    children: [
      {
        label: 'Platform Admins',
        path: ROUTES.PLATFORM_ADMINS,
        icon: 'Users',
        roles: ['super_admin'],
      },
      {
        label: 'Subscription Plans',
        path: ROUTES.SUBSCRIPTION_PLANS,
        icon: 'CreditCard',
        roles: ['super_admin', 'platform_admin'],
      },
      {
        label: 'Organizations',
        path: ROUTES.ORGANIZATIONS,
        icon: 'Building',
        roles: ['super_admin', 'platform_admin'],
      },
      {
        label: 'B2C Users',
        path: ROUTES.B2C_USERS,
        icon: 'UserCheck',
        roles: ['super_admin', 'platform_admin'],
      },
      {
        label: 'F&F Onboarding',
        path: ROUTES.FNF_ONBOARDING,
        icon: 'UserPlus',
        roles: ['super_admin'],
      },
    ],
  },
  
  {
    label: 'Operations',
    path: '/operations',
    icon: 'Settings',
    roles: ['super_admin', 'platform_admin'],
    children: [
      {
        label: 'NFC Requests',
        path: ROUTES.OPERATIONS_NFC_REQUESTS,
        icon: 'Smartphone',
        roles: ['super_admin', 'platform_admin'],
      },
      {
        label: 'Broadcasts',
        path: ROUTES.BROADCASTS,
        icon: 'Megaphone',
        roles: ['super_admin', 'platform_admin'],
      },
      {
        label: 'Activity Logs',
        path: ROUTES.ACTIVITY_LOGS,
        icon: 'Activity',
        roles: ['super_admin', 'platform_admin'],
      },
      {
        label: 'Support Tickets',
        path: ROUTES.SUPPORT_TICKETS,
        icon: 'Headphones',
        roles: ['super_admin', 'platform_admin'],
      },
    ],
  },
  
  // Org Admin Navigation
  {
    label: 'Organization',
    path: '/organization',
    icon: 'Building',
    roles: ['org_admin'],
    children: [
      {
        label: 'My Users',
        path: ROUTES.ORG_USERS,
        icon: 'Users',
        roles: ['org_admin'],
      },
      {
        label: 'Sub Admins',
        path: ROUTES.ORG_SUB_ADMINS,
        icon: 'UserCheck',
        roles: ['org_admin'],
      },
      {
        label: 'Customization',
        path: ROUTES.ORG_CUSTOMIZATION,
        icon: 'Palette',
        roles: ['org_admin'],
      },
      {
        label: 'NFC Requests',
        path: ROUTES.ORG_NFC_REQUESTS,
        icon: 'Smartphone',
        roles: ['org_admin'],
      },
      {
        label: 'Bot Settings',
        path: ROUTES.ORG_BOT_SETTINGS,
        icon: 'Bot',
        roles: ['org_admin'],
      },
      {
        label: 'Viewer Logs',
        path: ROUTES.ORG_LOGS,
        icon: 'Eye',
        roles: ['org_admin'],
      },
      {
        label: 'Settings',
        path: ROUTES.ORG_SETTINGS_NEW,
        icon: 'Settings',
        roles: ['org_admin'],
      },
    ],
  },
  
  // Org Sub Admin Navigation
  {
    label: 'Team Management',
    path: '/team',
    icon: 'Users',
    roles: ['org_sub_admin'],
    children: [
      {
        label: 'Assigned Users',
        path: ROUTES.ASSIGNED_USERS,
        icon: 'Users',
        roles: ['org_sub_admin'],
      },
      {
        label: 'Viewer Logs',
        path: ROUTES.VIEWER_LOGS,
        icon: 'Eye',
        roles: ['org_sub_admin'],
      },
    ],
  },
  
  // Common Navigation
  {
    label: 'Support',
    path: ROUTES.SUPPORT_TICKETS,
    icon: 'Headphones',
    roles: ['org_admin', 'org_sub_admin'],
  },
  
  {
    label: 'Profile',
    path: ROUTES.PROFILE,
    icon: 'User',
    roles: ['super_admin', 'platform_admin', 'org_admin', 'org_sub_admin'],
  },
]; 