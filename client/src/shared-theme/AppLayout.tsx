import * as React from "react";
import { CssBaseline, Stack } from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Stack
        component="main"
        sx={[
          {
            minHeight: "100vh",
            position: "relative",
            p: 4,
          },
          (theme) => ({
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              zIndex: -1,
              inset: 0,
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
              backgroundRepeat: "no-repeat",
              ...theme.applyStyles("dark", {
                backgroundImage:
                  "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
              }),
            },
          }),
        ]}
      >
        {children}
      </Stack>
    </AppTheme>
  );
}
