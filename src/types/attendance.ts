// Attendance Report Request Types
export interface AttendanceReportRequest {
  employeeId?: number;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string;   // Format: YYYY-MM-DD
}

// Attendance Report Response Types - Cập nhật theo response thực tế
export interface AttendanceReportData {
  employeeId?: number;
  employeeName: string;
  departmentName: string;
  position?: string; // Có thể có trong case tổng hợp
  totalEmployees?: number; // Có trong case tổng hợp tất cả nhân viên
  
  // Work statistics
  totalDays?: number;
  totalWorkDate: number;
  averageWorkDate?: number; // Có trong case tổng hợp
  totalAttendance?: number;
  totalWorkHours: number;
  averageWorkHours: number;
  attendanceRate?: number; // Percentage (0-100) - chỉ có khi có employeeId + dates
  
  // Attendance breakdown
  comeEarlyCount: number;
  presentInCount: number;
  lateCount: number;
  presentOutCount: number;
  earlyLeaveCount: number;
  absentCount: number;
  leaveCount: number;
  
  // Timing statistics
  totalNotOnTimeCount: number;
  totalNotOnTimeMinutes: number;
  overtimeCount: number;
  totalOvertimeMinutes: number;
}

export interface AttendanceDetail {
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours: number;
  status: AttendanceStatus;
  isLate: boolean;
  isEarlyLeave: boolean;
  overtimeHours: number;
  notes?: string;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EARLY_LEAVE = 'EARLY_LEAVE',
  OVERTIME = 'OVERTIME',
  HOLIDAY = 'HOLIDAY',
  WEEKEND = 'WEEKEND',
  SICK_LEAVE = 'SICK_LEAVE',
  ANNUAL_LEAVE = 'ANNUAL_LEAVE',
}

export interface AttendanceReportResponse {
  success?: boolean;
  message?: string;
  data?: AttendanceReportData | AttendanceReportData[];
}

// Summary Statistics - Tính toán từ data thực tế
export interface AttendanceSummary {
  totalEmployees: number;
  averageAttendanceRate: number;
  totalPresentDays: number;
  totalAbsentDays: number;
  totalLateDays: number;
  totalWorkHours: number;
  averageWorkHours: number;
  departmentStats: DepartmentStats[];
  monthlyTrends: MonthlyTrend[];
}

export interface DepartmentStats {
  departmentName: string;
  employeeCount: number;
  attendanceRate: number;
  punctualityRate: number;
  avgWorkHours: number;
}

export interface MonthlyTrend {
  month: string;
  attendanceRate: number;
  totalWorkingDays: number;
  totalPresentDays: number;
}

// Filter Options
export interface AttendanceReportFilters {
  employeeId?: number;
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  status?: AttendanceStatus[];
}

// Helper type để distinguish response types
export type AttendanceReportType = 
  | 'employee_with_dates'    // employeeId + startDate + endDate
  | 'employee_all_time'      // chỉ employeeId
  | 'all_employees_period';  // chỉ startDate + endDate 