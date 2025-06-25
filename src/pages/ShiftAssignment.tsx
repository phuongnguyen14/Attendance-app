import React, { useState } from 'react';
import { UserCheck, Calendar, Search, Filter, Plus, Clock, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ShiftAssignment: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');

  const assignments = [
    {
      id: 1,
      employee: 'John Doe',
      department: 'Engineering',
      shift: 'Morning Shift',
      date: '2024-01-15',
      time: '09:00 - 17:00',
      status: 'Assigned',
      avatar: 'JD'
    },
    {
      id: 2,
      employee: 'Jane Smith',
      department: 'Marketing',
      shift: 'Morning Shift',
      date: '2024-01-15',
      time: '09:00 - 17:00',
      status: 'Assigned',
      avatar: 'JS'
    },
    {
      id: 3,
      employee: 'Mike Johnson',
      department: 'Sales',
      shift: 'Evening Shift',
      date: '2024-01-15',
      time: '14:00 - 22:00',
      status: 'Requested',
      avatar: 'MJ'
    },
    {
      id: 4,
      employee: 'Sarah Wilson',
      department: 'HR',
      shift: 'Flexible Hours',
      date: '2024-01-15',
      time: '08:00 - 16:00',
      status: 'Approved',
      avatar: 'SW'
    },
    {
      id: 5,
      employee: 'David Lee',
      department: 'Finance',
      shift: 'Morning Shift',
      date: '2024-01-15',
      time: '09:00 - 17:00',
      status: 'Pending',
      avatar: 'DL'
    }
  ];

  const shiftStats = [
    { shift: 'Morning Shift', assigned: 45, capacity: 50, percentage: 90 },
    { shift: 'Evening Shift', assigned: 22, capacity: 30, percentage: 73 },
    { shift: 'Night Shift', assigned: 15, capacity: 20, percentage: 75 },
    { shift: 'Flexible Hours', assigned: 28, capacity: 35, percentage: 80 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'Requested':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('nav.shiftAssignment')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Assign employees to shifts and manage schedules
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105">
            <Plus className="w-4 h-4 inline mr-2" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Shift Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {shiftStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.shift}
              </h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.assigned}/{stat.capacity}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="week"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">All Shifts</option>
              <option value="morning">Morning Shift</option>
              <option value="evening">Evening Shift</option>
              <option value="night">Night Shift</option>
              <option value="flexible">Flexible Hours</option>
            </select>
          </div>
          <div>
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="requested">Requested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Shift
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {assignment.avatar}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.employee}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {assignment.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-300">
                        {assignment.shift}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {assignment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {assignment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Schedule Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Weekly Assignment Overview
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                {day}
              </div>
              <div className="space-y-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded text-xs">
                  <div className="font-medium text-blue-800 dark:text-blue-300">Morning</div>
                  <div className="flex items-center justify-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    <span className="text-blue-700 dark:text-blue-400">45</span>
                  </div>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded text-xs">
                  <div className="font-medium text-emerald-800 dark:text-emerald-300">Evening</div>
                  <div className="flex items-center justify-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    <span className="text-emerald-700 dark:text-emerald-400">22</span>
                  </div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded text-xs">
                  <div className="font-medium text-purple-800 dark:text-purple-300">Night</div>
                  <div className="flex items-center justify-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    <span className="text-purple-700 dark:text-purple-400">15</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiftAssignment;