import { useState, useCallback } from 'react';
import { validateFields } from './validateFormFields';
import { useSnackbar } from './SnackbarContext';

/**
 * Form field error state
 */
export interface FormFieldError {
  error: boolean;
  message: string;
}

/**
 * Form errors object
 */
export interface FormErrors {
  [key: string]: FormFieldError;
}

/**
 * Form submission handler type
 */
export type FormSubmitHandler<T = any> = (data: T) => Promise<void>;

/**
 * Form validation result
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

/**
 * Custom hook for form management
 * 
 * Provides form state management, validation, error handling,
 * and submission logic to reduce code repetition in form components.
 * 
 * @param initialData - Initial form data
 * @param onSubmit - Form submission handler
 * @returns Form management utilities
 */
export const useForm = <T extends Record<string, any>>(
  initialData: T,
  onSubmit?: FormSubmitHandler<T>
) => {
  // Form data state
  const [formData, setFormData] = useState<T>(initialData);
  
  // Form errors state
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Snackbar utility
  const showSnackbar = useSnackbar();

  /**
   * Update form data
   * 
   * @param field - Field name to update
   * @param value - New field value
   */
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field]: { error: false, message: '' }
      }));
    }
  }, [errors]);

  /**
   * Update multiple form fields at once
   * 
   * @param updates - Object containing field updates
   */
  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        if (newErrors[field]) {
          newErrors[field] = { error: false, message: '' };
        }
      });
      return newErrors;
    });
  }, []);

  /**
   * Validate form data
   * 
   * @param data - Data to validate (defaults to current form data)
   * @returns Validation result
   */
  const validateForm = useCallback((data: T = formData): FormValidationResult => {
    const validation = validateFields(data);
    
    // Convert validation errors to our format
    const formErrors: FormErrors = {};
    Object.keys(validation.errors).forEach(key => {
      const error = validation.errors[key];
      formErrors[key] = {
        error: error.error,
        message: error.message
      };
    });
    
    setErrors(formErrors);
    return {
      isValid: validation.isValid,
      errors: formErrors
    };
  }, [formData]);

  /**
   * Handle form submission
   * 
   * @param event - Form submission event
   */
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!onSubmit) {
      console.warn('No submit handler provided to useForm');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Validate form before submission
      const validation = validateForm();
      
      if (!validation.isValid) {
        showSnackbar({
          message: 'Please fix the errors in the form',
          severity: 'error'
        });
        return;
      }
      
      // Submit form data
      await onSubmit(formData);
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
        
      showSnackbar({
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm, showSnackbar]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  /**
   * Set form errors manually
   * 
   * @param newErrors - New errors to set
   */
  const setFormErrors = useCallback((newErrors: FormErrors) => {
    setErrors(newErrors);
  }, []);

  /**
   * Get error state for a specific field
   * 
   * @param field - Field name
   * @returns Error state for the field
   */
  const getFieldError = useCallback((field: keyof T): FormFieldError => {
    return errors[field as string] || { error: false, message: '' };
  }, [errors]);

  /**
   * Check if form has any errors
   */
  const hasErrors = Object.values(errors).some(error => error.error);

  return {
    // State
    formData,
    errors,
    isSubmitting,
    hasErrors,
    
    // Actions
    updateField,
    updateFields,
    validateForm,
    handleSubmit,
    resetForm,
    setFormErrors,
    getFieldError,
  };
};

export default useForm; 