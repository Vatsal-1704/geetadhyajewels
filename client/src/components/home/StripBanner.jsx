import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./StripBanner.css";

export default function StripBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
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

  if (!banner) return null;

  return (
    <div className="strip-banner">
      {/* Background Image */}
      {banner.image && (
        <img src={banner.image} alt={banner.title} className="strip-banner-image" />
      )}

      {/* Dark Overlay */}
      <div className="strip-banner-overlay" />

      {/* Content */}
      <div className="strip-banner-content">
        <div className="strip-banner-text">
          <p className="strip-banner-label">✦ {banner.subtitle || "Featured"}</p>
          <h3 className="strip-banner-title">{banner.title || "Check This Out"}</h3>
          {banner.text && <p className="strip-banner-description">{banner.text}</p>}
        </div>

        {banner.link && (
          <Link to={banner.link} className="strip-banner-cta">
            View Now →
          </Link>
        )}
      </div>
    </div>
  );
}
