import { useState } from "react";
import { Link } from "react-router-dom";
import "./NewsletterSection.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <section className="nl-section">
      <div className="nl-container">
        <span className="nl-sparkle" aria-hidden="true">
          ✨
        </span>

        <p className="nl-eyebrow">Exclusive Offers</p>

        <h2 className="nl-heading">Get 10% Off Your First Order</h2>

        <p className="nl-subtitle">
          Join 10,000+ jewellery lovers. Get early access to new arrivals,
          exclusive deals &amp; styling tips.
        </p>

        {submitted ? (
          <p className="nl-success" role="alert">
            &#127881; Welcome! Check your inbox for your 10% off code.
          </p>
        ) : (
          <form className="nl-form" onSubmit={handleSubmit} noValidate>
            <div className="nl-input-group">
              <input
                type="email"
                className="nl-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                aria-label="Email address"
                autoComplete="email"
              />
              <button type="submit" className="nl-btn">
                Subscribe
              </button>
            </div>
            {error && (
              <p className="nl-error" role="alert">
                {error}
              </p>
            )}
          </form>
        )}

        <p className="nl-disclaimer">
          No spam, unsubscribe anytime. By subscribing you agree to our{" "}
          <Link to="/privacy-policy" className="nl-policy-link">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
