import { useState, useCallback } from "react";
import { validators } from "../utils/validators";

/**
 * Reusable form validation hook
 * @param {object} initialValues - Form field values
 * @param {function} onSubmit - Callback when form is valid
 * @param {object} validationRules - Validation rules for each field
 * @returns {object} Form state, handlers, and validation methods
 */
export const useFormValidation = (initialValues, onSubmit, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (fieldName, fieldValue) => {
      const rules = validationRules[fieldName];
      if (!rules) return null;

      // If rules is a function, call it
      if (typeof rules === "function") {
        return rules(fieldValue);
      }

      // If rules is an array of validator functions
      if (Array.isArray(rules)) {
        for (const rule of rules) {
          const result = rule(fieldValue);
          if (!result.valid) return result;
        }
        return { valid: true };
      }

      return { valid: true };
    },
    [validationRules]
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const result = validateField(fieldName, values[fieldName]);
      if (result && !result.valid) {
        newErrors[fieldName] = result.error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateField, values]);

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      setValues((prev) => ({ ...prev, [name]: newValue }));

      // Validate on change if field has been touched
      if (touched[name]) {
        const result = validateField(name, newValue);
        setErrors((prev) => ({
          ...prev,
          [name]: result && !result.valid ? result.error : undefined,
        }));
      }
    },
    [touched, validateField]
  );

  // Handle blur (mark as touched and validate)
  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const result = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: result && !result.valid ? result.error : undefined,
      }));
    },
    [validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Mark all fields as touched
      setTouched(
        Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );

      if (!validateForm()) {
        // Scroll to first error field
        const firstErrorField = document.querySelector("[data-error='true']");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
          firstErrorField.focus();
        }
        return;
      }

      setLoading(true);
      try {
        await onSubmit(values);
      } catch (err) {
        // Error handled by caller
      } finally {
        setLoading(false);
      }
    },
    [validateForm, onSubmit, values, validationRules]
  );

  // Set field error (for API errors)
  const setFieldError = useCallback((fieldName, errorMsg) => {
    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Set form-level error
  const setFormError = useCallback((errorMsg) => {
    setErrors((prev) => ({ ...prev, _form: errorMsg }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    loading,
    setValues,
    setFieldError,
    clearFieldError,
    setFormError,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    validateField,
    resetForm,
  };
};
