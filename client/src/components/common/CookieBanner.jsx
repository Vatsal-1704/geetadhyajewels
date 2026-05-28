import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("gjCookieAccepted")) setShow(true); }, []);
  const accept = () => { localStorage.setItem("gjCookieAccepted", "1"); setShow(false); };
  if (!show) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 z-40 bg-brand-black text-white rounded-xl p-4 shadow-xl max-w-lg mx-auto flex items-center gap-4 animate-slide-up">
      <div className="text-2xl">🍪</div>
      <p className="text-sm text-gray-300 flex-1">We use cookies to enhance your experience. By continuing, you agree to our <a href="/privacy-policy" className="text-brand-gold underline">Privacy Policy</a>.</p>
      <button onClick={accept} className="bg-brand-gold text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-brand-gold-dark transition-colors">Accept</button>
    </div>
  );
}
