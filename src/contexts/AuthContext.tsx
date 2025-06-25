import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { httpClient } from '../utils/httpClient';
import { ApiError } from '../utils/httpClient';
import { useTranslation } from '../hooks/useTranslation';
import { debugAuthState } from '../constants/app';
import {
  User,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthContextType,
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Initialize auth state on app startup
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state từ localStorage
   */
  const initializeAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🚀 AuthContext: Initializing authentication state');

      // Debug current auth state
      debugAuthState();

      // Check if user is authenticated
      if (authService.isAuthenticated()) {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        console.log('📋 AuthContext: Checking stored auth data');
        console.log('- Stored token exists:', !!storedToken);
        console.log('- Stored user exists:', !!storedUser);

        if (storedToken && storedUser) {
          // Set token in HTTP client immediately
          httpClient.setAuthToken(storedToken);
          console.log('🔧 AuthContext: HTTP client token restored');

          setToken(storedToken);
          setUser(storedUser);
          
          console.log('✅ AuthContext: Auth state restored from localStorage');
          
          // NOTE: Không cần refresh user data từ server vì:
          // 1. User data đã được tạo từ login response 
          // 2. Employee details sẽ được fetch riêng bằng useCurrentEmployee hook
          // 3. Endpoint /api/v1/user/profile không tồn tại trong backend
        } else {
          console.log('❌ AuthContext: Invalid stored auth data, clearing');
          await logout();
        }
      } else {
        console.log('❌ AuthContext: No valid authentication found');
        // Clear invalid auth data
        await logout();
      }
    } catch (error) {
      console.error('❌ AuthContext: Failed to initialize auth:', error);
      await logout();
    } finally {
      setIsLoading(false);
      console.log('✅ AuthContext: Authentication initialization completed');
      // Debug final auth state
      debugAuthState();
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      console.log('🔐 AuthContext: Attempting login');
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        // authService.login() đã store user data trong localStorage
        // Lấy user data từ localStorage thay vì response.data.user (không tồn tại)
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();
        
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
          console.log('✅ AuthContext: Login successful');
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        throw new Error(response.message || t('messages.loginFailed'));
      }
    } catch (error) {
      console.error('❌ AuthContext: Login failed', error);
      
      // Clear any partial auth state
      setUser(null);
      setToken(null);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      } else {
        throw new Error(t('messages.loginFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      console.log('📝 AuthContext: Attempting registration');
      const response = await authService.register(userData);

      if (response.success && response.data) {
        // authService.register() đã store user data trong localStorage
        // Lấy user data từ localStorage thay vì response.data.user (không tồn tại)
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();
        
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
          console.log('✅ AuthContext: Registration successful');
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        throw new Error(response.message || t('messages.addFailed'));
      }
    } catch (error) {
      console.error('❌ AuthContext: Registration failed', error);
      
      // Clear any partial auth state
      setUser(null);
      setToken(null);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      } else {
        throw new Error(t('messages.addFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🚪 AuthContext: Logging out');
      
      await authService.logout();
    } catch (error) {
      console.error('⚠️ AuthContext: Logout error', error);
    } finally {
      // Always clear local state regardless of API call result
      setUser(null);
      setToken(null);
      setIsLoading(false);
      console.log('✅ AuthContext: Logout completed');
    }
  };

  /**
   * Refresh access token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      console.log('🔄 AuthContext: Refreshing token');
      
      const response = await authService.refreshToken();
      
      if (response.success && response.data) {
        setToken(response.data.token);
        console.log('✅ AuthContext: Token refreshed');
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('❌ AuthContext: Token refresh failed', error);
      await logout();
      throw error;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('✏️ AuthContext: Updating profile');
      
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      console.log('✅ AuthContext: Profile updated');
    } catch (error) {
      console.error('❌ AuthContext: Failed to update profile', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      } else {
        throw new Error(t('messages.updateFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Change user password
   */
  const changePassword = async (passwords: ChangePasswordRequest): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔑 AuthContext: Changing password');
      
      await authService.changePassword(passwords);
      console.log('✅ AuthContext: Password changed');
    } catch (error) {
      console.error('❌ AuthContext: Failed to change password', error);
      
      if (error instanceof ApiError) {
        throw new Error(error.message);
      } else {
        throw new Error(t('messages.updateFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token && authService.isAuthenticated();

  // Auto-refresh token khi sắp hết hạn
  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.log('🔄 AuthContext: Skipping auto-refresh - not authenticated or no token');
      return;
    }

    // Skip auto-refresh for mock tokens
    if (token.startsWith('mock-token-')) {
      console.log('🔄 AuthContext: Skipping auto-refresh for mock token');
      return;
    }

    try {
      // Parse token để lấy expiration time
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Validate payload has required fields
      if (!payload.exp || typeof payload.exp !== 'number') {
        console.warn('⚠️ AuthContext: Token missing or invalid exp field, skipping auto-refresh');
        return;
      }

      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      console.log('🔄 AuthContext: Token auto-refresh check:', {
        expirationTime: new Date(expirationTime).toISOString(),
        timeUntilExpiration: Math.floor(timeUntilExpiration / 1000 / 60) + ' minutes',
        willRefresh: timeUntilExpiration > (5 * 60 * 1000) && timeUntilExpiration < (60 * 60 * 1000)
      });

      // Only setup auto-refresh if token expires in reasonable time (5 min to 1 hour)
      const refreshTime = timeUntilExpiration - (5 * 60 * 1000); // 5 minutes before expiry
      const maxRefreshTime = 60 * 60 * 1000; // 1 hour max

      if (refreshTime > 0 && refreshTime < maxRefreshTime) {
        console.log('⏰ AuthContext: Setting up auto-refresh in', Math.floor(refreshTime / 1000 / 60), 'minutes');
        
        const refreshTimer = setTimeout(() => {
          console.log('🔄 AuthContext: Auto-refresh triggered');
          refreshToken().catch((error) => {
            console.error('❌ Auto token refresh failed:', error);
            // Don't logout on auto-refresh failure - let user continue with current token
          });
        }, refreshTime);

        return () => {
          console.log('🧹 AuthContext: Clearing auto-refresh timer');
          clearTimeout(refreshTimer);
        };
      } else if (timeUntilExpiration <= 0) {
        console.warn('❌ AuthContext: Token already expired, clearing auth state');
        logout();
      } else {
        console.log('ℹ️ AuthContext: Token expires too far in future, skipping auto-refresh');
      }
    } catch (error) {
      console.error('❌ AuthContext: Failed to parse token for auto-refresh:', error);
      // Don't logout on parse error - token might still be valid for API calls
    }
  }, [token, isAuthenticated]); // Keep dependencies but add better guards

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    debugAuthState,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};