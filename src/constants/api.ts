// API Base Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  API_VERSION: 'v1',
  TIMEOUT: 10000, // 10 seconds
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Export API_BASE_URL for convenience
export const API_BASE_URL = API_CONFIG.BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH_TOKEN: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
  },

  // User Management
  USER: {
    PROFILE: '/api/v1/user/profile',
    UPDATE_PROFILE: '/api/v1/user/profile',
    CHANGE_PASSWORD: '/api/v1/user/change-password',
    UPLOAD_AVATAR: '/api/v1/user/avatar',
  },

  // Employee Management
  EMPLOYEE: {
    LIST: '/api/v1/employees',
    CREATE: '/api/v1/employees',
    GET_BY_ID: (id: string) => `/api/v1/employees/${id}`,
    UPDATE: (id: string) => `/api/v1/employees/${id}`,
    DELETE: (id: string) => `/api/v1/employees/${id}`,
    SEARCH: '/api/v1/employees/search',
    FILTER: '/api/v1/employees/filter',
  },

  // Department Management
  DEPARTMENT: {
    LIST: '/api/v1/departments',
    CREATE: '/api/v1/departments',
    GET_BY_ID: (id: string) => `/api/v1/departments/${id}`,
    UPDATE: (id: string) => `/api/v1/departments/${id}`,
    DELETE: (id: string) => `/api/v1/departments/${id}`,
  },

  // Attendance Management
  ATTENDANCE: {
    LIST: '/api/v1/attendance',
    CHECK_IN: '/api/v1/attendance/check-in',
    CHECK_OUT: '/api/v1/attendance/check-out',
    GET_BY_DATE: (date: string) => `/api/v1/attendance/date/${date}`,
    GET_BY_EMPLOYEE: (employeeId: string) => `/api/v1/attendance/employee/${employeeId}`,
    HISTORY: '/api/v1/attendance/history',
    STATISTICS: '/api/v1/attendance/statistics',
    REPORT: '/api/v1/attendance/report',
  },

  // Shift Management
  SHIFT: {
    LIST: '/api/v1/shifts',
    CREATE: '/api/v1/shifts',
    GET_BY_ID: (id: string) => `/api/v1/shifts/${id}`,
    UPDATE: (id: string) => `/api/v1/shifts/${id}`,
    DELETE: (id: string) => `/api/v1/shifts/${id}`,
    ASSIGN: '/api/v1/shifts/assign',
    UNASSIGN: '/api/v1/shifts/unassign',
  },

  // Reports & Statistics
  REPORTS: {
    ATTENDANCE_REPORT: '/api/v1/reports/attendance',
    EMPLOYEE_REPORT: '/api/v1/reports/employee',
    DEPARTMENT_REPORT: '/api/v1/reports/department',
    EXPORT_PDF: '/api/v1/reports/export/pdf',
    EXPORT_EXCEL: '/api/v1/reports/export/excel',
  },
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  TIMEOUT_ERROR: 'Yêu cầu hết thời gian chờ',
  UNAUTHORIZED: 'Không có quyền truy cập',
  FORBIDDEN: 'Truy cập bị từ chối',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Lỗi máy chủ',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
} as const; 