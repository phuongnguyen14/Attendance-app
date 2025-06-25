import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Clock,
  BarChart3,
  Building2,
  Users,
  Calendar,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Loader
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentEmployee } from '../../hooks/useCurrentEmployee';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useLanguage();
  const { logout, user, isAuthenticated } = useAuth();
  const { employee, isLoading: isEmployeeLoading, error: employeeError } = useCurrentEmployee();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: Clock, label: t('nav.attendance'), path: '/attendance' },
    { icon: BarChart3, label: t('nav.statistics'), path: '/statistics' },
    { icon: Building2, label: t('nav.department'), path: '/department' },
    { icon: Users, label: t('nav.employee'), path: '/employee' },
    { icon: Calendar, label: t('nav.shift'), path: '/shift' },
    { icon: UserCheck, label: t('nav.shiftAssignment'), path: '/shift-assignment' },
  ];

  const handleProfileClick = () => {
    navigate('/settings?tab=profile');
    setIsCollapsed(false); // Close mobile menu if open
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Get display data from employee API or fallback to auth user data
  const getDisplayData = () => {
    if (employee) {
      return {
        fullName: employee.fullName,
        position: employee.position || employee.jobTitle,
        department: employee.department?.name,
        avatar: employee.avatar,
      };
    } else if (user) {
      return {
        fullName: user.fullName,
        position: user.position,
        department: user.department?.name,
        avatar: user.avatar,
      };
    }
    return null;
  };

  const displayData = getDisplayData();

  return (
    <>
      {/* Mobile backdrop */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AttendFlow
              </h1>
            </div>
            <button 
              onClick={() => setIsCollapsed(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Profile Section */}
          {isAuthenticated && displayData && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group relative"
                disabled={isEmployeeLoading}
              >
                {/* Loading overlay */}
                {isEmployeeLoading && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center">
                    <Loader className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                )}

                {/* Avatar - removed status indicators */}
                <div className="relative">
                  {displayData.avatar ? (
                    <img
                      src={displayData.avatar}
                      alt={displayData.fullName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(displayData.fullName)}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {displayData.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {displayData.position || displayData.department || 'Nhân viên'}
                  </p>
                  {/* API status indicator - text only */}
                  {employee && (
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="text-xs text-green-600 dark:text-green-400">API</span>
                    </div>
                  )}
                </div>

                {/* Arrow icon */}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </button>

              {/* Error message */}
              {employeeError && (
                <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 px-3">
                  Dùng dữ liệu offline
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">{t('nav.settings')}</span>
            </NavLink>
            
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </>
  );
};

export default Sidebar;