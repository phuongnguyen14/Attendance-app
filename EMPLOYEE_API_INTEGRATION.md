# 👤 Employee API Integration - User Profile trong Sidebar

## 📋 Tổng quan

Đã tích hợp thành công **Employee API** vào user profile section trong sidebar để hiển thị thông tin thật của người đang đăng nhập từ backend sử dụng `employeeId`.

## 🔧 Flow hoạt động

### 1. **Login Process**
```typescript
// Login response từ backend
{
  "departmentDisplayName": "string",
  "departmentName": "string", 
  "email": "string",
  "employeeId": 0,           // 🔑 KEY: ID của employee
  "fullName": "string",
  "id": 0,                   // User ID
  "message": "string",
  "role": "ADMIN",
  "token": "string",
  "username": "string"
}
```

### 2. **Employee Data Fetch**
```typescript
// Sử dụng employeeId để fetch chi tiết
GET /api/v1/employees/{employeeId}

Response: {
  "createdAt": "2025-06-25T06:28:46.787Z",
  "dateOfBirth": "2025-06-25",
  "departmentDisplayName": "string",
  "departmentName": "string",
  "email": "string",
  "fullName": "string",
  "gender": "FEMALE",
  "id": 0,
  "phoneNumber": "string",
  "position": "string",
  "role": "ADMIN",
  "updatedAt": "2025-06-25T06:28:46.787Z",
  "username": "string"
}
```

## 🔄 Data Flow

1. **User đăng nhập** → Backend trả về login response với `employeeId`
2. **AuthService** tạo User object với `employeeId` từ response  
3. **Sidebar component mount** → `useCurrentEmployee` hook được trigger
4. **Hook gọi API** `/api/v1/employees/{employeeId}` với Authorization header
5. **Backend** trả về thông tin chi tiết employee
6. **Frontend** hiển thị thông tin trong user profile section

## 🛠️ Technical Implementation

### **AuthService Changes**
```typescript
// Tạo User object từ login response
const user: User = {
  id: rawResponse.id?.toString(),
  employeeId: rawResponse.employeeId?.toString(), // 🔑 Store employeeId
  username: rawResponse.username,
  fullName: rawResponse.fullName,
  email: rawResponse.email,
  role: rawResponse.role,
  department: {
    name: rawResponse.departmentDisplayName || rawResponse.departmentName
  },
  // ... other fields
};
```

### **useCurrentEmployee Hook** 
```typescript
// Sử dụng employeeId từ auth user
const employeeData = await employeeService.getEmployeeById(user.employeeId);
```

### **Smart Fallback System**
- **Có Employee API data** → Hiển thị thông tin từ API (position, phone, etc.)
- **API lỗi/chậm** → Fallback về auth user data (name, email, department)
- **Offline** → Hiển thị thông báo "Dùng dữ liệu offline"

## ✨ UI Features

### **Visual Indicators**
- 🟢 **Green dot + "API" badge**: Dữ liệu từ Employee API thành công
- 🟠 **Orange dot**: API lỗi, đang dùng fallback data  
- ⏳ **Loading spinner**: Đang fetch employee data
- 📱 **Responsive design**: Mobile và desktop friendly

### **Debug Tools** (Development)
- **Employee API Debug panel** trong DevSettings
- Test với real employeeId: `/api/v1/employees/{employeeId}`
- Console logging với detailed information
- Real-time status monitoring

## 🎯 Backend API Requirements

### **Login Endpoint**
```
POST /api/v1/auth/login

Response phải có employeeId:
{
  "departmentDisplayName": "IT Department",
  "departmentName": "IT", 
  "email": "user@company.com",
  "employeeId": 123,        // 🔑 REQUIRED
  "fullName": "Nguyễn Văn A",
  "id": 456,               // User ID
  "role": "ADMIN",
  "token": "jwt_token_here",
  "username": "nva"
}
```

### **Employee Detail Endpoint**
```
GET /api/v1/employees/{employeeId}
Authorization: Bearer <JWT_TOKEN>

Response với thông tin chi tiết:
{
  "id": 123,
  "fullName": "Nguyễn Văn A",
  "position": "Senior Developer", 
  "phoneNumber": "0901234567",
  "departmentName": "IT Department",
  "email": "nva@company.com",
  // ... các field khác
}
```

## 🔧 Development & Testing

### **Debug Commands**
```javascript
// Test trong console
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('EmployeeId:', JSON.parse(localStorage.getItem('user'))?.employeeId);

// Test API trực tiếp
const employeeId = JSON.parse(localStorage.getItem('user'))?.employeeId;
fetch(`/api/v1/employees/${employeeId}`, {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
});
```

### **DevSettings Panel**
1. Mở DevSettings (purple gear icon)
2. Xem "Employee API Debug" section  
3. Click "Debug" để xem employeeId và test API
4. Click "Refresh" để retry API call

## 🛡️ Error Handling

- **Không có employeeId** → Skip API call, dùng auth data
- **Employee API 404** → Employee không tồn tại, dùng auth data
- **Employee API 401** → Token expired, redirect login
- **Network error** → Hiển thị error state, retry available

## 📝 Key Benefits

- ✅ **Accurate data**: Sử dụng đúng employeeId từ backend
- ✅ **Real employee info**: Position, phone, department details
- ✅ **Graceful fallback**: Vẫn hoạt động khi API lỗi
- ✅ **Performance**: Cache employee data, smart loading
- ✅ **Developer friendly**: Extensive debugging tools

## 🚀 Next Steps

1. ✅ Backend implement proper login response với employeeId  
2. ✅ Test với real employee data từ database
3. 🔄 Implement caching để tối ưu performance
4. 🔄 Add avatar upload functionality 