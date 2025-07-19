# VCard Admin - Project Structure

This document outlines the organized and optimized project structure for the VCard Admin application.

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── index.ts         # Component exports
│   ├── Layout.tsx       # Main layout component
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── TopBar.tsx       # Top navigation bar
│   ├── RouteGuard.tsx   # Route protection component
│   ├── Avatar.tsx       # Avatar component
│   ├── UserAvatar.tsx   # User avatar component
│   ├── SimpleTable.tsx  # Reusable table component
│   ├── NotificationToast.tsx # Notification component
│   ├── ComingSoonOverlay.tsx # Coming soon overlay
│   ├── InviteUserModal.tsx   # User invitation modal
│   ├── ProfilePictureModal.tsx # Profile picture modal
│   ├── PhaseRoadmap.tsx # Feature roadmap component
│   └── superadmin/      # Super admin specific components
│       ├── index.ts
│       ├── B2CUsersTab.tsx
│       └── OrganizationsTab.tsx
│
├── contexts/            # React contexts
│   ├── index.ts        # Context exports
│   ├── AuthContext.tsx # Authentication context
│   └── NotificationContext.tsx # Notification context
│
├── pages/              # Page components organized by feature
│   ├── index.ts        # Page exports
│   ├── auth/           # Authentication pages
│   │   └── Login.tsx
│   ├── dashboard/      # Dashboard pages
│   │   ├── Dashboard.tsx
│   │   └── SuperAdminDashboard.tsx
│   ├── users/          # User management pages
│   │   ├── Users.tsx
│   │   ├── UserDetail.tsx
│   │   ├── B2CUsers.tsx
│   │   ├── PlatformAdmins.tsx
│   │   └── AssignedUsers.tsx
│   ├── organizations/  # Organization pages
│   │   ├── Organizations.tsx
│   │   ├── OrganizationDetail.tsx
│   │   └── OrganizationUserDetail.tsx
│   ├── org/            # Organization admin pages
│   │   ├── OrgUsers.tsx
│   │   ├── OrgSubAdmins.tsx
│   │   ├── OrgSettings.tsx
│   │   ├── OrgSettingsNew.tsx
│   │   ├── OrgCustomizationPage.tsx
│   │   ├── OrgAvatarSettingsPage.tsx
│   │   ├── OrgBotSettings.tsx
│   │   └── OrgLogs.tsx
│   ├── nfc/            # NFC related pages
│   │   ├── NFCRequests.tsx
│   │   ├── NFCSettings.tsx
│   │   ├── OperationsNFCRequests.tsx
│   │   ├── OperationsNFCRequestDetail.tsx
│   │   └── OrgNFCRequests.tsx
│   ├── subscription/   # Subscription pages
│   │   ├── SubscriptionPlans.tsx
│   │   ├── SubscriptionManagement.tsx
│   │   └── SubscriptionDetails.tsx
│   ├── cards/          # Card management pages
│   │   ├── CardTemplates.tsx
│   │   └── CardAssignment.tsx
│   ├── analytics/      # Analytics pages
│   │   ├── Analytics.tsx
│   │   ├── ActivityLogs.tsx
│   │   ├── Logs.tsx
│   │   └── ViewerLogs.tsx
│   ├── settings/       # Settings pages
│   │   ├── Settings.tsx
│   │   ├── RolesPermissions.tsx
│   │   ├── AccessControl.tsx
│   │   ├── Branding.tsx
│   │   └── ThemeManager.tsx
│   ├── support/        # Support pages
│   │   ├── SupportTickets.tsx
│   │   └── Broadcasts.tsx
│   ├── Profile.tsx     # User profile page
│   └── Roadmap.tsx     # Feature roadmap page
│
├── types/              # TypeScript type definitions
│   ├── index.ts        # Type exports
│   ├── user.ts         # User-related types
│   ├── organization.ts # Organization-related types
│   ├── nfc.ts          # NFC-related types
│   ├── subscription.ts # Subscription-related types
│   ├── analytics.ts    # Analytics-related types
│   └── common.ts       # Common/shared types
│
├── services/           # API and service functions
│   ├── index.ts        # Service exports
│   └── api.ts          # API service functions
│
├── constants/          # Application constants
│   ├── index.ts        # Constant exports
│   ├── routes.ts       # Route definitions
│   └── roles.ts        # Role definitions
│
├── hooks/              # Custom React hooks
│   └── index.ts        # Hook exports
│
├── utils/              # Utility functions
│   └── index.ts        # Utility exports
│
├── data/               # Mock data and static data
│   └── mockData.ts     # Mock data for development
│
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.css           # Global styles
└── App.css             # App-specific styles
```

## Key Improvements

### 1. **Organized Type Definitions**
- Split the large `types/index.ts` file into domain-specific files
- Better separation of concerns for type definitions
- Easier to maintain and extend

### 2. **Feature-Based Page Organization**
- Pages are now organized by feature/domain
- Related pages are grouped together
- Easier to find and maintain related functionality

### 3. **Centralized Exports**
- All components, pages, types, and services are exported from index files
- Cleaner import statements throughout the application
- Better dependency management

### 4. **Consolidated Contexts**
- Removed duplicate context directories
- All contexts are now in the `contexts/` directory
- Consistent import paths

### 5. **Component Organization**
- Components are organized by purpose (layout, UI, modals, etc.)
- Super admin specific components are in their own directory
- Better reusability and maintainability

### 6. **Service Layer Structure**
- Prepared for future service organization
- API services are centralized
- Ready for domain-specific service files

## Import Examples

### Before (Old Structure)
```typescript
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Dashboard from './pages/Dashboard';
import { User, Organization } from './types';
```

### After (New Structure)
```typescript
import { AuthProvider, NotificationProvider } from './contexts';
import { Dashboard } from './pages';
import { User, Organization } from './types';
```

## Benefits

1. **Maintainability**: Easier to find and modify code
2. **Scalability**: Structure supports growth and new features
3. **Readability**: Clear organization makes code easier to understand
4. **Reusability**: Better component and utility organization
5. **Type Safety**: Organized type definitions improve TypeScript experience
6. **Performance**: Better tree-shaking and bundle optimization

## Next Steps

1. **Service Organization**: Create domain-specific service files
2. **Custom Hooks**: Add reusable custom hooks
3. **Utility Functions**: Add common utility functions
4. **Component Optimization**: Break down large page components
5. **Testing Structure**: Add organized test files
6. **Documentation**: Add component and API documentation 