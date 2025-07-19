# User Hierarchy & Access Control

## User Roles Overview

### 1. Super Admin (Platform Level)
- **Role**: `super_admin`
- **Scope**: Platform-wide access
- **Email**: `john@twintik.com`
- **Domain**: `@twintik.com` (platform domain)
- **Responsibilities**:
  - Manage all organizations
  - Approve organization registrations
  - Global platform settings
  - B2C user management
  - NFC card management
  - Subscription management
  - Card template management
  - Access control and permissions

### 2. Platform Admin (Platform Level)
- **Role**: `super_admin` (same role as Super Admin)
- **Scope**: Platform-wide access (assists Super Admin)
- **Email**: `alex.johnson@twintik.com`
- **Domain**: `@twintik.com` (platform domain)
- **Responsibilities**:
  - Same as Super Admin
  - Assists with platform management tasks
  - Backup admin for platform operations

### 3. Org Admin (Organization Level)
- **Role**: `org_admin`
- **Scope**: Organization-specific access
- **Email**: `sarah@techcorp.com`
- **Domain**: `@techcorp.com` (company domain)
- **Responsibilities**:
  - Manage organization users
  - Organization branding and settings
  - Card assignment and management
  - Organization analytics
  - NFC card configuration
  - User invitations and management

### 4. Sub Admin (Organization Level)
- **Role**: `sub_admin`
- **Scope**: Limited organization access
- **Email**: `mike@techcorp.com`
- **Domain**: `@techcorp.com` (company domain)
- **Responsibilities**:
  - View assigned team members
  - Limited card management
  - Basic analytics access
  - No user management
  - No branding changes

## Access Matrix

| Role | Users | Organizations | Analytics | Settings | NFC | Templates | B2C Users | Subscriptions |
|------|-------|---------------|-----------|----------|-----|-----------|-----------|---------------|
| Super Admin | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Platform Admin | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Org Admin | ✅ Org | ❌ | ✅ Org | ✅ Org | ✅ Org | ✅ Org | ❌ | ❌ |
| Sub Admin | ✅ View | ❌ | ✅ Limited | ❌ | ❌ | ❌ | ❌ | ❌ |

## Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | `john@twintik.com` | `password` | Platform |
| Platform Admin | `alex.johnson@twintik.com` | `password` | Platform |
| Org Admin | `sarah@techcorp.com` | `password` | Organization |
| Sub Admin | `mike@techcorp.com` | `password` | Limited |

## Organization Structure

### TechCorp Solutions
- **Domain**: `techcorp.com`
- **Admin**: Sarah Org Admin (`sarah@techcorp.com`)
- **Sub Admin**: Mike Sub Admin (`mike@techcorp.com`)

## Permission Details

### Super Admin & Platform Admin Permissions
- `canEditProfile`: ✅
- `canEditTheme`: ✅
- `canManageUsers`: ✅
- `canViewAnalytics`: ✅
- `canManageNFC`: ✅
- `canManageTemplates`: ✅

### Org Admin Permissions
- `canEditProfile`: ✅
- `canEditTheme`: ✅
- `canManageUsers`: ✅
- `canViewAnalytics`: ✅
- `canManageNFC`: ✅
- `canManageTemplates`: ✅

### Sub Admin Permissions
- `canEditProfile`: ❌
- `canEditTheme`: ❌
- `canManageUsers`: ❌
- `canViewAnalytics`: ✅
- `canManageNFC`: ❌
- `canManageTemplates`: ❌ 