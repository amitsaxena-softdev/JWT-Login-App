import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ForgotPassword from "./ForgetPassword";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "../../shared-theme/customizations/CustomIcons";
import { validateFields } from "../../utils/validateFormFields";
import AuthCard from "../../shared-theme/customizations/AuthCard";
import AppDialog from "../../shared-theme/AppDialog";

import { useSnackbar } from "../../utils/SnackbarContext";

interface SignInCardProps {
  setSignIn: (value: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export default function SignInCard({
  setSignIn,
  setIsAuthenticated,
}: SignInCardProps) {
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const showSnackbar = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate inputs before proceeding
    const formData = new FormData(event.currentTarget);
    const fields = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    try {
      const { isValid, errors } = validateFields(fields);

      // Reset error states
      setUsernameError(errors.username?.error || false);
      setUsernameErrorMessage(errors.username?.message || "");
      setPasswordError(errors.password?.error || false);
      setPasswordErrorMessage(errors.password?.message || "");

      // If any field is invalid, do not proceed with submission
      if (!isValid) {
        return;
      }

      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const result = await response.json();

      if (response.ok) {
        const rememberMe = formData.get("remember") === "on";
        console.log(rememberMe);
        if (rememberMe) {
          // Store token in localStorage for persistent login
          localStorage.setItem("token", result.token);
        } else {
          // Store token in sessionStorage for session-only login
          sessionStorage.setItem("token", result.token);
          localStorage.removeItem("token");
        }
        showSnackbar({
          message: result.message || "Login successful",
          severity: "success",
        });
        setIsAuthenticated(true);
      } else {
        showSnackbar({
          message: result.message || "Login failed",
          severity: "error",
        });
      }
    } catch (error: any) {
      const msg = error.message || "Something went wrong.";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  return (
    <AuthCard variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Username</FormLabel>
          <TextField
            error={usernameError}
            helperText={usernameErrorMessage}
            id="username"
            type="string"
            name="username"
            placeholder="user123"
            autoComplete="string"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={usernameError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "baseline" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox color="primary" />}
          name="remember"
          label="Remember me"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button type="submit" fullWidth variant="contained">
          Sign in
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <span>
            <Link
              component="button"
              onClick={() => setSignIn(false)}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign up
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("Sign in with Google")}
          startIcon={<GoogleIcon />}
        >
          Sign in with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("Sign in with Facebook")}
          startIcon={<FacebookIcon />}
        >
          Sign in with Facebook
        </Button>
      </Box>
      <AppDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Error"
        message={errorMessage}
        type="error"
      />
    </AuthCard>
  );
}
