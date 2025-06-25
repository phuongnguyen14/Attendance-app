# 🚨 Login Troubleshooting Guide

## Vấn đề: "Không login được nữa"

### 🔍 **Bước 1: Chạy Full Diagnostics**

1. **Mở ứng dụng** trên browser (http://localhost:5174)
2. **Click vào icon ⚙️** ở góc dưới phải 
3. **Click "🔍 Full Auth Diagnostics"**
4. **Xem console** (F12 → Console tab)

### 📊 **Các lỗi thường gặp và cách fix:**

#### ❌ **"Backend Test Failed" / "Backend may not be running"**
**Nguyên nhân:** Java Spring backend không chạy

**Giải pháp:**
```bash
# Đảm bảo backend Spring Boot đang chạy trên port 8080
# Kiểm tra bằng cách mở: http://localhost:8080
```

#### ❌ **"Token Expired" / "Token Parse Error"**
**Nguyên nhân:** JWT token trong localStorage bị hỏng hoặc hết hạn

**Giải pháp:**
1. **Trong DevSettings:** Click "Clear Dev Settings"
2. **Hoặc trong Console:** Run `clearAuthState()`
3. **Hoặc manual:** `localStorage.clear()`
4. **Refresh trang:** F5

#### ❌ **"Network Error" / "CORS Error"**
**Nguyên nhân:** Backend chưa config CORS cho frontend

**Giải pháp backend (Spring Boot):**
```java
@CrossOrigin(origins = "http://localhost:5174")
@RestController
public class AuthController {
    // Your controllers
}
```

#### ❌ **"Response format not supported"**
**Nguyên nhân:** Backend trả về format khác với frontend expect

**Expected format:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "1", "username": "test", ... },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token"
  }
}
```

#### ❌ **"Token Refresh Failed" / Auto-refresh Loop**
**Nguyên nhân:** Auto-refresh mechanism gây ra infinite loop

**Triệu chứng:**
- Console đầy "Token refresh failed" messages
- Trang bị stuck ở loading state
- HMR updates liên tục trong dev mode

**Giải pháp:**
1. **Quick Fix trong DevSettings:** Click "🧹 Fix Token Issues"
2. **Manual clear:** 
   ```javascript
   localStorage.removeItem('accessToken');
   localStorage.removeItem('refreshToken');
   localStorage.removeItem('user');
   location.reload();
   ```
3. **Check for mock tokens:** Auto-refresh bị skip cho mock tokens
4. **Backend refresh endpoint:** Đảm bảo `/api/v1/auth/refresh` hoạt động

### 🛠️ **Quick Fixes:**

#### **Fix 1: Clear Authentication State**
```javascript
// Trong console browser:
clearAuthState()
// Hoặc
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');
```

#### **Fix 2: Hard Refresh**
- **Windows:** `Ctrl + F5` hoặc `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

#### **Fix 3: Clear Browser Cache**
1. F12 → Application/Storage tab
2. Clear Storage → Clear site data
3. Refresh trang

#### **Fix 4: Reset Development Settings**
1. DevSettings → Clear Dev Settings
2. Hoặc console: `localStorage.removeItem('dev_show_info')`

### 🔄 **Restart Everything**

Nếu vẫn không được, restart toàn bộ:

```bash
# 1. Stop tất cả processes
# Ctrl+C trong terminals

# 2. Clear node_modules (nếu cần)
rm -rf node_modules
npm install

# 3. Clear browser data hoàn toàn
# DevTools → Application → Clear Storage

# 4. Restart backend (Java Spring)
# 5. Restart frontend
npm run dev
```

### 📱 **Test Login Steps:**

1. **Clear auth state** (DevSettings hoặc console)
2. **Đảm bảo backend running** (http://localhost:8080)
3. **Thử login với credentials hợp lệ**
4. **Check console** cho error details
5. **Check Network tab** cho API calls

### 💡 **Common Issues:**

#### **Port conflicts:**
- Frontend: http://localhost:5174 (Vite auto-change port)
- Backend: http://localhost:8080

#### **Environment variables:**
```env
VITE_API_URL=http://localhost:8080
```

#### **CORS in backend:**
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:5174"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

### 🎯 **Debug Checklist:**

- [ ] Backend running on :8080
- [ ] Frontend running on :5174  
- [ ] CORS configured in backend
- [ ] localStorage cleared
- [ ] Browser cache cleared
- [ ] Valid credentials used
- [ ] Network tab shows API calls
- [ ] Console shows no errors

### 📞 **Still Need Help?**

1. **Run Full Diagnostics** và copy console output
2. **Check Network tab** trong DevTools
3. **Screenshot error messages**
4. **Share backend logs** nếu có access

---

**💡 Pro Tip:** Luôn chạy "🔍 Full Auth Diagnostics" trước khi báo bug - nó sẽ cho biết 90% vấn đề! 