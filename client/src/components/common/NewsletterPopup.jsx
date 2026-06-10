import { useState, useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";
import { validators } from "../../utils/validators";
import "./NewsletterPopup.css";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("gjNewsletterDismissed")) return;
    const t = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("gjNewsletterDismissed", "1");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    const emailValidation = validators.email(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call or make actual newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDone(true);
      setTimeout(dismiss, 2000);
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  if (!show) return null;

  return (
    <div className="newsletter-popup-overlay">
      <div className="newsletter-popup">
        <div className="newsletter-popup-header">
          <div className="newsletter-popup-emoji">💍</div>
          <h3 className="newsletter-popup-title">Get 10% Off</h3>
          <p className="newsletter-popup-subtitle">on your first order!</p>
        </div>

        <div className="newsletter-popup-body">
          {done ? (
            <div className="newsletter-popup-success">
              <div className="newsletter-popup-success-emoji">🎉</div>
              <p className="newsletter-popup-success-text">
                You're in! Check your inbox for the discount code.
              </p>
            </div>
          ) : (
            <>
              <p className="newsletter-popup-description">
                Subscribe to our newsletter for exclusive deals, new arrivals & style tips.
              </p>

              {/* Error message */}
              {error && (
                <div className="newsletter-popup-error">
                  <FiAlertCircle size={16} className="newsletter-popup-error-icon" />
                  <p className="newsletter-popup-error-text">{error}</p>
                </div>
              )}

              <form onSubmit={submit} className="newsletter-popup-form" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  className={`newsletter-popup-input ${error ? "error" : ""}`}
                />
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="newsletter-popup-submit-btn"
                >
                  {loading ? (
                    <div className="newsletter-popup-spinner" />
                  ) : null}
                  {loading ? "..." : "Subscribe"}
                </button>
              </form>

              <button
                onClick={dismiss}
                className="newsletter-popup-skip-btn"
              >
                No thanks, I'll pay full price
              </button>
            </>
          )}
        </div>

        <button
          onClick={dismiss}
          className="newsletter-popup-close-btn"
          aria-label="Close popup"
        >
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
}
