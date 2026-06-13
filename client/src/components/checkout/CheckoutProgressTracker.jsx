import { FiMapPin, FiTruck, FiCreditCard, FiCheck } from "react-icons/fi";
import "./CheckoutProgressTracker.css";

const STEPS = [
  { id: 0, name: "Address", icon: FiMapPin },
  { id: 1, name: "Delivery", icon: FiTruck },
  { id: 2, name: "Payment", icon: FiCreditCard }
];

export default function CheckoutProgressTracker({ currentStep, completedSteps }) {
  return (
    <div className="checkout-progress">
      <div className="checkout-progress-container">
        {STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="checkout-progress-item">
              {/* Step Circle */}
              <div
                className={`checkout-progress-circle ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              >
                {isCompleted ? (
                  <FiCheck size={18} className="checkout-progress-icon-check" />
                ) : (
                  <StepIcon size={18} className="checkout-progress-icon" />
                )}
              </div>

              {/* Step Label */}
              <p className={`checkout-progress-label ${isActive ? "active" : ""}`}>
                {step.name}
              </p>

              {/* Connector Line (except for last step) */}
              {index < STEPS.length - 1 && (
                <div
                  className={`checkout-progress-line ${isCompleted ? "completed" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Indicator */}
      <div className="checkout-progress-mobile-indicator">
        Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].name}
      </div>
    </div>
  );
}
