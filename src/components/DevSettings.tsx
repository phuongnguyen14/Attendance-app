import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Bug, Shield, RefreshCw, LogOut, Users } from 'lucide-react';
import { isDevelopment, shouldShowDevInfo, toggleDevInfo, shouldEnableLogging, toggleLogging } from '../constants/app';
import { API_BASE_URL } from '../constants/api';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentEmployee } from '../hooks/useCurrentEmployee';

const DevSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDevInfo, setShowDevInfo] = useState(shouldShowDevInfo());
  const [enableLogging, setEnableLogging] = useState(shouldEnableLogging());
  const { debugAuthState, user, isAuthenticated, refreshToken, logout } = useAuth();
  const { employee, isLoading: isEmployeeLoading, error: employeeError, refetch: refetchEmployee } = useCurrentEmployee();
  
  // Update local state when component mounts or localStorage changes
  useEffect(() => {
    setShowDevInfo(shouldShowDevInfo());
    setEnableLogging(shouldEnableLogging());
  }, [isOpen]); // Re-check when panel opens
  
  // Only show in development mode
  if (!isDevelopment()) {
    return null;
  }

  const handleToggleDevInfo = () => {
    toggleDevInfo();
    const newValue = shouldShowDevInfo();
    setShowDevInfo(newValue);
    console.log('🔄 DevSettings: Show Dev Info toggled to:', newValue);
  };

  const handleToggleLogging = () => {
    toggleLogging();
    const newValue = shouldEnableLogging();
    setEnableLogging(newValue);
    console.log('🔄 DevSettings: Console Logging toggled to:', newValue);
  };

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
      alert('Token refreshed successfully!');
    } catch (error) {
      alert('Token refresh failed: ' + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const handleEmployeeDebug = () => {
    console.clear();
    console.log('👤 EMPLOYEE API DEBUG STARTED');
    
    console.group('📊 Current Employee Data');
    console.log('Loading:', isEmployeeLoading);
    console.log('Error:', employeeError);
    console.log('Employee Data:', employee);
    console.log('User EmployeeId:', user?.employeeId);
    console.groupEnd();
    
    console.group('🔗 API Test');
    if (user?.employeeId) {
      const apiUrl = `${API_BASE_URL}/api/v1/employees/${user.employeeId}`;
      console.log('Testing URL:', apiUrl);
      
      fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log('📊 Employee API Status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('📄 Employee API Response:', data);
        console.groupEnd();
      })
      .catch(error => {
        console.error('❌ Employee API Test Failed:', error);
        console.groupEnd();
      });
    } else {
      console.warn('❌ No employeeId available for testing');
      console.log('User object:', user);
      console.groupEnd();
    }
    
    alert('👤 Employee debug completed! Check console for details.');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
        title="Development Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🛠️ Dev Settings
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Show Dev Info</span>
                  <button
                    onClick={handleToggleDevInfo}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showDevInfo ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showDevInfo ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Console Logging</span>
                  <button
                    onClick={handleToggleLogging}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enableLogging ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enableLogging ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* Employee API Debug Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Employee API Debug
              </h4>
              <div className="space-y-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div>Status: <span className={employee ? 'text-green-600' : employeeError ? 'text-red-600' : 'text-yellow-600'}>
                    {isEmployeeLoading ? 'Loading...' : employee ? 'Loaded' : employeeError ? 'Error' : 'No Data'}
                  </span></div>
                  <div>Name: {employee?.fullName || 'None'}</div>
                  <div>Position: {employee?.position || employee?.jobTitle || 'None'}</div>
                  <div>Department: {employee?.department?.name || 'None'}</div>
                  {employeeError && (
                    <div className="text-red-600">Error: {employeeError}</div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleEmployeeDebug}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded flex items-center justify-center"
                  >
                    <Bug className="w-3 h-3 mr-1" />
                    Debug
                  </button>
                  <button
                    onClick={refetchEmployee}
                    disabled={!isAuthenticated || isEmployeeLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs py-1 px-2 rounded flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${isEmployeeLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Auth Debug Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Authentication Debug
              </h4>
              <div className="space-y-2">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div>Status: <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span></div>
                  <div>User: {user?.fullName || 'None'}</div>
                  <div>Email: {user?.email || 'None'}</div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={debugAuthState}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded flex items-center justify-center"
                  >
                    <Bug className="w-3 h-3 mr-1" />
                    Debug
                  </button>
                  <button
                    onClick={handleRefreshToken}
                    disabled={!isAuthenticated}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xs py-1 px-2 rounded flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={!isAuthenticated}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-xs py-1 px-2 rounded flex items-center justify-center disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-3 h-3 mr-1" />
                    Logout
                  </button>
                </div>
                
                {/* Quick Fix for Token Issues */}
                <button
                  onClick={() => {
                    if (confirm('Clear all authentication data? This will log you out.')) {
                      // Clear all auth-related data
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('refreshToken');
                      localStorage.removeItem('user');
                      
                      // Clear HTTP client token
                      const { httpClient } = require('../utils/httpClient');
                      httpClient.removeAuthToken();
                      
                      console.log('🧹 Auth state cleared manually');
                      alert('Auth cleared! Page will refresh.');
                      window.location.reload();
                    }
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded"
                >
                  🧹 Fix Token Issues
                </button>
                
                {/* Full Diagnostics Button */}
                <button
                  onClick={() => {
                    // Run comprehensive auth diagnostics
                    console.clear();
                    console.log('🔍 FULL AUTH DIAGNOSTICS STARTED');
                    
                    // Check localStorage
                    console.group('📁 LocalStorage Debug');
                    const token = localStorage.getItem('accessToken');
                    const refreshToken = localStorage.getItem('refreshToken');
                    const userData = localStorage.getItem('user');
                    const devInfo = localStorage.getItem('dev_show_info');
                    const devLog = localStorage.getItem('dev_enable_logging');
                    
                    console.log('🔑 Access Token:', token ? 'Present (' + token.substring(0, 20) + '...)' : 'Missing');
                    console.log('🔄 Refresh Token:', refreshToken ? 'Present' : 'Missing');
                    console.log('👤 User Data:', userData ? 'Present' : 'Missing');
                    console.log('⚙️ Dev Show Info:', devInfo);
                    console.log('📝 Dev Enable Logging:', devLog);
                    
                    if (token) {
                      try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const expirationTime = payload.exp * 1000;
                        const currentTime = Date.now();
                        const timeUntilExpiry = expirationTime - currentTime;
                        
                        console.log('⏰ Token Expiry:', new Date(expirationTime).toLocaleString());
                        console.log('⏳ Time Until Expiry:', Math.floor(timeUntilExpiry / 1000 / 60), 'minutes');
                        console.log('✅ Token Valid:', timeUntilExpiry > 0);
                        
                        if (timeUntilExpiry <= 0) {
                          console.warn('❌ TOKEN EXPIRED! Auto-clearing...');
                          localStorage.removeItem('accessToken');
                          localStorage.removeItem('refreshToken');
                          localStorage.removeItem('user');
                        }
                      } catch (error) {
                        console.error('❌ Token Parse Error:', error);
                        console.warn('Clearing invalid token...');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                      }
                    }
                    console.groupEnd();
                    
                    // Test backend connectivity
                    console.group('🌐 Backend Connectivity Test');
                    const apiUrl = 'http://localhost:8080';
                    
                    fetch(apiUrl + '/api/v1/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username: 'test', password: 'test' })
                    })
                    .then(response => {
                      console.log('📊 Backend Status:', response.status);
                      if (response.status === 401) {
                        console.log('✅ Backend is running (401 = invalid credentials is normal)');
                      } else if (response.ok) {
                        console.log('✅ Backend is running and responded OK');
                      } else {
                        console.log('⚠️ Backend responded with status:', response.status);
                      }
                      return response.text();
                    })
                    .then(text => {
                      console.log('📄 Response:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
                      console.groupEnd();
                    })
                    .catch(error => {
                      console.error('❌ Backend Test Failed:', error);
                      console.warn('🚨 BACKEND MAY NOT BE RUNNING!');
                      console.log('💡 Solution: Start Java Spring backend on http://localhost:8080');
                      console.groupEnd();
                    });
                    
                    // Environment info
                    console.group('🔧 Environment Info');
                    console.log('🌍 URL:', window.location.href);
                    console.log('🌐 Online:', navigator.onLine);
                    console.log('⚡ Mode:', import.meta?.env?.MODE || 'unknown');
                    console.log('🔗 API URL:', apiUrl);
                    console.groupEnd();
                    
                    // Cleanup helpers
                    console.group('🛠️ Cleanup Helpers');
                    console.log('Run these in console if needed:');
                    console.log('- clearAuthState() // Clear auth data only');
                    console.log('- localStorage.clear() // Clear all data');
                    
                    window.clearAuthState = () => {
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('refreshToken');
                      localStorage.removeItem('user');
                      console.log('✅ Auth cleared! Refresh page.');
                    };
                    console.groupEnd();
                    
                    alert('🔍 Full diagnostics completed! Check console for details.');
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1 px-2 rounded"
                >
                  🔍 Full Auth Diagnostics
                </button>
              </div>
            </div>

            {/* Environment Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Environment</h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Mode: <span className="font-mono">{import.meta.env.MODE}</span></div>
                <div>API: <span className="font-mono">{API_BASE_URL}</span></div>
                <div>Node Env: <span className="font-mono">{import.meta.env.NODE_ENV}</span></div>
              </div>
            </div>

            {/* Storage Debug */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage Debug</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    console.group('🗄️ LocalStorage Contents');
                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      if (key) {
                        console.log(key + ':', localStorage.getItem(key));
                      }
                    }
                    console.groupEnd();
                    alert('Storage contents logged to console');
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
                >
                  Log Storage Contents
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('Clear all dev settings from localStorage?')) {
                      localStorage.removeItem('dev_show_info');
                      localStorage.removeItem('dev_enable_logging');
                      // Force re-check settings
                      setShowDevInfo(shouldShowDevInfo());
                      setEnableLogging(shouldEnableLogging());
                      console.log('🧹 Dev settings cleared from localStorage');
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                >
                  Clear Dev Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevSettings; 