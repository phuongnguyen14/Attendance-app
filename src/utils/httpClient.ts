import { API_CONFIG, HTTP_STATUS, API_ERROR_MESSAGES } from '../constants/api';
import { ApiResponse, ApiErrorResponse } from '../types/auth';

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public errors: any[];
  public timestamp: string;

  constructor(message: string, status: number, errors: any[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}

// HTTP Client class
class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Set authorization token
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authorization token
  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  // Get stored token from localStorage
  private getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Build full URL
  private buildUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  // Build request headers
  private buildHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const token = this.getStoredToken();
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle response
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data: any;
    
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle different HTTP status codes
      switch (response.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          // Don't auto-redirect on 401 - let the calling code handle it
          // This prevents infinite loops during token refresh failures
          console.warn('🔐 HTTP Client: 401 Unauthorized - clearing stored tokens');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.removeAuthToken();
          
          throw new ApiError(API_ERROR_MESSAGES.UNAUTHORIZED, response.status, data.errors);

        case HTTP_STATUS.FORBIDDEN:
          throw new ApiError(API_ERROR_MESSAGES.FORBIDDEN, response.status, data.errors);

        case HTTP_STATUS.NOT_FOUND:
          throw new ApiError(API_ERROR_MESSAGES.NOT_FOUND, response.status, data.errors);

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          throw new ApiError(API_ERROR_MESSAGES.SERVER_ERROR, response.status, data.errors);

        default:
          throw new ApiError(
            data.message || API_ERROR_MESSAGES.NETWORK_ERROR,
            response.status,
            data.errors || []
          );
      }
    }

    return data;
  }

  // Handle network errors
  private handleNetworkError(error: any): never {
    if (error.name === 'AbortError') {
      throw new ApiError(API_ERROR_MESSAGES.TIMEOUT_ERROR, 0);
    }
    
    if (!navigator.onLine) {
      throw new ApiError('Không có kết nối internet', 0);
    }

    throw new ApiError(API_ERROR_MESSAGES.NETWORK_ERROR, 0);
  }

  // GET request
  async get<T = any>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'GET',
        headers: this.buildHeaders(headers),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      this.handleNetworkError(error);
    }
  }

  // POST request
  async post<T = any>(
    endpoint: string, 
    data?: any, 
    headers: Record<string, string> = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'POST',
        headers: this.buildHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      this.handleNetworkError(error);
    }
  }

  // PUT request
  async put<T = any>(
    endpoint: string, 
    data?: any, 
    headers: Record<string, string> = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'PUT',
        headers: this.buildHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      this.handleNetworkError(error);
    }
  }

  // DELETE request
  async delete<T = any>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'DELETE',
        headers: this.buildHeaders(headers),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      this.handleNetworkError(error);
    }
  }

  // PATCH request
  async patch<T = any>(
    endpoint: string, 
    data?: any, 
    headers: Record<string, string> = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'PATCH',
        headers: this.buildHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      this.handleNetworkError(error);
    }
  }

  // Upload file (multipart/form-data)
  async upload<T = any>(
    endpoint: string, 
    formData: FormData, 
    headers: Record<string, string> = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Remove Content-Type header for multipart/form-data
    // Browser will set it automatically with boundary
    const uploadHeaders = { ...this.buildHeaders(headers) };
    delete uploadHeaders['Content-Type'];

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      this.handleNetworkError(error);
    }
  }
}

// Create and export a singleton instance
export const httpClient = new HttpClient();

// Export the class for testing purposes
export { HttpClient }; 