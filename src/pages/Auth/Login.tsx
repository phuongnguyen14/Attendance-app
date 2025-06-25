import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { LoginFormData, ValidationError } from '../../types/auth';
import { shouldShowDevInfo } from '../../constants/app';
import DevSettings from '../../components/DevSettings';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear specific field error when user types
    setErrors(prev => prev.filter(error => error.field !== name));
    setSubmitError('');
  };

  /**
   * Validate form data
   */
  const validateForm = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    // Username validation
    if (!formData.username.trim()) {
      validationErrors.push({
        field: 'username',
        message: t('messages.validationError') + ': Username là bắt buộc',
      });
    } else if (formData.username.length < 3) {
      validationErrors.push({
        field: 'username',
        message: 'Username phải có ít nhất 3 ký tự',
      });
    }

    // Password validation
    if (!formData.password) {
      validationErrors.push({
        field: 'password',
        message: t('messages.validationError') + ': Mật khẩu là bắt buộc',
      });
    } else if (formData.password.length < 6) {
      validationErrors.push({
        field: 'password',
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    return validationErrors;
  };

  /**
   * Get error message for specific field
   */
  const getFieldError = (fieldName: string): string | undefined => {
    const error = errors.find(err => err.field === fieldName);
    return error?.message;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitError('');

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log('🚀 Login: Submitting form data:', {
        username: formData.username,
        rememberMe: formData.rememberMe,
      });

      await login({
        username: formData.username.trim(),
        password: formData.password,
      });

      console.log('✅ Login: Success, redirecting to dashboard');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Login: Failed', error);
      
      // Parse error message for better user experience
      let errorMessage = error.message || t('messages.loginFailed');
      
      // Handle specific error cases
      if (errorMessage.includes('Định dạng response không được hỗ trợ')) {
        errorMessage = 'Lỗi kết nối với server. Vui lòng kiểm tra server backend.';
      } else if (errorMessage.includes('NETWORK_ERROR') || errorMessage.includes('fetch')) {
        errorMessage = 'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.';
      } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
        errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
      } else if (errorMessage.includes('400') || errorMessage.includes('bad request')) {
        errorMessage = 'Thông tin đăng nhập không hợp lệ.';
      } else if (errorMessage.includes('500') || errorMessage.includes('server error')) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      }
      
      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AttendFlow</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.welcomeBack')}
            </h2>
          </div>

          {/* Global Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <div className="text-red-700 dark:text-red-300 text-sm">
                {submitError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    getFieldError('username')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập username của bạn"
                  required
                  disabled={isLoading}
                />
              </div>
              {getFieldError('username') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError('username')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.password')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    getFieldError('password')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {getFieldError('password') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError('password')}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  disabled={isLoading}
                />
                <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.rememberMe')}
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('common.loading')}
                </div>
              ) : (
                t('auth.signIn')
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {t('auth.noAccount')}{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {t('auth.register')}
              </Link>
            </p>
          </div>

          {/* Development Note */}
          {shouldShowDevInfo() && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Development Mode:</strong><br />
                Đang kết nối tới API: {import.meta.env.VITE_API_URL || 'http://localhost:8080'}<br />
                Endpoint: POST /api/v1/auth/login
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Development Settings */}
      <DevSettings />
    </div>
  );
};

export default Login;