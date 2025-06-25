import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../constants/api';
import { shouldEnableLogging } from '../constants/app';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
  ApiResponse,
} from '../types/auth';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Helper function for conditional logging
   */
  private log(message: string, ...args: any[]): void {
    if (shouldEnableLogging()) {
      console.log(message, ...args);
    }
  }

  private logError(message: string, ...args: any[]): void {
    if (shouldEnableLogging()) {
      console.error(message, ...args);
    }
  }

  private logWarn(message: string, ...args: any[]): void {
    if (shouldEnableLogging()) {
      console.warn(message, ...args);
    }
  }

  /**
   * Map Employee object từ backend thành User object cho frontend
   * @param employee - Employee object từ backend
   * @returns User object
   */
  private mapEmployeeToUser(employee: any): User {
    if (!employee) {
      this.logWarn('⚠️ No employee data received, creating default user');
      return {
        id: '1',
        username: 'unknown',
        email: '',
        fullName: 'Unknown User',
        phoneNumber: '',
        department: { id: '1', name: 'Unknown' },
        status: 'ACTIVE' as any,
        roles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    this.log('🔄 Mapping employee to user:', employee);

    return {
      id: employee.id?.toString() || '1',
      username: employee.username || employee.userName || '',
      email: employee.email || '',
      fullName: employee.fullName || employee.full_name || employee.name || '',
      phoneNumber: employee.phoneNumber || employee.phone_number || '',
      avatar: employee.avatar || undefined,
      department: {
        id: employee.department?.id?.toString() || employee.departmentId?.toString() || '1',
        name: employee.department?.name || employee.department?.departmentName || employee.departmentName || 'Unknown Department'
      },
      position: employee.position || employee.jobTitle || undefined,
      status: this.mapEmployeeStatus(employee.status || employee.active),
      roles: this.mapEmployeeRoles(employee.roles || employee.role),
      createdAt: employee.createdAt || employee.created_at || new Date().toISOString(),
      updatedAt: employee.updatedAt || employee.updated_at || new Date().toISOString(),
      lastLoginAt: employee.lastLoginAt || employee.last_login_at || undefined,
    };
  }

  /**
   * Map employee status thành UserStatus enum
   */
  private mapEmployeeStatus(status: any): any {
    if (!status) return 'ACTIVE';
    
    // Handle boolean active field
    if (typeof status === 'boolean') {
      return status ? 'ACTIVE' : 'INACTIVE';
    }
    
    // Handle string status
    const statusStr = status.toString().toUpperCase();
    const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'];
    
    return validStatuses.includes(statusStr) ? statusStr : 'ACTIVE';
  }

  /**
   * Map employee roles
   */
  private mapEmployeeRoles(roles: any): any[] {
    if (!roles) return [];
    
    // If roles is a string (single role)
    if (typeof roles === 'string') {
      return [{
        id: '1',
        name: roles,
        permissions: []
      }];
    }
    
    // If roles is array
    if (Array.isArray(roles)) {
      return roles.map((role, index) => ({
        id: role.id?.toString() || (index + 1).toString(),
        name: role.name || role.toString(),
        permissions: role.permissions || []
      }));
    }
    
    return [];
  }

  /**
   * Normalize response format từ backend về format frontend expects
   * @param rawResponse - Raw response từ backend
   * @returns Normalized AuthResponse
   */
  private normalizeAuthResponse(rawResponse: any): AuthResponse {
    this.log('🔄 AuthService: Normalizing response format');
    
    // Case 1: Backend login response format mới với employeeId
    if (rawResponse.token && rawResponse.employeeId !== undefined) {
      this.log('✅ Response format: New backend format với employeeId');
      
      // Tạo User object từ login response
      const user: User = {
        id: rawResponse.id?.toString() || '1',
        employeeId: rawResponse.employeeId?.toString() || '1',
        username: rawResponse.username || '',
        email: rawResponse.email || '',
        fullName: rawResponse.fullName || '',
        phoneNumber: '', // Sẽ lấy từ employee API sau
        avatar: undefined,
        department: {
          id: '1', // Temporary, sẽ lấy từ employee API
          name: rawResponse.departmentDisplayName || rawResponse.departmentName || 'Unknown Department',
        },
        position: undefined, // Sẽ lấy từ employee API
        role: rawResponse.role || 'USER',
        status: 'ACTIVE' as any,
        roles: [{
          id: '1',
          name: rawResponse.role || 'USER',
          permissions: []
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return {
        success: true,
        message: rawResponse.message || 'Login successful',
        data: {
          departmentDisplayName: rawResponse.departmentDisplayName,
          departmentName: rawResponse.departmentName,
          email: rawResponse.email,
          employeeId: rawResponse.employeeId,
          fullName: rawResponse.fullName,
          id: rawResponse.id,
          message: rawResponse.message,
          role: rawResponse.role,
          token: rawResponse.token,
          username: rawResponse.username,
        }
      };
    }
    
    // Case 2: Response đã đúng format (có success, data fields)
    if (rawResponse.success !== undefined && rawResponse.data) {
      this.log('✅ Response format: Standard (có success + data)');
      return rawResponse as AuthResponse;
    }
    
    // Case 3: Response có token trực tiếp (format cũ)
    if (rawResponse.token && (rawResponse.user || rawResponse.employee)) {
      this.log('✅ Response format: Direct token/user fields');
      const user = rawResponse.user || this.mapEmployeeToUser(rawResponse.employee);
      
      return {
        success: true,
        message: rawResponse.message || 'Login successful',
        data: {
          departmentDisplayName: user.department?.name || '',
          departmentName: user.department?.name || '',
          email: user.email,
          employeeId: parseInt(user.employeeId || user.id || '1'),
          fullName: user.fullName,
          id: parseInt(user.id || '1'),
          message: rawResponse.message || 'Login successful',
          role: user.role || 'USER',
          token: rawResponse.token,
          username: user.username,
        }
      };
    }

    // Case 4: Response có accessToken thay vì token
    if (rawResponse.accessToken && (rawResponse.user || rawResponse.employee)) {
      this.log('✅ Response format: accessToken field');
      const user = rawResponse.user || this.mapEmployeeToUser(rawResponse.employee);
      
      return {
        success: true,
        message: rawResponse.message || 'Login successful',
        data: {
          departmentDisplayName: user.department?.name || '',
          departmentName: user.department?.name || '',
          email: user.email,
          employeeId: parseInt(user.employeeId || user.id || '1'),
          fullName: user.fullName,
          id: parseInt(user.id || '1'),
          message: rawResponse.message || 'Login successful',
          role: user.role || 'USER',
          token: rawResponse.accessToken,
          username: user.username,
        }
      };
    }

    // Case 5: Message indicates success but different structure
    if (rawResponse.message && 
        (rawResponse.message.toLowerCase().includes('successful') || 
         rawResponse.message.toLowerCase().includes('success'))) {
      this.logWarn('⚠️ Response format: Success message but unknown structure');
      
      // Try to extract token from any field
      const possibleToken = rawResponse.token || 
                           rawResponse.accessToken || 
                           rawResponse.jwt || 
                           rawResponse.authToken;
      
      if (possibleToken) {
        const user = rawResponse.user || 
                    this.mapEmployeeToUser(rawResponse.employee) ||
                    this.mapEmployeeToUser(null); // fallback default user
                    
        return {
          success: true,
          message: rawResponse.message,
          data: {
            departmentDisplayName: user.department?.name || '',
            departmentName: user.department?.name || '',
            email: user.email,
            employeeId: parseInt(user.employeeId || user.id || '1'),
            fullName: user.fullName,
            id: parseInt(user.id || '1'),
            message: rawResponse.message,
            role: user.role || 'USER',
            token: possibleToken,
            username: user.username,
          }
        };
      }
    }

    // Case 6: Backend response chỉ có message thành công (có thể không có token)
    if (rawResponse.message && 
        (rawResponse.message.includes('thành công') || 
         rawResponse.message.includes('successful'))) {
      this.logWarn('⚠️ Response format: Success message only, creating mock token');
      
      const user = this.mapEmployeeToUser(rawResponse.employee || rawResponse.user);
      
      // Tạo mock response cho case backend chỉ confirm success
      return {
        success: true,
        message: rawResponse.message,
        data: {
          departmentDisplayName: user.department?.name || '',
          departmentName: user.department?.name || '',
          email: user.email,
          employeeId: parseInt(user.employeeId || user.id || '1'),
          fullName: user.fullName,
          id: parseInt(user.id || '1'),
          message: rawResponse.message,
          role: user.role || 'USER',
          token: 'mock-token-' + Date.now(),
          username: user.username,
        }
      };
    }

    // Case 7: Unknown format - throw detailed error
    this.logError('❌ Unknown response format:', rawResponse);
    throw new Error(
      `Định dạng response không được hỗ trợ. ` +
      `Backend cần trả về: { token, employeeId, fullName, email, username, role, ... } format. ` +
      `Received: ${JSON.stringify(rawResponse)}`
    );
  }

  /**
   * Login user với username và password
   * @param credentials - Login credentials
   * @returns Promise<AuthResponse>
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      this.log('🔐 AuthService: Attempting login for user:', credentials.username);
      
      const rawResponse = await httpClient.post<any>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // 🐛 DEBUG: Log exact response để xem format từ backend
      this.log('🔍 AuthService: Raw response from backend:', JSON.stringify(rawResponse, null, 2));
      this.log('🔍 AuthService: Response type:', typeof rawResponse);

      // Normalize response format
      const response = this.normalizeAuthResponse(rawResponse);
      
      this.log('🔍 AuthService: Normalized response:', JSON.stringify(response, null, 2));

      // Store tokens in localStorage if login successful
      if (response.success && response.data) {
        this.storeAuthData(response.data);
        this.log('✅ AuthService: Login successful');
        return response;
      } else {
        this.logError('❌ AuthService: Login failed after normalization');
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      this.logError('❌ AuthService: Login failed', error);
      throw error;
    }
  }

  /**
   * Register new user
   * @param userData - Registration data
   * @returns Promise<AuthResponse>
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      this.log('📝 AuthService: Attempting registration for user:', userData.username);
      
      const rawResponse = await httpClient.post<any>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      // 🐛 DEBUG: Log exact response để xem format từ backend
      this.log('🔍 AuthService: Raw register response from backend:', JSON.stringify(rawResponse, null, 2));

      // Normalize response format
      const response = this.normalizeAuthResponse(rawResponse);
      
      this.log('🔍 AuthService: Normalized register response:', JSON.stringify(response, null, 2));

      // Store tokens in localStorage if registration successful
      if (response.success && response.data) {
        this.storeAuthData(response.data);
        this.log('✅ AuthService: Registration successful');
        return response;
      } else {
        this.logError('❌ AuthService: Registration failed after normalization');
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      this.logError('❌ AuthService: Registration failed', error);
      throw error;
    }
  }

  /**
   * Logout user - clear local storage và call logout endpoint
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 AuthService: Logging out user');
      
      // Call logout endpoint if token exists
      const token = this.getStoredToken();
      if (token) {
        await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error('⚠️ AuthService: Logout API call failed', error);
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local storage
      this.clearAuthData();
      console.log('✅ AuthService: Logout completed');
    }
  }

  /**
   * Refresh access token
   * @returns Promise<RefreshTokenResponse>
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Skip refresh for mock tokens
      if (refreshToken.startsWith('mock-refresh-token-')) {
        this.logWarn('⚠️ AuthService: Skipping refresh for mock token');
        throw new Error('Mock token refresh not supported');
      }

      console.log('🔄 AuthService: Refreshing access token');

      const response = await httpClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );

      if (response.success && response.data) {
        // Update stored tokens
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Update HTTP client with new token
        httpClient.setAuthToken(response.data.token);
        
        console.log('✅ AuthService: Token refreshed successfully');
        return response;
      } else {
        throw new Error('Refresh token response invalid');
      }

    } catch (error) {
      console.error('❌ AuthService: Token refresh failed', error);
      
      // Don't auto-redirect on refresh failure - let the caller decide
      // Clear auth data but don't force redirect to login
      if (error instanceof Error && (
        error.message.includes('No refresh token available') ||
        error.message.includes('Mock token refresh not supported') ||
        error.message.includes('401') ||
        error.message.includes('403')
      )) {
        console.log('🧹 AuthService: Clearing auth data due to refresh failure');
        this.clearAuthData();
      }
      
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns Promise<User>
   */
  async getCurrentUser(): Promise<User> {
    try {
      console.log('👤 AuthService: Fetching current user profile');
      
      const response = await httpClient.get<ApiResponse<User>>(
        API_ENDPOINTS.USER.PROFILE
      );

      if (response.success && response.data) {
        console.log('✅ AuthService: User profile fetched');
        return response.data;
      }

      throw new Error('Failed to fetch user profile');
    } catch (error) {
      console.error('❌ AuthService: Failed to fetch user profile', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param userData - Partial user data to update
   * @returns Promise<User>
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      console.log('✏️ AuthService: Updating user profile');
      
      const response = await httpClient.put<ApiResponse<User>>(
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        userData
      );

      if (response.success && response.data) {
        console.log('✅ AuthService: Profile updated successfully');
        return response.data;
      }

      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('❌ AuthService: Failed to update profile', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param passwords - Password change data
   * @returns Promise<void>
   */
  async changePassword(passwords: ChangePasswordRequest): Promise<void> {
    try {
      console.log('🔑 AuthService: Changing password');
      
      const response = await httpClient.post<ApiResponse>(
        API_ENDPOINTS.USER.CHANGE_PASSWORD,
        passwords
      );

      if (response.success) {
        console.log('✅ AuthService: Password changed successfully');
        return;
      }

      throw new Error('Failed to change password');
    } catch (error) {
      console.error('❌ AuthService: Failed to change password', error);
      throw error;
    }
  }

  /**
   * Forgot password - send reset email
   * @param email - User email
   * @returns Promise<void>
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      console.log('📧 AuthService: Sending password reset email');
      
      const response = await httpClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      if (response.success) {
        console.log('✅ AuthService: Password reset email sent');
        return;
      }

      throw new Error('Failed to send reset email');
    } catch (error) {
      console.error('❌ AuthService: Failed to send reset email', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param resetData - Reset password data
   * @returns Promise<void>
   */
  async resetPassword(resetData: ResetPasswordRequest): Promise<void> {
    try {
      console.log('🔄 AuthService: Resetting password');
      
      const response = await httpClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        resetData
      );

      if (response.success) {
        console.log('✅ AuthService: Password reset successful');
        return;
      }

      throw new Error('Failed to reset password');
    } catch (error) {
      console.error('❌ AuthService: Failed to reset password', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    
    if (!token) {
      return false;
    }

    // Check if token is expired (basic check)
    try {
      const payload = this.parseJWT(token);
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        console.log('⚠️ AuthService: Token expired');
        this.clearAuthData();
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ AuthService: Invalid token format', error);
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Get stored access token
   * @returns string | null
   */
  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Get stored refresh token
   * @returns string | null
   */
  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Get stored user data
   * @returns User | null
   */
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ AuthService: Failed to parse stored user data', error);
      return null;
    }
  }

  /**
   * Store authentication data trong localStorage
   * @param authData - Authentication data từ login/register
   */
  private storeAuthData(authData: AuthResponse['data']): void {
    console.log('💾 AuthService: Storing authentication data');
    
    // Store token
    localStorage.setItem('accessToken', authData.token);
    
    // Create User object từ login response data
    const user: User = {
      id: authData.id?.toString() || '1',
      employeeId: authData.employeeId?.toString() || '1',
      username: authData.username || '',
      email: authData.email || '',
      fullName: authData.fullName || '',
      phoneNumber: '', // Sẽ được update từ employee API
      avatar: undefined,
      department: {
        id: '1', // Temporary
        name: authData.departmentDisplayName || authData.departmentName || 'Unknown Department',
      },
      position: undefined, // Sẽ được update từ employee API
      role: authData.role || 'USER',
      status: 'ACTIVE' as any,
      roles: [{
        id: '1',
        name: authData.role || 'USER',
        permissions: []
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set token in HTTP client
    httpClient.setAuthToken(authData.token);
    
    console.log('✅ AuthService: Authentication data stored successfully');
    console.log('👤 User stored:', user);
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Remove token from HTTP client
    httpClient.removeAuthToken();
    
    console.log('🗑️ AuthService: Auth data cleared');
  }

  /**
   * Parse JWT token (basic parsing without verification)
   * @param token - JWT token
   * @returns Decoded payload
   */
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();

// Export class for testing
export { AuthService }; 