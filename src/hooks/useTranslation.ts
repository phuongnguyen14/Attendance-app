import { useLanguage } from '../contexts/LanguageContext';

/**
 * Hook để sử dụng translations dễ dàng hơn
 * Hỗ trợ nested keys như 'nav.dashboard', 'auth.login'
 * 
 * @example
 * const { t, language, setLanguage } = useTranslation();
 * 
 * // Sử dụng:
 * t('nav.dashboard') // 'Dashboard' hoặc 'Bảng điều khiển'
 * t('auth.login') // 'Login' hoặc 'Đăng nhập'
 * t('common.save') // 'Save' hoặc 'Lưu'
 */
export const useTranslation = () => {
  const { t, language, setLanguage, currentTranslations } = useLanguage();
  
  /**
   * Hàm translate với type safety
   * @param key - Translation key (nested support)
   * @param fallback - Fallback text nếu không tìm thấy key
   */
  const translate = (key: string, fallback?: string): string => {
    const result = t(key);
    return result === key && fallback ? fallback : result;
  };

  /**
   * Chuyển đổi ngôn ngữ
   */
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  /**
   * Kiểm tra ngôn ngữ hiện tại
   */
  const isVietnamese = language === 'vi';
  const isEnglish = language === 'en';

  return {
    t: translate,
    language,
    setLanguage,
    toggleLanguage,
    isVietnamese,
    isEnglish,
    translations: currentTranslations,
  };
}; 