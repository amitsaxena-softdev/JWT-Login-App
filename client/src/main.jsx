import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInSide from "./SignIn/SignInSide";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<SignInSide signIn={true} />} />
    <Route path="/signup" element={<SignInSide signIn={false} />} />
    <Route path="/admin" element={<SignInSide />} />
    <Route path="/user" element={<SignInSide />} />
    <Route path="/" element={<SignInSide />} />
  </Routes>
  </BrowserRouter>
);
