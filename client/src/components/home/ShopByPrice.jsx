import { Link } from "react-router-dom";
import "./ShopByPrice.css";

const ranges = [
  {
    label: "Under ₹499",
    desc: "Everyday picks & fun gifting finds",
    max: 499,
    emoji: "🎀",
    accent: "#c9a84c",
  },
  {
    label: "Under ₹999",
    desc: "Stylish sets for any occasion",
    max: 999,
    emoji: "💎",
    accent: "#d4af37",
  },
  {
    label: "Under ₹1999",
    desc: "Premium pieces & statement jewelry",
    max: 1999,
    emoji: "👑",
    accent: "#e8c96a",
  },
];

export default function ShopByPrice() {
  return (
    <section className="shop-by-price">
      <div className="shop-by-price-container">
        <div className="shop-by-price-header">
          <p className="shop-by-price-label">For Every Budget</p>
          <h2 className="shop-by-price-title">Shop by Price</h2>
        </div>
        <div className="shop-by-price-grid">
          {ranges.map((r) => (
            <Link
              key={r.max}
              to={`/collections?maxPrice=${r.max}`}
              className="price-card"
              style={{ "--price-accent": r.accent }}
            >
              <div className="price-card-emoji">{r.emoji}</div>
              <div className="price-card-label">{r.label}</div>
              <p className="price-card-desc">{r.desc}</p>
              <span className="price-card-cta">Shop Now →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
