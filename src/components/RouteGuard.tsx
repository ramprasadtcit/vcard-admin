import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTE_PERMISSIONS } from '../constants/routes';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, requiredRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role for this route
  if (requiredRoles && user) {
    const routePermissions = ROUTE_PERMISSIONS[location.pathname as keyof typeof ROUTE_PERMISSIONS];
    
    if (routePermissions && !(routePermissions as readonly string[]).includes(user.role)) {
      // User doesn't have permission for this route
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default RouteGuard; 