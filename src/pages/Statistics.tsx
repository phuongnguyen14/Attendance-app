import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Search,
  Download,
  Filter,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { attendanceService } from '../services/attendanceService';
import {
  AttendanceReportData,
  AttendanceSummary,
  AttendanceReportFilters,
  AttendanceStatus,
} from '../types/attendance';
import APITestPanel from '../components/APITestPanel';

const Statistics: React.FC = () => {
  const { t } = useLanguage();

  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'report'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [reportData, setReportData] = useState<AttendanceReportData[]>([]);
  
  // Filter state
  const [filters, setFilters] = useState<AttendanceReportFilters>(() => {
    // Sử dụng today's date để có data để test
    const today = attendanceService.formatDateForAPI(new Date());
    return {
      startDate: today,
      endDate: today,
      employeeId: undefined,
      departmentId: undefined,
      status: undefined,
    };
  });

  // Load initial data
  useEffect(() => {
    // Auto-load summary data khi component mount
    loadSummaryData();
    // Auto-load report data để có sẵn data
    loadReportData();
  }, []);

  // Auto-reload data khi filters change
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      // Debounce để tránh call API quá nhiều
      const timeoutId = setTimeout(() => {
        if (activeTab === 'overview') {
          loadSummaryData();
        } else if (activeTab === 'report') {
          loadReportData();
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [filters.startDate, filters.endDate, filters.employeeId, activeTab]);

  const loadSummaryData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const summaryData = await attendanceService.getAttendanceSummary(
        filters.startDate,
        filters.endDate
      );
      
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Use new service method để get data dựa trên filters
      if (filters.employeeId) {
        // Single employee report
        const report = await attendanceService.getEmployeeAttendanceReport(
          filters.employeeId,
          filters.startDate,
          filters.endDate
        );
        setReportData([report]);
      } else if (filters.startDate && filters.endDate) {
        // All employees summary
        const allEmployeesSummary = await attendanceService.getAllEmployeesSummary(
          filters.startDate,
          filters.endDate
        );
        setReportData([allEmployeesSummary]);
      } else {
        setError('Vui lòng chọn ít nhất một trong: Mã nhân viên hoặc Khoảng thời gian');
        return;
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải báo cáo chấm công');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof AttendanceReportFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    // Force reload data với filters hiện tại
    if (activeTab === 'overview') {
      loadSummaryData();
    } else if (activeTab === 'report') {
      loadReportData();
    }
  };

  const handleTabChange = (newTab: 'overview' | 'report') => {
    setActiveTab(newTab);
    
    // Auto-load data cho tab mới
    setTimeout(() => {
      if (newTab === 'overview') {
        loadSummaryData();
      } else if (newTab === 'report') {
        loadReportData();
      }
    }, 100);
  };

  const setDateRange = (range: 'currentMonth' | 'last30Days' | 'today' | 'custom') => {
    let newRange;
    switch (range) {
      case 'currentMonth':
        newRange = attendanceService.getCurrentMonthRange();
        break;
      case 'last30Days':
        newRange = attendanceService.getLast30DaysRange();
        break;
      case 'today':
        newRange = attendanceService.getTodayRange();
        break;
      default:
        return;
    }
    
    setFilters(prev => ({
      ...prev,
      ...newRange,
    }));
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: AttendanceStatus): string => {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'text-emerald-600 bg-emerald-100';
      case AttendanceStatus.ABSENT:
        return 'text-red-600 bg-red-100';
      case AttendanceStatus.LATE:
        return 'text-amber-600 bg-amber-100';
      case AttendanceStatus.EARLY_LEAVE:
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('nav.statistics')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
            Thống kê và báo cáo chấm công chi tiết
        </p>
      </div>
        
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo</span>
        </button>
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

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Bộ lọc thống kê
          </h3>
          
          {/* Quick Date Ranges */}
          <div className="flex space-x-2">
            <button
              onClick={() => setDateRange('today')}
              className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md text-blue-800 dark:text-blue-200"
            >
              Hôm nay
            </button>
            <button
              onClick={() => setDateRange('currentMonth')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            >
              Tháng này
            </button>
            <button
              onClick={() => setDateRange('last30Days')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            >
              30 ngày qua
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Employee ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mã nhân viên (tùy chọn)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={filters.employeeId || ''}
                onChange={(e) => handleFilterChange('employeeId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập ID nhân viên"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Từ ngày
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đến ngày
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
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
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
          { id: 'report', label: 'Báo cáo chi tiết', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Loading State for Overview */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải dữ liệu thống kê...</span>
            </div>
          )}

      {/* Key Metrics */}
          {!isLoading && summary && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tỷ lệ chấm công trung bình
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPercentage(summary.averageAttendanceRate)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">Live data</span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Tổng nhân viên
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary.totalEmployees}
              </p>
              <div className="flex items-center mt-2">
                      <Users className="w-4 h-4 text-purple-500 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Đang hoạt động</span>
              </div>
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
                      Tổng giờ làm việc
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary.totalWorkHours.toFixed(0)}h
              </p>
              <div className="flex items-center mt-2">
                      <Clock className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        TB: {summary.averageWorkHours.toFixed(1)}h
                      </span>
              </div>
            </div>
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Ngày đi muộn
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {summary.totalLateDays}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {summary.totalPresentDays > 0 
                          ? `${((summary.totalLateDays / summary.totalPresentDays) * 100).toFixed(1)}%`
                          : '0%'
                        } tổng số
                      </span>
              </div>
            </div>
            <div className="bg-amber-500 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!isLoading && !summary && !error && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Chưa có dữ liệu thống kê
              </p>
              <button
                onClick={loadSummaryData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Tải dữ liệu
              </button>
          </div>
          )}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Báo cáo chấm công chi tiết
          </h3>
          </div>
          
          {reportData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nhân viên / Tổng hợp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Phòng ban
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ngày làm việc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Có mặt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Đi muộn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Vắng mặt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Giờ làm TB
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Overtime
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tỷ lệ chấm công
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {reportData.map((report, index) => (
                    <tr key={report.employeeId || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {report.employeeName}
                          </div>
                          {report.employeeId && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {report.employeeId}
                            </div>
                          )}
                          {report.totalEmployees && (
                            <div className="text-sm text-emerald-600 dark:text-emerald-400">
                              {report.totalEmployees} nhân viên
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {report.departmentName}
                        {report.position && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {report.position}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{report.totalWorkDate}</div>
                        {report.totalDays && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            trong {report.totalDays} ngày
                          </div>
                        )}
                        {report.averageWorkDate && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            TB: {report.averageWorkDate.toFixed(1)} ngày
                          </div>
                        )}
                        {report.totalAttendance && (
                          <div className="text-xs text-emerald-600 dark:text-emerald-400">
                            {report.totalAttendance} lần chấm công
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          <div>Đúng giờ: {report.presentInCount}</div>
                          <div className="text-emerald-600">Sớm: {report.comeEarlyCount}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          report.lateCount === 0 ? 'bg-green-100 text-green-800' :
                          report.lateCount < 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.lateCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          <div>Vắng: {report.absentCount}</div>
                          <div className="text-blue-600">Nghỉ phép: {report.leaveCount}</div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>{report.averageWorkHours.toFixed(2)}h</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tổng: {report.totalWorkHours.toFixed(1)}h
                  </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          <div>{report.overtimeCount} lần</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {(report.totalOvertimeMinutes / 60).toFixed(1)}h
                  </div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {report.attendanceRate !== undefined ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            report.attendanceRate >= 95 ? 'bg-green-100 text-green-800' :
                            report.attendanceRate >= 85 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {formatPercentage(report.attendanceRate)}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <BarChart3 className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có dữ liệu báo cáo. Hãy thực hiện tìm kiếm để xem kết quả.
              </p>
          </div>
          )}
        </div>
      )}

      {/* API Test Panel - Only shows in development mode */}
      <APITestPanel />
    </div>
  );
};

export default Statistics;