import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "../../utils/api";
import "./HeroBanner.css";

const DEFAULT_SLIDES = [
  {
    image: "https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png",
    title: "Elegant Jewellery",
    subtitle: "For Every Occasion",
    cta: "Shop Now",
    link: "/collections",
  },
  {
    image: "https://rubans.in/cdn/shop/files/desktop_banner_-_2025-03-10T154327.693_540x.jpg",
    title: "New Arrivals",
    subtitle: "Discover Fresh Designs",
    cta: "Explore",
    link: "/collections?filter=new",
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
        const heroBanners = data
          .filter((b) => b.type === "hero")
          .sort((a, b) => a.displayOrder - b.displayOrder);
        if (heroBanners.length > 0) {
          const formattedBanners = heroBanners.map((b) => ({
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
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  return (
    <div className="hero-banner">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === current ? "hero-slide-active" : ""}`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="hero-slide-image"
          />

          {/* Dark Overlay - Luxury style */}
          <div className="hero-overlay" />

          {/* Content */}
          <div className="hero-content">
            <div className="hero-content-wrapper">
              <div className={`hero-text ${i === current ? "hero-text-active" : ""}`}>
                {/* Label */}
                <p className="hero-label">✦ Premium Collection</p>

                {/* Title */}
                <h1 className="hero-title">{slide.title}</h1>

                {/* Subtitle */}
                {slide.subtitle && (
                  <p className="hero-subtitle">{slide.subtitle}</p>
                )}

                {/* CTA Button */}
                <Link to={slide.link} className="hero-cta-button">
                  {slide.cta} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button onClick={prev} className="hero-nav-button hero-nav-prev">
        <FiChevronLeft size={24} />
      </button>
      <button onClick={next} className="hero-nav-button hero-nav-next">
        <FiChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`hero-dot ${i === current ? "hero-dot-active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
