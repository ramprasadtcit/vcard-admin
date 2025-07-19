import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, NotificationProvider } from './contexts';
import RouteGuard from './components/RouteGuard';
import Layout from './components/Layout';

// Import pages from organized structure
import {
  Login,
  Dashboard,
  SuperAdminDashboard,
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
  OrgSettingsNew
} from './pages';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
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
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
