export interface TranslationKeys {
  // Navigation & Menu
  nav: {
    dashboard: string;
    attendance: string;
    statistics: string;
    department: string;
    employee: string;
    shift: string;
    shiftAssignment: string;
    settings: string;
    logout: string;
    profile: string;
    notifications: string;
  };

  // Authentication
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    signIn: string;
    signUp: string;
    noAccount: string;
    hasAccount: string;
    welcomeBack: string;
    createAccount: string;
    loginSubtitle: string;
    registerSubtitle: string;
    forgotPassword: string;
    resetPassword: string;
    rememberMe: string;
    employeeId: string;
    department: string;
    position: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    totalEmployees: string;
    presentToday: string;
    onLeave: string;
    lateArrivals: string;
    recentActivity: string;
    quickActions: string;
    markAttendance: string;
    viewReports: string;
    manageEmployees: string;
    attendanceRate: string;
    thisMonth: string;
    lastMonth: string;
    weeklyOverview: string;
    monthlyTrend: string;
  };

  // Attendance
  attendance: {
    title: string;
    checkIn: string;
    checkOut: string;
    status: string;
    present: string;
    absent: string;
    late: string;
    earlyLeave: string;
    overtime: string;
    breakTime: string;
    workingHours: string;
    totalHours: string;
    todayAttendance: string;
    attendanceHistory: string;
    markAttendance: string;
    currentStatus: string;
    lastCheckIn: string;
    lastCheckOut: string;
    location: string;
    notes: string;
  };

  // Employee Management
  employee: {
    title: string;
    addEmployee: string;
    editEmployee: string;
    deleteEmployee: string;
    employeeList: string;
    employeeDetails: string;
    personalInfo: string;
    contactInfo: string;
    workInfo: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    birthDate: string;
    joinDate: string;
    salary: string;
    status: string;
    active: string;
    inactive: string;
    suspended: string;
    avatar: string;
    uploadPhoto: string;
  };

  // Department Management
  department: {
    title: string;
    addDepartment: string;
    editDepartment: string;
    deleteDepartment: string;
    departmentList: string;
    departmentName: string;
    description: string;
    manager: string;
    employeeCount: string;
    budget: string;
    location: string;
    establishedDate: string;
  };

  // Shift Management
  shift: {
    title: string;
    addShift: string;
    editShift: string;
    deleteShift: string;
    shiftList: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    breakDuration: string;
    workingDays: string;
    shiftType: string;
    morning: string;
    afternoon: string;
    night: string;
    flexible: string;
    assigned: string;
    unassigned: string;
  };

  // Statistics & Reports
  statistics: {
    title: string;
    attendanceReport: string;
    employeeReport: string;
    departmentReport: string;
    monthlyReport: string;
    weeklyReport: string;
    dailyReport: string;
    exportReport: string;
    generateReport: string;
    dateRange: string;
    fromDate: string;
    toDate: string;
    totalWorkingDays: string;
    totalAbsences: string;
    averageWorkingHours: string;
    punctualityRate: string;
  };

  // Settings
  settings: {
    title: string;
    general: string;
    appearance: string;
    notifications: string;
    security: string;
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    light: string;
    dark: string;
    auto: string;
    english: string;
    vietnamese: string;
    emailNotifications: string;
    pushNotifications: string;
    attendanceReminders: string;
    weeklyReports: string;
    changePassword: string;
    twoFactorAuth: string;
    sessionTimeout: string;
    loginHistory: string;
  };

  // Common UI Elements
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    add: string;
    search: string;
    loading: string;
    submit: string;
    reset: string;
    confirm: string;
    close: string;
    next: string;
    previous: string;
    finish: string;
    yes: string;
    no: string;
    ok: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    required: string;
    optional: string;
    select: string;
    selectAll: string;
    clear: string;
    refresh: string;
    export: string;
    import: string;
    print: string;
    share: string;
    copy: string;
    download: string;
    upload: string;
    view: string;
    details: string;
    actions: string;
    filter: string;
    sort: string;
    sortBy: string;
    ascending: string;
    descending: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    thisWeek: string;
    lastWeek: string;
    nextWeek: string;
    thisMonth: string;
    lastMonth: string;
    nextMonth: string;
    thisYear: string;
    lastYear: string;
    nextYear: string;
  };

  // Messages & Notifications
  messages: {
    welcome: string;
    loginSuccess: string;
    loginFailed: string;
    logoutSuccess: string;
    saveSuccess: string;
    saveFailed: string;
    deleteSuccess: string;
    deleteFailed: string;
    updateSuccess: string;
    updateFailed: string;
    addSuccess: string;
    addFailed: string;
    networkError: string;
    serverError: string;
    validationError: string;
    confirmDelete: string;
    unsavedChanges: string;
    noData: string;
    noResults: string;
    accessDenied: string;
    sessionExpired: string;
    checkInSuccess: string;
    checkOutSuccess: string;
    alreadyCheckedIn: string;
    alreadyCheckedOut: string;
  };

  // Time & Date
  time: {
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
    am: string;
    pm: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
  };
}

