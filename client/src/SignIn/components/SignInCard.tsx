import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ForgotPassword from "./ForgetPassword";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "../../shared-theme/customizations/CustomIcons";
import AuthCard from "../../shared-theme/customizations/AuthCard";
import FormField from "../../shared-theme/components/FormField";
import useForm from "../../utils/useForm";
import { useAuth } from "../../utils/AuthContext";

/**
 * SignInCard Component Props
 */
interface SignInCardProps {
  setSignIn: (value: boolean) => void;
}

/**
 * SignInCard Component
 * 
 * Handles user login with form validation and authentication.
 * Uses modular components and hooks for better code organization.
 * 
 * @param props - Component props
 * @returns JSX element
 */
export default function SignInCard({ setSignIn }: SignInCardProps) {
  const [open, setOpen] = useState(false);
  const { login } = useAuth();

  // Form state management using custom hook
  const {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    getFieldError,
    updateField,
  } = useForm(
    {
      username: '',
      password: '',
      remember: false,
    },
    async (data) => {
      await login(data.username, data.password, data.remember);
    }
  );

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle field changes
  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    updateField(field as keyof typeof formData, value);
  };

  return (
    <AuthCard variant="outlined">
      {/* Mobile logo */}
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <SitemarkIcon />
      </Box>
      
      {/* Title */}
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      
      {/* Login Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        {/* Username Field */}
        <FormField
          type="text"
          name="username"
          label="Username"
          placeholder="user123"
          autoComplete="username"
          autoFocus
          required
          value={formData.username}
          onChange={handleFieldChange('username')}
          error={getFieldError('username').error}
          errorMessage={getFieldError('username').message}
        />
        
        {/* Password Field */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormField
            type="password"
            name="password"
            label="Password"
            placeholder="••••••"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleFieldChange('password')}
            error={getFieldError('password').error}
            errorMessage={getFieldError('password').message}
          />
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: "baseline", ml: 1 }}
          >
            Forgot your password?
          </Link>
        </Box>
        
        {/* Remember Me Checkbox */}
        <FormControlLabel
          control={
            <Checkbox 
              color="primary" 
              name="remember"
              checked={formData.remember}
              onChange={handleFieldChange('remember')}
            />
          }
          label="Remember me"
        />
        
        {/* Forgot Password Dialog */}
        <ForgotPassword open={open} handleClose={handleClose} />
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          fullWidth 
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
        
        {/* Sign Up Link */}
        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link
            component="button"
            onClick={() => setSignIn(false)}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
      
      {/* Social Login Divider */}
      <Divider>or</Divider>
      
      {/* Social Login Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{
            borderColor: "grey.300",
            color: "grey.700",
            "&:hover": {
              borderColor: "grey.400",
              backgroundColor: "grey.50",
            },
          }}
        >
          Continue with Google
        </Button>
        <Button
          variant="outlined"
          startIcon={<FacebookIcon />}
          fullWidth
          sx={{
            borderColor: "grey.300",
            color: "grey.700",
            "&:hover": {
              borderColor: "grey.400",
              backgroundColor: "grey.50",
            },
          }}
        >
          Continue with Facebook
        </Button>
      </Box>
    </AuthCard>
  );
}
