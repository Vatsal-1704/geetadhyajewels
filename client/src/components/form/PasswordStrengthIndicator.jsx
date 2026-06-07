import { getPasswordStrength } from "../../utils/validators";

/**
 * Visual password strength indicator
 * Shows strength level and progress bar
 */
export default function PasswordStrengthIndicator({ password }) {
  const { strength, percentage, color } = getPasswordStrength(password);

  const colorMap = {
    gray: "bg-gray-300",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  };

  const strengthTextMap = {
    none: { text: "No password entered", color: "text-gray-500" },
    weak: { text: "Weak password", color: "text-red-600" },
    medium: { text: "Medium strength", color: "text-yellow-600" },
    strong: { text: "Strong password", color: "text-green-600" },
    "very-strong": { text: "Very strong password", color: "text-green-700" },
  };

  if (strength === "none") return null;

  const { text, color: textColor } = strengthTextMap[strength];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${textColor}`}>{text}</span>
        <span className="text-xs text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Password should contain:
        <br />
        • At least 8 characters
        <br />
        • Uppercase and lowercase letters
        <br />
        • At least one number
      </p>
    </div>
  );
}
