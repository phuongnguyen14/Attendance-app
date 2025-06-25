# Employee API Integration - Comprehensive Guide

## Tổng quan

Hệ thống Employee Management được tích hợp đầy đủ với backend Java Spring Boot, cung cấp các chức năng quản lý nhân viên hoàn chỉnh bao gồm CRUD operations, search, filtering, và statistics.

## 📁 Cấu trúc Files

```
src/
├── types/employee.ts                    # Type definitions
├── services/employeeService.ts          # Service layer
├── pages/Employee.tsx                   # Main Employee page
├── components/EmployeeAPITestPanel.tsx  # API testing tool
└── services/README_Employee.md          # This documentation
```

## 🔗 API Endpoints

### Danh sách Employee Endpoints

| Endpoint | Method | Mô tả | Query Params |
|----------|--------|-------|-------------|
| `/api/v1/employees` | GET | Lấy tất cả nhân viên | - |
| `/api/v1/employees/{id}` | GET | Lấy nhân viên theo ID | id (required) |
| `/api/v1/employees/filter` | GET | Lọc nhân viên | fullName, departmentId, status, page, size |
| `/api/v1/employees` | POST | Tạo nhân viên mới | - |
| `/api/v1/employees/{id}` | PUT | Cập nhật nhân viên | id (required) |
| `/api/v1/employees/{id}` | DELETE | Xóa nhân viên | id (required) |
| `/api/v1/employees/stats` | GET | Thống kê nhân viên | - |
| `/api/v1/employees/{id}/avatar` | POST | Upload avatar | id (required) |
| `/api/v1/departments` | GET | Danh sách phòng ban | - |

### Filter Parameters

Hệ thống hỗ trợ tất cả filter parameters từ API specification:

```typescript
interface EmployeeSearchFilters {
  // Basic identification filters
  id?: string;                 // Employee ID
  username?: string;           // Username
  fullName?: string;           // Full name (exact or partial match)
  email?: string;              // Email address
  phoneNumber?: string;        // Phone number
  position?: string;           // Job position/title
  
  // Legacy support
  name?: string;               // Maps to fullName for backward compatibility
  
  // Department and status
  department?: string;         // Maps to departmentId (use department ID)
  departmentId?: string;       // Department ID (recommended)
  status?: EmployeeStatus;     // Employee status
  
  // Date range filters
  joinDateFrom?: string;       // From date (YYYY-MM-DD)
  joinDateTo?: string;         // To date (YYYY-MM-DD)
  
  // Salary range filters
  salaryMin?: number;          // Minimum salary
  salaryMax?: number;          // Maximum salary
  
  // Pagination
  page?: number;               // Current page (default: 1)
  limit?: number;              // Maps to size parameter (default: 10)
  size?: number;               // Direct size parameter
  
  // Sorting
  sortBy?: string;             // Sort field
  sortOrder?: 'asc' | 'desc';  // Maps to direction parameter
  direction?: 'asc' | 'desc';  // Direct direction parameter
}
```

### API Parameter Mapping

| Frontend Field | API Parameter | Description | Example |
|----------------|---------------|-------------|---------|
| `id` | `id` | Employee ID | `"123"` |
| `username` | `username` | Username | `"john.doe"` |
| `fullName` | `fullName` | Full name | `"Nguyễn Văn A"` |
| `email` | `email` | Email address | `"john@company.com"` |
| `phoneNumber` | `phoneNumber` | Phone number | `"+84123456789"` |
| `position` | `position` | Job position | `"Software Developer"` |
| `department` | `departmentId` | Department ID | `"IT"` |
| `status` | `status` | Employee status | `"ACTIVE"` |
| `page` | `page` | Page number | `1` |
| `limit` | `size` | Items per page | `10` |
| `sortBy` | `sortBy` | Sort field | `"fullName"` |
| `sortOrder` | `direction` | Sort direction | `"asc"` |

