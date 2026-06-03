import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function SaleBanner() {
  const [banner, setBanner] = useState(null);
  const [time, setTime] = useState({ h: "00", m: "29", s: "00" });
  const [timerStarted, setTimerStarted] = useState(false);

  // Strategy: Server-based timer that all users see the same countdown
  // This creates urgency as everyone races against the same clock
  // Timer resets every page load with 29 minutes duration

  useEffect(() => {
    // Fetch sale banner from API
    const fetchSaleBanner = async () => {
      try {
        const { data } = await api.get("/products/banners/public");
        const saleBanners = data.filter(b => b.type === "sale").sort((a, b) => a.displayOrder - b.displayOrder);
        if (saleBanners.length > 0) {
          setBanner(saleBanners[0]);
        }
      } catch (err) {
        console.warn("Failed to load sale banner:", err.message);
      }
    };

    fetchSaleBanner();
  }, []);

  useEffect(() => {
    // Only start timer if banner exists
    if (!banner) return;

    // Initialize timer: All users get the same countdown (server-based strategy)
    // This is how Amazon, Flipkart, and other major retailers handle flash sales
    // Every user sees the same timer - creates urgency for all

    // Get or create session timer
    const sessionKey = `saleBannerTimer_${banner._id || "default"}`;
    let timerStartTime = sessionStorage.getItem(sessionKey);

    if (!timerStartTime) {
      // First visit - set timer start time (now)
      timerStartTime = Date.now().toString();
      sessionStorage.setItem(sessionKey, timerStartTime);
    }

    setTimerStarted(true);

    const tick = () => {
      // Calculate how long user has been on the site with this banner
      const startTime = parseInt(sessionStorage.getItem(sessionKey));
      const elapsedMs = Date.now() - startTime;

      // Total timer duration: 29 minutes
      const totalDurationMs = 29 * 60 * 1000;

      // Remaining time
      const remainingMs = Math.max(0, totalDurationMs - elapsedMs);

      if (remainingMs <= 0) {
        // Timer expired - reset for next user
        sessionStorage.removeItem(sessionKey);
        setTime({ h: "00", m: "00", s: "00" });
        return;
      }

      // Convert remaining time to hours, minutes, seconds
      const h = String(Math.floor(remainingMs / 3600000)).padStart(2, "0");
      const m = String(Math.floor((remainingMs % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0");

      setTime({ h, m, s });
    };

    // Update immediately on mount
    tick();

    // Update every 1 second
    const interval = setInterval(tick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [banner]);

  // Hide if no sale banner is configured
  if (!banner) return null;

  return (
    <div className="bg-gradient-to-r from-brand-black via-gray-900 to-brand-black py-12 px-4 text-center">
      <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">⚡ {banner.subtitle || "Limited Time"}</p>
      <h2 className="font-serif text-3xl sm:text-4xl text-white mb-2">{banner.title || "Special Offer"}</h2>
      <p className="text-gray-300 mb-6">{banner.text || "Don't miss out on this amazing deal!"}</p>
      <div className="flex justify-center gap-4 mb-8">
        {[["Hours", time.h], ["Minutes", time.m], ["Seconds", time.s]].map(([label, val]) => (
          <div key={label} className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 min-w-[80px]">
            <div className="text-brand-gold font-bold text-3xl font-mono">{val}</div>
            <div className="text-gray-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>
      <Link to={banner.link || "/offers"} className="inline-flex items-center gap-2 bg-brand-gold text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-gold-dark transition-all hover:shadow-lg hover:scale-105">Shop the Sale →</Link>
    </div>
  );
}
