import { httpClient } from '../utils/httpClient';
import { API_ENDPOINTS } from '../constants/api';
import { shouldEnableLogging } from '../constants/app';
import {
  AttendanceReportRequest,
  AttendanceReportResponse,
  AttendanceReportData,
  AttendanceSummary,
  AttendanceReportFilters,
  AttendanceReportType,
} from '../types/attendance';

/**
 * Attendance Service
 * Handles all attendance-related API calls
 */
class AttendanceService {
  /**
   * Helper function for conditional logging
   */
  private log(message: string, ...args: any[]): void {
    if (shouldEnableLogging()) {
      console.log(message, ...args);
    }
  }

  private logError(message: string, ...args: any[]): void {
    if (shouldEnableLogging()) {
      console.error(message, ...args);
    }
  }

  /**
   * Determine report type based on filters
   */
  private getReportType(filters: AttendanceReportFilters): AttendanceReportType {
    if (filters.employeeId && filters.startDate && filters.endDate) {
      return 'employee_with_dates';
    } else if (filters.employeeId && !filters.startDate && !filters.endDate) {
      return 'employee_all_time';
    } else if (!filters.employeeId && filters.startDate && filters.endDate) {
      return 'all_employees_period';
    } else {
      throw new Error('Invalid filter combination. Please provide either: employeeId + dates, employeeId only, or dates only');
    }
  }

  /**
   * Get attendance report với query parameters
   * @param filters - Report filters
   * @returns Promise<AttendanceReportData>
   */
  async getAttendanceReport(filters: AttendanceReportFilters): Promise<AttendanceReportData> {
    try {
      this.log('📊 AttendanceService: Fetching attendance report with filters:', filters);

      // Validate và determine report type
      const reportType = this.getReportType(filters);
      this.log('📋 AttendanceService: Report type:', reportType);

      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.employeeId) {
        queryParams.append('employeeId', filters.employeeId.toString());
      }
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }
      
      if (filters.departmentId) {
        queryParams.append('departmentId', filters.departmentId.toString());
      }

      if (filters.status && filters.status.length > 0) {
        filters.status.forEach(status => {
          queryParams.append('status', status);
        });
      }

      const endpoint = `${API_ENDPOINTS.ATTENDANCE.REPORT}?${queryParams.toString()}`;
      this.log('🔗 AttendanceService: API endpoint:', endpoint);

      // Call API - response có thể là direct object hoặc wrapped response
      const response = await httpClient.get<AttendanceReportData | AttendanceReportResponse>(endpoint);

      this.log('🔍 AttendanceService: Raw response:', response);

      // Handle response format
      let reportData: AttendanceReportData;
      
      if (this.isWrappedResponse(response)) {
        // Response có success, message, data wrapper
        if (response.success && response.data) {
          reportData = Array.isArray(response.data) ? response.data[0] : response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch attendance report');
        }
      } else {
        // Response là direct data object
        reportData = response as AttendanceReportData;
      }

      // Validate reportData
      if (!reportData.employeeName) {
        throw new Error('Invalid response: missing employeeName');
      }

