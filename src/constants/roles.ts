import { UserRole } from '../types';

export const ROLES = {
  SUPER_ADMIN: 'super_admin' as UserRole,
  PLATFORM_ADMIN: 'platform_admin' as UserRole,
  ORG_ADMIN: 'org_admin' as UserRole,
  ORG_SUB_ADMIN: 'org_sub_admin' as UserRole,
  SUB_ADMIN: 'sub_admin' as UserRole,
  EDITOR: 'editor' as UserRole,
  VIEWER: 'viewer' as UserRole,
} as const;

export const PERMISSIONS = {
  // Super Admin permissions (highest level)
  MANAGE_PLATFORM_ADMINS: 'manage_platform_admins',
  MANAGE_ORGANIZATIONS: 'manage_organizations',
  VIEW_PLATFORM_ANALYTICS: 'view_platform_analytics',
  MANAGE_GLOBAL_SETTINGS: 'manage_global_settings',
  MANAGE_SUBSCRIPTION_PLANS: 'manage_subscription_plans',
  MANAGE_B2C_USERS: 'manage_b2c_users',
  PROCESS_NFC_REQUESTS: 'process_nfc_requests',
  MANAGE_BROADCASTS: 'manage_broadcasts',
  VIEW_ACTIVITY_LOGS: 'view_activity_logs',
  MANAGE_SUPPORT_TICKETS: 'manage_support_tickets',
  
  // Org Admin permissions (organization level)
  MANAGE_ORG_USERS: 'manage_org_users',
  MANAGE_CARD_TEMPLATES: 'manage_card_templates',
  MANAGE_NFC_SETTINGS: 'manage_nfc_settings',
  MANAGE_THEME: 'manage_theme',
  VIEW_SUBSCRIPTION_DETAILS: 'view_subscription_details',
  VIEW_VIEWER_LOGS: 'view_viewer_logs',
  MANAGE_ORG_SETTINGS: 'manage_org_settings',
  VIEW_ORG_ANALYTICS: 'view_org_analytics',
  RAISE_SUPPORT_TICKETS: 'raise_support_tickets',
  
  // Org Sub Admin permissions (limited)
  VIEW_ASSIGNED_USERS: 'view_assigned_users',
  MANAGE_ASSIGNED_USERS: 'manage_assigned_users',
  VIEW_BASIC_ANALYTICS: 'view_basic_analytics',
  
  // Sub Admin permissions
  MANAGE_SUB_ORG_USERS: 'manage_sub_org_users',
  VIEW_SUB_ORG_ANALYTICS: 'view_sub_org_analytics',
  
  // Editor permissions
  EDIT_CARDS: 'edit_cards',
  VIEW_CARDS: 'view_cards',
} as const;

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_PLATFORM_ADMINS,
    PERMISSIONS.MANAGE_ORGANIZATIONS,
    PERMISSIONS.VIEW_PLATFORM_ANALYTICS,
    PERMISSIONS.MANAGE_GLOBAL_SETTINGS,
    PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS,
    PERMISSIONS.MANAGE_B2C_USERS,
    PERMISSIONS.PROCESS_NFC_REQUESTS,
    PERMISSIONS.MANAGE_BROADCASTS,
    PERMISSIONS.VIEW_ACTIVITY_LOGS,
    PERMISSIONS.MANAGE_SUPPORT_TICKETS,
  ],
  [ROLES.PLATFORM_ADMIN]: [
    PERMISSIONS.MANAGE_ORGANIZATIONS,
    PERMISSIONS.VIEW_PLATFORM_ANALYTICS,
    PERMISSIONS.MANAGE_GLOBAL_SETTINGS,
    PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS,
    PERMISSIONS.MANAGE_B2C_USERS,
    PERMISSIONS.PROCESS_NFC_REQUESTS,
    PERMISSIONS.MANAGE_BROADCASTS,
    PERMISSIONS.VIEW_ACTIVITY_LOGS,
    PERMISSIONS.MANAGE_SUPPORT_TICKETS,
  ],
  [ROLES.ORG_ADMIN]: [
    PERMISSIONS.MANAGE_ORG_USERS,
    PERMISSIONS.MANAGE_CARD_TEMPLATES,
    PERMISSIONS.MANAGE_NFC_SETTINGS,
    PERMISSIONS.MANAGE_THEME,
    PERMISSIONS.VIEW_SUBSCRIPTION_DETAILS,
    PERMISSIONS.VIEW_VIEWER_LOGS,
    PERMISSIONS.MANAGE_ORG_SETTINGS,
    PERMISSIONS.VIEW_ORG_ANALYTICS,
    PERMISSIONS.RAISE_SUPPORT_TICKETS,
  ],
  [ROLES.ORG_SUB_ADMIN]: [
    PERMISSIONS.VIEW_ASSIGNED_USERS,
    PERMISSIONS.MANAGE_ASSIGNED_USERS,
    PERMISSIONS.VIEW_BASIC_ANALYTICS,
  ],
  [ROLES.SUB_ADMIN]: [
    PERMISSIONS.MANAGE_SUB_ORG_USERS,
    PERMISSIONS.VIEW_SUB_ORG_ANALYTICS,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.EDIT_CARDS,
    PERMISSIONS.VIEW_CARDS,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_CARDS,
  ],
} as const;

export const ROLE_DISPLAY_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.PLATFORM_ADMIN]: 'Platform Admin',
  [ROLES.ORG_ADMIN]: 'Organization Admin',
  [ROLES.ORG_SUB_ADMIN]: 'Organization Sub Admin',
  [ROLES.SUB_ADMIN]: 'Sub Admin',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.VIEWER]: 'Viewer',
} as const;

export const ROLE_DESCRIPTIONS = {
  [ROLES.SUPER_ADMIN]: 'Full platform control with ability to manage platform admins and global settings',
  [ROLES.PLATFORM_ADMIN]: 'Platform-level management assisting Super Admin with organizations and global features',
  [ROLES.ORG_ADMIN]: 'Organization-level management with user and template control',
  [ROLES.ORG_SUB_ADMIN]: 'Limited access for managing assigned users and basic operations',
  [ROLES.SUB_ADMIN]: 'Sub-organization management with limited user control',
  [ROLES.EDITOR]: 'Can edit and view cards within assigned scope',
  [ROLES.VIEWER]: 'Read-only access to view cards and basic information',
} as const; 