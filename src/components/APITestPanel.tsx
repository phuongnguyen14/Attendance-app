import React, { useState } from 'react';
import { Play, Code, CheckCircle, XCircle, Clock, User, Calendar, Users } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';
import { shouldShowDevInfo } from '../constants/app';

interface APITestPanelProps {
  className?: string;
}

type TestScenario = 'employee_with_dates' | 'employee_all_time' | 'all_employees_period';

const APITestPanel: React.FC<APITestPanelProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<TestScenario>('employee_with_dates');

  // Only show in development mode when dev info is enabled
  if (!shouldShowDevInfo()) {
    return null;
  }

  const getTestFilters = (scenario: TestScenario) => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (scenario) {
      case 'employee_with_dates':
        return {
          employeeId: 2000,
          startDate: today,
          endDate: today,
          description: 'Test với employeeId + startDate + endDate',
          expectedFields: ['attendanceRate', 'totalDays', 'totalWorkDate']
        };
      case 'employee_all_time':
        return {
          employeeId: 2000,
          description: 'Test với chỉ employeeId (tất cả thời gian)',
          expectedFields: ['totalWorkDate', 'averageWorkHours', 'không có attendanceRate']
        };
      case 'all_employees_period':
        return {
          startDate: today,
          endDate: today,
          description: 'Test với chỉ startDate + endDate (tất cả nhân viên)',
          expectedFields: ['totalEmployees', 'employeeName như "TẤT CẢ NHÂN VIÊN"', 'position']
        };
      default:
        return {};
    }
  };

  const runAPITest = async () => {
    try {
      setIsLoading(true);
      setError('');
      setTestResult(null);

      const testConfig = getTestFilters(selectedScenario);
      console.log('🧪 APITestPanel: Running attendance report API test');
      console.log('📊 APITestPanel: Test scenario:', selectedScenario);
      console.log('📊 APITestPanel: Test config:', testConfig);

      let result;
      const startTime = Date.now();

      switch (selectedScenario) {
        case 'employee_with_dates':
          result = await attendanceService.getEmployeeAttendanceReport(
            testConfig.employeeId!,
            testConfig.startDate,
            testConfig.endDate
          );
          break;
        case 'employee_all_time':
          result = await attendanceService.getEmployeeAttendanceReport(
            testConfig.employeeId!
          );
          break;
        case 'all_employees_period':
          result = await attendanceService.getAllEmployeesSummary(
            testConfig.startDate!,
            testConfig.endDate!
          );
          break;
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setTestResult({
        success: true,
        scenario: selectedScenario,
        description: testConfig.description,
        expectedFields: testConfig.expectedFields,
        data: result,
        responseTime: responseTime,
        endpoint: '/api/v1/attendance/report',
        params: {
          employeeId: testConfig.employeeId,
          startDate: testConfig.startDate,
          endDate: testConfig.endDate,
        },
        timestamp: new Date().toISOString(),
      });

      console.log('✅ APITestPanel: Test successful', result);
    } catch (err: any) {
      console.error('❌ APITestPanel: Test failed', err);
      setError(err.message || 'API test failed');
      setTestResult({
        success: false,
        scenario: selectedScenario,
        error: err.message,
        endpoint: '/api/v1/attendance/report',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scenarios = [
    {
      id: 'employee_with_dates' as TestScenario,
      label: 'Nhân viên + Khoảng thời gian',
      icon: User,
      description: 'employeeId + startDate + endDate'
    },
    {
      id: 'employee_all_time' as TestScenario,
      label: 'Nhân viên tất cả thời gian',
      icon: Calendar,
      description: 'Chỉ employeeId'
    },
    {
      id: 'all_employees_period' as TestScenario,
      label: 'Tất cả nhân viên theo thời gian',
      icon: Users,
      description: 'Chỉ startDate + endDate'
    }
  ];

  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Code className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            API Test Panel (Development)
          </h3>
        </div>
        
        <button
          onClick={runAPITest}
          disabled={isLoading}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Testing...' : 'Test API'}</span>
        </button>
      </div>

      {/* Scenario Selection */}
      <div className="mb-4">
        <div className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-2">
          Chọn test scenario:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedScenario === scenario.id
                    ? 'bg-yellow-100 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
                }`}
              >
                <div className="flex items-center mb-1">
                  <Icon className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {scenario.label}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {scenario.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-yellow-800 dark:text-yellow-200 text-sm mb-4">
        <strong>Test Endpoint:</strong> GET /api/v1/attendance/report<br />
        <strong>Selected Scenario:</strong> {getTestFilters(selectedScenario).description}<br />
        <strong>Expected Fields:</strong> {getTestFilters(selectedScenario).expectedFields?.join(', ')}
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center mb-2">
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={`font-medium ${
              testResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {testResult.success ? 'API Test Successful' : 'API Test Failed'}
            </span>
            <Clock className="w-4 h-4 text-gray-400 ml-auto mr-1" />
            <span className="text-xs text-gray-500">
              {new Date(testResult.timestamp).toLocaleTimeString()}
              {testResult.responseTime && (
                <span className="ml-1">({testResult.responseTime}ms)</span>
              )}
            </span>
          </div>

          {testResult.success && testResult.data && (
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-md">
              <div className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">
                Key Data Summary:
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                <div><strong>Tên:</strong> {testResult.data.employeeName}</div>
                <div><strong>Phòng ban:</strong> {testResult.data.departmentName}</div>
                
                {/* Basic Info */}
                {testResult.data.employeeId && (
                  <div><strong>Employee ID:</strong> {testResult.data.employeeId}</div>
                )}
                {testResult.data.totalEmployees && (
                  <div><strong>Tổng nhân viên:</strong> {testResult.data.totalEmployees}</div>
                )}
                {testResult.data.position && (
                  <div><strong>Vị trí:</strong> {testResult.data.position}</div>
                )}
                
                {/* Work Statistics */}
                <div><strong>Ngày làm việc:</strong> {testResult.data.totalWorkDate}</div>
                {testResult.data.totalDays && (
                  <div><strong>Tổng ngày trong kỳ:</strong> {testResult.data.totalDays}</div>
                )}
                {testResult.data.averageWorkDate && (
                  <div><strong>Trung bình ngày làm:</strong> {testResult.data.averageWorkDate}</div>
                )}
                {testResult.data.totalAttendance && (
                  <div><strong>Tổng lần chấm công:</strong> {testResult.data.totalAttendance}</div>
                )}
                
                {/* Time Statistics */}
                <div><strong>Tổng giờ làm:</strong> {testResult.data.totalWorkHours.toFixed(1)}h</div>
                <div><strong>Giờ làm trung bình:</strong> {testResult.data.averageWorkHours?.toFixed(2)}h</div>
                {testResult.data.attendanceRate !== undefined && (
                  <div><strong>Tỷ lệ chấm công:</strong> {testResult.data.attendanceRate.toFixed(1)}%</div>
                )}
                
                {/* Attendance Breakdown */}
                <div className="border-t border-green-200 dark:border-green-800 pt-1 mt-1">
                  <div><strong>Có mặt:</strong> Đúng giờ: {testResult.data.presentInCount}, Sớm: {testResult.data.comeEarlyCount}</div>
                  <div><strong>Vấn đề:</strong> Muộn: {testResult.data.lateCount}, Về sớm: {testResult.data.earlyLeaveCount}, Vắng: {testResult.data.absentCount}</div>
                  <div><strong>Overtime:</strong> {testResult.data.overtimeCount} lần, {(testResult.data.totalOvertimeMinutes / 60).toFixed(1)}h</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
              <strong>Full Response:</strong>
            </div>
            <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              <strong>API Error:</strong> {error}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default APITestPanel; 