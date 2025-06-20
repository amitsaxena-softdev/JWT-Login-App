import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
  GoogleIcon,
  FacebookIcon,
} from "../../shared-theme/customizations/CustomIcons";
import { validateFields } from "../../utils/validateFormFields";
import AuthCard from "../../shared-theme/customizations/AuthCard";
import { useSnackbar } from "../../utils/SnackbarContext";
import AppDialog from "../../shared-theme/AppDialog";

export default function SignUp(props: {
  disableCustomTheme?: boolean;
  setSignIn: (signIn: boolean) => void;
  setIsAuthenticated: (value: boolean) => void;
}) {
  const { setSignIn } = props;
  const [emailError, setEmailError] = useState(false);
  const [emaildialogMessage, setEmaildialogMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passworddialogMessage, setPassworddialogMessage] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNamedialogMessage, setFirstNamedialogMessage] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [lastNamedialogMessage, setLastNamedialogMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernamedialogMessage, setUsernamedialogMessage] = useState("");
  const [genderError, setGenderError] = useState(false);
  const [genderErrorMessage, setGenderErrorMessage] = useState("");

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const showSnackbar = useSnackbar();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // For demonstration, remove in production
    event.preventDefault();
    try {
      // Validate inputs before proceeding
      const formData = new FormData(event.currentTarget);
      const fields = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        gender: (
          document.querySelector(
            'input[name="gender"]:checked'
          ) as HTMLInputElement
        )?.value as string,
        role: formData.get("admin") === "on" ? "admin" : "user",
        allowExtraEmails: formData.has("allowExtraEmails"),
      };

      const { isValid, errors } = validateFields(fields);

      // Reset error states
      setUsernameError(errors.username?.error || false);
      setUsernamedialogMessage(errors.username?.message || "");
      setPasswordError(errors.password?.error || false);
      setPassworddialogMessage(errors.password?.message || "");
      setEmailError(errors.email?.error || false);
      setEmaildialogMessage(errors.email?.message || "");
      setFirstNameError(errors.firstName?.error || false);
      setFirstNamedialogMessage(errors.firstName?.message || "");
      setLastNameError(errors.lastName?.error || false);
      setLastNamedialogMessage(errors.lastName?.message || "");
      setGenderError(errors.gender?.error || false);
      setGenderErrorMessage(errors.gender?.message || "");

      // If any field is invalid, do not proceed with submission
      if (!isValid) {
        console.error("Form validation failed:", errors);
        return;
      }

      console.log(JSON.stringify(fields));
      // console.log(fields); // Only for demonstration, remove in production
      // Proceed with form submission, e.g., send data to the server
      const response = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = await response.json();
      if (response.ok) {
        showSnackbar({
          message: result.message || "User created successfully",
          severity: "success",
        });
        setSignIn(true);
      } else {
        showSnackbar({
          message: result.message || "Something went wrong.",
          severity: "error",
        });
      }
    } catch (error) {
      const msg = error.message || "Something went wrong.";
      setDialogMessage(msg);
      setFormDialogOpen(true);
    }
  };

  return (
    <AuthCard variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign up
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <TextField
              autoComplete="firstName"
              name="firstName"
              required
              fullWidth
              id="firstName"
              placeholder="Jon"
              error={firstNameError}
              helperText={firstNamedialogMessage}
              color={firstNameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <TextField
              autoComplete="lastName"
              name="lastName"
              required
              fullWidth
              id="lastName"
              placeholder="Snow"
              error={lastNameError}
              helperText={lastNamedialogMessage}
              color={lastNameError ? "error" : "primary"}
            />
          </FormControl>
        </Box>

        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            autoComplete="username"
            name="username"
            required
            fullWidth
            id="username"
            placeholder="jonsnow123"
            error={usernameError}
            helperText={usernamedialogMessage}
            color={usernameError ? "error" : "primary"}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            required
            fullWidth
            id="email"
            placeholder="your@email.com"
            name="email"
            autoComplete="email"
            variant="outlined"
            error={emailError}
            helperText={emaildialogMessage}
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            required
            fullWidth
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="new-password"
            variant="outlined"
            error={passwordError}
            helperText={passworddialogMessage}
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <FormControl fullWidth error={genderError} required>
            <FormLabel id="gender-label">Gender</FormLabel>
            <RadioGroup row aria-labelledby="gender-label" name="gender">
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
            <FormHelperText>{genderErrorMessage}</FormHelperText>
          </FormControl>

          <FormControlLabel
            control={<Checkbox color="primary" />}
            name="admin"
            label="Admin"
          />
        </Box>

        <FormControlLabel
          control={<Checkbox color="primary" />}
          name="allowExtraEmails"
          label="I want to receive updates via email."
        />
        <Button type="submit" fullWidth variant="contained">
          Sign up
        </Button>
      </Box>
      <Divider>
        <Typography sx={{ color: "text.secondary" }}>or</Typography>
      </Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("Sign up with Google")}
          startIcon={<GoogleIcon />}
        >
          Sign up with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert("Sign up with Facebook")}
          startIcon={<FacebookIcon />}
        >
          Sign up with Facebook
        </Button>
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
      <AppDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        title="Error"
        message={dialogMessage}
        type="error"
      />
    </AuthCard>
  );
}
