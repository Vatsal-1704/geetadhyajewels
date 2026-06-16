import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./StripBanner.css";

const DEFAULT_BANNER = {
  subtitle: "New Arrivals 2024",
  title: "Bridal & Festive Collection",
  text: "Handcrafted jewellery for every occasion — weddings, festivals & beyond.",
  link: "/collections/bridal-sets",
};

export default function StripBanner() {
  const [banner, setBanner] = useState(DEFAULT_BANNER);

  useEffect(() => {
    const fetchStripBanner = async () => {
      try {
        const { data } = await api.get("/products/banners/public");
        const stripBanners = data.filter(b => b.type === "strip").sort((a, b) => a.displayOrder - b.displayOrder);
        if (stripBanners.length > 0) {
          setBanner(stripBanners[0]);
        }
      } catch (err) {
        // keep default banner
      }
    };

    fetchStripBanner();
  }, []);

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
