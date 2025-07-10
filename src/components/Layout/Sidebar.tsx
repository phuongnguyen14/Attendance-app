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
          className="fixed inset-0 bg-black bg-opacity-50 cyberpunk:bg-cyber-dark-100 cyberpunk:bg-opacity-80 z-40 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white dark:bg-gray-900 cyberpunk:cyber-sidebar border-r border-gray-200 dark:border-gray-700 cyberpunk:border-cyber-neon-cyan z-50 transition-transform duration-300 ease-in-out
        ${isCollapsed ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
        w-64 cyberpunk:shadow-electric
      `}>
        <div className="flex flex-col h-full">
          {/* Header with Cyberpunk Branding */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 cyberpunk:border-cyber-neon-cyan">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 cyberpunk:from-cyber-neon-cyan cyberpunk:to-cyber-neon-pink rounded-lg flex items-center justify-center cyberpunk:shadow-neon-cyan cyberpunk:animate-glow-pulse">
                <Clock className="w-6 h-6 text-white cyber-icon" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white cyberpunk:text-cyber-neon-cyan cyberpunk:font-cyber cyberpunk:text-neon-glow">
                  AttendFlow
                </h1>
                <span className="text-xs text-gray-500 cyberpunk:text-cyber-neon-pink cyberpunk:font-matrix cyberpunk:animate-neon-flicker">
                  v2.0.CYBER
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsCollapsed(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cyberpunk:hover:bg-cyber-dark-300 cyberpunk:hover:shadow-neon-cyan transition-all duration-300"
            >
              <X className="w-5 h-5 text-gray-500 cyberpunk:text-cyber-neon-cyan cyber-icon" />
            </button>
          </div>

          {/* User Profile Section with Cyberpunk Enhancement */}
          {isAuthenticated && displayData && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 cyberpunk:border-cyber-neon-cyan">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cyberpunk:cyber-card cyberpunk:hover:shadow-neon-cyan transition-all duration-300 group relative overflow-hidden"
                disabled={isEmployeeLoading}
              >
                {/* Cyberpunk scan line effect */}
                <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-r cyberpunk:from-transparent cyberpunk:via-cyber-neon-cyan cyberpunk:to-transparent cyberpunk:opacity-20 cyberpunk:transform cyberpunk:-translate-x-full group-hover:cyberpunk:translate-x-full cyberpunk:transition-transform cyberpunk:duration-1000"></div>

                {/* Loading overlay */}
                {isEmployeeLoading && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 cyberpunk:bg-cyber-dark-300/80 rounded-lg flex items-center justify-center">
                    <div className="cyberpunk:cyber-spinner">
                      <Loader className="w-4 h-4 animate-spin text-blue-500 cyberpunk:text-cyber-neon-cyan" />
                    </div>
                  </div>
                )}

                {/* Avatar with Cyberpunk Glow */}
                <div className="relative">
                  {displayData.avatar ? (
                    <img
                      src={displayData.avatar}
                      alt={displayData.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 cyberpunk:border-cyber-neon-cyan cyberpunk:shadow-neon-cyan cyberpunk:animate-glow-pulse"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 cyberpunk:from-cyber-neon-cyan cyberpunk:to-cyber-neon-pink rounded-full flex items-center justify-center text-white font-semibold text-sm cyberpunk:shadow-cyber-glow cyberpunk:animate-cyber-breathe cyberpunk:font-cyber">
                      {getInitials(displayData.fullName)}
                    </div>
                  )}
                  
                  {/* Cyberpunk Status Ring */}
                  <div className="cyberpunk:absolute cyberpunk:-inset-1 cyberpunk:rounded-full cyberpunk:bg-gradient-to-r cyberpunk:from-cyber-neon-green cyberpunk:via-cyber-neon-cyan cyberpunk:to-cyber-neon-pink cyberpunk:opacity-75 cyberpunk:animate-spin cyberpunk:blur-sm"></div>
                  <div className="cyberpunk:absolute cyberpunk:-inset-1 cyberpunk:rounded-full cyberpunk:bg-gradient-to-r cyberpunk:from-cyber-neon-green cyberpunk:via-cyber-neon-cyan cyberpunk:to-cyber-neon-pink cyberpunk:opacity-75 cyberpunk:animate-ping"></div>
                </div>

                {/* User Info with Cyberpunk Typography */}
                <div className="flex-1 text-left relative z-10">
                  <p className="text-sm font-medium text-gray-900 dark:text-white cyberpunk:text-cyber-neon-cyan cyberpunk:font-cyber cyberpunk:text-neon-glow truncate">
                    {displayData.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 cyberpunk:text-cyber-neon-green cyberpunk:font-matrix truncate">
                    {displayData.position || displayData.department || 'Nhân viên'}
                  </p>
                  {/* API status indicator with cyberpunk styling */}
                  {employee && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="cyberpunk:w-2 cyberpunk:h-2 cyberpunk:bg-cyber-neon-green cyberpunk:rounded-full cyberpunk:animate-neon-flicker"></div>
                      <span className="text-xs text-green-600 dark:text-green-400 cyberpunk:text-cyber-neon-green cyberpunk:font-matrix cyberpunk:animate-digital-glitch">
                        API.CONNECTED
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow icon with cyberpunk animation */}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 cyberpunk:text-cyber-neon-cyan cyberpunk:group-hover:text-cyber-neon-pink cyber-icon transition-all duration-300" />
              </button>

              {/* Error message with cyberpunk styling */}
              {employeeError && (
                <div className="mt-3 p-2 cyberpunk:cyber-card cyberpunk:border-cyber-neon-orange">
                  <div className="flex items-center space-x-2">
                    <div className="cyberpunk:w-2 cyberpunk:h-2 cyberpunk:bg-cyber-neon-orange cyberpunk:rounded-full cyberpunk:animate-neon-flicker"></div>
                    <span className="text-xs text-orange-600 dark:text-orange-400 cyberpunk:text-cyber-neon-orange cyberpunk:font-matrix">
                      OFFLINE.MODE
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation with Cyberpunk Styling */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, index) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 cyberpunk:cyber-card cyberpunk:border-cyber-neon-green text-blue-600 dark:text-blue-400 cyberpunk:text-cyber-neon-green cyberpunk:shadow-neon-green border-r-2 border-blue-600 cyberpunk:border-cyber-neon-green'
                      : 'text-gray-700 dark:text-gray-300 cyberpunk:text-cyber-neon-cyan hover:bg-gray-50 dark:hover:bg-gray-800 cyberpunk:hover:bg-cyber-dark-300 cyberpunk:hover:shadow-neon-cyan'
                  }`
                }
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Cyberpunk hover effect */}
                <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-r cyberpunk:from-transparent cyberpunk:via-cyber-neon-cyan cyberpunk:to-transparent cyberpunk:opacity-20 cyberpunk:transform cyberpunk:-translate-x-full group-hover:cyberpunk:translate-x-full cyberpunk:transition-transform cyberpunk:duration-700"></div>
                
                <item.icon className="w-5 h-5 cyber-icon relative z-10" />
                <span className="font-medium cyberpunk:font-cyber relative z-10">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom section with Cyberpunk Enhancement */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 cyberpunk:border-cyber-neon-cyan space-y-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 cyberpunk:cyber-card cyberpunk:border-cyber-neon-purple text-blue-600 dark:text-blue-400 cyberpunk:text-cyber-neon-purple cyberpunk:shadow-neon-pink'
                    : 'text-gray-700 dark:text-gray-300 cyberpunk:text-cyber-neon-cyan hover:bg-gray-50 dark:hover:bg-gray-800 cyberpunk:hover:bg-cyber-dark-300 cyberpunk:hover:shadow-neon-cyan'
                }`
              }
            >
              <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-r cyberpunk:from-transparent cyberpunk:via-cyber-neon-purple cyberpunk:to-transparent cyberpunk:opacity-20 cyberpunk:transform cyberpunk:-translate-x-full group-hover:cyberpunk:translate-x-full cyberpunk:transition-transform cyberpunk:duration-700"></div>
              <Settings className="w-5 h-5 cyber-icon relative z-10" />
              <span className="font-medium cyberpunk:font-cyber relative z-10">{t('nav.settings')}</span>
            </NavLink>
            
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 cyberpunk:text-cyber-neon-red hover:bg-red-50 dark:hover:bg-red-900/20 cyberpunk:hover:bg-cyber-dark-300 hover:text-red-600 dark:hover:text-red-400 cyberpunk:hover:text-cyber-neon-red cyberpunk:hover:shadow-neon-pink transition-all duration-300 group relative overflow-hidden"
            >
              <div className="cyberpunk:absolute cyberpunk:inset-0 cyberpunk:bg-gradient-to-r cyberpunk:from-transparent cyberpunk:via-cyber-neon-red cyberpunk:to-transparent cyberpunk:opacity-20 cyberpunk:transform cyberpunk:-translate-x-full group-hover:cyberpunk:translate-x-full cyberpunk:transition-transform cyberpunk:duration-700"></div>
              <LogOut className="w-5 h-5 cyber-icon relative z-10" />
              <span className="font-medium cyberpunk:font-cyber relative z-10">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button with Cyberpunk Styling */}
      <button
        onClick={() => setIsCollapsed(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-3 bg-white dark:bg-gray-900 cyberpunk:cyber-card cyberpunk:shadow-neon-cyan rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 cyberpunk:border-cyber-neon-cyan cyberpunk:animate-glow-pulse"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400 cyberpunk:text-cyber-neon-cyan cyber-icon" />
      </button>
    </>
  );
};

export default Sidebar;