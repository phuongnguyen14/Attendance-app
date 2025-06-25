import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe, Monitor, User, Mail, Phone, Calendar, MapPin, Building2, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrentEmployee } from '../hooks/useCurrentEmployee';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { employee, isLoading: isEmployeeLoading, error: employeeError } = useCurrentEmployee();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Read tab from URL parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['profile', 'preferences'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getDisplayData = () => {
    if (employee) {
      return employee;
    } else if (user) {
      return {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        department: user.department,
        role: user.role,
      };
    }
    return null;
  };

  const displayData = getDisplayData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your application preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {displayData?.avatar ? (
                    <img
                      src={displayData.avatar}
                      alt={displayData.fullName}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {displayData?.fullName?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayData?.fullName || 'Unknown User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {employee?.position || employee?.jobTitle || user?.role || 'Employee'}
                  </p>
                  {employee && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Active • Data from API</span>
                    </div>
                  )}
                  {employeeError && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-orange-600 dark:text-orange-400">Using offline data</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isEmployeeLoading && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-600 dark:text-blue-400">Loading employee data...</span>
                  </div>
                </div>
              )}

              {/* Employee Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Username</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {displayData?.username || 'Not available'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {displayData?.email || 'Not available'}
                        </div>
                      </div>
                    </div>

                    {employee?.phoneNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {employee.phoneNumber}
                          </div>
                        </div>
                      </div>
                    )}

                    {employee?.birthDate && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(employee.birthDate)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Work Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Department</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {displayData?.department?.name || 'Not assigned'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Position</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {employee?.position || employee?.jobTitle || user?.role || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    {employee?.joinDate && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Join Date</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {formatDate(employee.joinDate)}
                          </div>
                        </div>
                      </div>
                    )}

                    {employee?.status && (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className={`w-3 h-3 rounded-full ${
                            employee.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {employee.status}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {employee?.address && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Address</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {employee.address}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Settings */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
                    <SettingsIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('settings.theme')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose your preferred theme
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-100 dark:bg-gray-700' 
                        : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                      {theme === 'dark' ? (
                        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {theme === 'dark' ? t('settings.dark') : t('settings.light')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {theme === 'dark' ? 'Dark color scheme' : 'Light color scheme'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Language Settings */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('settings.language')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select your preferred language
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                      language === 'en'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                        EN
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {t('settings.english')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          English
                        </div>
                      </div>
                    </div>
                    {language === 'en' && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setLanguage('vi')}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                      language === 'vi'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-medium text-sm">
                        VI
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {t('settings.vietnamese')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Tiếng Việt
                        </div>
                      </div>
                    </div>
                    {language === 'vi' && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Settings - only show in preferences tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Application Preferences
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications for important updates
                </div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Auto-save Changes
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically save changes as you work
                </div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Show Advanced Features
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Display advanced options and features
                </div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;