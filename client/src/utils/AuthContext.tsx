import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, getAuthToken, setAuthToken, removeAuthToken } from './api';
import { useSnackbar } from './SnackbarContext';

/**
 * User data interface
 */
export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
  phone: string;
  createdAt: string;
  aboutUser?: string;
  settings?: {
    newsletter: boolean;
  };
}

/**
 * Authentication context state
 */
interface AuthContextState {
  /** Current user data */
  user: User | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being checked */
  isLoading: boolean;
  /** Login function */
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  /** Logout function */
  logout: () => Promise<void>;
  /** Update user data */
  updateUser: (userData: User) => void;
  /** Clear user data */
  clearUser: () => void;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextState | undefined>(undefined);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Provides authentication state and methods to the entire application.
 * Handles token validation, user login/logout, and persistent authentication.
 * 
 * @param children - Child components
 * @returns JSX element
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const showSnackbar = useSnackbar();

  /**
   * Validate stored token and set authentication state
   */
  const validateToken = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Validate token with server
      const response = await authApi.checkToken();
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        // Token is invalid, clear it
        removeAuthToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user login
   * 
   * @param username - User's username
   * @param password - User's password
   * @param rememberMe - Whether to remember the user
   */
  const login = async (username: string, password: string, rememberMe: boolean = false) => {
    try {
      const response = await authApi.login({ username, password });
      
      if (response.success && response.token) {
        // Store token
        setAuthToken(response.token, rememberMe);
        
        // Set user data - server returns user directly in response
        if (response.user) {
          setUser(response.user);
        }
        
        setIsAuthenticated(true);
        
        showSnackbar({
          message: response.message || 'Login successful',
          severity: 'success'
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Handle user logout
   */
  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if server call fails
    } finally {
      // Clear local state
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      
      showSnackbar({
        message: 'Logged out successfully',
        severity: 'info'
      });
    }
  };

  /**
   * Update user data
   * 
   * @param userData - New user data
   */
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  /**
   * Clear user data
   */
  const clearUser = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeAuthToken();
  };

  // Validate token on component mount
  useEffect(() => {
    validateToken();
  }, []);

  const contextValue: AuthContextState = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    clearUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 * 
 * @returns Authentication context state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 