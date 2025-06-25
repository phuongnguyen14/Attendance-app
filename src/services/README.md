# 🔗 API Integration Guide

## 📋 Tổng quan

Hệ thống API integration hoàn chỉnh cho AttendFlow với:
- ✅ Type-safe HTTP client
- ✅ Automatic token management  
- ✅ Error handling & retry logic
- ✅ Request/Response interceptors
- ✅ Authentication flow

## 🚀 Setup

### 1. **Environment Variables**

Tạo file `.env` trong root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:8080
VITE_API_VERSION=v1

# Application Environment  
VITE_NODE_ENV=development
VITE_APP_NAME=AttendFlow
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_DEV_TOOLS=true

# Optional: API Timeout
VITE_API_TIMEOUT=10000
```

### 2. **Backend Server**

Đảm bảo Java Spring backend đang chạy trên:
- URL: `http://localhost:8080`
- CORS enabled cho origin `http://localhost:5173`

## 📡 API Endpoints

### **Authentication**

```typescript
// Login
POST /api/v1/auth/login
Content-Type: application/json
{
  "username": "string",
  "password": "string"
}

// Register  
POST /api/v1/auth/register
Content-Type: application/json
{
  "username": "string",
  "password": "string", 
  "fullName": "string",
  "email": "string",
  "phoneNumber": "string",
  "departmentName": "string"
}

// Logout
POST /api/v1/auth/logout
Authorization: Bearer {token}

// Refresh Token
POST /api/v1/auth/refresh
Content-Type: application/json
{
  "refreshToken": "string"
}
```

### **User Management**

```typescript
// Get Profile
GET /api/v1/user/profile
Authorization: Bearer {token}

// Update Profile
PUT /api/v1/user/profile
Authorization: Bearer {token}
Content-Type: application/json
{
  "fullName": "string",
  "email": "string", 
  "phoneNumber": "string"
}

// Change Password
POST /api/v1/user/change-password
Authorization: Bearer {token}
Content-Type: application/json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

## 🛠️ Cách sử dụng

### **1. Authentication Service**

```typescript
import { authService } from '../services/authService';

// Login
try {
  const response = await authService.login({
    username: 'user123',
    password: 'password123'
  });
  console.log('Login successful:', response.data.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Register
try {
  const response = await authService.register({
    username: 'newuser',
    password: 'password123',
    fullName: 'Nguyễn Văn A',
    email: 'user@example.com',
    phoneNumber: '0123456789',
    departmentName: 'IT'
  });
  console.log('Registration successful');
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Check authentication
const isAuth = authService.isAuthenticated();
const user = authService.getStoredUser();
const token = authService.getStoredToken();
```

### **2. HTTP Client**

```typescript
import { httpClient } from '../utils/httpClient';

// GET request
const users = await httpClient.get('/api/v1/users');

// POST request
const newUser = await httpClient.post('/api/v1/users', userData);

// PUT request  
const updatedUser = await httpClient.put('/api/v1/users/123', userData);

// DELETE request
await httpClient.delete('/api/v1/users/123');

// File upload
const formData = new FormData();
formData.append('file', file);
const response = await httpClient.upload('/api/v1/upload', formData);
```

### **3. Auth Context Integration**

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    login, 
    logout,
    register 
  } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Redirect or show success
    } catch (error) {
      // Show error message
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginForm />;
  
  return <Dashboard user={user} />;
};
```

## 🔧 Configuration

### **API Client Settings**

```typescript
// src/constants/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  API_VERSION: 'v1', 
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

### **Error Handling**

```typescript
import { ApiError } from '../utils/httpClient';

try {
  const data = await httpClient.get('/api/v1/data');
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.message);
    console.log('Status:', error.status);
    console.log('Errors:', error.errors);
  } else {
    console.log('Network Error:', error.message);
  }
}
```

### **Token Management**

```typescript
// Tokens are automatically managed
// Manual token operations:

// Set token
httpClient.setAuthToken('your-jwt-token');

// Remove token
httpClient.removeAuthToken();

// Auto-refresh is handled by AuthContext
```

## 🔍 Debugging

### **Development Mode**

Trong development mode, bạn sẽ thấy:
- API endpoint info trong Login/Register forms
- Console logs cho tất cả API calls
- Network tab trong DevTools

### **Common Issues**

1. **CORS Error**
   ```bash
   # Backend cần enable CORS cho http://localhost:5173
   @CrossOrigin(origins = "http://localhost:5173")
   ```

2. **401 Unauthorized**
   ```typescript
   // Token expired hoặc invalid
   // AuthContext sẽ tự động redirect về login
   ```

3. **Network Error**
   ```typescript
   // Check backend server running
   // Check API_CONFIG.BASE_URL
   ```

## 📱 Testing

### **Manual Testing**

1. Start backend server trên port 8080
2. Start frontend server: `npm run dev`
3. Test login với valid credentials
4. Test registration với required fields
5. Check token persistence trong localStorage

### **API Testing Tools**

```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Test register endpoint  
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "password":"password123", 
    "fullName":"Test User",
    "email":"test@example.com",
    "phoneNumber":"0123456789",
    "departmentName":"IT"
  }'
```

## 🔐 Security

### **Token Storage**

- Access tokens stored trong localStorage
- Auto-refresh 5 minutes before expiration
- Automatic logout khi token expired

### **Request Security**

- All API requests include CSRF protection
- Sensitive data không log ra console trong production
- Input validation on both client và server

### **Best Practices**

- ✅ Never log passwords
- ✅ Always validate input  
- ✅ Use HTTPS trong production
- ✅ Implement proper error boundaries
- ✅ Handle network failures gracefully 