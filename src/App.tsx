import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import DevSettings from './components/DevSettings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Statistics from './pages/Statistics';
import Department from './pages/Department';
import Employee from './pages/Employee';
import Shift from './pages/Shift';
import ShiftAssignment from './pages/ShiftAssignment';
import Settings from './pages/Settings';
import LanguageToggle from './components/LanguageToggle';
import { useTranslation } from './hooks/useTranslation';

// Demo component để thể hiện translation system
const TranslationDemo: React.FC = () => {
  const { t, language, isVietnamese } = useTranslation();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🌐 {t('dashboard.welcome')}
          </h1>
          <LanguageToggle variant="button" />
        </div>

        {/* Language Status */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>{t('settings.language')}:</strong> {isVietnamese ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
            <br />
            <strong>Current Language Code:</strong> {language}
          </p>
        </div>

        {/* Navigation Demo */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              📋 {t('nav.dashboard')} - Navigation
            </h2>
            <ul className="space-y-2">
              <li>📊 {t('nav.dashboard')}</li>
              <li>⏰ {t('nav.attendance')}</li>
              <li>📈 {t('nav.statistics')}</li>
              <li>🏢 {t('nav.department')}</li>
              <li>👥 {t('nav.employee')}</li>
              <li>🕐 {t('nav.shift')}</li>
              <li>⚙️ {t('nav.settings')}</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              🔐 {t('auth.login')} - Authentication
            </h2>
            <ul className="space-y-2">
              <li>📧 {t('auth.email')}</li>
              <li>🔒 {t('auth.password')}</li>
              <li>🔑 {t('auth.signIn')}</li>
              <li>📝 {t('auth.register')}</li>
              <li>👋 {t('auth.welcomeBack')}</li>
            </ul>
          </div>
        </div>

        {/* Dashboard Stats Demo */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            📊 {t('dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">150</div>
              <div className="text-sm">{t('dashboard.totalEmployees')}</div>
            </div>
            <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">142</div>
              <div className="text-sm">{t('dashboard.presentToday')}</div>
            </div>
            <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">5</div>
              <div className="text-sm">{t('dashboard.onLeave')}</div>
            </div>
            <div className="bg-white dark:bg-gray-600 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm">{t('dashboard.lateArrivals')}</div>
            </div>
          </div>
        </div>

        {/* Common Actions */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            🎯 {t('common.actions')}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {t('common.save')}
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              {t('common.cancel')}
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              {t('common.add')}
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              {t('common.edit')}
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              {t('common.delete')}
            </button>
          </div>
        </div>

        {/* Different Toggle Variants */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            🔄 Language Toggle Variants
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Button Style:</h3>
              <LanguageToggle variant="button" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Switch Style:</h3>
              <LanguageToggle variant="switch" />
            </div>
            <div>
              <h3 className="font-medium mb-2">Dropdown Style:</h3>
              <LanguageToggle variant="dropdown" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✅</div>
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-200">
                {t('messages.success')}!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Hệ thống đa ngôn ngữ đã hoạt động hoàn hảo! 
                Translation system is working perfectly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes>
                {/* Demo route để thể hiện translation */}
                <Route path="/demo" element={<TranslationDemo />} />
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Redirect to dashboard instead of demo */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="department" element={<Department />} />
                  <Route path="employee" element={<Employee />} />
                  <Route path="shift" element={<Shift />} />
                  <Route path="shift-assignment" element={<ShiftAssignment />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
              
              {/* Development Settings Panel - Always available */}
              <DevSettings />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;