import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Eye, EyeOff, Mail, Lock, User, Phone, Building, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { RegisterFormData, ValidationError } from '../../types/auth';
import { shouldShowDevInfo } from '../../constants/app';
import DevSettings from '../../components/DevSettings';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    departmentName: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const { register, isLoading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
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
        message: 'Username là bắt buộc',
      });
    } else if (formData.username.length < 3) {
      validationErrors.push({
        field: 'username',
        message: 'Username phải có ít nhất 3 ký tự',
      });
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      validationErrors.push({
        field: 'username',
        message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới',
      });
    }

    // Password validation
    if (!formData.password) {
      validationErrors.push({
        field: 'password',
        message: 'Mật khẩu là bắt buộc',
      });
    } else if (formData.password.length < 6) {
      validationErrors.push({
        field: 'password',
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      validationErrors.push({
        field: 'confirmPassword',
        message: 'Xác nhận mật khẩu là bắt buộc',
      });
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.push({
        field: 'confirmPassword',
        message: 'Mật khẩu xác nhận không khớp',
      });
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      validationErrors.push({
        field: 'fullName',
        message: 'Họ và tên là bắt buộc',
      });
    } else if (formData.fullName.trim().length < 2) {
      validationErrors.push({
        field: 'fullName',
        message: 'Họ và tên phải có ít nhất 2 ký tự',
      });
    }

    // Email validation
    if (!formData.email.trim()) {
      validationErrors.push({
        field: 'email',
        message: 'Email là bắt buộc',
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.push({
        field: 'email',
        message: 'Email không hợp lệ',
      });
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      validationErrors.push({
        field: 'phoneNumber',
        message: 'Số điện thoại là bắt buộc',
      });
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      validationErrors.push({
        field: 'phoneNumber',
        message: 'Số điện thoại không hợp lệ',
      });
    }

    // Department name validation
    if (!formData.departmentName.trim()) {
      validationErrors.push({
        field: 'departmentName',
        message: 'Phòng ban là bắt buộc',
      });
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      validationErrors.push({
        field: 'agreeToTerms',
        message: 'Bạn phải đồng ý với điều khoản sử dụng',
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
      console.log('🚀 Register: Submitting form data:', {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        departmentName: formData.departmentName,
      });

      await register({
        username: formData.username.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        departmentName: formData.departmentName.trim(),
      });

      console.log('✅ Register: Success, redirecting to dashboard');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Register: Failed', error);
      setSubmitError(error.message || t('messages.addFailed'));
    }
  };

  // Common departments list for autocomplete
  const commonDepartments = [
    'Nhân sự',
    'Kế toán',
    'Kỹ thuật',
    'Marketing',
    'Kinh doanh',
    'IT',
    'Sản xuất',
    'Chất lượng',
    'Hành chính',
    'Tài chính',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AttendFlow</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('auth.registerSubtitle')}</p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.createAccount')}
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

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.fullName')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    getFieldError('fullName')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nguyễn Văn A"
                  required
                  disabled={isLoading}
                />
              </div>
              {getFieldError('fullName') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError('fullName')}
                </p>
              )}
            </div>

            {/* Email and Phone in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.email')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                      getFieldError('email')
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                {getFieldError('email') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError('email')}
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                      getFieldError('phoneNumber')
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="0123456789"
                    required
                    disabled={isLoading}
                  />
                </div>
                {getFieldError('phoneNumber') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError('phoneNumber')}
                  </p>
                )}
              </div>
            </div>

            {/* Department Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phòng ban <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleInputChange}
                  list="departments"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                    getFieldError('departmentName')
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Nhập tên phòng ban"
                  required
                  disabled={isLoading}
                />
                <datalist id="departments">
                  {commonDepartments.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>
              {getFieldError('departmentName') && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {getFieldError('departmentName')}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.confirmPassword')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                      getFieldError('confirmPassword')
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {getFieldError('confirmPassword') && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {getFieldError('confirmPassword')}
                  </p>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5 ${
                  getFieldError('agreeToTerms') ? 'border-red-300 dark:border-red-600' : ''
                }`}
                disabled={isLoading}
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Tôi đồng ý với{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  chính sách bảo mật
                </Link>
                <span className="text-red-500"> *</span>
              </label>
            </div>
            {getFieldError('agreeToTerms') && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError('agreeToTerms')}
              </p>
            )}

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
                t('auth.signUp')
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {t('auth.hasAccount')}{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                {t('auth.login')}
              </Link>
            </p>
          </div>

          {/* Development Note */}
          {shouldShowDevInfo() && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Development Mode:</strong><br />
                Đang kết nối tới API: {import.meta.env.VITE_API_URL || 'http://localhost:8080'}<br />
                Endpoint: POST /api/v1/auth/register
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

export default Register;