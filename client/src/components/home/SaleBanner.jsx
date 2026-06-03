import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function SaleBanner() {
  const [banner, setBanner] = useState(null);
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

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
    const tick = () => {
      // Use banner's saleEndDate if available, otherwise default to 2 days from now
      const target = banner?.saleEndDate ? new Date(banner.saleEndDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const diff = target - new Date();
      if (diff <= 0) return;
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTime({ h, m, s });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
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
