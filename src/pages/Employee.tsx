import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Trash2, 
  Eye,
  Download,
  Upload,
  AlertCircle,
  Calendar,
  Building,
  DollarSign,
  Clock
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { employeeService } from '../services/employeeService';
import { cacheService } from '../utils/cacheService';
import { shouldShowDevInfo } from '../constants/app';
import Pagination from '../components/Pagination';
import {
  Employee,
  EmployeeSearchFilters,
  EmployeeStats,
  EmployeeStatus,
  Department,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '../types/employee';
import EmployeeAPITestPanel from '../components/EmployeeAPITestPanel';

const EmployeePage: React.FC = () => {
  const { t } = useLanguage();
  
  // State management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Filter state
  const [filters, setFilters] = useState<EmployeeSearchFilters>({
    name: '',
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    position: '',
    department: '',
    status: undefined,
    page: 1,
    limit: 12,
  });

  // Advanced filter state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNext: false,
    hasPrev: false,
  });

  // All employees (for local filtering)
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Load initial data
  useEffect(() => {
    console.log('🚀 Employee page: Initializing component');
    
    // Try to restore from cache first
    const cachedData = cacheService.getEmployeeData();
    const cachedFilters = cacheService.getEmployeeFilters();
    const cachedPagination = cacheService.getEmployeePagination();
    const cachedViewMode = cacheService.getEmployeeViewMode();

    console.log('📋 Employee page: Cache status check:');
    console.log('- Cached data:', !!cachedData);
    console.log('- Cached filters:', !!cachedFilters);
    console.log('- Cached pagination:', !!cachedPagination);
    console.log('- Cached view mode:', cachedViewMode);

    // Always restore view mode if available (independent of data cache)
    if (cachedViewMode) {
      setViewMode(cachedViewMode);
      console.log('✅ Employee page: Restored view mode from cache:', cachedViewMode);
    } else {
      console.log('ℹ️ Employee page: No cached view mode found, using default: grid');
    }

    // Always restore filters if available
    if (cachedFilters) {
      setFilters(cachedFilters);
      console.log('✅ Employee page: Restored filters from cache');
    }

    // Always restore pagination if available
    if (cachedPagination) {
      setPagination(cachedPagination);
      console.log('✅ Employee page: Restored pagination from cache');
    }

    if (cachedData && cachedData.employees.length > 0) {
      // Restore employee data from cache
      setEmployees(cachedData.employees);
      setAllEmployees(cachedData.employees);
      setFilteredEmployees(cachedData.filteredEmployees);
      setStats(cachedData.stats);
      setDepartments(cachedData.departments);

      console.log('✅ Employee page: Restored employee data from cache');
    } else {
      // Load fresh data
      console.log('🔄 Employee page: Loading fresh data');
      loadEmployees();
      loadDepartments();
      loadStats();
    }
  }, []);

  // Auto-save to cache when data changes
  useEffect(() => {
    if (allEmployees.length > 0) {
      cacheService.setEmployeeData({
        employees: allEmployees,
        filteredEmployees,
        filters,
        pagination,
        stats,
        departments,
        lastUpdated: new Date().toISOString(),
      });
    }
  }, [allEmployees, filteredEmployees, filters, pagination, stats, departments]);

  // Auto-save filters and pagination
  useEffect(() => {
    cacheService.setEmployeeFilters(filters);
  }, [filters]);

  useEffect(() => {
    cacheService.setEmployeePagination(pagination);
  }, [pagination]);

  useEffect(() => {
    console.log('🔄 Employee page: View mode changed to:', viewMode);
    cacheService.setEmployeeViewMode(viewMode);
    console.log('💾 Employee page: Saved view mode to cache:', viewMode);
  }, [viewMode]);

  // Auto-filter when filters change
  useEffect(() => {
    filterEmployees();
  }, [
    allEmployees, 
    filters.name, 
    filters.fullName,
    filters.username,
    filters.email,
    filters.phoneNumber,
    filters.position,
    filters.department, 
    filters.status, 
    pagination.currentPage, 
    pagination.itemsPerPage
  ]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const employeeData = await employeeService.getAllEmployees();
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
      setAllEmployees(employeeData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách nhân viên');
      console.error('Failed to load employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const departmentData = await employeeService.getDepartments();
      setDepartments(departmentData);
    } catch (err: any) {
      console.error('Failed to load departments:', err);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await employeeService.getEmployeeStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to load employee stats:', err);
    }
  };

  const filterEmployees = () => {
    let filtered = [...allEmployees];

    // Filter by name (legacy support)
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.fullName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.phoneNumber.includes(searchTerm)
      );
    }

    // Filter by specific fields
    if (filters.fullName) {
      const searchTerm = filters.fullName.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.fullName.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.username) {
      const searchTerm = filters.username.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.username?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.email) {
      const searchTerm = filters.email.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.phoneNumber) {
      filtered = filtered.filter(emp => 
        emp.phoneNumber.includes(filters.phoneNumber!)
      );
    }

    if (filters.position) {
      const searchTerm = filters.position.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.position?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by department - now using department ID
    if (filters.department) {
      filtered = filtered.filter(emp => 
        emp.department.id === filters.department ||
        emp.department.name.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(emp => emp.status === filters.status);
    }

    // Update pagination info
    const totalItems = filtered.length;
    const itemsPerPage = pagination.itemsPerPage;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPage = Math.min(pagination.currentPage, totalPages || 1);

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEmployees = filtered.slice(startIndex, endIndex);

    // Update states
    setFilteredEmployees(paginatedEmployees);
    setPagination({
      currentPage,
      totalPages: totalPages || 1,
      totalItems,
      itemsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    });
  };

  const handleFilterChange = (key: keyof EmployeeSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const searchResponse = await employeeService.searchEmployees(filters);
      const employeeData = searchResponse.employees || searchResponse as Employee[];
      
      setEmployees(employeeData);
      setFilteredEmployees(employeeData);
    } catch (err: any) {
      setError(err.message || 'Không thể tìm kiếm nhân viên');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async (employeeData: CreateEmployeeRequest) => {
    try {
      setIsLoading(true);
      await employeeService.createEmployee(employeeData);
      
      // Invalidate cache and reload fresh data
      cacheService.invalidateEmployeeCache();
      await loadEmployees();
      await loadStats();
      
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Không thể tạo nhân viên mới');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (employeeData: UpdateEmployeeRequest) => {
    try {
      setIsLoading(true);
      await employeeService.updateEmployee(employeeData.id, employeeData);
      
      // Invalidate cache and reload fresh data
      cacheService.invalidateEmployeeCache();
      await loadEmployees();
      await loadStats();
      
      setShowEditModal(false);
      setSelectedEmployee(null);
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật thông tin nhân viên');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      return;
    }

    try {
      setIsLoading(true);
      await employeeService.deleteEmployee(id);
      
      // Invalidate cache and reload fresh data
      cacheService.invalidateEmployeeCache();
      await loadEmployees();
      await loadStats();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa nhân viên');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage,
      currentPage: 1, // Reset to first page
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('nav.employee')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý thông tin nhân viên và hồ sơ
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {viewMode === 'grid' ? 'Bảng' : 'Lưới'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <div className="text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Tổng nhân viên
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalEmployees}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeEmployees}
                </p>
              </div>
              <div className="bg-emerald-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Đang nghỉ phép
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.onLeaveEmployees}
                </p>
              </div>
              <div className="bg-amber-500 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Lương trung bình
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {employeeService.formatSalary(stats.averageSalary)}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bộ lọc</h3>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">
              {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
            </span>
          </button>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tổng quát..."
              value={filters.name || ''}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <select
              value={filters.department || ''}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tất cả phòng ban</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as EmployeeStatus)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value={EmployeeStatus.ACTIVE}>Hoạt động</option>
              <option value={EmployeeStatus.ON_LEAVE}>Nghỉ phép</option>
              <option value={EmployeeStatus.INACTIVE}>Không hoạt động</option>
              <option value={EmployeeStatus.SUSPENDED}>Tạm ngừng</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Tìm kiếm</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Bộ lọc nâng cao</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID Nhân viên
                </label>
                <input
                  type="text"
                  placeholder="ID..."
                  value={filters.id || ''}
                  onChange={(e) => handleFilterChange('id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username..."
                  value={filters.username || ''}
                  onChange={(e) => handleFilterChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Họ và tên..."
                  value={filters.fullName || ''}
                  onChange={(e) => handleFilterChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Email..."
                  value={filters.email || ''}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Số điện thoại..."
                  value={filters.phoneNumber || ''}
                  onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vị trí
                </label>
                <input
                  type="text"
                  placeholder="Vị trí..."
                  value={filters.position || ''}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Clear Advanced Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    id: '',
                    username: '',
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    position: '',
                  }));
                }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Xóa bộ lọc nâng cao
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Employee List - Grid View */}
      {!isLoading && viewMode === 'grid' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {employee.avatar ? (
                      <img src={employee.avatar} alt={employee.fullName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      employee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {employee.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                      {employee.position || 'Chưa xác định'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewEmployee(employee)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                  <Edit2 className="w-4 h-4" />
                </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {employee.email}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {employee.phoneNumber}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {employee.department.name}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ngày vào làm:</span>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {employeeService.formatDate(employee.joinDate)}
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employeeService.getStatusColor(employee.status)}`}>
                    {employeeService.getStatusText(employee.status)}
                  </span>
                </div>

                {employee.salary && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Lương:</span>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {employeeService.formatSalary(employee.salary)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee List - Table View */}
      {!isLoading && viewMode === 'table' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phòng ban
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày vào làm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lương
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {employee.avatar ? (
                            <img src={employee.avatar} alt={employee.fullName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            employee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                          )}
                        </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.position || 'Chưa xác định'}
                  </div>
                </div>
              </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{employee.email}</div>
                      <div className="text-gray-500 dark:text-gray-400">{employee.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employee.department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employeeService.formatDate(employee.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employeeService.formatSalary(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employeeService.getStatusColor(employee.status)}`}>
                        {employeeService.getStatusText(employee.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit2 className="w-4 h-4" />
                </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                </button>
              </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEmployees.length === 0 && pagination.totalItems === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filters.name || filters.department || filters.status 
              ? 'Không tìm thấy nhân viên phù hợp với bộ lọc'
              : 'Chưa có nhân viên nào'
            }
          </p>
          {!filters.name && !filters.department && !filters.status && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Thêm nhân viên đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination.totalItems > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          />
        </div>
      )}

      {/* TODO: Add Modal Components */}
      {/* - AddEmployeeModal */}
      {/* - EditEmployeeModal */}
      {/* - ViewEmployeeModal */}
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Thêm nhân viên mới</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chức năng này sẽ được phát triển trong phiên bản tới.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
      </div>
      )}

      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa nhân viên</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Đang chỉnh sửa: {selectedEmployee.fullName}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chức năng này sẽ được phát triển trong phiên bản tới.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedEmployee(null);
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Thông tin nhân viên</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedEmployee.avatar ? (
                    <img src={selectedEmployee.avatar} alt={selectedEmployee.fullName} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    selectedEmployee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.fullName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedEmployee.position || 'Chưa xác định'}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${employeeService.getStatusColor(selectedEmployee.status)}`}>
                    {employeeService.getStatusText(selectedEmployee.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phòng ban</label>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.department.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày vào làm</label>
                  <p className="text-gray-900 dark:text-white">{employeeService.formatDate(selectedEmployee.joinDate)}</p>
                </div>
                {selectedEmployee.salary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lương</label>
                    <p className="text-gray-900 dark:text-white">{employeeService.formatSalary(selectedEmployee.salary)}</p>
                  </div>
                )}
                {selectedEmployee.birthDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày sinh</label>
                    <p className="text-gray-900 dark:text-white">{employeeService.formatDate(selectedEmployee.birthDate)}</p>
                  </div>
                )}
              </div>

              {selectedEmployee.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ</label>
                  <p className="text-gray-900 dark:text-white">{selectedEmployee.address}</p>
                </div>
              )}

              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kỹ năng</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleEditEmployee(selectedEmployee)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedEmployee(null);
                }}
                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
            </div>
      )}

      {/* Employee API Test Panel - Only shows in development mode */}
      <EmployeeAPITestPanel />

      {/* Cache Status - Development Mode */}
      {shouldShowDevInfo() && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              💾 Cache Status & Debug Tools (Development)
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  cacheService.clear();
                  console.log('🧹 All cache cleared');
                  alert('Cache đã được xóa! Refresh trang để reload data.');
                }}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
              >
                Clear All Cache
              </button>
              <button
                onClick={() => {
                  console.log('🔍 Current view mode:', viewMode);
                  console.log('🔍 Cached view mode:', cacheService.getEmployeeViewMode());
                  console.log('🔍 Cache status:', cacheService.getCacheStatus());
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
              >
                Debug Info
              </button>
            </div>
          </div>
          
          {/* Current State Info */}
          <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-md">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Current State:</h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <div><strong>View Mode:</strong> {viewMode} {viewMode === 'grid' ? '🔷' : '📋'}</div>
              <div><strong>Total Employees:</strong> {allEmployees.length}</div>
              <div><strong>Filtered Employees:</strong> {filteredEmployees.length}</div>
              <div><strong>Current Page:</strong> {pagination.currentPage}/{pagination.totalPages}</div>
              <div><strong>Advanced Filters:</strong> {showAdvancedFilters ? 'Shown' : 'Hidden'}</div>
            </div>
          </div>

          {/* Cache Details */}
          <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-md">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Cache Details:</h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <div><strong>View Mode Cache:</strong> {cacheService.getEmployeeViewMode() || 'Not cached'}</div>
              <div><strong>Employee Data Cache:</strong> {cacheService.getEmployeeData() ? 'Available' : 'Not cached'}</div>
              <div><strong>Filters Cache:</strong> {cacheService.getEmployeeFilters() ? 'Available' : 'Not cached'}</div>
              <div><strong>Pagination Cache:</strong> {cacheService.getEmployeePagination() ? 'Available' : 'Not cached'}</div>
            </div>
          </div>

          {/* Full Cache Status */}
          <details className="mb-2">
            <summary className="cursor-pointer font-medium text-blue-800 dark:text-blue-200 text-sm">
              📊 Full Cache Status (Click to expand)
            </summary>
            <pre className="text-xs text-blue-700 dark:text-blue-300 overflow-auto mt-2 p-2 bg-white dark:bg-gray-800 rounded">
              {JSON.stringify(cacheService.getCacheStatus(), null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;