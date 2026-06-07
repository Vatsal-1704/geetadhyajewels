import { useState, useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";
import { validators } from "../../utils/validators";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl animate-slide-up">
        <div className="bg-brand-black p-8 text-center">
          <div className="text-4xl mb-3">💍</div>
          <h3 className="font-serif text-2xl text-white mb-1">Get 10% Off</h3>
          <p className="text-brand-gold text-sm">on your first order!</p>
        </div>

        <div className="p-8">
          {done ? (
            <div className="text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-semibold text-brand-black">
                You're in! Check your inbox for the discount code.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-sm text-center mb-6">
                Subscribe to our newsletter for exclusive deals, new arrivals & style tips.
              </p>

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <FiAlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={submit} className="flex gap-2" noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  className={`
                    flex-1 border rounded-lg px-4 py-3 text-sm outline-none
                    transition-colors
                    ${error ? "border-red-300 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-brand-gold"}
                    ${loading ? "bg-gray-100 text-gray-400" : ""}
                  `}
                />
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="bg-brand-gold text-white px-5 py-3 rounded-lg font-medium hover:bg-brand-gold-dark transition-colors text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  {loading ? "..." : "Subscribe"}
                </button>
              </form>

              <button
                onClick={dismiss}
                className="w-full text-center text-xs text-gray-400 mt-4 hover:text-gray-600 transition-colors"
              >
                No thanks, I'll pay full price
              </button>
            </>
          )}
        </div>

        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-white hover:text-brand-gold transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
}
