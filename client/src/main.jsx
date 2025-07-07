import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./SignIn/SignInSide";
import AppLayout from "./shared-theme/AppLayout";
import { SnackbarProvider } from "./utils/SnackbarContext"; 
import Dashboard from "./Dashboard/Dashboard";

/**
 * Main Application Component
 * 
 * Handles authentication state management and routing between
 * the sign-in page and dashboard based on user authentication status.
 * 
 * Features:
 * - JWT token validation (client-side and server-side)
 * - Automatic authentication state management
 * - Protected routing
 * - Token storage in session/local storage
 */
function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Retrieves JWT token from browser storage
   * 
   * Priority: sessionStorage > localStorage
   * This allows for session-based tokens that are cleared when browser closes
   * while maintaining fallback to persistent storage
   * 
   * @returns {string | null} The stored JWT token or null if not found
   */
  const getStoredToken = () => {
    return sessionStorage.getItem("token") || localStorage.getItem("token");
  };

  /**
   * Validates JWT token with the server
   * 
   * Performs server-side validation to ensure token is still valid
   * and not blacklisted. This is crucial for security as client-side
   * validation can be bypassed.
   * 
   * @param {string} token - The JWT token to validate
   * @returns {Promise<boolean>} True if token is valid, false otherwise
   */
  const validateTokenWithServer = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/auth/checkToken", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server validation failed: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Server token validation error:", error);
      return false;
    }
  };

  /**
   * Comprehensive token validation function
   * 
   * Performs both client-side and server-side validation:
   * 1. Client-side: Checks token format and expiration
   * 2. Server-side: Validates token with backend and checks blacklist
   * 
   * If validation fails, clears stored tokens for security
   * 
   * @returns {Promise<boolean>} True if token is valid, false otherwise
   */
  const checkToken = async () => {
    const token = getStoredToken();
    
    // Early return if no token exists
    if (!token) {
      return false;
    }

    // Client-side validation: Check token format and expiration
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        console.warn("Token has expired");
        return false;
      }
    } catch (error) {
      console.error("Invalid token format:", error);
      return false;
    }

    // Server-side validation: Check with backend
    const serverValidation = await validateTokenWithServer(token);
    
    if (!serverValidation) {
      // Clear invalid tokens from storage
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      return false;
    }
    
    return true;
  };

  /**
   * Effect hook for initial authentication check
   * 
   * Runs on component mount to validate stored token and
   * set authentication state accordingly. This ensures users
   * remain logged in across browser sessions if they have a valid token.
   */
  useEffect(() => {
         const verifyAuthentication = async () => {
      try {
        const isValid = await checkToken();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Authentication verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyAuthentication();
  }, []);

  return (
    <SnackbarProvider>
      <AppLayout>
        <BrowserRouter>
          <Routes>
            {/* Main route with conditional rendering based on auth status */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <SignInSide setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            
            {/* Future routes for role-based access */}
            {/* 
            <Route
              path="/admin"
              element={
                isAuthenticated ? (
                  <AdminDashboard />
                ) : (
                  <SignInSide setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/user"
              element={
                isAuthenticated ? (
                  <UserDashboard />
                ) : (
                  <SignInSide setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            */}
          </Routes>
        </BrowserRouter>
      </AppLayout>
    </SnackbarProvider>
  );
}

// Initialize React application
createRoot(document.getElementById("root")).render(<App />);
