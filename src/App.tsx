import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import DevSettings from './components/DevSettings';
import CyberpunkDemo from './components/CyberpunkDemo';
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

// Cyberpunk Demo component với styling mới
const TranslationDemo: React.FC = () => {
  const { t, language, isVietnamese } = useTranslation();

  return (
    <div className="min-h-screen cyber-bg-grid cyber-bg-circuit">
      {/* Cyberpunk Background */}
      <div className="cyber-background"></div>
      
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <div className="cyber-card p-8">
          {/* Header with Glowing Effect */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-neon-glow text-cyber-neon-cyan animate-glow-pulse font-cyber">
              🌐 {t('dashboard.welcome')}
            </h1>
            <div className="flex gap-4">
              <LanguageToggle variant="button" />
            </div>
          </div>

          {/* Language Status with Neon Border */}
          <div className="mb-8 p-6 cyber-card border-electric">
            <p className="text-cyber-neon-cyan text-lg font-matrix">
              <strong className="text-cyber-neon-pink">{t('settings.language')}:</strong> 
              <span className="ml-2 text-neon-glow">
                {isVietnamese ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
              </span>
              <br />
              <strong className="text-cyber-neon-green">Current Language Code:</strong> 
              <span className="ml-2 text-cyber-neon-yellow animate-neon-flicker">{language}</span>
            </p>
          </div>

          {/* Navigation Demo with Cyberpunk Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="cyber-stat-card hover-cyber">
              <h2 className="text-2xl font-semibold mb-6 text-cyber-neon-pink text-neon-glow font-cyber">
                📋 {t('nav.dashboard')} - Navigation
              </h2>
              <ul className="space-y-3">
                {[
                  { icon: '📊', key: 'nav.dashboard' },
                  { icon: '⏰', key: 'nav.attendance' },
                  { icon: '📈', key: 'nav.statistics' },
                  { icon: '🏢', key: 'nav.department' },
                  { icon: '👥', key: 'nav.employee' },
                  { icon: '🕐', key: 'nav.shift' },
                  { icon: '⚙️', key: 'nav.settings' },
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-cyber-neon-cyan hover:text-cyber-neon-green transition-all duration-300 hover:translate-x-2">
                    <span className="cyber-icon text-2xl mr-3 animate-cyber-float">{item.icon}</span>
                    <span className="font-matrix">{t(item.key)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cyber-stat-card hover-cyber">
              <h2 className="text-2xl font-semibold mb-6 text-cyber-neon-green text-neon-glow font-cyber">
                🔐 {t('auth.login')} - Authentication
              </h2>
              <ul className="space-y-3">
                {[
                  { icon: '📧', key: 'auth.email' },
                  { icon: '🔒', key: 'auth.password' },
                  { icon: '🔑', key: 'auth.signIn' },
                  { icon: '📝', key: 'auth.register' },
                  { icon: '👋', key: 'auth.welcomeBack' },
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-cyber-neon-cyan hover:text-cyber-neon-yellow transition-all duration-300 hover:translate-x-2">
                    <span className="cyber-icon text-2xl mr-3 animate-cyber-float" style={{ animationDelay: `${index * 0.2}s` }}>{item.icon}</span>
                    <span className="font-matrix">{t(item.key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dashboard Stats Demo with Animated Cards */}
          <div className="cyber-card mb-8 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-cyber-neon-purple text-neon-glow font-cyber">
              📊 {t('dashboard.quickActions')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '150', key: 'dashboard.totalEmployees', color: 'text-cyber-neon-cyan', bg: 'bg-cyber-dark-400' },
                { value: '142', key: 'dashboard.presentToday', color: 'text-cyber-neon-green', bg: 'bg-cyber-dark-400' },
                { value: '5', key: 'dashboard.onLeave', color: 'text-cyber-neon-yellow', bg: 'bg-cyber-dark-400' },
                { value: '3', key: 'dashboard.lateArrivals', color: 'text-cyber-neon-pink', bg: 'bg-cyber-dark-400' },
              ].map((stat, index) => (
                <div key={index} className="cyber-stat-card text-center hover-cyber">
                  <div className={`text-3xl font-bold ${stat.color} text-neon-glow animate-glow-pulse font-cyber`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-cyber-neon-cyan mt-2 font-matrix">{t(stat.key)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Actions with Cyberpunk Buttons */}
          <div className="cyber-card mb-8 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-cyber-neon-orange text-neon-glow font-cyber">
              🎯 {t('common.actions')}
            </h2>
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'common.save', color: 'cyber-button' },
                { key: 'common.cancel', color: 'cyber-button' },
                { key: 'common.add', color: 'cyber-button' },
                { key: 'common.edit', color: 'cyber-button' },
                { key: 'common.delete', color: 'cyber-button' },
              ].map((action, index) => (
                <button
                  key={index}
                  className={`${action.color} animate-button-cyber`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {t(action.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Different Toggle Variants */}
          <div className="cyber-card mb-8 p-6">
            <h2 className="text-2xl font-semibold mb-6 text-cyber-neon-purple text-neon-glow font-cyber">
              🔄 Language & Theme Controls
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-cyber-neon-cyan font-cyber">Button Style:</h3>
                <LanguageToggle variant="button" />
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-cyber-neon-cyan font-cyber">Switch Style:</h3>
                <LanguageToggle variant="switch" />
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-cyber-neon-cyan font-cyber">Dropdown Style:</h3>
                <LanguageToggle variant="dropdown" />
              </div>
            </div>
          </div>

          {/* Cyberpunk Data Table Demo */}
          <div className="cyber-table mb-8">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-cyber-neon-yellow">EMP-001</td>
                  <td>Nguyễn Văn A</td>
                  <td className="text-cyber-neon-green">IT Department</td>
                  <td className="text-cyber-neon-cyan animate-neon-flicker">ACTIVE</td>
                </tr>
                <tr>
                  <td className="text-cyber-neon-yellow">EMP-002</td>
                  <td>Trần Thị B</td>
                  <td className="text-cyber-neon-green">HR Department</td>
                  <td className="text-cyber-neon-cyan animate-neon-flicker">ACTIVE</td>
                </tr>
                <tr>
                  <td className="text-cyber-neon-yellow">EMP-003</td>
                  <td>Lê Văn C</td>
                  <td className="text-cyber-neon-green">Finance</td>
                  <td className="text-cyber-neon-pink animate-neon-flicker">OFFLINE</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Success Message with Hologram Effect */}
          <div className="cyber-card border-plasma p-6">
            <div className="flex items-center">
              <div className="text-cyber-neon-green mr-4 text-3xl animate-hologram">✅</div>
              <div>
                <h3 className="font-semibold text-cyber-neon-green text-neon-glow font-cyber text-xl">
                  {t('messages.success')}!
                </h3>
                <p className="text-cyber-neon-cyan font-matrix mt-2">
                  Hệ thống đa ngôn ngữ Cyberpunk đã hoạt động hoàn hảo! 
                  <br />
                  <span className="text-cyber-neon-pink animate-digital-glitch">Translation system is working perfectly!</span>
                </p>
              </div>
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 cyberpunk:bg-cyber-dark-100 transition-all duration-500">
              {/* Cyberpunk Background Effects */}
              <div className="cyber-background"></div>
              
              <Routes>
                {/* Demo route để thể hiện translation với cyberpunk theme */}
                <Route path="/demo" element={<TranslationDemo />} />
                
                {/* Cyberpunk Demo route */}
                <Route path="/cyberpunk" element={<CyberpunkDemo />} />
                
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