import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageToggleProps {
  variant?: 'button' | 'switch' | 'dropdown';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'button' }) => {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (variant === 'button') {
    return (
      <div className="flex gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="cyber-button text-sm px-4 py-2"
        >
          <span className="cyber-icon mr-2">🌐</span>
          {language === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="cyber-button text-sm px-4 py-2"
        >
          <span className="cyber-icon mr-2">
            {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🔮'}
          </span>
          {theme === 'light' ? 'LIGHT' : theme === 'dark' ? 'DARK' : 'CYBER'}
        </button>
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <div className="space-y-4">
        {/* Language Switch */}
        <div className="flex items-center gap-3">
          <span className="text-cyber-neon-cyan font-matrix text-sm">Language:</span>
          <div className="relative">
            <button
              onClick={toggleLanguage}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none ${
                language === 'vi' 
                  ? 'bg-cyber-neon-pink shadow-neon-pink' 
                  : 'bg-cyber-neon-cyan shadow-neon-cyan'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 cyber-icon ${
                  language === 'vi' ? 'translate-x-8' : 'translate-x-1'
                }`}
              >
                <span className="text-xs flex items-center justify-center h-full">
                  {language === 'vi' ? 'VI' : 'EN'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Theme Switch */}
        <div className="flex items-center gap-3">
          <span className="text-cyber-neon-cyan font-matrix text-sm">Theme:</span>
          <div className="flex gap-2">
            {(['light', 'dark', 'cyberpunk'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={`px-3 py-1 rounded-full text-xs font-cyber transition-all duration-300 ${
                  theme === themeOption
                    ? 'bg-cyber-neon-pink text-white shadow-neon-pink'
                    : 'bg-cyber-dark-400 text-cyber-neon-cyan hover:bg-cyber-dark-300'
                }`}
              >
                {themeOption === 'light' ? '☀️' : themeOption === 'dark' ? '🌙' : '🔮'}
                {themeOption.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="space-y-4">
        {/* Language Dropdown */}
        <div className="relative">
          <label className="block text-cyber-neon-cyan font-matrix text-sm mb-2">
            {t('settings.language')}:
          </label>
          <select
            value={language}
            onChange={(e) => toggleLanguage()}
            className="cyber-input w-full text-sm"
          >
            <option value="en" className="bg-cyber-dark-400 text-cyber-neon-cyan">
              🇺🇸 English
            </option>
            <option value="vi" className="bg-cyber-dark-400 text-cyber-neon-cyan">
              🇻🇳 Tiếng Việt
            </option>
          </select>
        </div>

        {/* Theme Dropdown */}
        <div className="relative">
          <label className="block text-cyber-neon-cyan font-matrix text-sm mb-2">
            Theme:
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cyber-input w-full text-left flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="cyber-icon">
                  {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🔮'}
                </span>
                {theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'Cyberpunk Mode'}
              </span>
              <span className={`cyber-icon transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                ⬇️
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 cyber-card border border-cyber-neon-cyan rounded-lg z-50">
                {[
                  { value: 'light', icon: '☀️', label: 'Light Mode' },
                  { value: 'dark', icon: '🌙', label: 'Dark Mode' },
                  { value: 'cyberpunk', icon: '🔮', label: 'Cyberpunk Mode' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value as any);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-300 hover:bg-cyber-dark-300 ${
                      theme === option.value 
                        ? 'text-cyber-neon-pink bg-cyber-dark-400' 
                        : 'text-cyber-neon-cyan'
                    }`}
                  >
                    <span className="cyber-icon animate-cyber-float">{option.icon}</span>
                    <span className="font-matrix">{option.label}</span>
                    {theme === option.value && (
                      <span className="ml-auto text-cyber-neon-green animate-neon-flicker">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LanguageToggle; 