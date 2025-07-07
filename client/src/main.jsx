import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./SignIn/SignInSide";
import AppLayout from "./shared-theme/AppLayout";
import { SnackbarProvider } from "./utils/SnackbarContext"; 
import { AuthProvider, useAuth } from "./utils/AuthContext";
import Dashboard from "./Dashboard/Dashboard";

/**
 * Main Application Component
 * 
 * Handles routing between the sign-in page and dashboard based on user authentication status.
 * Uses the AuthProvider context for authentication state management.
 */
function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
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
                <SignInSide />
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
                <SignInSide />
              )
            }
          />
          <Route
            path="/user"
            element={
              isAuthenticated ? (
                <UserDashboard />
              ) : (
                <SignInSide />
              )
            }
          />
          */}
        </Routes>
      </BrowserRouter>
    </AppLayout>
  );
}

/**
 * Root Application Component
 * 
 * Wraps the app with necessary providers for authentication and notifications.
 */
function AppWithProviders() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  );
}

// Initialize React application
createRoot(document.getElementById("root")).render(<AppWithProviders />);
