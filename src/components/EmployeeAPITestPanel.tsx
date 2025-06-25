import React, { useState } from 'react';
import { Play, Code, CheckCircle, XCircle, Clock, User, Users, Search, Plus, Edit, Trash } from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { shouldShowDevInfo } from '../constants/app';
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeSearchFilters,
  EmployeeStatus,
} from '../types/employee';

interface EmployeeAPITestPanelProps {
  className?: string;
}

type TestScenario = 
  | 'get_all_employees' 
  | 'get_employee_by_id' 
  | 'search_employees' 
  | 'create_employee' 
  | 'update_employee' 
  | 'delete_employee'
  | 'get_stats'
  | 'get_departments';

const EmployeeAPITestPanel: React.FC<EmployeeAPITestPanelProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<TestScenario>('get_all_employees');

  // Only show in development mode when dev info is enabled
  if (!shouldShowDevInfo()) {
    return null;
  }

  const getTestConfig = (scenario: TestScenario) => {
    switch (scenario) {
      case 'get_all_employees':
        return {
          description: 'Lấy tất cả nhân viên từ API',
          expectedFields: ['id', 'fullName', 'email', 'department', 'status'],
          endpoint: 'GET /api/v1/employees'
        };
      case 'get_employee_by_id':
        return {
          description: 'Lấy thông tin nhân viên theo ID',
          expectedFields: ['id', 'fullName', 'email', 'phoneNumber', 'department'],
          endpoint: 'GET /api/v1/employees/{id}',
          testId: '1'
        };
      case 'search_employees':
        return {
          description: 'Lọc nhân viên với all parameters',
          expectedFields: ['employees', 'pagination'],
          endpoint: 'GET /api/v1/employees/filter',
          filters: {
            id: '1',
            username: 'testuser',
            fullName: 'Nguyễn Văn Test',
            email: 'test@company.com',
            phoneNumber: '0123456789',
            position: 'Developer',
            department: 'IT', // Use department ID
            status: EmployeeStatus.ACTIVE,
            page: 1,
            limit: 5
          }
        };
      case 'create_employee':
        return {
          description: 'Tạo nhân viên mới',
          expectedFields: ['id', 'fullName', 'email', 'department'],
          endpoint: 'POST /api/v1/employees',
          mockData: {
            fullName: 'Test Employee',
            firstName: 'Test',
            lastName: 'Employee',
            email: 'test.employee@company.com',
            phoneNumber: '+84123456789',
            departmentId: '1',
            departmentName: 'Engineering',
            position: 'Software Developer',
            joinDate: new Date().toISOString().split('T')[0],
            salary: 50000000,
            address: '123 Test Street, Ho Chi Minh City'
          }
        };
      case 'update_employee':
        return {
          description: 'Cập nhật thông tin nhân viên',
          expectedFields: ['id', 'fullName', 'email', 'department'],
          endpoint: 'PUT /api/v1/employees/{id}',
          testId: '1',
          mockData: {
            id: '1',
            fullName: 'Updated Employee Name',
            email: 'updated.employee@company.com',
            position: 'Senior Software Developer',
            salary: 60000000
          }
        };
      case 'delete_employee':
        return {
          description: 'Xóa nhân viên',
          expectedFields: ['success message'],
          endpoint: 'DELETE /api/v1/employees/{id}',
          testId: '999' // Use non-existent ID to avoid deleting real data
        };
      case 'get_stats':
        return {
          description: 'Lấy thống kê nhân viên',
          expectedFields: ['totalEmployees', 'activeEmployees', 'averageSalary'],
          endpoint: 'GET /api/v1/employees/stats'
        };
      case 'get_departments':
        return {
          description: 'Lấy danh sách phòng ban',
          expectedFields: ['id', 'name'],
          endpoint: 'GET /api/v1/departments'
        };
      default:
        return {
          description: 'Unknown test scenario',
          expectedFields: [],
          endpoint: ''
        };
    }
  };

  const runAPITest = async () => {
    try {
      setIsLoading(true);
      setError('');
      setTestResult(null);

      const testConfig = getTestConfig(selectedScenario);
      console.log('🧪 EmployeeAPITestPanel: Running employee API test');
      console.log('📊 EmployeeAPITestPanel: Test scenario:', selectedScenario);
      console.log('📊 EmployeeAPITestPanel: Test config:', testConfig);

      let result;
      const startTime = Date.now();

      switch (selectedScenario) {
        case 'get_all_employees':
          result = await employeeService.getAllEmployees();
          break;
        
        case 'get_employee_by_id':
          result = await employeeService.getEmployeeById(testConfig.testId!);
          break;
        
        case 'search_employees':
          result = await employeeService.searchEmployees(testConfig.filters as EmployeeSearchFilters);
          break;
        
        case 'create_employee':
          result = await employeeService.createEmployee(testConfig.mockData as CreateEmployeeRequest);
          break;
        
        case 'update_employee':
          result = await employeeService.updateEmployee(
            testConfig.testId!,
            testConfig.mockData as UpdateEmployeeRequest
          );
          break;
        
        case 'delete_employee':
          await employeeService.deleteEmployee(testConfig.testId!);
          result = { success: true, message: 'Employee deleted successfully' };
          break;
        
        case 'get_stats':
          result = await employeeService.getEmployeeStats();
          break;
        
        case 'get_departments':
          result = await employeeService.getDepartments();
          break;
        
        default:
          throw new Error('Unknown test scenario');
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      setTestResult({
        success: true,
        scenario: selectedScenario,
        description: testConfig.description,
        expectedFields: testConfig.expectedFields,
        endpoint: testConfig.endpoint,
        data: result,
        responseTime: responseTime,
        params: testConfig.filters || testConfig.mockData || { id: testConfig.testId },
        timestamp: new Date().toISOString(),
      });

      console.log('✅ EmployeeAPITestPanel: Test successful', result);
    } catch (err: any) {
      console.error('❌ EmployeeAPITestPanel: Test failed', err);
      setError(err.message || 'API test failed');
      setTestResult({
        success: false,
        scenario: selectedScenario,
        error: err.message,
        endpoint: getTestConfig(selectedScenario).endpoint,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scenarios = [
    {
      id: 'get_all_employees' as TestScenario,
      label: 'Lấy tất cả nhân viên',
      icon: Users,
      description: 'GET /api/v1/employees'
    },
    {
      id: 'get_employee_by_id' as TestScenario,
      label: 'Lấy nhân viên theo ID',
      icon: User,
      description: 'GET /api/v1/employees/{id}'
    },
    {
      id: 'search_employees' as TestScenario,
      label: 'Lọc nhân viên',
      icon: Search,
      description: 'GET /api/v1/employees/filter'
    },
    {
      id: 'create_employee' as TestScenario,
      label: 'Tạo nhân viên mới',
      icon: Plus,
      description: 'POST /api/v1/employees'
    },
    {
      id: 'update_employee' as TestScenario,
      label: 'Cập nhật nhân viên',
      icon: Edit,
      description: 'PUT /api/v1/employees/{id}'
    },
    {
      id: 'delete_employee' as TestScenario,
      label: 'Xóa nhân viên',
      icon: Trash,
      description: 'DELETE /api/v1/employees/{id}'
    },
    {
      id: 'get_stats' as TestScenario,
      label: 'Thống kê nhân viên',
      icon: Users,
      description: 'GET /api/v1/employees/stats'
    },
    {
      id: 'get_departments' as TestScenario,
      label: 'Danh sách phòng ban',
      icon: Users,
      description: 'GET /api/v1/departments'
    }
  ];

  return (
    <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Code className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            Employee API Test Panel (Development)
          </h3>
        </div>
        
        <button
          onClick={runAPITest}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
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
        <div className="text-green-800 dark:text-green-200 text-sm font-medium mb-2">
          Chọn test scenario:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedScenario === scenario.id
                    ? 'bg-green-100 dark:bg-green-800 border-green-300 dark:border-green-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                }`}
              >
                <div className="flex items-center mb-1">
                  <Icon className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
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

      <div className="text-green-800 dark:text-green-200 text-sm mb-4">
        <strong>Test Endpoint:</strong> {getTestConfig(selectedScenario).endpoint}<br />
        <strong>Selected Scenario:</strong> {getTestConfig(selectedScenario).description}<br />
        <strong>Expected Fields:</strong> {getTestConfig(selectedScenario).expectedFields?.join(', ')}
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
              {testResult.success ? 'Employee API Test Successful' : 'Employee API Test Failed'}
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
                {/* Handle different data types */}
                {Array.isArray(testResult.data) ? (
                  <div>
                    <div><strong>Type:</strong> Array</div>
                    <div><strong>Count:</strong> {testResult.data.length} items</div>
                    {testResult.data.length > 0 && testResult.data[0].fullName && (
                      <div><strong>First Employee:</strong> {testResult.data[0].fullName}</div>
                    )}
                    {testResult.data.length > 0 && testResult.data[0].name && (
                      <div><strong>First Department:</strong> {testResult.data[0].name}</div>
                    )}
                  </div>
                ) : testResult.data.employees ? (
                  <div>
                    <div><strong>Type:</strong> Search Response</div>
                    <div><strong>Employees Found:</strong> {testResult.data.employees.length}</div>
                    <div><strong>Total Pages:</strong> {testResult.data.pagination?.totalPages || 'N/A'}</div>
                    {testResult.data.employees.length > 0 && (
                      <div><strong>First Result:</strong> {testResult.data.employees[0].fullName}</div>
                    )}
                  </div>
                ) : testResult.data.fullName ? (
                  <div>
                    <div><strong>Employee Name:</strong> {testResult.data.fullName}</div>
                    <div><strong>Email:</strong> {testResult.data.email}</div>
                    <div><strong>Department:</strong> {testResult.data.department?.name}</div>
                    <div><strong>Position:</strong> {testResult.data.position || 'N/A'}</div>
                    <div><strong>Status:</strong> {testResult.data.status}</div>
                    {testResult.data.salary && (
                      <div><strong>Salary:</strong> {employeeService.formatSalary(testResult.data.salary)}</div>
                    )}
                  </div>
                ) : testResult.data.totalEmployees !== undefined ? (
                  <div>
                    <div><strong>Type:</strong> Employee Statistics</div>
                    <div><strong>Total Employees:</strong> {testResult.data.totalEmployees}</div>
                    <div><strong>Active Employees:</strong> {testResult.data.activeEmployees}</div>
                    <div><strong>Average Salary:</strong> {employeeService.formatSalary(testResult.data.averageSalary)}</div>
                  </div>
                ) : testResult.data.success ? (
                  <div>
                    <div><strong>Operation:</strong> {testResult.data.message || 'Success'}</div>
                    <div><strong>Status:</strong> ✅ Completed</div>
                  </div>
                ) : (
                  <div>
                    <div><strong>Data Type:</strong> {typeof testResult.data}</div>
                    <div><strong>Has Data:</strong> {testResult.data ? 'Yes' : 'No'}</div>
                  </div>
                )}

                {/* Request params if available */}
                {testResult.params && (
                  <div className="border-t border-green-200 dark:border-green-800 pt-1 mt-1">
                    <div><strong>Request Params:</strong></div>
                    <div className="text-xs font-mono">
                      {JSON.stringify(testResult.params, null, 2)}
                    </div>
                  </div>
                )}
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
              <strong>Employee API Error:</strong> {error}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAPITestPanel; 