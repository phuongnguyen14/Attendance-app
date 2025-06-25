import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKeys } from '../locales/translations';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentTranslations: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'vi'; // Default to Vietnamese
  });

  // Function to get nested translation value
  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // If key not found, return the key itself as fallback
          return key;
        }
      }
      
      return typeof value === 'string' ? value : key;
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update document language attribute for accessibility
    document.documentElement.lang = lang;
    
    // Trigger a custom event for other components to listen to language changes
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
  };

  // Set initial document language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentTranslations = translations[language];

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage, 
        t,
        currentTranslations 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper hook for easy translation access
export const useTranslation = () => {
  const { t, language, currentTranslations } = useLanguage();
  return { t, language, translations: currentTranslations };
};