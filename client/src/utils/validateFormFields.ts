/**
 * Form Validation Utilities
 * 
 * Provides comprehensive form field validation for user input.
 * Includes validation for authentication forms, user registration,
 * and profile updates with detailed error messages.
 */

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, { error: boolean; message: string }>;
}

/**
 * Field validation rules and error messages
 */
const validationRules = {
  username: {
    required: "Username is required",
    minLength: "Username must be at least 3 characters",
    maxLength: "Username must be less than 20 characters",
    pattern: "Username can only contain letters, numbers, and underscores",
  },
  password: {
    required: "Password is required",
    minLength: "Password must be at least 6 characters",
    maxLength: "Password must be less than 50 characters",
  },
  email: {
    required: "Email is required",
    pattern: "Please enter a valid email address",
  },
  firstName: {
    required: "First name is required",
    minLength: "First name must be at least 2 characters",
    maxLength: "First name must be less than 30 characters",
  },
  lastName: {
    required: "Last name is required",
    minLength: "Last name must be at least 2 characters",
    maxLength: "Last name must be less than 30 characters",
  },
  role: {
    required: "Role is required",
    enum: "Role must be either 'user' or 'admin'",
  },
  gender: {
    required: "Gender is required",
    enum: "Gender must be either 'male' or 'female'",
  },
};

/**
 * Validate form fields against defined rules
 * 
 * @param fields - Object containing form field values
 * @returns Validation result with errors and validity status
 */
export const validateFields = (fields: Record<string, any>): ValidationResult => {
  const errors: Record<string, { error: boolean; message: string }> = {};
  let isValid = true;

  // Validate username
  if (fields.username !== undefined) {
    const username = fields.username.trim();
    
    if (!username) {
      errors.username = { error: true, message: validationRules.username.required };
      isValid = false;
    } else if (username.length < 3) {
      errors.username = { error: true, message: validationRules.username.minLength };
      isValid = false;
    } else if (username.length > 20) {
      errors.username = { error: true, message: validationRules.username.maxLength };
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = { error: true, message: validationRules.username.pattern };
      isValid = false;
    }
  }

  // Validate password
  if (fields.password !== undefined) {
    const password = fields.password;
    
    if (!password) {
      errors.password = { error: true, message: validationRules.password.required };
      isValid = false;
    } else if (password.length < 6) {
      errors.password = { error: true, message: validationRules.password.minLength };
      isValid = false;
    } else if (password.length > 50) {
      errors.password = { error: true, message: validationRules.password.maxLength };
      isValid = false;
    }
  }

  // Validate email
  if (fields.email !== undefined) {
    const email = fields.email.trim();
    
    if (!email) {
      errors.email = { error: true, message: validationRules.email.required };
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = { error: true, message: validationRules.email.pattern };
      isValid = false;
    }
  }

  // Validate first name
  if (fields.firstName !== undefined) {
    const firstName = fields.firstName.trim();
    
    if (!firstName) {
      errors.firstName = { error: true, message: validationRules.firstName.required };
      isValid = false;
    } else if (firstName.length < 2) {
      errors.firstName = { error: true, message: validationRules.firstName.minLength };
      isValid = false;
    } else if (firstName.length > 30) {
      errors.firstName = { error: true, message: validationRules.firstName.maxLength };
      isValid = false;
    }
  }

  // Validate last name
  if (fields.lastName !== undefined) {
    const lastName = fields.lastName.trim();
    
    if (!lastName) {
      errors.lastName = { error: true, message: validationRules.lastName.required };
      isValid = false;
    } else if (lastName.length < 2) {
      errors.lastName = { error: true, message: validationRules.lastName.minLength };
      isValid = false;
    } else if (lastName.length > 30) {
      errors.lastName = { error: true, message: validationRules.lastName.maxLength };
      isValid = false;
    }
  }

  // Validate role
  if (fields.role !== undefined) {
    const role = fields.role;
    
    if (!role) {
      errors.role = { error: true, message: validationRules.role.required };
      isValid = false;
    } else if (!['user', 'admin'].includes(role)) {
      errors.role = { error: true, message: validationRules.role.enum };
      isValid = false;
    }
  }

  // Validate gender
  if (fields.gender !== undefined) {
    const gender = fields.gender;
    
    if (!gender) {
      errors.gender = { error: true, message: validationRules.gender.required };
      isValid = false;
    } else if (!['male', 'female'].includes(gender)) {
      errors.gender = { error: true, message: validationRules.gender.enum };
      isValid = false;
    }
  }

  return { isValid, errors };
};
