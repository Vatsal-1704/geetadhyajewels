import { useState, useEffect } from "react";
import api from "../../utils/api";
import "./AnnouncementBanner.css";

const DEFAULT_BANNER = {
  text: "🚚 FREE SHIPPING on orders above ₹999  |  💎 Use code JEWEL10 for 10% OFF  |  ✨ New Arrivals Every Week",
};

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState(DEFAULT_BANNER);

  useEffect(() => {
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
        // keep default banner
      }
    };

    fetchAnnouncementBanner();
  }, []);

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
