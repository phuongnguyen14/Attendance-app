// Authentication Request Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Authentication Response Types
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    departmentDisplayName: string;
    departmentName: string;
    email: string;
    employeeId: number;
    fullName: string;
    id: number;
    message: string;
    role: string;
    token: string;
    username: string;
  };
}

export interface User {
  id: string;
  employeeId: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar?: string;
  department: {
    id: string;
    name: string;
  };
  position?: string;
  role: string;
  status: UserStatus;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiError[];
  pagination?: Pagination;
}

export interface ApiError {
  field?: string;
  code: string;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Token Types
export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (passwords: ChangePasswordRequest) => Promise<void>;
  debugAuthState?: () => void; // Debug helper for development
}

// Form Validation Types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentName: string;
  agreeToTerms: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

// API Error Types
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: ApiError[];
  timestamp: string;
  path: string;
  status: number;
} 