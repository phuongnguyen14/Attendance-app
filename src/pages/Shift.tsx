import React, { useState } from 'react';
import { Calendar, Clock, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Shift: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const shifts = [
    {
      id: 1,
      name: 'Morning Shift',
      startTime: '09:00',
      endTime: '17:00',
      duration: '8 hours',
      breakTime: '1 hour',
      type: 'Full-time',
      department: 'Engineering',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Evening Shift',
      startTime: '14:00',
      endTime: '22:00',
      duration: '8 hours',
      breakTime: '1 hour',
      type: 'Full-time',
      department: 'Customer Support',
      color: 'emerald'
    },
    {
      id: 3,
      name: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00',
      duration: '8 hours',
      breakTime: '1 hour',
      type: 'Full-time',
      department: 'Security',
      color: 'purple'
    },
    {
      id: 4,
      name: 'Part-time Morning',
      startTime: '10:00',
      endTime: '14:00',
      duration: '4 hours',
      breakTime: '30 minutes',
      type: 'Part-time',
      department: 'Sales',
      color: 'amber'
    },
    {
      id: 5,
      name: 'Flexible Hours',
      startTime: '08:00',
      endTime: '16:00',
      duration: '8 hours',
      breakTime: '1 hour',
      type: 'Flexible',
      department: 'Marketing',
      color: 'rose'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      rose: 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400 border-rose-200 dark:border-rose-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('nav.shift')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage work shifts and schedules
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Shift
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shift Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${getColorClasses(shift.color)} p-6 hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`bg-gradient-to-r from-${shift.color}-500 to-${shift.color}-600 p-3 rounded-lg`}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {shift.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {shift.department}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Time:</span>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {shift.startTime} - {shift.endTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {shift.duration}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Break:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {shift.breakTime}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  shift.type === 'Full-time' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' :
                  shift.type === 'Part-time' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {shift.type}
                </span>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  View Schedule
                </button>
                <button className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  Assign Staff
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Weekly Schedule Overview
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {day}
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-blue-200 dark:bg-blue-800 rounded text-xs flex items-center justify-center text-blue-800 dark:text-blue-200">
                  Morning
                </div>
                <div className="h-6 bg-emerald-200 dark:bg-emerald-800 rounded text-xs flex items-center justify-center text-emerald-800 dark:text-emerald-200">
                  Evening
                </div>
                {index < 5 && (
                  <div className="h-6 bg-purple-200 dark:bg-purple-800 rounded text-xs flex items-center justify-center text-purple-800 dark:text-purple-200">
                    Night
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shift;