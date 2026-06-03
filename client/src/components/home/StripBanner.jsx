import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function StripBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // Fetch strip banner from API
    const fetchStripBanner = async () => {
      try {
        const { data } = await api.get("/products/banners/public");
        const stripBanners = data.filter(b => b.type === "strip").sort((a, b) => a.displayOrder - b.displayOrder);
        if (stripBanners.length > 0) {
          setBanner(stripBanners[0]);
        }
      } catch (err) {
        console.warn("Failed to load strip banner:", err.message);
      }
    };

    fetchStripBanner();
  }, []);

  // Hide if no strip banner is configured
  if (!banner) return null;

  return (
    <div className="relative w-full h-32 overflow-hidden bg-brand-black">
      {/* Background Image */}
      {banner.image && (
        <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-8 lg:px-16 max-w-7xl mx-auto w-full">
        <div className="flex-1">
          <p className="text-brand-gold text-xs tracking-widest uppercase mb-1">✦ {banner.subtitle || "Featured"}</p>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold leading-tight">{banner.title || "Check This Out"}</h3>
          {banner.text && <p className="text-gray-300 text-sm mt-1">{banner.text}</p>}
        </div>

        {/* CTA Button */}
        {banner.link && (
          <Link to={banner.link} className="ml-6 flex-shrink-0 inline-flex items-center gap-2 bg-brand-gold text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-gold-dark transition-all hover:shadow-lg hover:scale-105 whitespace-nowrap">
            View Now →
          </Link>
        )}
      </div>
    </div>
  );
}
