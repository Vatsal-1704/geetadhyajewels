import { useState, useEffect } from "react";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("gjCookieAccepted")) setShow(true); }, []);
  const accept = () => { localStorage.setItem("gjCookieAccepted", "1"); setShow(false); };
  if (!show) return null;
  return (
    <div className="cookie-banner">
      <div className="cookie-banner-emoji">🍪</div>
      <p className="cookie-banner-text">We use cookies to enhance your experience. By continuing, you agree to our <a href="/privacy-policy" className="cookie-banner-link">Privacy Policy</a>.</p>
      <div className="cookie-banner-actions">
        <button onClick={accept} className="cookie-banner-button cookie-banner-accept">Accept</button>
      </div>
    </div>
  );
}
