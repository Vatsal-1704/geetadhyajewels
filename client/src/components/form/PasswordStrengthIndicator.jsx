import { getPasswordStrength } from "../../utils/validators";
import "./PasswordStrengthIndicator.css";

/**
 * Visual password strength indicator
 * Shows strength level and progress bar
 */
export default function PasswordStrengthIndicator({ password }) {
  const { strength, percentage, color } = getPasswordStrength(password);

  const strengthTextMap = {
    none: { text: "No password entered" },
    weak: { text: "Weak password" },
    medium: { text: "Medium strength" },
    strong: { text: "Strong password" },
    "very-strong": { text: "Very strong password" },
  };

  if (strength === "none") return null;

  const { text } = strengthTextMap[strength];

  return (
    <div className="password-strength-container">
      <div className="password-strength-header">
        <span className={`password-strength-label ${strength}`}>{text}</span>
        <span className="password-strength-percentage">{percentage}%</span>
      </div>
      <div className="password-strength-bar-container">
        <div
          className={`password-strength-bar ${color}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Password strength"
        />
      </div>
      <div className="password-strength-requirements">
        <span className="password-strength-requirement-title">Password should contain:</span>
        <ul className="password-strength-requirement-list">
          <li className="password-strength-requirement-item">At least 8 characters</li>
          <li className="password-strength-requirement-item">Uppercase and lowercase letters</li>
          <li className="password-strength-requirement-item">At least one number</li>
        </ul>
      </div>
    </div>
  );
}
