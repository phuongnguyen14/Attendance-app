// Employee Types and Interfaces

export interface Employee {
  id: string;
  username?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  department: {
    id: string;
    name: string;
  };
  position?: string;
  jobTitle?: string;
  status: EmployeeStatus;
  salary?: number;
  birthDate?: string;
  joinDate: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills?: string[];
  roles?: Role[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CreateEmployeeRequest {
  username?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  departmentName?: string;
  position?: string;
  jobTitle?: string;
  salary?: number;
  birthDate?: string;
  joinDate: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills?: string[];
  password?: string; // For creating login account
}

export interface UpdateEmployeeRequest {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  departmentId?: string;
  departmentName?: string;
  position?: string;
  jobTitle?: string;
  salary?: number;
  birthDate?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills?: string[];
  status?: EmployeeStatus;
}

export interface EmployeeSearchFilters {
  // Basic filters
  id?: string;
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  
  // Legacy name field (for backward compatibility)
  name?: string;
  
  // Department and status
  department?: string; // Maps to departmentId
  departmentId?: string;
  status?: EmployeeStatus;
  
  // Date range filters
  joinDateFrom?: string;
  joinDateTo?: string;
  
  // Salary range filters
  salaryMin?: number;
  salaryMax?: number;
  
  // Pagination
  page?: number;
  limit?: number; // Maps to size parameter
  size?: number;
  
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc'; // Maps to direction parameter
  direction?: 'asc' | 'desc';
}

export interface EmployeeSearchResponse {
  employees: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface EmployeeListResponse {
  success: boolean;
  message: string;
  data: Employee[] | EmployeeSearchResponse;
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
  PENDING = 'PENDING',
}

export interface Role {
  id: string;
  name: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

// Department for employee selection
export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: {
    id: string;
    name: string;
  };
  employeeCount?: number;
  location?: string;
  budget?: number;
  establishedDate?: string;
}

export interface DepartmentListResponse {
  success: boolean;
  message: string;
  data: Department[];
}

// Employee Statistics
export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  onLeaveEmployees: number;
  newEmployeesThisMonth: number;
  averageSalary: number;
  departmentDistribution: {
    department: string;
    count: number;
    percentage: number;
  }[];
  positionDistribution: {
    position: string;
    count: number;
    percentage: number;
  }[];
  ageDistribution: {
    ageRange: string;
    count: number;
    percentage: number;
  }[];
}

export interface EmployeeStatsResponse {
  success: boolean;
  message: string;
  data: EmployeeStats;
}

// Form data for validation
export interface EmployeeFormData {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
  position: string;
  salary: string;
  birthDate: string;
  joinDate: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  skills: string;
  status: EmployeeStatus;
}

export interface EmployeeValidationError {
  field: string;
  message: string;
}

// Upload avatar response
export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  data: {
    avatarUrl: string;
  };
}

// Employee activity log
export interface EmployeeActivity {
  id: string;
  employeeId: string;
  action: string;
  description: string;
  timestamp: string;
  performedBy: {
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
}

export interface EmployeeActivityResponse {
  success: boolean;
  message: string;
  data: EmployeeActivity[];
} 