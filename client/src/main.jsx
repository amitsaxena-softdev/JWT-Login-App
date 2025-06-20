import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./SignIn/SignInSide";
import AppLayout from "./shared-theme/AppLayout";
import { SnackbarProvider } from "./utils/SnackbarContext"; 
import Dashboard from "./Dashboard/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getStoredToken = () => {
    return sessionStorage.getItem("token") || localStorage.getItem("token");
  };

  const checkToken = () => {
    const token = getStoredToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch (err) {
      console.error("Invalid token format", err);
      return false;
    }
  };

  // Check token on initial load
  useEffect(() => {
    const auth = checkToken();
    setIsAuthenticated(auth);
  }, []);

  return (
    <SnackbarProvider>
      <AppLayout>
        <BrowserRouter>
          <Routes>
            {/* <Route
              path="/admin"
              element={<SignInSide setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/user"
              element={<SignInSide setIsAuthenticated={setIsAuthenticated} />}
            /> */}
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
          </Routes>
        </BrowserRouter>
      </AppLayout>
    </SnackbarProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
