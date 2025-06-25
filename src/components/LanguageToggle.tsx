import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageToggleProps {
  variant?: 'button' | 'dropdown' | 'switch';
  showText?: boolean;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  variant = 'button', 
  showText = true,
  className = '' 
}) => {
  const { language, setLanguage, t, isVietnamese } = useTranslation();

  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showText && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.language')}
          </span>
        )}
        <div className="relative">
          <button
            onClick={() => setLanguage(isVietnamese ? 'en' : 'vi')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isVietnamese 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isVietnamese ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <span className={isVietnamese ? 'font-semibold text-blue-600' : 'text-gray-500'}>
            VI
          </span>
          <span className="text-gray-400">|</span>
          <span className={!isVietnamese ? 'font-semibold text-blue-600' : 'text-gray-500'}>
            EN
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'vi')}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="vi">{t('settings.vietnamese')}</option>
          <option value="en">{t('settings.english')}</option>
        </select>
        <svg
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }

  // Default button variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showText && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('settings.language')}:
        </span>
      )}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        <button
          onClick={() => setLanguage('vi')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            isVietnamese
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          🇻🇳 VI
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            !isVietnamese
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          🇺🇸 EN
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle; 