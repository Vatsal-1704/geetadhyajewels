import HeroBanner from "../components/home/HeroBanner";
import HomeSearch from "../components/home/HomeSearch";
import AnnouncementBanner from "../components/home/AnnouncementBanner";
import ShopByCategory from "../components/home/ShopByCategory";
import FeaturedProducts from "../components/home/FeaturedProducts";
import ShopByStyle from "../components/home/ShopByStyle";
import ShopByOccasion from "../components/home/ShopByOccasion";
import ShopByPrice from "../components/home/ShopByPrice";
import SaleBanner from "../components/home/SaleBanner";
import StripBanner from "../components/home/StripBanner";
import Testimonials from "../components/home/Testimonials";
import InstagramStrip from "../components/home/InstagramStrip";
import TrustBadges from "../components/home/TrustBadges";
import DealOfTheDay from "../components/home/DealOfTheDay";
import NewsletterSection from "../components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <HomeSearch />
      <AnnouncementBanner />
      <TrustBadges />
      <ShopByCategory />
      <ShopByOccasion />
      <FeaturedProducts type="new" title="What's New ✨" />
      <SaleBanner />
      <ShopByStyle />
      <ShopByPrice />
      <DealOfTheDay />
      <StripBanner />
      <Testimonials />
      <NewsletterSection />
      <InstagramStrip />
    </div>
  );
}
