import Stack from "@mui/material/Stack";
import SignInCard from "./components/SignInCard";
import Content from "./components/Content";
import SignUp from "./components/SignUpCard";
import { useState } from "react";

export default function SignInSide(props: {
  disableCustomTheme?: boolean;
  signIn?: Boolean;
  setIsAuthenticated?: (value: boolean) => void;
}) {
  const [signIn, setSignIn] = useState(true);
  return (
    <>
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        sx={{
          justifyContent: "center",
          gap: { xs: 6, sm: 12 },
          p: 2,
          mx: "auto",
        }}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: "auto",
          }}
        >
          <Content />
          {signIn ? (
            <SignInCard
              setIsAuthenticated={props.setIsAuthenticated ?? (() => {})}
              setSignIn={setSignIn}
            />
          ) : (
            <SignUp
              setSignIn={setSignIn}
              setIsAuthenticated={props.setIsAuthenticated ?? (() => {})}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
}
