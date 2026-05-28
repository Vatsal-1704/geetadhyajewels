import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-36 right-4 z-40 bg-brand-black text-brand-gold w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-gold hover:text-white transition-all">
      <FiArrowUp size={18} />
    </button>
  );
}
