import HeroBanner from "../components/home/HeroBanner";
import AnnouncementBanner from "../components/home/AnnouncementBanner";
import ShopByCategory from "../components/home/ShopByCategory";
import FeaturedProducts from "../components/home/FeaturedProducts";
import ShopByOccasion from "../components/home/ShopByOccasion";
import SaleBanner from "../components/home/SaleBanner";
import StripBanner from "../components/home/StripBanner";
import ShopByPrice from "../components/home/ShopByPrice";
import ShopByStyle from "../components/home/ShopByStyle";
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
      <ShopByOccasion />
      <SaleBanner />
      <FeaturedProducts type="bestsellers" title="Best Sellers 🔥" />
      <ShopByPrice />
      <ShopByStyle />
      <StripBanner />
      <Testimonials />
      <InstagramStrip />
    </div>
  );
}
