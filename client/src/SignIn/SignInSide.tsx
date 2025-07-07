import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import SignInCard from "./components/SignInCard";
import Content from "./components/Content";
import SignUpCard from "./components/SignUpCard";

/**
 * SignInSide Component
 * 
 * Main authentication interface that handles both sign-in and sign-up flows.
 * Provides a responsive layout with content section and authentication forms.
 * 
 * Features:
 * - Toggle between sign-in and sign-up forms
 * - Responsive design for mobile and desktop
 * - Content section with app information
 * - Authentication state management via AuthContext
 * 
 * @returns JSX element
 */
export default function SignInSide() {
  // Local state to toggle between sign-in and sign-up forms
  const [signIn, setSignIn] = useState<boolean>(true);

  return (
    <>
      {/* Main container with responsive layout */}
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          gap: { xs: 6, sm: 12 },
          p: 2,
          mx: "auto",
        }}
      >
        {/* Inner container with responsive spacing */}
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: "auto",
          }}
        >
          {/* Content section with app information */}
          <Content />
          
          {/* Conditional rendering of authentication forms */}
          {signIn ? (
            <SignInCard setSignIn={setSignIn} />
          ) : (
            <SignUpCard setSignIn={setSignIn} />
          )}
        </Stack>
      </Stack>
    </>
  );
}
