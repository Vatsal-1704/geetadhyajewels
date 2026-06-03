import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../../utils/api";

const DEFAULT_SLIDES = [
  {
    image: "https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png",
    title: "Elegant Jewellery", subtitle: "For Every Occasion", cta: "Shop Now", link: "/collections",
  },
  {
    image: "https://rubans.in/cdn/shop/files/desktop_banner_-_2025-03-10T154327.693_540x.jpg",
    title: "New Arrivals", subtitle: "Discover Fresh Designs", cta: "Explore", link: "/collections?filter=new",
  },
];

export default function HeroBanner() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch banners from API
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/products/banners/public");
        const heroBanners = data.filter(b => b.type === "hero").sort((a, b) => a.displayOrder - b.displayOrder);
        if (heroBanners.length > 0) {
          const formattedBanners = heroBanners.map(b => ({
            image: b.image,
            title: b.title || "Featured Collection",
            subtitle: b.subtitle || "",
            cta: "View Now",
            link: b.link || "/collections",
          }));
          setSlides(formattedBanners);
        }
      } catch (err) {
        console.warn("Failed to load banners from API, using defaults:", err.message);
        // Use defaults if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent(p => (p + 1) % slides.length);

  return (
    <div className="relative h-[50vh] sm:h-[65vh] lg:h-[80vh] overflow-hidden bg-brand-black">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-8 lg:px-16">
              <div className={`max-w-lg transition-all duration-700 ${i === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                <p className="text-brand-gold text-sm tracking-widest uppercase mb-3">✦ Premium Collection</p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight mb-2">{slide.title}</h1>
                <p className="text-gray-200 text-lg mb-8">{slide.subtitle}</p>
                <Link to={slide.link} className="inline-flex items-center gap-2 bg-brand-gold text-white px-8 py-3.5 rounded-full font-medium hover:bg-brand-gold-dark transition-all hover:shadow-xl hover:scale-105">
                  {slide.cta} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-brand-gold text-white rounded-full p-2 backdrop-blur-sm transition-all"><FiChevronLeft size={22} /></button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-brand-gold text-white rounded-full p-2 backdrop-blur-sm transition-all"><FiChevronRight size={22} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all ${i === current ? "w-8 h-2 bg-brand-gold" : "w-2 h-2 bg-white/50"}`} />)}
      </div>
    </div>
  );
}
