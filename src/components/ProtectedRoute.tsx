import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading spinner while authentication is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated after initialization
  if (!isAuthenticated || !user) {
    console.log('🔒 ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute: User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;