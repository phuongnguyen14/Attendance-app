# 🌐 Hệ thống Đa ngôn ngữ (i18n)

## 📋 Tổng quan
Hệ thống đa ngôn ngữ hoàn chỉnh hỗ trợ Tiếng Việt và Tiếng Anh với:
- ✅ Type-safe translations
- ✅ Nested key support  
- ✅ Hot reload khi đổi ngôn ngữ
- ✅ Local storage persistence
- ✅ Accessibility support

## 🚀 Cách sử dụng

### 1. Import hook
```tsx
import { useTranslation } from '../hooks/useTranslation';
```

### 2. Sử dụng trong component
```tsx
const MyComponent = () => {
  const { t, language, setLanguage, isVietnamese } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.dashboard')}</h1>
      <p>{t('auth.welcomeBack')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
};
```

### 3. Thêm component chuyển đổi ngôn ngữ
```tsx
import LanguageToggle from '../components/LanguageToggle';

// Button style (mặc định)
<LanguageToggle variant="button" />

// Switch style
<LanguageToggle variant="switch" />

// Dropdown style  
<LanguageToggle variant="dropdown" />
```

## 📝 Cấu trúc Translation Keys

### Navigation
- `nav.dashboard` → "Dashboard" / "Bảng điều khiển"
- `nav.attendance` → "Attendance" / "Chấm công"
- `nav.settings` → "Settings" / "Cài đặt"

### Authentication
- `auth.login` → "Login" / "Đăng nhập"
- `auth.password` → "Password" / "Mật khẩu"
- `auth.welcomeBack` → "Welcome Back" / "Chào mừng trở lại"

### Common Actions
- `common.save` → "Save" / "Lưu"
- `common.cancel` → "Cancel" / "Hủy"
- `common.edit` → "Edit" / "Sửa"
- `common.delete` → "Delete" / "Xóa"

### Messages
- `messages.success` → "Success" / "Thành công"
- `messages.saveSuccess` → "Saved successfully" / "Lưu thành công"

## 🛠️ Thêm translations mới

### 1. Mở file `src/locales/translations.ts`

### 2. Thêm key mới vào interface `TranslationKeys`
```tsx
interface TranslationKeys {
  // Existing keys...
  
  // Thêm section mới
  newSection: {
    newKey: string;
    anotherKey: string;
  };
}
```

### 3. Thêm translations cho cả 2 ngôn ngữ
```tsx
export const translations = {
  en: {
    // Existing translations...
    
    newSection: {
      newKey: 'New Value',
      anotherKey: 'Another Value',
    },
  },
  
  vi: {
    // Existing translations...
    
    newSection: {
      newKey: 'Giá trị mới',
      anotherKey: 'Giá trị khác',
    },
  },
};
```

### 4. Sử dụng key mới
```tsx
const { t } = useTranslation();

return <h1>{t('newSection.newKey')}</h1>;
```

## 🎯 Best Practices

### 1. **Đặt tên key có ý nghĩa**
```tsx
// ✅ Tốt
t('auth.loginButton')
t('dashboard.totalEmployees')

// ❌ Không tốt  
t('btn1')
t('text123')
```

### 2. **Nhóm keys theo feature**
```tsx
// ✅ Tốt - theo feature
nav: { dashboard, settings }
auth: { login, register }
attendance: { checkIn, checkOut }

// ❌ Không tốt - trộn lẫn
general: { dashboard, login, checkIn }
```

### 3. **Sử dụng fallback khi cần**
```tsx
const { t } = useTranslation();

// Với fallback
const text = t('some.missing.key', 'Default text');
```

### 4. **Kiểm tra ngôn ngữ hiện tại**
```tsx
const { isVietnamese, isEnglish } = useTranslation();

return (
  <div>
    {isVietnamese && <VietnamSpecificComponent />}
    {isEnglish && <EnglishSpecificComponent />}
  </div>
);
```

## 🔧 API Reference

### useTranslation Hook
```tsx
const {
  t,              // Translation function
  language,       // Current language ('en' | 'vi')
  setLanguage,    // Set language function
  toggleLanguage, // Toggle between en/vi
  isVietnamese,   // Boolean check
  isEnglish,      // Boolean check
  translations,   // Current translations object
} = useTranslation();
```

### LanguageToggle Props
```tsx
interface LanguageToggleProps {
  variant?: 'button' | 'dropdown' | 'switch';
  showText?: boolean;
  className?: string;
}
```

## 🎨 Styling

LanguageToggle component sử dụng Tailwind CSS và tự động hỗ trợ dark mode:

```tsx
// Custom styling
<LanguageToggle 
  variant="button" 
  className="my-custom-class"
  showText={false}
/>
```

## 🐛 Troubleshooting

### Key không tồn tại
- Kiểm tra spelling trong key
- Đảm bảo key đã được thêm vào cả EN và VI
- Check console warnings

### Không lưu language setting
- Kiểm tra localStorage permissions
- Clear browser cache/localStorage

### TypeScript errors
- Rebuild project sau khi thêm keys mới
- Kiểm tra interface TranslationKeys đã cập nhật

## 📱 Demo

Truy cập `/demo` để xem demo đầy đủ hệ thống đa ngôn ngữ! 