type ValidationResult = {
  isValid: boolean;
  errors: { [key: string]: { error: boolean; message: string } };
};

export const validateFields = (fields: {
  [key: string]: string;
}): ValidationResult => {
  const errors: ValidationResult["errors"] = {};
  let isValid = true;

  // Firstname
  if ("firstname" in fields) {
    if (!fields.firstname || fields.firstname.length < 1) {
      errors.firstname = {
        error: true,
        message: "Firstname is required.",
      };
      isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(fields.firstname)) {
      errors.firstname = {
        error: true,
        message: "Firstname must contain only letters.",
      };
      isValid = false;
    } else {
      errors.firstname = { error: false, message: "" };
    }
  }

  // Lastname
  if ("lastname" in fields) {
    if (!fields.lastname || fields.lastname.length < 1) {
      errors.lastname = {
        error: true,
        message: "Lastname is required.",
      };
      isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(fields.lastname)) {
      errors.lastname = {
        error: true,
        message: "Lastname must contain only letters.",
      };
      isValid = false;
    } else {
      errors.lastname = { error: false, message: "" };
    }
  }

  // Username
  if ("username" in fields) {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(fields.username)) {
      errors.username = {
        error: true,
        message: "Username: 3–20 chars, letters, numbers, _ only.",
      };
      isValid = false;
    } else {
      errors.username = { error: false, message: "" };
    }
  }

  // Password
  if ("password" in fields) {
    if (!fields.password) {
      errors.password = {
        error: true,
        message: "Password is required.",
      };
      isValid = false;
    } else if (fields.password.length < 6) {
      errors.password = {
        error: true,
        message: "Password must be at least 6 characters long.",
      };
      isValid = false;
    } else {
      errors.password = { error: false, message: "" };
    }
  }

  // Email
  if ("email" in fields) {
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
      errors.email = {
        error: true,
        message: "Invalid email address.",
      };
      isValid = false;
    } else {
      errors.email = { error: false, message: "" };
    }
  }

  // Gender
  if ("gender" in fields) {
    if (!fields.gender) {
      errors.gender = {
        error: true,
        message: "Select a gender.",
      };
      isValid = false;
    } 
    else if (!(fields.gender == "male" || fields.gender == "female"))  {
      errors.gender = {
        error: true,
        message: "Select a valid gender.",
        };
        isValid = false;
    }
    else {
      errors.gender = { error: false, message: "" };
    }
  }

  return { isValid, errors };
};
