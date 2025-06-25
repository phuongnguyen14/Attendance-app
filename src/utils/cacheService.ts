interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

interface EmployeeCacheData {
  employees: any[];
  filteredEmployees: any[];
  filters: any;
  pagination: any;
  stats: any;
  departments: any[];
  lastUpdated: string;
}

class CacheService {
  private prefix = 'attendflow_';
  private defaultTTL = 15 * 60 * 1000; // 15 minutes

  /**
   * Set cache data with expiration
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: ttl,
      };
      
      localStorage.setItem(
        `${this.prefix}${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  /**
   * Get cache data if not expired
   */
  get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(`${this.prefix}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();

      // Check if expired
      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      return null;
    }
  }

  /**
   * Remove specific cache item
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.warn('Failed to remove cache:', error);
    }
  }

  /**
   * Clear all cache with prefix
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Check if cache exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Employee-specific cache methods
   */
  
  // Cache employee data
  setEmployeeData(data: EmployeeCacheData): void {
    this.set('employee_data', {
      ...data,
      lastUpdated: new Date().toISOString(),
    });
  }

  // Get cached employee data
  getEmployeeData(): EmployeeCacheData | null {
    return this.get<EmployeeCacheData>('employee_data');
  }

  // Cache employee filters
  setEmployeeFilters(filters: any): void {
    this.set('employee_filters', filters, 60 * 60 * 1000); // 1 hour
  }

  // Get cached employee filters
  getEmployeeFilters(): any | null {
    return this.get('employee_filters');
  }

  // Cache pagination state
  setEmployeePagination(pagination: any): void {
    this.set('employee_pagination', pagination, 60 * 60 * 1000); // 1 hour
  }

  // Get cached pagination state
  getEmployeePagination(): any | null {
    return this.get('employee_pagination');
  }

  // Cache view mode
  setEmployeeViewMode(viewMode: 'grid' | 'table'): void {
    this.set('employee_view_mode', viewMode, 24 * 60 * 60 * 1000); // 24 hours
  }

  // Get cached view mode
  getEmployeeViewMode(): 'grid' | 'table' | null {
    return this.get<'grid' | 'table'>('employee_view_mode');
  }

  // Invalidate employee cache (call after CRUD operations)
  invalidateEmployeeCache(): void {
    this.remove('employee_data');
    console.log('Employee cache invalidated');
  }

  // Get cache status for debugging
  getCacheStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const cacheKey = key.replace(this.prefix, '');
          const cached = localStorage.getItem(key);
          
          if (cached) {
            try {
              const cacheItem = JSON.parse(cached);
              const now = Date.now();
              const age = now - cacheItem.timestamp;
              const remaining = cacheItem.expiresIn - age;
              
              status[cacheKey] = {
                exists: true,
                age: Math.floor(age / 1000), // seconds
                remaining: Math.floor(remaining / 1000), // seconds
                expired: remaining <= 0,
                size: cached.length,
              };
            } catch {
              status[cacheKey] = { exists: true, error: 'Parse error' };
            }
          }
        }
      });
    } catch (error) {
      console.warn('Failed to get cache status:', error);
    }
    
    return status;
  }
}

export const cacheService = new CacheService();
export default cacheService; 