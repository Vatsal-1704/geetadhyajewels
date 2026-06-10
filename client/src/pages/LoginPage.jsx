import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useFormValidation } from "../hooks/useFormValidation";
import { validators } from "../utils/validators";
import FormInput from "../components/form/FormInput";
import PasswordStrengthIndicator from "../components/form/PasswordStrengthIndicator";
import "./LoginPage.css";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Validation rules
  const loginRules = {
    email: (val) => validators.email(val),
    password: (val) => validators.password(val, 6),
  };

  const registerRules = {
    name: (val) => validators.fullName(val),
    email: (val) => validators.email(val),
    phone: (val) => validators.phone(val),
    password: (val) => validators.password(val, 8),
    confirmPassword: (val) => validators.passwordMatch(form.values.password, val),
    agreeTerms: (val) => validators.termsAccepted(val),
  };

  const form = useFormValidation(
    { name: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false },
    handleFormSubmit,
    isLogin ? loginRules : registerRules
  );

  async function handleFormSubmit(values) {
    try {
      let user;
      if (isLogin) {
        user = await login(values.email, values.password);
      } else {
        user = await register(values.name, values.email, values.password, values.phone);
      }
      toast.success(isLogin ? "Welcome back! 👑" : "Account created! Welcome to GeetadhyaJewels ✨");
      form.resetForm();
      navigate(user?.role === "admin" ? "/admin" : (state?.from || "/account"));
    } catch (err) {
      form.setFormError(err.response?.data?.message || "Authentication failed");
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  }

  const handleTabChange = (newTab) => {
    setIsLogin(newTab === "Login");
    form.resetForm();
    setShowPassword(false);
    setShowConfirmPassword(false);
    setAgreeTerms(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-3xl font-bold text-brand-black">
            Geetadhya<span className="text-brand-gold">Jewels</span>
          </Link>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Tab Toggle */}
          <div className="flex bg-brand-cream rounded-xl p-1 mb-6">
            {["Login", "Register"].map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  (t === "Login") === isLogin
                    ? "bg-brand-gold text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Form-level error */}
          {form.errors._form && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{form.errors._form}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit} className="space-y-4" noValidate>
            {/* Register: Full Name */}
            {!isLogin && (
              <FormInput
                label="Full Name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.name}
                touched={form.touched.name}
                required
              />
            )}

            {/* Register: Phone */}
            {!isLogin && (
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={form.values.phone}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.phone}
                touched={form.touched.phone}
                required
              />
            )}

            {/* Email */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.email}
              touched={form.touched.email}
              required
            />

            {/* Password */}
            <div>
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder={isLogin ? "Enter your password" : "Min. 8 characters"}
                value={form.values.password}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.password}
                touched={form.touched.password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />
              {!isLogin && form.values.password && (
                <PasswordStrengthIndicator password={form.values.password} />
              )}
            </div>

            {/* Register: Confirm Password */}
            {!isLogin && (
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.values.confirmPassword}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.confirmPassword}
                touched={form.touched.confirmPassword}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                required
              />
            )}

            {/* Register: Terms & Conditions */}
            {!isLogin && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  checked={form.values.agreeTerms}
                  onChange={(e) => {
                    form.handleChange(e);
                    setAgreeTerms(e.target.checked);
                  }}
                  onBlur={form.handleBlur}
                  className="mt-1 accent-brand-gold cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-brand-gold hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-brand-gold hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}
            {!isLogin && form.errors.agreeTerms && form.touched.agreeTerms && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span>•</span>
                {form.errors.agreeTerms}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={form.loading}
              className="w-full bg-brand-gold text-white py-3.5 rounded-xl font-semibold hover:bg-brand-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {form.loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : isLogin ? (
                "Login to My Account"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Forgot Password Link (Login only) - Disabled until implemented */}
          {isLogin && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Password reset feature coming soon. Contact support for assistance.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
