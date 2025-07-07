/**
 * FormField Component
 * 
 * Universal form field component that renders different input types
 * with consistent styling, validation, and accessibility features.
 * Supports text, email, password, radio, and checkbox input types.
 */

import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormHelperText,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Radio option interface for radio button groups
 */
export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * FormField component props
 */
interface FormFieldProps {
  /** Input type */
  type: 'text' | 'email' | 'password' | 'radio' | 'checkbox';
  /** Field name for form handling */
  name: string;
  /** Field label */
  label: string;
  /** Field placeholder text */
  placeholder?: string;
  /** Whether field is required */
  required?: boolean;
  /** Field value */
  value?: string | boolean;
  /** Change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Auto-complete attribute */
  autoComplete?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Radio options for radio type */
  options?: RadioOption[];
  /** Checkbox label */
  checkboxLabel?: string;
  /** Additional styling */
  sx?: any;
}

/**
 * FormField Component
 * 
 * Renders form fields with consistent styling and validation.
 * Supports multiple input types with appropriate Material-UI components.
 * 
 * @param props - Component properties
 * @returns JSX element
 */
const FormField: React.FC<FormFieldProps> = ({
  type,
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error = false,
  errorMessage = '',
  autoComplete,
  autoFocus = false,
  options = [],
  checkboxLabel,
  sx,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  /**
   * Toggle password visibility
   */
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Render text-based inputs (text, email, password)
   */
  const renderTextInput = () => (
    <TextField
      type={type === 'password' && showPassword ? 'text' : type}
      name={name}
      label={label}
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
      required={required}
      error={error}
      helperText={errorMessage}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      fullWidth
      variant="outlined"
      sx={sx}
      InputProps={{
        endAdornment: type === 'password' ? (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePassword}
              edge="end"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
    />
  );

  /**
   * Render radio button group
   */
  const renderRadioGroup = () => (
    <FormControl error={error} required={required} sx={sx}>
      <FormLabel sx={{ mb: 1, fontWeight: 500 }}>{label}</FormLabel>
      <RadioGroup
        name={name}
        value={value || ''}
        onChange={onChange}
        row
        sx={{ gap: 2 }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size="small" />}
            label={option.label}
            disabled={option.disabled}
            sx={{ 
              margin: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
              }
            }}
          />
        ))}
      </RadioGroup>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );

  /**
   * Render checkbox
   */
  const renderCheckbox = () => (
    <FormControl error={error} required={required} sx={sx}>
      <FormControlLabel
        control={
          <Checkbox
            name={name}
            checked={value as boolean || false}
            onChange={onChange}
            size="small"
          />
        }
        label={checkboxLabel || label}
        sx={{ 
          margin: 0,
          '& .MuiFormControlLabel-label': {
            fontSize: '0.875rem',
          }
        }}
      />
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );

  // Render appropriate input type
  switch (type) {
    case 'radio':
      return renderRadioGroup();
    case 'checkbox':
      return renderCheckbox();
    default:
      return renderTextInput();
  }
};

export default FormField; 