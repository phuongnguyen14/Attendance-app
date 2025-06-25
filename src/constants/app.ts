// Application Constants
export const APP_CONFIG = {
  NAME: 'AttendFlow',
  VERSION: '1.0.0',
  DESCRIPTION: 'Hệ thống quản lý chấm công thông minh',
} as const;

// Development Settings
export const DEV_CONFIG = {
  // Control whether to show development info in UI
  SHOW_DEV_INFO: true, // Set to true để hiển thị development box và API test panel
  
  // Control console logging
  ENABLE_CONSOLE_LOGS: true,
  
  // Control debug features
  ENABLE_DEBUG: true,
  
  // Control API debugging
  ENABLE_API_DEBUG: true,
} as const;

// Helper functions
export const isDevelopment = (): boolean => {
  return import.meta.env.MODE === 'development';
};

export const isProduction = (): boolean => {
  return import.meta.env.MODE === 'production';
};

export const shouldShowDevInfo = (): boolean => {
  if (!isDevelopment()) return false;
  
  // Read from localStorage first, fallback to DEV_CONFIG
  const storedValue = localStorage.getItem('dev_show_info');
  if (storedValue !== null) {
    return storedValue === 'true';
  }
  
  return DEV_CONFIG.SHOW_DEV_INFO;
};

export const shouldEnableLogging = (): boolean => {
  if (!isDevelopment()) return false;
  
  // Read from localStorage first, fallback to DEV_CONFIG
  const storedValue = localStorage.getItem('dev_enable_logging');
  if (storedValue !== null) {
    return storedValue === 'true';
  }
  
  return DEV_CONFIG.ENABLE_CONSOLE_LOGS;
};

// Conditional logging function - only logs in development when enabled
export const conditionalLog = (...args: any[]): void => {
  if (shouldEnableLogging()) {
    console.log(...args);
  }
};

// Debug helper for auth state
export const debugAuthState = (): void => {
  if (!isDevelopment()) return;
  
  console.group('🔍 Auth State Debug');
  
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const user = localStorage.getItem('user');
  
  console.log('🔑 Access Token:', token ? 'Present' : 'Missing');
  console.log('🔄 Refresh Token:', refreshToken ? 'Present' : 'Missing');
  console.log('👤 User Data:', user ? 'Present' : 'Missing');
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      
      console.log('⏰ Token Expiry:', new Date(expirationTime).toLocaleString());
      console.log('⏳ Time Until Expiry:', Math.floor(timeUntilExpiry / 1000 / 60), 'minutes');
      console.log('✅ Token Valid:', timeUntilExpiry > 0);
    } catch (error) {
      console.log('❌ Token Parse Error:', error);
    }
  }
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('👤 User:', userData.fullName || userData.username || 'Unknown');
      console.log('📧 Email:', userData.email || 'No email');
    } catch (error) {
      console.log('❌ User Parse Error:', error);
    }
  }
  
  console.groupEnd();
};

/**
 * Toggle development info display
 */
export const toggleDevInfo = (): void => {
  if (!isDevelopment()) return;
  
  const current = shouldShowDevInfo();
  localStorage.setItem('dev_show_info', (!current).toString());
  console.log('🔄 Dev info display toggled:', !current);
};

/**
 * Toggle console logging
 */
export const toggleLogging = (): void => {
  if (!isDevelopment()) return;
  
  const current = shouldEnableLogging();
  localStorage.setItem('dev_enable_logging', (!current).toString());
  console.log('🔄 Console logging toggled:', !current);
}; 