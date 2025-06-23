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

  const validateTokenWithServer = async (token) => {
  try {
    const response = await fetch("http://localhost:3001/auth/checkToken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Token invalid");

    return true;
  } catch (err) {
    return false;
  }
};

const checkToken = async () => {
  const token = getStoredToken();
  if (!token) return false;

  // Client side validation (e.g., expiration)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp < Date.now() / 1000) return false;
  } catch (err) {
    console.error("Invalid token format", err);
    return false;
  }

  // Server side validation
  const serverCheck = await validateTokenWithServer(token);
  return serverCheck;
};

  // Check token on initial load
  useEffect(() => {
  const verify = async () => {
    const isValid = await checkToken();
    setIsAuthenticated(isValid);
  };
  verify();
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
