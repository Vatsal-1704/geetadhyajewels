import { forwardRef } from "react";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import "./FormInput.css";

/**
 * Sanitize input to prevent XSS attacks
 * Removes dangerous characters but preserves legitimate input
 */
const sanitizeInput = (value, type) => {
  if (!value) return value;
  if (typeof value !== "string") return value;

  // For different field types, apply appropriate sanitization
  switch (type) {
    case "email":
      // Allow standard email characters
      return value.replace(/[<>\"';]/g, "");
    case "tel":
      // Allow numbers, spaces, hyphens, parentheses, plus
      return value.replace(/[^0-9\s\-\(\)\+]/g, "");
    case "number":
      return value.replace(/[^0-9\.\-]/g, "");
    default:
      // General sanitization: remove HTML/JS tags
      return value.replace(/[<>\"']/g, "");
  }
};

/**
 * Reusable form input component with validation
 * Shows inline error messages and validation state
 */
const FormInput = forwardRef((props, ref) => {
  const {
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    disabled = false,
    required = false,
    showPassword = false,
    onTogglePassword,
    showValidationIcon = true,
    className = "",
    containerClassName = "",
    ...rest
  } = props;

  const hasError = error && touched;
  const isValid = touched && !error;
  const isPassword = type === "password";

  return (
    <div className={`form-input-container ${containerClassName}`}>
      {label && (
        <label className="form-input-label" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">
        <input
          ref={ref}
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            // Sanitize input before passing to parent
            const sanitized = sanitizeInput(e.target.value, type);
            const syntheticEvent = { ...e, target: { ...e.target, value: sanitized } };
            onChange(syntheticEvent);
          }}
          onBlur={onBlur}
          disabled={disabled}
          data-error={hasError}
          className={`form-input ${hasError ? "error" : ""} ${isValid ? "success" : ""} ${className}`}
          autoComplete={type === "password" ? "current-password" : "on"}
          {...rest}
        />

        {/* Password visibility toggle */}
        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="form-input-toggle-password"
            tabIndex="-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}

        {/* Validation icons */}
        {showValidationIcon && (
          <>
            {hasError && (
              <FiAlertCircle
                size={18}
                className="form-input-icon error"
                aria-hidden="true"
              />
            )}
            {isValid && (
              <FiCheckCircle
                size={18}
                className="form-input-icon success"
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="form-input-error" role="alert">
          {error}
        </p>
      )}

      {/* Success message (optional) */}
      {isValid && (
        <p className="form-input-success">
          Looks good!
        </p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
