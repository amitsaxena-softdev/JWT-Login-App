import * as React from "react";
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

import { GoogleIcon, FacebookIcon } from "./CustomIcons";
import { validateFields } from "../../utils/validateFormFields";
import AuthCard from "../../shared-theme/customizations/AuthCard";

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [firstnameError, setfirstnameError] = React.useState(false);
  const [firstnameErrorMessage, setfirstnameErrorMessage] = React.useState("");
  const [lastnameError, setlastnameError] = React.useState(false);
  const [lastnameErrorMessage, setlastnameErrorMessage] = React.useState("");
  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
  const [genderError, setGenderError] = React.useState(false);
  const [genderErrorMessage, setGenderErrorMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // For demonstration, remove in production
    event.preventDefault();
    try {
      // Validate inputs before proceeding
      const formData = new FormData(event.currentTarget);
      const fields = {
        firstname: formData.get("firstname") as string,
        lastname: formData.get("lastname") as string,
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        gender: (
          document.querySelector(
            'input[name="gender"]:checked'
          ) as HTMLInputElement
        )?.value as string,
      };

      const { isValid, errors } = validateFields(fields);

      // Reset error states
      setUsernameError(errors.username?.error || false);
      setUsernameErrorMessage(errors.username?.message || "");
      setPasswordError(errors.password?.error || false);
      setPasswordErrorMessage(errors.password?.message || "");
      setEmailError(errors.email?.error || false);
      setEmailErrorMessage(errors.email?.message || "");
      setfirstnameError(errors.firstname?.error || false);
      setfirstnameErrorMessage(errors.firstname?.message || "");
      setlastnameError(errors.lastname?.error || false);
      setlastnameErrorMessage(errors.lastname?.message || "");
      setGenderError(errors.gender?.error || false);
      setGenderErrorMessage(errors.gender?.message || "");

      // If any field is invalid, do not proceed with submission
      if (!isValid) {
        console.error("Form validation failed:", errors);
        return;
      }

      console.log(fields);
    } catch (error) {
      console.error("Error during form submission:", error);
      // Handle error, e.g., show an error dialog or message
      return;
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
            <FormLabel htmlFor="firstname">Firstname</FormLabel>
            <TextField
              autoComplete="firstname"
              name="firstname"
              required
              fullWidth
              id="firstname"
              placeholder="Jon"
              error={firstnameError}
              helperText={firstnameErrorMessage}
              color={firstnameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="lastname">Lastname</FormLabel>
            <TextField
              autoComplete="lastname"
              name="lastname"
              required
              fullWidth
              id="lastname"
              placeholder="Snow"
              error={lastnameError}
              helperText={lastnameErrorMessage}
              color={lastnameError ? "error" : "primary"}
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
            helperText={usernameErrorMessage}
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
            helperText={emailErrorMessage}
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
            helperText={passwordErrorMessage}
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>

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
          control={<Checkbox value="allowExtraEmails" color="primary" />}
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
          <Link href="/" variant="body2" sx={{ alignSelf: "center" }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}
