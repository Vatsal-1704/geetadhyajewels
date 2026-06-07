/**
 * Comprehensive validation rules for all forms
 * Returns { valid: boolean, error?: string }
 */

export const validators = {
  // Email validation
  email: (value) => {
    if (!value || !value.trim()) return { valid: false, error: "Email address is required" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return { valid: false, error: "Please enter a valid email address" };
    return { valid: true };
  },

  // Password validation
  password: (value, minLength = 8) => {
    if (!value) return { valid: false, error: `Password is required` };
    if (value.length < minLength) return { valid: false, error: `Password must be at least ${minLength} characters` };
    if (!/[A-Z]/.test(value)) return { valid: false, error: "Password must contain at least one uppercase letter" };
    if (!/[a-z]/.test(value)) return { valid: false, error: "Password must contain at least one lowercase letter" };
    if (!/[0-9]/.test(value)) return { valid: false, error: "Password must contain at least one number" };
    return { valid: true };
  },

  // Confirm password matches
  passwordMatch: (password, confirmPassword) => {
    if (!confirmPassword) return { valid: false, error: "Please confirm your password" };
    if (password !== confirmPassword) return { valid: false, error: "Passwords do not match" };
    return { valid: true };
  },

  // Full name validation
  fullName: (value) => {
    if (!value || !value.trim()) return { valid: false, error: "Full name is required" };
    if (value.trim().length < 2) return { valid: false, error: "Name must be at least 2 characters" };
    if (value.trim().length > 50) return { valid: false, error: "Name must not exceed 50 characters" };
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return { valid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
    return { valid: true };
  },

  // Phone number validation (Indian format)
  phone: (value) => {
    if (!value || !value.trim()) return { valid: false, error: "Phone number is required" };
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers
    const cleaned = value.trim().replace(/[^\d]/g, "");
    if (!phoneRegex.test(cleaned)) return { valid: false, error: "Please enter a valid 10-digit phone number" };
    return { valid: true };
  },

  // Pincode validation (Indian 6-digit)
  pincode: (value) => {
    if (!value || !value.trim()) return { valid: false, error: "Pincode is required" };
    const pincodeRegex = /^[1-9]\d{5}$/;
    if (!pincodeRegex.test(value.trim())) return { valid: false, error: "Please enter a valid 6-digit pincode" };
    return { valid: true };
  },

  // Address line validation
  addressLine: (value, lineNumber = 1) => {
    if (!value || !value.trim()) return { valid: false, error: `Address Line ${lineNumber} is required` };
    if (value.trim().length < 10) return { valid: false, error: `Address Line ${lineNumber} must be at least 10 characters` };
    if (value.trim().length > 100) return { valid: false, error: `Address Line ${lineNumber} must not exceed 100 characters` };
    return { valid: true };
  },

  // City validation
  city: (value) => {
    if (!value || !value.trim()) return { valid: false, error: "City is required" };
    if (value.trim().length < 2) return { valid: false, error: "City name must be at least 2 characters" };
    return { valid: true };
  },

  // State validation
  state: (value) => {
    if (!value || !value.trim()) return { valid: false, error: "State is required" };
    return { valid: true };
  },

  // Generic required field
  required: (value, fieldName) => {
    if (!value || !value.toString().trim()) return { valid: false, error: `${fieldName} is required` };
    return { valid: true };
  },

  // Text with min length
  minLength: (value, min, fieldName) => {
    if (!value || !value.trim()) return { valid: false, error: `${fieldName} is required` };
    if (value.trim().length < min) return { valid: false, error: `${fieldName} must be at least ${min} characters` };
    return { valid: true };
  },

  // Text with max length
  maxLength: (value, max, fieldName) => {
    if (value && value.length > max) return { valid: false, error: `${fieldName} must not exceed ${max} characters` };
    return { valid: true };
  },

  // Subject validation (5+ chars)
  subject: (value) => {
    if (!value || !value.trim()) return { valid: false, error: "Subject is required" };
    if (value.trim().length < 5) return { valid: false, error: "Subject must be at least 5 characters" };
    if (value.trim().length > 100) return { valid: false, error: "Subject must not exceed 100 characters" };
    return { valid: true };
  },

  // Message validation (20-1000 chars)
  message: (value, minLength = 20, maxLength = 1000) => {
    if (!value || !value.trim()) return { valid: false, error: "Message is required" };
    if (value.trim().length < minLength) return { valid: false, error: `Message must be at least ${minLength} characters` };
    if (value.trim().length > maxLength) return { valid: false, error: `Message must not exceed ${maxLength} characters` };
    return { valid: true };
  },

  // Review rating validation
  rating: (value) => {
    if (!value || value < 1 || value > 5) return { valid: false, error: "Please select a rating between 1 and 5 stars" };
    return { valid: true };
  },

  // Terms & conditions validation
  termsAccepted: (value) => {
    if (!value) return { valid: false, error: "You must accept the Terms & Conditions" };
    return { valid: true };
  },
};

/**
 * Get password strength indicator
 * @param {string} password
 * @returns {object} { strength: 'weak'|'medium'|'strong', percentage: number, color: string }
 */
export const getPasswordStrength = (password) => {
  let strength = 0;

  if (!password) return { strength: "none", percentage: 0, color: "gray" };

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const strengthMap = {
    0: { strength: "none", percentage: 0, color: "gray" },
    1: { strength: "weak", percentage: 20, color: "red" },
    2: { strength: "weak", percentage: 40, color: "red" },
    3: { strength: "medium", percentage: 60, color: "yellow" },
    4: { strength: "strong", percentage: 80, color: "green" },
    5: { strength: "very-strong", percentage: 100, color: "green" },
  };

  return strengthMap[strength] || { strength: "weak", percentage: 20, color: "red" };
};
