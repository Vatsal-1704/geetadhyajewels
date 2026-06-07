/**
 * Backend validation utilities
 * Mirror frontend validators for consistency
 */

// Email validation
const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, error: "Email address is required" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  return { valid: true };
};

// Password validation (for backend, minimum 6 for login, 8 for register)
const validatePassword = (password, minLength = 8, isLogin = false) => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  // Login: simpler validation
  if (isLogin) {
    if (password.length < 6) {
      return { valid: false, error: "Password must be at least 6 characters" };
    }
    return { valid: true };
  }

  // Register: stricter validation
  if (password.length < minLength) {
    return { valid: false, error: `Password must be at least ${minLength} characters` };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  return { valid: true };
};

// Full name validation
const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, error: "Name is required" };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  if (name.trim().length > 50) {
    return { valid: false, error: "Name must not exceed 50 characters" };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return { valid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  }
  return { valid: true };
};

// Phone validation (Indian format)
const validatePhone = (phone, required = true) => {
  if (!phone && !required) {
    return { valid: true };
  }
  if (!phone || !phone.trim()) {
    return { valid: false, error: "Phone number is required" };
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.trim().replace(/[^\d]/g, "");
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, error: "Please enter a valid 10-digit phone number" };
  }
  return { valid: true };
};

// Pincode validation (6-digit Indian)
const validatePincode = (pincode) => {
  if (!pincode || !pincode.trim()) {
    return { valid: false, error: "Pincode is required" };
  }
  const pincodeRegex = /^[1-9]\d{5}$/;
  if (!pincodeRegex.test(pincode.trim())) {
    return { valid: false, error: "Please enter a valid 6-digit pincode" };
  }
  return { valid: true };
};

// Address line validation
const validateAddressLine = (address, lineNumber = 1) => {
  if (!address || !address.trim()) {
    return { valid: false, error: `Address Line ${lineNumber} is required` };
  }
  if (address.trim().length < 10) {
    return { valid: false, error: `Address Line ${lineNumber} must be at least 10 characters` };
  }
  if (address.trim().length > 100) {
    return { valid: false, error: `Address Line ${lineNumber} must not exceed 100 characters` };
  }
  return { valid: true };
};

// City validation
const validateCity = (city) => {
  if (!city || !city.trim()) {
    return { valid: false, error: "City is required" };
  }
  if (city.trim().length < 2) {
    return { valid: false, error: "City name must be at least 2 characters" };
  }
  return { valid: true };
};

// State validation
const validateState = (state) => {
  if (!state || !state.trim()) {
    return { valid: false, error: "State is required" };
  }
  return { valid: true };
};

// Generic required field
const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};

// Text with min/max length
const validateLength = (value, min, max, fieldName) => {
  if (!value || !value.toString().trim()) {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (value.length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  if (value.length > max) {
    return { valid: false, error: `${fieldName} must not exceed ${max} characters` };
  }
  return { valid: true };
};

// Subject validation (5+ chars)
const validateSubject = (subject) => {
  if (!subject || !subject.trim()) {
    return { valid: false, error: "Subject is required" };
  }
  if (subject.trim().length < 5) {
    return { valid: false, error: "Subject must be at least 5 characters" };
  }
  if (subject.trim().length > 100) {
    return { valid: false, error: "Subject must not exceed 100 characters" };
  }
  return { valid: true };
};

// Message validation (20-1000 chars)
const validateMessage = (message, minLength = 20, maxLength = 1000) => {
  if (!message || !message.trim()) {
    return { valid: false, error: "Message is required" };
  }
  if (message.trim().length < minLength) {
    return { valid: false, error: `Message must be at least ${minLength} characters` };
  }
  if (message.trim().length > maxLength) {
    return { valid: false, error: `Message must not exceed ${maxLength} characters` };
  }
  return { valid: true };
};

// Price validation
const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice) || numPrice <= 0) {
    return { valid: false, error: "Price must be a positive number" };
  }
  return { valid: true };
};

// Stock quantity validation
const validateStock = (stock) => {
  const numStock = parseInt(stock);
  if (isNaN(numStock) || numStock < 0) {
    return { valid: false, error: "Stock quantity must be a non-negative number" };
  }
  return { valid: true };
};

// SKU validation
const validateSKU = (sku) => {
  if (!sku || !sku.trim()) {
    return { valid: false, error: "SKU is required" };
  }
  if (sku.trim().length > 50) {
    return { valid: false, error: "SKU must not exceed 50 characters" };
  }
  return { valid: true };
};

// Rating validation (1-5)
const validateRating = (rating) => {
  const numRating = parseInt(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return { valid: false, error: "Rating must be between 1 and 5" };
  }
  return { valid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validatePincode,
  validateAddressLine,
  validateCity,
  validateState,
  validateRequired,
  validateLength,
  validateSubject,
  validateMessage,
  validatePrice,
  validateStock,
  validateSKU,
  validateRating,
};
