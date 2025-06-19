import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./SignIn/SignInSide";
import Test from "./Test";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
      } catch (e) {
        console.error("Invalid token format", e);
        return false;
      }
    }
    return false;
  };

  // Check token on initial load
  useEffect(() => {
    const auth = checkToken();
    setIsAuthenticated(auth);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<SignInSide setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/user" element={<SignInSide setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={<Test />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Test />
            ) : (
              <SignInSide setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
