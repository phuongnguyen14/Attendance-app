import React from 'react';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('dashboard.totalEmployees'),
      value: '124',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: t('dashboard.presentToday'),
      value: '98',
      icon: UserCheck,
      color: 'bg-emerald-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: t('dashboard.onLeave'),
      value: '12',
      icon: UserX,
      color: 'bg-amber-500',
      change: '-8%',
      changeType: 'negative'
    },
    {
      title: t('dashboard.lateArrivals'),
      value: '4',
      icon: Clock,
      color: 'bg-red-500',
      change: '-15%',
      changeType: 'positive'
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Checked in', time: '9:00 AM', status: 'success' },
    { user: 'Jane Smith', action: 'Checked out', time: '6:00 PM', status: 'success' },
    { user: 'Mike Johnson', action: 'Late arrival', time: '9:30 AM', status: 'warning' },
    { user: 'Sarah Wilson', action: 'Applied for leave', time: '8:45 AM', status: 'info' },
  ];

  const quickActions = [
    { title: t('dashboard.markAttendance'), icon: Clock, color: 'bg-blue-500' },
    { title: t('dashboard.viewReports'), icon: Users, color: 'bg-emerald-500' },
    { title: t('dashboard.manageEmployees'), icon: UserCheck, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage your team's attendance efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.recentActivity')}
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-emerald-500' :
                    activity.status === 'warning' ? 'bg-amber-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.action}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('dashboard.quickActions')}
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className={`${action.color} p-2 rounded-lg`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;