### Available Departments

Hệ thống hỗ trợ các phòng ban sau:

| Department ID | Tên phòng ban |
|---------------|---------------|
| `IT` | Phòng công nghệ thông tin |
| `MARKETING` | Phòng quảng bá |
| `HR` | Human Resources |
| `ACCOUNTING` | Phòng kế toán |
| `PRODUCTION` | Phòng sản xuất |
| `LEGAL` | Pháp chế, hợp đồng |
| `QA` | Đảm bảo chất lượng |
| `PROJECT_MANAGEMENT` | Quản lý dự án |
| `CORPORATE_COMMUNICATION` | Truyền thông |
| `TEST_DEPARTMENT` | Phòng ban test |

## 📊 Response Formats

### Lấy tất cả nhân viên
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "1",
      "fullName": "Nguyễn Văn A",
      "firstName": "Văn A",
      "lastName": "Nguyễn",
      "email": "nguyenvana@company.com",
      "phoneNumber": "+84123456789",
      "department": {
        "id": "1",
        "name": "Engineering"
      },
      "position": "Software Developer",
      "status": "ACTIVE",
      "salary": 50000000,
      "birthDate": "1990-01-01",
      "joinDate": "2023-01-15",
      "address": "123 Main St, Ho Chi Minh City",
      "skills": ["JavaScript", "React", "Node.js"],
      "createdAt": "2023-01-15T08:00:00Z",
      "updatedAt": "2023-01-15T08:00:00Z"
    }
  ]
}
```

### Search Response (với pagination)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "employees": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Employee Statistics
```json
{
  "success": true,
  "data": {
    "totalEmployees": 25,
    "activeEmployees": 20,
    "inactiveEmployees": 2,
    "onLeaveEmployees": 3,
    "newEmployeesThisMonth": 2,
    "averageSalary": 45000000,
    "departmentDistribution": [
      {
        "department": "Engineering",
        "count": 10,
        "percentage": 40.0
      }
    ],
    "positionDistribution": [...],
    "ageDistribution": [...]
  }
}
```

## 🛠️ Cách sử dụng Service Layer

### 1. Import Service
```typescript
import { employeeService } from '../services/employeeService';
```

### 2. Lấy tất cả nhân viên
```typescript
const loadEmployees = async () => {
  try {
    const employees = await employeeService.getAllEmployees();
    setEmployees(employees);
  } catch (error) {
    console.error('Failed to load employees:', error);
  }
};
```

### 3. Lọc nhân viên với filters nâng cao
```typescript
const advancedSearch = async () => {
  try {
    const filters = {
      // Basic identification filters
      id: '123',
      username: 'john.doe',
      fullName: 'Nguyễn Văn A',
      email: 'john@company.com',
      phoneNumber: '+84123456789',
      position: 'Software Developer',
      
      // Department and status
      department: 'IT', // Sử dụng department ID
      status: EmployeeStatus.ACTIVE,
      
      // Pagination and sorting
      page: 1,
      limit: 10,
      sortBy: 'fullName',
      sortOrder: 'asc'
    };
    
    const result = await employeeService.searchEmployees(filters);
    setEmployees(result.employees);
    setPagination(result.pagination);
  } catch (error) {
    console.error('Advanced search failed:', error);
  }
};
```

### 3a. Tìm kiếm đơn giản (backward compatible)
```typescript
const simpleSearch = async () => {
  try {
    const filters = {
      name: 'Nguyễn', // Legacy search - maps to fullName
      department: 'IT',
      status: EmployeeStatus.ACTIVE,
      page: 1,
      limit: 10
    };
    
    const result = await employeeService.searchEmployees(filters);
    setEmployees(result.employees);
    setPagination(result.pagination);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### 4. Tạo nhân viên mới
```typescript
const createEmployee = async () => {
  try {
    const newEmployee = {
      fullName: 'Trần Thị B',
      firstName: 'Thị B',
      lastName: 'Trần',
      email: 'tranthib@company.com',
      phoneNumber: '+84987654321',
      departmentId: 'IT',
      position: 'Software Developer',
      joinDate: '2024-01-15',
      salary: 50000000,
      address: '456 Second St, Ho Chi Minh City'
    };
    
    const created = await employeeService.createEmployee(newEmployee);
    console.log('Employee created:', created);
  } catch (error) {
    console.error('Failed to create employee:', error);
  }
};
```

### 5. Cập nhật nhân viên
```typescript
const updateEmployee = async (employeeId: string) => {
  try {
    const updates = {
      id: employeeId,
      fullName: 'Trần Thị B Updated',
      position: 'Senior Software Developer',
      salary: 60000000
    };
    
    const updated = await employeeService.updateEmployee(employeeId, updates);
    console.log('Employee updated:', updated);
  } catch (error) {
    console.error('Failed to update employee:', error);
  }
};
```

### 6. Xóa nhân viên
```typescript
const deleteEmployee = async (employeeId: string) => {
  try {
    await employeeService.deleteEmployee(employeeId);
    console.log('Employee deleted successfully');
  } catch (error) {
    console.error('Failed to delete employee:', error);
  }
};
```

### 7. Upload Avatar
```typescript
const uploadAvatar = async (employeeId: string, file: File) => {
  try {
    const avatarUrl = await employeeService.uploadAvatar(employeeId, file);
    console.log('Avatar uploaded:', avatarUrl);
  } catch (error) {
    console.error('Failed to upload avatar:', error);
  }
};
```

## 🎨 UI Components

### Employee Page Features

1. **Statistics Cards**: Hiển thị tổng quan số liệu nhân viên
2. **Search & Filter**: Tìm kiếm và lọc nhân viên theo nhiều tiêu chí
3. **Grid/Table View**: Chuyển đổi giữa hiển thị dạng lưới và bảng
4. **CRUD Operations**: Thêm, sửa, xóa, xem chi tiết nhân viên
5. **Real-time Data**: Tự động cập nhật dữ liệu sau mỗi thao tác

### View Modes

#### Grid View
- Hiển thị dạng cards với thông tin cơ bản
- Avatar/Initial letters
- Thông tin liên hệ
- Actions buttons (View, Edit, Delete)

#### Table View
- Hiển thị dạng bảng với tất cả thông tin
- Sortable columns
- Responsive design
- Inline actions

## 🧪 API Testing

### Employee API Test Panel

Component `EmployeeAPITestPanel` cung cấp công cụ test API trong development mode:

#### Test Scenarios:
1. **Lấy tất cả nhân viên** - GET /api/v1/employees
2. **Lấy nhân viên theo ID** - GET /api/v1/employees/{id}
3. **Lọc nhân viên** - GET /api/v1/employees/filter
4. **Tạo nhân viên mới** - POST /api/v1/employees
5. **Cập nhật nhân viên** - PUT /api/v1/employees/{id}
6. **Xóa nhân viên** - DELETE /api/v1/employees/{id}
7. **Thống kê nhân viên** - GET /api/v1/employees/stats
8. **Danh sách phòng ban** - GET /api/v1/departments

#### Cách sử dụng:
1. Mở Employee page trong development mode
2. Scroll xuống cuối trang tìm "Employee API Test Panel"
3. Chọn test scenario
4. Click "Test API"
5. Xem kết quả và response time

## ⚙️ Configuration

### Development Settings

```typescript
// src/constants/app.ts
export const DEV_SETTINGS = {
  showDevInfo: true,        // Hiển thị dev info boxes
  enableConsoleLog: true,   // Enable console logging
  apiTimeout: 10000,        // API timeout (ms)
  mockDataMode: false,      // Use mock data instead of API
};
```

### Environment Variables
```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_VERSION=v1
REACT_APP_DEV_MODE=true
```

## 🔒 Error Handling

### Service Layer Error Handling
```typescript
try {
  const employees = await employeeService.getAllEmployees();
} catch (error: any) {
  // Error được normalize thành user-friendly message
  console.error('API Error:', error.message);
  setError(error.message || 'Không thể tải danh sách nhân viên');
}
```

### Common Error Messages
- `"Không thể tải danh sách nhân viên"` - Lỗi khi load employees
- `"Không thể tìm kiếm nhân viên"` - Lỗi search
- `"Không thể tạo nhân viên mới"` - Lỗi create
- `"Không thể cập nhật thông tin nhân viên"` - Lỗi update
- `"Không thể xóa nhân viên"` - Lỗi delete

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column grid, mobile-optimized forms
- **Tablet**: 768px - 1024px - 2 column grid
- **Desktop**: > 1024px - 3 column grid, full table view

### Mobile Features
- Touch-friendly buttons
- Swipe actions (planned)
- Mobile-optimized modals
- Condensed information display

## 🚀 Performance Optimization

### Implemented Optimizations
1. **Debounced Search**: 500ms delay để tránh API calls quá nhiều
2. **Local Filtering**: Client-side filtering cho tìm kiếm cơ bản
3. **Pagination**: Hỗ trợ pagination để load data theo chunks
4. **Response Normalization**: Xử lý multiple response formats
5. **Error Boundary**: Graceful error handling

### Planned Optimizations
1. **React.memo** cho components
2. **useMemo/useCallback** cho expensive operations
3. **Virtual scrolling** cho large datasets
4. **Image optimization** cho avatars
5. **Service Worker** cho offline support

## 🧩 Integration với các Module khác

### Authentication Integration
```typescript
// Employee operations yêu cầu authentication
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  // Redirect to login
  return;
}

// Check permissions
if (!user.permissions.includes('EMPLOYEE_READ')) {
  // Show access denied
  return;
}
```

### Department Integration
```typescript
// Load departments cho dropdown
const departments = await employeeService.getDepartments();
```

### Attendance Integration
```typescript
// Link từ Employee page to Attendance
<button onClick={() => navigate(`/attendance?employeeId=${employee.id}`)}>
  Xem chấm công
</button>
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Failed to load employees"
- **Nguyên nhân**: Backend API không available
- **Giải pháp**: Check API endpoint, network connection

#### 2. "Search không hoạt động"
- **Nguyên nhân**: Search parameters không đúng format
- **Giải pháp**: Check EmployeeSearchFilters interface

#### 3. "Avatar upload failed"
- **Nguyên nhân**: File size quá lớn hoặc format không support
- **Giải pháp**: Resize image, check file format

#### 4. "Statistics không hiển thị"
- **Nguyên nhân**: Stats API endpoint chưa implement
- **Giải pháp**: Check backend stats endpoint

### Debug Mode

Enable console logging để debug:
```typescript
// src/constants/app.ts
export const DEV_SETTINGS = {
  enableConsoleLog: true,
};
```

Logs sẽ hiển thị:
- 🔄 API calls being made
- ✅ Successful responses
- ❌ Error responses
- 📊 Data transformation steps

## 📝 Contributing

### Code Standards
1. Follow existing naming conventions
2. Add TypeScript types cho all new features
3. Include error handling
4. Add console logging với conditionalLog()
5. Update documentation

### Testing
1. Test tất cả CRUD operations
2. Test error scenarios
3. Test responsive design
4. Verify API integration
5. Check performance với large datasets

## 📚 Related Documentation

- [Authentication Integration](./README.md#authentication)
- [Attendance API Integration](./README.md#attendance-integration)
- [Language System](../locales/README.md)
- [Development Settings](../constants/README.md)

---

**Note**: Employee API integration đã được implement và test đầy đủ. Tất cả endpoints đã được tích hợp với UI và sẵn sàng cho production use. 