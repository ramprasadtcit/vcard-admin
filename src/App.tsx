import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, NotificationProvider, FFUsersProvider } from './contexts';
import RouteGuard from './components/RouteGuard';
import Layout from './components/Layout';

// Import pages from organized structure
import {
  Login,
  Dashboard,
  PlatformAdmins,
  SubscriptionPlans,
  Organizations,
  OrganizationDetail,
  NFCRequests,
  OperationsNFCRequests,
  OperationsNFCRequestDetail,
  Broadcasts,
  ActivityLogs,
  SupportTickets,
  B2CUsers,
  UserDetail,
  OrganizationUserDetail,
  Users,
  CardTemplates,
  NFCSettings,
  ThemeManager,
  SubscriptionDetails,
  ViewerLogs,
  OrgSettings,
  AssignedUsers,
  Profile,
  OrgUsers,
  OrgUserDetail,
  OrgSubAdmins,
  OrgCustomizationPage,
  OrgNFCRequests,
  OrgAvatarSettingsPage,
  OrgBotSettings,
  OrgLogs,
  OrgSettingsNew,
  FFUserOnboarding,
  FFUserDetail,
  FFUserEdit,
  BulkImportFFUsers
} from './pages';

// Import onboarding pages separately since they're not in the pages index
import FFUserProfileSetup from './pages/onboarding/FFUserProfileSetup';
import FFUserProfileConfirmation from './pages/onboarding/FFUserProfileConfirmation';
import EmailInvitationPage from './pages/EmailInvitationPage';
import NFCConfirmationPage from './pages/NFCConfirmationPage';
import TwinTikMobileAppPage from './pages/TwinTikMobileAppPage';
import EmailTemplatesIndex from './pages/EmailTemplatesIndex';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <FFUsersProvider>
          <Router>
            <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/onboard/:token" element={<FFUserProfileSetup />} />
              <Route path="/onboard/:token/confirmation" element={<FFUserProfileConfirmation />} />
        <Route path="/email-templates" element={<EmailTemplatesIndex />} />
        <Route path="/email-invitation" element={<EmailInvitationPage />} />
        <Route path="/nfc-confirmation" element={<NFCConfirmationPage />} />
        <Route path="/twintik-mobile-app" element={<TwinTikMobileAppPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <RouteGuard>
                  <Layout />
                </RouteGuard>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Super Admin & Platform Admin routes */}
                <Route path="platform-admins" element={<PlatformAdmins />} />
                <Route path="subscription-plans" element={<SubscriptionPlans />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="organization/:organizationId" element={<OrganizationDetail />} />
                <Route path="nfc-requests" element={<NFCRequests />} />
                <Route path="operations/nfc-requests" element={<OperationsNFCRequests />} />
                <Route path="operations/nfc-requests/:requestId" element={<OperationsNFCRequestDetail />} />
                <Route path="broadcasts" element={<Broadcasts />} />
                <Route path="activity-logs" element={<ActivityLogs />} />
                <Route path="support-tickets" element={<SupportTickets />} />
                <Route path="b2c-users" element={<B2CUsers />} />
                <Route path="admin/fnf-onboarding" element={<FFUserOnboarding />} />
                <Route path="admin/fnf-onboarding/user/:userId" element={<FFUserDetail />} />
                <Route path="admin/fnf-onboarding/user/:userId/edit" element={<FFUserEdit />} />
                <Route path="admin/fnf-onboarding/bulk-import" element={<BulkImportFFUsers />} />
                <Route path="user/:userId" element={<UserDetail />} />
                <Route path="org-user/:userId" element={<OrganizationUserDetail />} />
                
                {/* Org Admin routes */}
                <Route path="users" element={<Users />} />
                <Route path="card-templates" element={<CardTemplates />} />
                <Route path="nfc-settings" element={<NFCSettings />} />
                <Route path="theme-manager" element={<ThemeManager />} />
                <Route path="subscription-details" element={<SubscriptionDetails />} />
                <Route path="viewer-logs" element={<ViewerLogs />} />
                <Route path="org-settings" element={<OrgSettings />} />
                
                {/* New Org Admin routes */}
                <Route path="org/users" element={<OrgUsers />} />
                <Route path="org/users/:userId" element={<OrgUserDetail />} />
                <Route path="org/sub-admins" element={<OrgSubAdmins />} />
                <Route path="org/customization" element={<OrgCustomizationPage />} />
                <Route path="org/nfc-requests" element={<OrgNFCRequests />} />
                <Route path="org/avatar-settings" element={<OrgAvatarSettingsPage />} />
                <Route path="org/bot-settings" element={<OrgBotSettings />} />
                <Route path="org/logs" element={<OrgLogs />} />
                <Route path="org/settings" element={<OrgSettingsNew />} />
                
                {/* Org Sub Admin routes */}
                <Route path="assigned-users" element={<AssignedUsers />} />
                
                {/* Common routes */}
                <Route path="profile" element={<Profile />} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
        </FFUsersProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
