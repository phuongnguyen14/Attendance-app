import { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { Employee } from '../types/employee';
import { useAuth } from '../contexts/AuthContext';
import { conditionalLog } from '../constants/app';

interface UseCurrentEmployeeResult {
  employee: Employee | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCurrentEmployee = (): UseCurrentEmployeeResult => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchEmployee = async () => {
    if (!isAuthenticated || !user?.employeeId) {
      conditionalLog('ℹ️ useCurrentEmployee: Not authenticated or no employeeId, skipping fetch');
      setEmployee(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      conditionalLog(`🔄 useCurrentEmployee: Fetching employee data for employeeId: ${user.employeeId}`);
      
      const employeeData = await employeeService.getEmployeeById(user.employeeId);
      
      conditionalLog('✅ useCurrentEmployee: Successfully fetched employee data', employeeData);
      setEmployee(employeeData);
    } catch (err: any) {
      console.error('❌ useCurrentEmployee: Failed to fetch employee data', err);
      setError(err.message || 'Không thể tải thông tin nhân viên');
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employee data when user or employeeId changes
  useEffect(() => {
    fetchEmployee();
  }, [user?.employeeId, isAuthenticated]);

  // Refetch function
  const refetch = async () => {
    await fetchEmployee();
  };

  return {
    employee,
    isLoading,
    error,
    refetch,
  };
}; 