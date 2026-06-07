import { forwardRef } from "react";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

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
    <div className={containerClassName}>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          data-error={hasError}
          className={`
            w-full px-4 py-3 text-sm rounded-xl border-2 transition-all
            outline-none focus:outline-none
            ${hasError ? "border-red-300 bg-red-50 focus:border-red-500" : ""}
            ${isValid ? "border-green-300 bg-green-50 focus:border-green-500" : ""}
            ${!hasError && !isValid ? "border-gray-200 focus:border-brand-gold" : ""}
            ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
            ${className}
          `}
          {...rest}
        />

        {/* Password visibility toggle */}
        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex="-1"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
              />
            )}
            {isValid && (
              <FiCheckCircle
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
              />
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
          <span>•</span>
          {error}
        </p>
      )}

      {/* Success message (optional) */}
      {isValid && (
        <p className="text-xs text-green-600 mt-2">✓ Looks good!</p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;