      this.log('✅ AttendanceService: Report fetched successfully:', reportData);
      return reportData;
    } catch (error) {
      this.logError('❌ AttendanceService: Failed to fetch report', error);
      throw error;
    }
  }

  /**
   * Check if response is wrapped (có success, message, data)
   */
  private isWrappedResponse(response: any): response is AttendanceReportResponse {
    return response && typeof response === 'object' && 
           ('success' in response || 'message' in response || 'data' in response);
  }

  /**
   * Get multiple employees report (for summary/list view)
   * @param filters - Report filters
   * @returns Promise<AttendanceReportData[]>
   */
  async getMultipleEmployeesReport(filters: AttendanceReportFilters): Promise<AttendanceReportData[]> {
    try {
      this.log('👥 AttendanceService: Fetching multiple employees report');

      // For now, we get single report based on filter type
      const singleReport = await this.getAttendanceReport(filters);
      
      // If it's a summary for all employees, return as array
      if (singleReport.totalEmployees && singleReport.totalEmployees > 1) {
        return [singleReport];
      }
      
      // If it's single employee, return as array
      return [singleReport];
    } catch (error) {
      this.logError('❌ AttendanceService: Failed to fetch multiple employees report', error);
      throw error;
    }
  }

  /**
   * Get single employee attendance report
   * @param employeeId - Employee ID
   * @param startDate - Start date (YYYY-MM-DD) - optional
   * @param endDate - End date (YYYY-MM-DD) - optional
   * @returns Promise<AttendanceReportData>
   */
  async getEmployeeAttendanceReport(
    employeeId: number,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceReportData> {
    try {
      this.log('👤 AttendanceService: Fetching employee report for ID:', employeeId);

      const filters: AttendanceReportFilters = { employeeId };
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      return await this.getAttendanceReport(filters);
    } catch (error) {
      this.logError('❌ AttendanceService: Failed to fetch employee report', error);
      throw error;
    }
  }

  /**
   * Get all employees summary for period
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise<AttendanceReportData>
   */
  async getAllEmployeesSummary(
    startDate: string,
    endDate: string
  ): Promise<AttendanceReportData> {
    try {
      this.log('🏢 AttendanceService: Fetching all employees summary');

      return await this.getAttendanceReport({
        startDate,
        endDate,
      });
    } catch (error) {
      this.logError('❌ AttendanceService: Failed to fetch all employees summary', error);
      throw error;
    }
  }

  /**
   * Get attendance summary statistics - tính toán từ data thực tế
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Promise<AttendanceSummary>
   */
  async getAttendanceSummary(
    startDate: string,
    endDate: string
  ): Promise<AttendanceSummary> {
    try {
      this.log('📈 AttendanceService: Calculating attendance summary');

      // Get all employees summary for the period
      const allEmployeesData = await this.getAllEmployeesSummary(startDate, endDate);

      // Calculate summary statistics from the response
      const summary: AttendanceSummary = {
        totalEmployees: allEmployeesData.totalEmployees || 1,
        averageAttendanceRate: allEmployeesData.attendanceRate || 0,
        totalPresentDays: allEmployeesData.presentInCount + allEmployeesData.comeEarlyCount,
        totalAbsentDays: allEmployeesData.absentCount,
        totalLateDays: allEmployeesData.lateCount,
        totalWorkHours: allEmployeesData.totalWorkHours,
        averageWorkHours: allEmployeesData.averageWorkHours,
        departmentStats: this.calculateDepartmentStatsFromSummary(allEmployeesData),
        monthlyTrends: [], // Would need additional API endpoint for this
      };

      this.log('✅ AttendanceService: Summary calculated:', summary);
      return summary;
    } catch (error) {
      this.logError('❌ AttendanceService: Failed to calculate summary', error);
      throw error;
    }
  }

  /**
   * Calculate department statistics từ summary data
   * @param summaryData - Summary data from API
   * @returns DepartmentStats[]
   */
  private calculateDepartmentStatsFromSummary(summaryData: AttendanceReportData) {
    // Since the API returns aggregated data, we create a single department stat
    const totalAttendance = summaryData.presentInCount + summaryData.comeEarlyCount;
    const totalExpected = summaryData.totalWorkDate || 1;
    const attendanceRate = (totalAttendance / totalExpected) * 100;
    
    const punctualityRate = summaryData.totalNotOnTimeCount > 0 
      ? ((totalAttendance - summaryData.totalNotOnTimeCount) / totalAttendance) * 100 
      : 100;

    return [{
      departmentName: summaryData.departmentName,
      employeeCount: summaryData.totalEmployees || 1,
      attendanceRate: attendanceRate,
      punctualityRate: punctualityRate,
      avgWorkHours: summaryData.averageWorkHours,
    }];
  }

  /**
   * Format date cho API calls
   * @param date - Date object
   * @returns Formatted date string (YYYY-MM-DD)
   */
  formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get current month date range
   * @returns {startDate, endDate}
   */
  getCurrentMonthRange(): { startDate: string; endDate: string } {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: this.formatDateForAPI(firstDay),
      endDate: this.formatDateForAPI(lastDay),
    };
  }

  /**
   * Get last 30 days range
   * @returns {startDate, endDate}
   */
  getLast30DaysRange(): { startDate: string; endDate: string } {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
      startDate: this.formatDateForAPI(startDate),
      endDate: this.formatDateForAPI(endDate),
    };
  }

  /**
   * Get today's date range (for testing)
   * @returns {startDate, endDate}
   */
  getTodayRange(): { startDate: string; endDate: string } {
    const today = new Date();
    const dateStr = this.formatDateForAPI(today);

    return {
      startDate: dateStr,
      endDate: dateStr,
    };
  }
}

// Create and export singleton instance
export const attendanceService = new AttendanceService();

// Export class for testing
export { AttendanceService }; 