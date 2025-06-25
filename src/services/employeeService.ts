import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../constants/api';
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeSearchFilters,
  EmployeeListResponse,
  EmployeeResponse,
  EmployeeSearchResponse,
  EmployeeStats,
  EmployeeStatsResponse,
  Department,
  DepartmentListResponse,
  EmployeeActivity,
  EmployeeActivityResponse,
  UploadAvatarResponse,
} from '../types/employee';
import { conditionalLog, shouldShowDevInfo } from '../constants/app';

class EmployeeService {
  /**
   * Get all employees
   */
  async getAllEmployees(): Promise<Employee[]> {
    try {
      conditionalLog('🔄 EmployeeService: Fetching all employees');
      
      const response = await httpClient.get<EmployeeListResponse>(API_ENDPOINTS.EMPLOYEE.LIST);
      const normalizedResponse = this.normalizeEmployeeListResponse(response);
      
      conditionalLog('✅ EmployeeService: Successfully fetched employees', normalizedResponse);
      
      if (Array.isArray(normalizedResponse)) {
        return normalizedResponse;
      } else if (normalizedResponse.employees) {
        return normalizedResponse.employees;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error('❌ EmployeeService: Failed to fetch employees', error);
      throw new Error(error.message || 'Không thể tải danh sách nhân viên');
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    try {
      conditionalLog(`🔄 EmployeeService: Fetching employee ${id}`);
      
      const response = await httpClient.get<EmployeeResponse>(API_ENDPOINTS.EMPLOYEE.GET_BY_ID(id));
      const employee = this.normalizeEmployeeResponse(response);
      
      conditionalLog('✅ EmployeeService: Successfully fetched employee', employee);
      return employee;
    } catch (error: any) {
      console.error(`❌ EmployeeService: Failed to fetch employee ${id}`, error);
      throw new Error(error.message || 'Không thể tải thông tin nhân viên');
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    try {
      conditionalLog('🔄 EmployeeService: Creating new employee', employeeData);
      
      const response = await httpClient.post<EmployeeResponse>(
        API_ENDPOINTS.EMPLOYEE.CREATE,
        employeeData
      );
      const employee = this.normalizeEmployeeResponse(response);
      
      conditionalLog('✅ EmployeeService: Successfully created employee', employee);
      return employee;
    } catch (error: any) {
      console.error('❌ EmployeeService: Failed to create employee', error);
      throw new Error(error.message || 'Không thể tạo nhân viên mới');
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(id: string, employeeData: UpdateEmployeeRequest): Promise<Employee> {
    try {
      conditionalLog(`🔄 EmployeeService: Updating employee ${id}`, employeeData);
      
      const response = await httpClient.put<EmployeeResponse>(
        API_ENDPOINTS.EMPLOYEE.UPDATE(id),
        employeeData
      );
      const employee = this.normalizeEmployeeResponse(response);
      
      conditionalLog('✅ EmployeeService: Successfully updated employee', employee);
      return employee;
    } catch (error: any) {
      console.error(`❌ EmployeeService: Failed to update employee ${id}`, error);
      throw new Error(error.message || 'Không thể cập nhật thông tin nhân viên');
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      conditionalLog(`🔄 EmployeeService: Deleting employee ${id}`);
      
      await httpClient.delete(API_ENDPOINTS.EMPLOYEE.DELETE(id));
      
      conditionalLog('✅ EmployeeService: Successfully deleted employee');
    } catch (error: any) {
      console.error(`❌ EmployeeService: Failed to delete employee ${id}`, error);
      throw new Error(error.message || 'Không thể xóa nhân viên');
    }
  }

  /**
   * Search employees with filters and pagination
   */
  async searchEmployees(filters: EmployeeSearchFilters = {}): Promise<EmployeeSearchResponse> {
    try {
      conditionalLog('🔄 EmployeeService: Filtering employees', filters);
      
      const queryParams = new URLSearchParams();
      
      // Add all filter parameters according to API specification
      if (filters.id) queryParams.append('id', filters.id);
      if (filters.username) queryParams.append('username', filters.username);
      if (filters.fullName) queryParams.append('fullName', filters.fullName);
      if (filters.email) queryParams.append('email', filters.email);
      if (filters.phoneNumber) queryParams.append('phoneNumber', filters.phoneNumber);
      if (filters.position) queryParams.append('position', filters.position);
      
      // Legacy support: map 'name' to 'fullName' if fullName not provided
      if (filters.name && !filters.fullName) {
        queryParams.append('fullName', filters.name);
      }
      
      // Department filter (support both department and departmentId)
      if (filters.departmentId) {
        queryParams.append('departmentId', filters.departmentId);
      } else if (filters.department) {
        queryParams.append('departmentId', filters.department);
      }
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.joinDateFrom) queryParams.append('joinDateFrom', filters.joinDateFrom);
      if (filters.joinDateTo) queryParams.append('joinDateTo', filters.joinDateTo);
      if (filters.salaryMin) queryParams.append('salaryMin', filters.salaryMin.toString());
      if (filters.salaryMax) queryParams.append('salaryMax', filters.salaryMax.toString());
      
      // Add pagination (support both limit and size)
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.size) {
        queryParams.append('size', filters.size.toString());
      } else if (filters.limit) {
        queryParams.append('size', filters.limit.toString());
      }
      
      // Add sorting (support both sortOrder and direction)
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.direction) {
        queryParams.append('direction', filters.direction);
      } else if (filters.sortOrder) {
        queryParams.append('direction', filters.sortOrder);
      }
      
      const url = `${API_ENDPOINTS.EMPLOYEE.FILTER}?${queryParams.toString()}`;
      const response = await httpClient.get<EmployeeListResponse>(url);
      const normalizedResponse = this.normalizeEmployeeListResponse(response);
      
      conditionalLog('✅ EmployeeService: Successfully filtered employees', normalizedResponse);
      conditionalLog('🔗 EmployeeService: Filter URL', url);
      
      // Return normalized search response
      if (Array.isArray(normalizedResponse)) {
        return {
          employees: normalizedResponse,
          pagination: {
            page: filters.page || 1,
            limit: filters.limit || filters.size || 10,
            total: normalizedResponse.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      } else {
        return normalizedResponse;
      }
    } catch (error: any) {
      console.error('❌ EmployeeService: Failed to filter employees', error);
      throw new Error(error.message || 'Không thể tìm kiếm nhân viên');
    }
  }

  /**
   * Get employee statistics
   */
  async getEmployeeStats(): Promise<EmployeeStats> {
    try {
      conditionalLog('🔄 EmployeeService: Fetching employee statistics');
      
      const response = await httpClient.get<EmployeeStatsResponse>('/api/v1/employees/stats');
      
      conditionalLog('✅ EmployeeService: Successfully fetched employee stats', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ EmployeeService: Failed to fetch employee stats', error);
      
      // Return mock stats if API not available
      return this.getMockEmployeeStats();
    }
  }

  /**
   * Get all departments for employee form
   */
  async getDepartments(): Promise<Department[]> {
    try {
      conditionalLog('🔄 EmployeeService: Fetching departments');
      
      const response = await httpClient.get<DepartmentListResponse>(API_ENDPOINTS.DEPARTMENT.LIST);
      
      conditionalLog('✅ EmployeeService: Successfully fetched departments', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ EmployeeService: Failed to fetch departments', error);
      
      // Return mock departments if API not available
      return this.getMockDepartments();
    }
  }

  /**
   * Upload employee avatar
   */
  async uploadAvatar(employeeId: string, file: File): Promise<string> {
    try {
      conditionalLog(`🔄 EmployeeService: Uploading avatar for employee ${employeeId}`);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await httpClient.post<UploadAvatarResponse>(
        `/api/v1/employees/${employeeId}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      conditionalLog('✅ EmployeeService: Successfully uploaded avatar', response.data.avatarUrl);
      return response.data.avatarUrl;
    } catch (error: any) {
      console.error(`❌ EmployeeService: Failed to upload avatar for employee ${employeeId}`, error);
      throw new Error(error.message || 'Không thể tải lên ảnh đại diện');
    }
  }

  /**
   * Get employee activity log
   */
  async getEmployeeActivity(employeeId: string): Promise<EmployeeActivity[]> {
    try {
      conditionalLog(`🔄 EmployeeService: Fetching activity for employee ${employeeId}`);
      
      const response = await httpClient.get<EmployeeActivityResponse>(
        `/api/v1/employees/${employeeId}/activity`
      );
      
      conditionalLog('✅ EmployeeService: Successfully fetched employee activity', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ EmployeeService: Failed to fetch employee activity for ${employeeId}`, error);
      return [];
    }
  }

  /**
   * Normalize employee list response to handle different backend response formats
   */
  private normalizeEmployeeListResponse(response: any): Employee[] | EmployeeSearchResponse {
    conditionalLog('🔄 EmployeeService: Normalizing employee list response', response);

    // Handle wrapped response
    if (response.data) {
      if (Array.isArray(response.data)) {
        return response.data.map(emp => this.normalizeEmployeeData(emp));
      } else if (response.data.employees) {
        return {
          employees: response.data.employees.map(emp => this.normalizeEmployeeData(emp)),
          pagination: response.data.pagination || {
            page: 1,
            limit: 10,
            total: response.data.employees.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      } else {
        return this.normalizeEmployeeData(response.data);
      }
    }

    // Handle direct array response
    if (Array.isArray(response)) {
      return response.map(emp => this.normalizeEmployeeData(emp));
    }

    // Handle pagination response
    if (response.employees) {
      return {
        employees: response.employees.map(emp => this.normalizeEmployeeData(emp)),
        pagination: response.pagination,
      };
    }

    // Default to empty array
    return [];
  }

  /**
   * Normalize employee response
   */
  private normalizeEmployeeResponse(response: any): Employee {
    conditionalLog('🔄 EmployeeService: Normalizing employee response', response);

    if (response.data) {
      return this.normalizeEmployeeData(response.data);
    }

    return this.normalizeEmployeeData(response);
  }

  /**
   * Normalize employee data to ensure consistent format
   */
  private normalizeEmployeeData(employee: any): Employee {
    return {
      id: employee.id?.toString() || employee.employeeId?.toString() || '0',
      username: employee.username || employee.userName,
      fullName: employee.fullName || employee.full_name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
      firstName: employee.firstName || employee.first_name,
      lastName: employee.lastName || employee.last_name,
      email: employee.email,
      phoneNumber: employee.phoneNumber || employee.phone_number || employee.phone,
      avatar: employee.avatar || employee.avatarUrl,
      department: {
        id: employee.department?.id?.toString() || employee.departmentId?.toString() || '0',
        name: employee.department?.name || employee.departmentName || employee.departmentDisplayName || 'Unknown Department',
      },
      position: employee.position || employee.jobTitle,
      jobTitle: employee.jobTitle || employee.position,
      status: employee.status || 'ACTIVE',
      salary: employee.salary ? parseFloat(employee.salary) : undefined,
      birthDate: employee.birthDate || employee.birth_date || employee.dateOfBirth,
      joinDate: employee.joinDate || employee.join_date || new Date().toISOString(),
      address: employee.address,
      emergencyContact: employee.emergencyContact || employee.emergency_contact,
      skills: employee.skills || [],
      roles: employee.roles || (employee.role ? [{ id: '1', name: employee.role }] : []),
      createdAt: employee.createdAt || employee.created_at || new Date().toISOString(),
      updatedAt: employee.updatedAt || employee.updated_at || new Date().toISOString(),
      lastLoginAt: employee.lastLoginAt || employee.last_login_at,
    };
  }

  /**
   * Get mock employee stats for development/fallback
   */
  private getMockEmployeeStats(): EmployeeStats {
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      inactiveEmployees: 0,
      onLeaveEmployees: 0,
      newEmployeesThisMonth: 0,
      averageSalary: 0,
      departmentDistribution: [],
      positionDistribution: [],
      ageDistribution: [],
    };
  }

  /**
   * Get mock departments for development/fallback
   */
  private getMockDepartments(): Department[] {
    return [
      { id: 'IT', name: 'Phòng công nghệ thông tin' },
      { id: 'MARKETING', name: 'Phòng quảng bá' },
      { id: 'HR', name: 'Human Resources' },
      { id: 'ACCOUNTING', name: 'Phòng kế toán' },
      { id: 'PRODUCTION', name: 'Phòng sản xuất' },
      { id: 'LEGAL', name: 'Pháp chế, hợp đồng' },
      { id: 'QA', name: 'Đảm bảo chất lượng' },
      { id: 'PROJECT_MANAGEMENT', name: 'Quản lý dự án' },
      { id: 'CORPORATE_COMMUNICATION', name: 'Truyền thông' },
      { id: 'TEST_DEPARTMENT', name: 'Phòng ban test' },
    ];
  }

  /**
   * Helper methods for status management
   */
  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'ON_LEAVE':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'INACTIVE':
      case 'TERMINATED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  }

  getStatusText(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'ON_LEAVE':
        return 'Nghỉ phép';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'SUSPENDED':
        return 'Tạm ngừng';
      case 'TERMINATED':
        return 'Đã nghỉ việc';
      case 'PENDING':
        return 'Chờ xử lý';
      default:
        return status;
    }
  }

  /**
   * Format salary for display
   */
  formatSalary(salary?: number): string {
    if (!salary) return 'Chưa cập nhật';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(salary);
  }

  /**
   * Format date for display
   */
  formatDate(date?: string): string {
    if (!date) return 'Chưa cập nhật';
    return new Date(date).toLocaleDateString('vi-VN');
  }
}

export const employeeService = new EmployeeService(); 