/**
 * API Configuration and Utilities
 * 
 * Centralized API handling with consistent error management,
 * request/response interceptors, and authentication token management.
 */

// API Configuration
const API_BASE_URL = 'http://localhost:3001';

/**
 * HTTP Methods supported by the API
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * API Request configuration options
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public status: number;
  public response: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Get authentication token from storage
 * 
 * @returns {string | null} The stored JWT token or null if not found
 */
export const getAuthToken = (): string | null => {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
};

/**
 * Set authentication token in storage
 * 
 * @param {string} token - The JWT token to store
 * @param {boolean} rememberMe - Whether to store in localStorage (true) or sessionStorage (false)
 */
export const setAuthToken = (token: string, rememberMe: boolean = false): void => {
  if (rememberMe) {
    localStorage.setItem("token", token);
    sessionStorage.removeItem("token");
  } else {
    sessionStorage.setItem("token", token);
    localStorage.removeItem("token");
  }
};

/**
 * Remove authentication token from storage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

/**
 * Create request headers with authentication if required
 * 
 * @param {boolean} requiresAuth - Whether authentication is required
 * @param {Record<string, string>} customHeaders - Additional headers
 * @returns {Record<string, string>} Headers object
 */
const createHeaders = (requiresAuth: boolean = false, customHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Make an API request with consistent error handling
 * 
 * @param {ApiRequestConfig} config - Request configuration
 * @returns {Promise<T>} API response data
 * @throws {ApiError} When request fails
 */
export const apiRequest = async <T = any>(config: ApiRequestConfig): Promise<T> => {
  const { method, endpoint, data, requiresAuth = false, headers = {} } = config;

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const requestHeaders = createHeaders(requiresAuth, headers);

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (data && method !== 'GET') {
      requestConfig.body = JSON.stringify(data);
    }

    const response = await fetch(url, requestConfig);
    const responseData = await response.json();

    if (!response.ok) {
      throw new ApiError(
        responseData.message || `HTTP ${response.status}`,
        response.status,
        responseData
      );
    }

    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      error
    );
  }
};

/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * User login
   */
  login: async (credentials: { username: string; password: string }) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: any;
    }>({
      method: 'POST',
      endpoint: '/auth/login',
      data: credentials,
    });
  },

  /**
   * User registration
   */
  signup: async (userData: {
    username: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
  }) => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      endpoint: '/auth/signup',
      data: userData,
    });
  },

  /**
   * User logout
   */
  logout: async () => {
    return apiRequest<ApiResponse>({
      method: 'POST',
      endpoint: '/auth/logout',
      requiresAuth: true,
    });
  },

  /**
   * Validate token
   */
  checkToken: async () => {
    return apiRequest<{
      success: boolean;
      message: string;
      user?: any;
    }>({
      method: 'GET',
      endpoint: '/auth/checkToken',
      requiresAuth: true,
    });
  },
};

/**
 * User API methods
 */
export const userApi = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    return apiRequest<ApiResponse>({
      method: 'GET',
      endpoint: '/user/profile',
      requiresAuth: true,
    });
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    return apiRequest<ApiResponse>({
      method: 'DELETE',
      endpoint: '/user/deleteUser',
      requiresAuth: true,
    });
  },
};

/**
 * Admin API methods
 */
export const adminApi = {
  /**
   * Get all users (admin only)
   */
  getAllUsers: async () => {
    return apiRequest<ApiResponse>({
      method: 'GET',
      endpoint: '/admin/getAllUsers',
      requiresAuth: true,
    });
  },

  /**
   * Delete user by admin (admin only)
   */
  deleteUser: async (userId: string) => {
    return apiRequest<ApiResponse>({
      method: 'DELETE',
      endpoint: '/admin/deleteUserByAdmin',
      data: { userId },
      requiresAuth: true,
    });
  },
}; 