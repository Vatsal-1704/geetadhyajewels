import HeroBanner from "../components/home/HeroBanner";
import AnnouncementBanner from "../components/home/AnnouncementBanner";
import ShopByCategory from "../components/home/ShopByCategory";
import FeaturedProducts from "../components/home/FeaturedProducts";
import ShopByStyle from "../components/home/ShopByStyle";
import SaleBanner from "../components/home/SaleBanner";
import StripBanner from "../components/home/StripBanner";
import Testimonials from "../components/home/Testimonials";
import InstagramStrip from "../components/home/InstagramStrip";
import TrustBadges from "../components/home/TrustBadges";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <AnnouncementBanner />
      <TrustBadges />
      <ShopByCategory />
      <FeaturedProducts type="new" title="What's New ✨" />
      <SaleBanner />
      <StripBanner />
      <FeaturedProducts type="bestsellers" title="Best Sellers 🔥" />
      <ShopByStyle />
      <Testimonials />
      <InstagramStrip />
    </div>
  );
}
