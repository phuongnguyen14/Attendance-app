import React, { useState } from 'react';
import { Building2, Users, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Department: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const departments = [
    {
      id: 1,
      name: 'Engineering',
      manager: 'John Smith',
      employees: 45,
      description: 'Software development and technical operations',
      location: 'Building A, Floor 3'
    },
    {
      id: 2,
      name: 'Marketing',
      manager: 'Sarah Johnson',
      employees: 22,
      description: 'Brand management and digital marketing',
      location: 'Building B, Floor 2'
    },
    {
      id: 3,
      name: 'Sales',
      manager: 'Mike Wilson',
      employees: 38,
      description: 'Customer acquisition and relationship management',
      location: 'Building A, Floor 1'
    },
    {
      id: 4,
      name: 'Human Resources',
      manager: 'Lisa Brown',
      employees: 12,
      description: 'Employee relations and organizational development',
      location: 'Building B, Floor 1'
    },
    {
      id: 5,
      name: 'Finance',
      manager: 'David Lee',
      employees: 15,
      description: 'Financial planning and accounting operations',
      location: 'Building A, Floor 2'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('nav.department')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage organizational departments and structure
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Department
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
              <option value="">All Locations</option>
              <option value="building-a">Building A</option>
              <option value="building-b">Building B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-500 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {dept.location}
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Manager:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {dept.manager}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Employees:</span>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dept.employees}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dept.description}
                </p>
              </div>

              <div className="flex space-x-2 pt-3">
                <button className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  View Details
                </button>
                <button className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  Manage Team
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Department Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {departments.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Departments
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {departments.reduce((sum, dept) => sum + dept.employees, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Employees
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(departments.reduce((sum, dept) => sum + dept.employees, 0) / departments.length)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Employees/Dept
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              2
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Office Locations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;