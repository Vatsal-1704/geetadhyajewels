import { useState, useEffect } from "react";
import api from "../../utils/api";
import "./AnnouncementBanner.css";

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // Fetch announcement banner from API
    const fetchAnnouncementBanner = async () => {
      try {
        const { data } = await api.get("/products/banners/public");
        const announcementBanners = data
          .filter((b) => b.type === "announcement")
          .sort((a, b) => a.displayOrder - b.displayOrder);
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
    <div className="announcement-banner">
      <div className="announcement-banner-content">
        <p className="announcement-text">
          📢 {banner.text || banner.title || "Important Announcement"}
        </p>
      </div>
    </div>
  );
}
