import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import {
  GoogleIcon,
  FacebookIcon,
} from "../../shared-theme/customizations/CustomIcons";
import AuthCard from "../../shared-theme/customizations/AuthCard";
import FormField, { RadioOption } from "../../shared-theme/components/FormField";
import useForm from "../../utils/useForm";
import { authApi } from "../../utils/api";
import { useSnackbar } from "../../utils/SnackbarContext";

/**
 * SignUpCard Component Props
 */
interface SignUpCardProps {
  setSignIn: (signIn: boolean) => void;
}

/**
 * Gender options for radio buttons
 */
const genderOptions: RadioOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

/**
 * SignUpCard Component
 * 
 * Handles user registration with comprehensive form validation.
 * Uses modular components and hooks for better code organization.
 * 
 * @param props - Component props
 * @returns JSX element
 */
export default function SignUpCard({ setSignIn }: SignUpCardProps) {
  const showSnackbar = useSnackbar();

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
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      gender: '',
      role: 'user',
      allowExtraEmails: false,
    },
    async (data) => {
      try {
        const response = await authApi.signup({
          username: data.username,
          password: data.password,
          role: data.role,
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
          gender: data.gender,
        });

        if (response.success) {
          showSnackbar({
            message: response.message || 'User created successfully',
            severity: 'success',
          });
          setSignIn(true);
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    }
  );

  // Handle field changes
  const handleFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    updateField(field as keyof typeof formData, value);
  };

  return (
    <AuthCard variant="outlined">
      {/* Title */}
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign up
      </Typography>

      {/* Registration Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Name Fields */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <FormField
              type="text"
              name="firstname"
              label="First Name"
              placeholder="Jon"
              autoComplete="given-name"
              required
              value={formData.firstname}
              onChange={handleFieldChange('firstname')}
              error={getFieldError('firstname').error}
              errorMessage={getFieldError('firstname').message}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormField
              type="text"
              name="lastname"
              label="Last Name"
              placeholder="Snow"
              autoComplete="family-name"
              required
              value={formData.lastname}
              onChange={handleFieldChange('lastname')}
              error={getFieldError('lastname').error}
              errorMessage={getFieldError('lastname').message}
            />
          </Box>
        </Box>

        {/* Username Field */}
        <FormField
          type="text"
          name="username"
          label="Username"
          placeholder="jonsnow123"
          autoComplete="username"
          required
          value={formData.username}
          onChange={handleFieldChange('username')}
          error={getFieldError('username').error}
          errorMessage={getFieldError('username').message}
        />

        {/* Email Field */}
        <FormField
          type="email"
          name="email"
          label="Email"
          placeholder="your@email.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleFieldChange('email')}
          error={getFieldError('email').error}
          errorMessage={getFieldError('email').message}
        />

        {/* Password Field */}
        <FormField
          type="password"
          name="password"
          label="Password"
          placeholder="••••••"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleFieldChange('password')}
          error={getFieldError('password').error}
          errorMessage={getFieldError('password').message}
        />

        {/* Gender Field */}
        <FormField
          type="radio"
          name="gender"
          label="Gender"
          options={genderOptions}
          required
          value={formData.gender}
          onChange={handleFieldChange('gender')}
          error={getFieldError('gender').error}
          errorMessage={getFieldError('gender').message}
        />

        {/* Role Selection */}
        <FormControlLabel
          control={
            <Checkbox 
              name="role" 
              value="admin"
              color="primary"
              checked={formData.role === 'admin'}
              onChange={handleFieldChange('role')}
            />
          }
          label="Register as Admin"
        />

        {/* Marketing Emails */}
        <FormControlLabel
          control={
            <Checkbox 
              name="allowExtraEmails" 
              color="primary"
              checked={formData.allowExtraEmails}
              onChange={handleFieldChange('allowExtraEmails')}
            />
          }
          label="I want to receive marketing promotions and updates via email."
        />

        {/* Submit Button */}
        <Button 
          type="submit" 
          fullWidth 
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </Button>

        {/* Sign In Link */}
        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            component="button"
            onClick={() => setSignIn(true)}
            variant="body2"
            sx={{ alignSelf: "center" }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>

      {/* Social Registration Divider */}
      <Divider>or</Divider>

      {/* Social Registration Buttons */}
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
