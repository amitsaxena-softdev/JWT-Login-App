import React from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
} from "@mui/material";

/**
 * Form field types supported by the component
 */
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url'
  | 'radio'
  | 'checkbox'
  | 'textarea';

/**
 * Radio option interface
 */
export interface RadioOption {
  value: string;
  label: string;
}

/**
 * FormField component props
 */
export interface FormFieldProps {
  /** Field type */
  type: FieldType;
  /** Field name (used for form data) */
  name: string;
  /** Field label */
  label: string;
  /** Field placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field has an error */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Helper text to display */
  helperText?: string;
  /** Field value (controlled component) */
  value?: string | boolean;
  /** Change handler (controlled component) */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Default value (uncontrolled component) */
  defaultValue?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field should auto-focus */
  autoFocus?: boolean;
  /** Auto-complete attribute */
  autoComplete?: string;
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  sx?: any;
  /** For radio fields: available options */
  radioOptions?: RadioOption[];
  /** For textarea: number of rows */
  rows?: number;
  /** For textarea: number of columns */
  cols?: number;
  /** Full width styling */
  fullWidth?: boolean;
  /** Field size */
  size?: 'small' | 'medium';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

/**
 * Reusable Form Field Component
 * 
 * A standardized form field component that handles different input types
 * with consistent styling, validation, and error handling.
 * Supports both controlled and uncontrolled modes.
 * 
 * @param props - FormField component props
 * @returns JSX element
 */
export const FormField: React.FC<FormFieldProps> = ({
  type,
  name,
  label,
  placeholder,
  required = false,
  error = false,
  errorMessage,
  helperText,
  value,
  onChange,
  defaultValue,
  disabled = false,
  autoFocus = false,
  autoComplete,
  className,
  sx,
  radioOptions = [],
  rows = 4,
  cols = 20,
  fullWidth = true,
  size = 'medium',
  color = 'primary',
}) => {
  // Determine the color to use based on error state
  const fieldColor = error ? 'error' : color;

  // Render radio group
  if (type === 'radio') {
    return (
      <FormControl 
        error={error} 
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        className={className}
        sx={sx}
      >
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup
          name={name}
          value={value as string || defaultValue || ''}
          onChange={onChange}
          row
        >
          {radioOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio color={fieldColor} />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        {(errorMessage || helperText) && (
          <FormHelperText error={error}>
            {errorMessage || helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  // Render checkbox
  if (type === 'checkbox') {
    return (
      <FormControl 
        error={error} 
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        className={className}
        sx={sx}
      >
        <FormControlLabel
          control={
            <Checkbox 
              name={name}
              color={fieldColor}
              checked={value as boolean || defaultValue === 'true'}
              onChange={onChange}
            />
          }
          label={label}
        />
        {(errorMessage || helperText) && (
          <FormHelperText error={error}>
            {errorMessage || helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  // Render textarea
  if (type === 'textarea') {
    return (
      <FormControl 
        error={error} 
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        className={className}
        sx={sx}
      >
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <TextField
          id={name}
          name={name}
          multiline
          rows={rows}
          placeholder={placeholder}
          value={value as string || defaultValue || ''}
          onChange={onChange}
          autoFocus={autoFocus}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          color={fieldColor}
          error={error}
          helperText={errorMessage || helperText}
          className={className}
          sx={sx}
        />
      </FormControl>
    );
  }

  // Render standard text input
  return (
    <FormControl 
      error={error} 
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      sx={sx}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <TextField
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value as string || defaultValue || ''}
        onChange={onChange}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        size={size}
        color={fieldColor}
        error={error}
        helperText={errorMessage || helperText}
        className={className}
        sx={sx}
      />
    </FormControl>
  );
};

export default FormField; 