export const translations: Record<'en' | 'vi', TranslationKeys> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      attendance: 'Attendance',
      statistics: 'Statistics',
      department: 'Department',
      employee: 'Employee',
      shift: 'Shift',
      shiftAssignment: 'Shift Assignment',
      settings: 'Settings',
      logout: 'Logout',
      profile: 'Profile',
      notifications: 'Notifications',
    },

    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      loginSubtitle: 'Sign in to your account to continue',
      registerSubtitle: 'Create your account to get started',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      rememberMe: 'Remember Me',
      employeeId: 'Employee ID',
      department: 'Department',
      position: 'Position',
    },

    dashboard: {
      welcome: 'Welcome to Attendance Management System',
      totalEmployees: 'Total Employees',
      presentToday: 'Present Today',
      onLeave: 'On Leave',
      lateArrivals: 'Late Arrivals',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      markAttendance: 'Mark Attendance',
      viewReports: 'View Reports',
      manageEmployees: 'Manage Employees',
      attendanceRate: 'Attendance Rate',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      weeklyOverview: 'Weekly Overview',
      monthlyTrend: 'Monthly Trend',
    },

    attendance: {
      title: 'Attendance Management',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      status: 'Status',
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      earlyLeave: 'Early Leave',
      overtime: 'Overtime',
      breakTime: 'Break Time',
      workingHours: 'Working Hours',
      totalHours: 'Total Hours',
      todayAttendance: "Today's Attendance",
      attendanceHistory: 'Attendance History',
      markAttendance: 'Mark Attendance',
      currentStatus: 'Current Status',
      lastCheckIn: 'Last Check In',
      lastCheckOut: 'Last Check Out',
      location: 'Location',
      notes: 'Notes',
    },

    employee: {
      title: 'Employee Management',
      addEmployee: 'Add Employee',
      editEmployee: 'Edit Employee',
      deleteEmployee: 'Delete Employee',
      employeeList: 'Employee List',
      employeeDetails: 'Employee Details',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      workInfo: 'Work Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      address: 'Address',
      birthDate: 'Birth Date',
      joinDate: 'Join Date',
      salary: 'Salary',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      avatar: 'Avatar',
      uploadPhoto: 'Upload Photo',
    },

    department: {
      title: 'Department Management',
      addDepartment: 'Add Department',
      editDepartment: 'Edit Department',
      deleteDepartment: 'Delete Department',
      departmentList: 'Department List',
      departmentName: 'Department Name',
      description: 'Description',
      manager: 'Manager',
      employeeCount: 'Employee Count',
      budget: 'Budget',
      location: 'Location',
      establishedDate: 'Established Date',
    },

    shift: {
      title: 'Shift Management',
      addShift: 'Add Shift',
      editShift: 'Edit Shift',
      deleteShift: 'Delete Shift',
      shiftList: 'Shift List',
      shiftName: 'Shift Name',
      startTime: 'Start Time',
      endTime: 'End Time',
      breakDuration: 'Break Duration',
      workingDays: 'Working Days',
      shiftType: 'Shift Type',
      morning: 'Morning',
      afternoon: 'Afternoon',
      night: 'Night',
      flexible: 'Flexible',
      assigned: 'Assigned',
      unassigned: 'Unassigned',
    },

    statistics: {
      title: 'Statistics & Reports',
      attendanceReport: 'Attendance Report',
      employeeReport: 'Employee Report',
      departmentReport: 'Department Report',
      monthlyReport: 'Monthly Report',
      weeklyReport: 'Weekly Report',
      dailyReport: 'Daily Report',
      exportReport: 'Export Report',
      generateReport: 'Generate Report',
      dateRange: 'Date Range',
      fromDate: 'From Date',
      toDate: 'To Date',
      totalWorkingDays: 'Total Working Days',
      totalAbsences: 'Total Absences',
      averageWorkingHours: 'Average Working Hours',
      punctualityRate: 'Punctuality Rate',
    },

    settings: {
      title: 'Settings',
      general: 'General',
      appearance: 'Appearance',
      notifications: 'Notifications',
      security: 'Security',
      theme: 'Theme',
      language: 'Language',
      timezone: 'Timezone',
      dateFormat: 'Date Format',
      timeFormat: 'Time Format',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      english: 'English',
      vietnamese: 'Vietnamese',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
      attendanceReminders: 'Attendance Reminders',
      weeklyReports: 'Weekly Reports',
      changePassword: 'Change Password',
      twoFactorAuth: 'Two-Factor Authentication',
      sessionTimeout: 'Session Timeout',
      loginHistory: 'Login History',
    },

    common: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      submit: 'Submit',
      reset: 'Reset',
      confirm: 'Confirm',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      required: 'Required',
      optional: 'Optional',
      select: 'Select',
      selectAll: 'Select All',
      clear: 'Clear',
      refresh: 'Refresh',
      export: 'Export',
      import: 'Import',
      print: 'Print',
      share: 'Share',
      copy: 'Copy',
      download: 'Download',
      upload: 'Upload',
      view: 'View',
      details: 'Details',
      actions: 'Actions',
      filter: 'Filter',
      sort: 'Sort',
      sortBy: 'Sort By',
      ascending: 'Ascending',
      descending: 'Descending',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      lastWeek: 'Last Week',
      nextWeek: 'Next Week',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      nextMonth: 'Next Month',
      thisYear: 'This Year',
      lastYear: 'Last Year',
      nextYear: 'Next Year',
    },

    messages: {
      welcome: 'Welcome to the system!',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      logoutSuccess: 'Logout successful',
      saveSuccess: 'Saved successfully',
      saveFailed: 'Save failed',
      deleteSuccess: 'Deleted successfully',
      deleteFailed: 'Delete failed',
      updateSuccess: 'Updated successfully',
      updateFailed: 'Update failed',
      addSuccess: 'Added successfully',
      addFailed: 'Add failed',
      networkError: 'Network error',
      serverError: 'Server error',
      validationError: 'Validation error',
      confirmDelete: 'Are you sure you want to delete this item?',
      unsavedChanges: 'You have unsaved changes',
      noData: 'No data available',
      noResults: 'No results found',
      accessDenied: 'Access denied',
      sessionExpired: 'Session expired',
      checkInSuccess: 'Check in successful',
      checkOutSuccess: 'Check out successful',
      alreadyCheckedIn: 'Already checked in today',
      alreadyCheckedOut: 'Already checked out',
    },

    time: {
      seconds: 'seconds',
      minutes: 'minutes',
      hours: 'hours',
      days: 'days',
      weeks: 'weeks',
      months: 'months',
      years: 'years',
      am: 'AM',
      pm: 'PM',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',
    },
  },

  vi: {
    nav: {
      dashboard: 'Bảng điều khiển',
      attendance: 'Chấm công',
      statistics: 'Thống kê',
      department: 'Phòng ban',
      employee: 'Nhân viên',
      shift: 'Ca làm việc',
      shiftAssignment: 'Phân ca',
      settings: 'Cài đặt',
      logout: 'Đăng xuất',
      profile: 'Hồ sơ',
      notifications: 'Thông báo',
    },

    auth: {
      login: 'Đăng nhập',
      register: 'Đăng ký',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      fullName: 'Họ và tên',
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      noAccount: 'Chưa có tài khoản?',
      hasAccount: 'Đã có tài khoản?',
      welcomeBack: 'Chào mừng trở lại',
      createAccount: 'Tạo tài khoản',
      loginSubtitle: 'Đăng nhập để tiếp tục',
      registerSubtitle: 'Tạo tài khoản để bắt đầu',
      forgotPassword: 'Quên mật khẩu?',
      resetPassword: 'Đặt lại mật khẩu',
      rememberMe: 'Ghi nhớ đăng nhập',
      employeeId: 'Mã nhân viên',
      department: 'Phòng ban',
      position: 'Chức vụ',
    },

    dashboard: {
      welcome: 'Chào mừng đến với Hệ thống Quản lý Chấm công',
      totalEmployees: 'Tổng nhân viên',
      presentToday: 'Có mặt hôm nay',
      onLeave: 'Đang nghỉ',
      lateArrivals: 'Đến muộn',
      recentActivity: 'Hoạt động gần đây',
      quickActions: 'Thao tác nhanh',
      markAttendance: 'Chấm công',
      viewReports: 'Xem báo cáo',
      manageEmployees: 'Quản lý nhân viên',
      attendanceRate: 'Tỷ lệ chấm công',
      thisMonth: 'Tháng này',
      lastMonth: 'Tháng trước',
      weeklyOverview: 'Tổng quan tuần',
      monthlyTrend: 'xu hướng tháng',
    },

    attendance: {
      title: 'Quản lý Chấm công',
      checkIn: 'Vào ca',
      checkOut: 'Ra ca',
      status: 'Trạng thái',
      present: 'Có mặt',
      absent: 'Vắng mặt',
      late: 'Muộn',
      earlyLeave: 'Về sớm',
      overtime: 'Tăng ca',
      breakTime: 'Giờ nghỉ',
      workingHours: 'Giờ làm việc',
      totalHours: 'Tổng giờ',
      todayAttendance: 'Chấm công hôm nay',
      attendanceHistory: 'Lịch sử chấm công',
      markAttendance: 'Chấm công',
      currentStatus: 'Trạng thái hiện tại',
      lastCheckIn: 'Lần vào ca cuối',
      lastCheckOut: 'Lần ra ca cuối',
      location: 'Vị trí',
      notes: 'Ghi chú',
    },

    employee: {
      title: 'Quản lý Nhân viên',
      addEmployee: 'Thêm nhân viên',
      editEmployee: 'Sửa nhân viên',
      deleteEmployee: 'Xóa nhân viên',
      employeeList: 'Danh sách nhân viên',
      employeeDetails: 'Chi tiết nhân viên',
      personalInfo: 'Thông tin cá nhân',
      contactInfo: 'Thông tin liên hệ',
      workInfo: 'Thông tin công việc',
      firstName: 'Tên',
      lastName: 'Họ',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      birthDate: 'Ngày sinh',
      joinDate: 'Ngày vào làm',
      salary: 'Lương',
      status: 'Trạng thái',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      suspended: 'Tạm ngừng',
      avatar: 'Ảnh đại diện',
      uploadPhoto: 'Tải ảnh lên',
    },

    department: {
      title: 'Quản lý Phòng ban',
      addDepartment: 'Thêm phòng ban',
      editDepartment: 'Sửa phòng ban',
      deleteDepartment: 'Xóa phòng ban',
      departmentList: 'Danh sách phòng ban',
      departmentName: 'Tên phòng ban',
      description: 'Mô tả',
      manager: 'Quản lý',
      employeeCount: 'Số nhân viên',
      budget: 'Ngân sách',
      location: 'Vị trí',
      establishedDate: 'Ngày thành lập',
    },

    shift: {
      title: 'Quản lý Ca làm việc',
      addShift: 'Thêm ca',
      editShift: 'Sửa ca',
      deleteShift: 'Xóa ca',
      shiftList: 'Danh sách ca',
      shiftName: 'Tên ca',
      startTime: 'Giờ bắt đầu',
      endTime: 'Giờ kết thúc',
      breakDuration: 'Thời gian nghỉ',
      workingDays: 'Ngày làm việc',
      shiftType: 'Loại ca',
      morning: 'Ca sáng',
      afternoon: 'Ca chiều',
      night: 'Ca tối',
      flexible: 'Linh hoạt',
      assigned: 'Đã phân',
      unassigned: 'Chưa phân',
    },

    statistics: {
      title: 'Thống kê & Báo cáo',
      attendanceReport: 'Báo cáo chấm công',
      employeeReport: 'Báo cáo nhân viên',
      departmentReport: 'Báo cáo phòng ban',
      monthlyReport: 'Báo cáo tháng',
      weeklyReport: 'Báo cáo tuần',
      dailyReport: 'Báo cáo ngày',
      exportReport: 'Xuất báo cáo',
      generateReport: 'Tạo báo cáo',
      dateRange: 'Khoảng thời gian',
      fromDate: 'Từ ngày',
      toDate: 'Đến ngày',
      totalWorkingDays: 'Tổng ngày làm việc',
      totalAbsences: 'Tổng ngày vắng',
      averageWorkingHours: 'Giờ làm việc trung bình',
      punctualityRate: 'Tỷ lệ đúng giờ',
    },

    settings: {
      title: 'Cài đặt',
      general: 'Chung',
      appearance: 'Giao diện',
      notifications: 'Thông báo',
      security: 'Bảo mật',
      theme: 'Chủ đề',
      language: 'Ngôn ngữ',
      timezone: 'Múi giờ',
      dateFormat: 'Định dạng ngày',
      timeFormat: 'Định dạng giờ',
      light: 'Sáng',
      dark: 'Tối',
      auto: 'Tự động',
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt',
      emailNotifications: 'Thông báo Email',
      pushNotifications: 'Thông báo đẩy',
      attendanceReminders: 'Nhắc nhở chấm công',
      weeklyReports: 'Báo cáo tuần',
      changePassword: 'Đổi mật khẩu',
      twoFactorAuth: 'Xác thực hai yếu tố',
      sessionTimeout: 'Thời gian phiên',
      loginHistory: 'Lịch sử đăng nhập',
    },

    common: {
      save: 'Lưu',
      cancel: 'Hủy',
      edit: 'Sửa',
      delete: 'Xóa',
      add: 'Thêm',
      search: 'Tìm kiếm',
      loading: 'Đang tải...',
      submit: 'Gửi',
      reset: 'Đặt lại',
      confirm: 'Xác nhận',
      close: 'Đóng',
      next: 'Tiếp theo',
      previous: 'Trước',
      finish: 'Hoàn thành',
      yes: 'Có',
      no: 'Không',
      ok: 'OK',
      error: 'Lỗi',
      success: 'Thành công',
      warning: 'Cảnh báo',
      info: 'Thông tin',
      required: 'Bắt buộc',
      optional: 'Tùy chọn',
      select: 'Chọn',
      selectAll: 'Chọn tất cả',
      clear: 'Xóa',
      refresh: 'Làm mới',
      export: 'Xuất',
      import: 'Nhập',
      print: 'In',
      share: 'Chia sẻ',
      copy: 'Sao chép',
      download: 'Tải xuống',
      upload: 'Tải lên',
      view: 'Xem',
      details: 'Chi tiết',
      actions: 'Thao tác',
      filter: 'Lọc',
      sort: 'Sắp xếp',
      sortBy: 'Sắp xếp theo',
      ascending: 'Tăng dần',
      descending: 'Giảm dần',
      today: 'Hôm nay',
      yesterday: 'Hôm qua',
      tomorrow: 'Ngày mai',
      thisWeek: 'Tuần này',
      lastWeek: 'Tuần trước',
      nextWeek: 'Tuần sau',
      thisMonth: 'Tháng này',
      lastMonth: 'Tháng trước',
      nextMonth: 'Tháng sau',
      thisYear: 'Năm này',
      lastYear: 'Năm trước',
      nextYear: 'Năm sau',
    },

    messages: {
      welcome: 'Chào mừng đến với hệ thống!',
      loginSuccess: 'Đăng nhập thành công',
      loginFailed: 'Đăng nhập thất bại',
      logoutSuccess: 'Đăng xuất thành công',
      saveSuccess: 'Lưu thành công',
      saveFailed: 'Lưu thất bại',
      deleteSuccess: 'Xóa thành công',
      deleteFailed: 'Xóa thất bại',
      updateSuccess: 'Cập nhật thành công',
      updateFailed: 'Cập nhật thất bại',
      addSuccess: 'Thêm thành công',
      addFailed: 'Thêm thất bại',
      networkError: 'Lỗi mạng',
      serverError: 'Lỗi máy chủ',
      validationError: 'Lỗi xác thực',
      confirmDelete: 'Bạn có chắc chắn muốn xóa mục này?',
      unsavedChanges: 'Bạn có thay đổi chưa được lưu',
      noData: 'Không có dữ liệu',
      noResults: 'Không tìm thấy kết quả',
      accessDenied: 'Từ chối truy cập',
      sessionExpired: 'Phiên đã hết hạn',
      checkInSuccess: 'Vào ca thành công',
      checkOutSuccess: 'Ra ca thành công',
      alreadyCheckedIn: 'Đã vào ca hôm nay',
      alreadyCheckedOut: 'Đã ra ca',
    },

    time: {
      seconds: 'giây',
      minutes: 'phút',
      hours: 'giờ',
      days: 'ngày',
      weeks: 'tuần',
      months: 'tháng',
      years: 'năm',
      am: 'SA',
      pm: 'CH',
      monday: 'Thứ hai',
      tuesday: 'Thứ ba',
      wednesday: 'Thứ tư',
      thursday: 'Thứ năm',
      friday: 'Thứ sáu',
      saturday: 'Thứ bảy',
      sunday: 'Chủ nhật',
      january: 'Tháng 1',
      february: 'Tháng 2',
      march: 'Tháng 3',
      april: 'Tháng 4',
      may: 'Tháng 5',
      june: 'Tháng 6',
      july: 'Tháng 7',
      august: 'Tháng 8',
      september: 'Tháng 9',
      october: 'Tháng 10',
      november: 'Tháng 11',
      december: 'Tháng 12',
    },
  },
}; 