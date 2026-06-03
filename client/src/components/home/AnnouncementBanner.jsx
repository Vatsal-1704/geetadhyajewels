import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // Fetch announcement banner from API
    const fetchAnnouncementBanner = async () => {
      try {
        const { data } = await api.get("/admin/banners");
        const announcementBanners = data.filter(b => b.type === "announcement" && b.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
        if (announcementBanners.length > 0) {
          setBanner(announcementBanners[0]);
        }
      } catch (err) {
        console.warn("Failed to load announcement banner:", err.message);
      }
    };

    fetchAnnouncementBanner();
  }, []);

  // Hide if no announcement banner is configured
  if (!banner) return null;

  return (
    <div className="bg-gradient-to-r from-brand-gold via-brand-gold to-brand-gold-dark py-3 px-4 text-center">
      <div className="max-w-7xl mx-auto">
        <p className="text-white text-sm font-medium tracking-wide">
          📢 {banner.text || banner.title || "Important Announcement"}
        </p>
      </div>
    </div>
  );
}
