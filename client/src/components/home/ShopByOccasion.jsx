import { Link } from "react-router-dom";
import "./ShopByOccasion.css";

const occasions = [
  {
    name: "Wedding & Bridal",
    slug: "wedding",
    emoji: "👑",
    desc: "Elegant sets for your big day",
    color: "#7c2d4a",
  },
  {
    name: "Festive & Pooja",
    slug: "festive",
    emoji: "🪔",
    desc: "Traditional jewels for celebrations",
    color: "#92400e",
  },
  {
    name: "Party & Evening",
    slug: "party",
    emoji: "✨",
    desc: "Glamour for every night out",
    color: "#3730a3",
  },
  {
    name: "Daily Casual",
    slug: "casual",
    emoji: "🌸",
    desc: "Light & comfortable for every day",
    color: "#065f46",
  },
];

export default function ShopByOccasion() {
  return (
    <section className="shop-by-occasion">
      <div className="shop-by-occasion-container">
        <div className="shop-by-occasion-header">
          <p className="shop-by-occasion-label">Find Your Look</p>
          <h2 className="shop-by-occasion-title">Shop by Occasion</h2>
        </div>
        <div className="shop-by-occasion-grid">
          {occasions.map((occ) => (
            <Link
              key={occ.slug}
              to={`/collections?occasion=${occ.slug}`}
              className="occasion-card"
              style={{ "--occ-color": occ.color }}
            >
              <div className="occasion-card-emoji">{occ.emoji}</div>
              <h3 className="occasion-card-name">{occ.name}</h3>
              <p className="occasion-card-desc">{occ.desc}</p>
              <span className="occasion-card-cta">Explore →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
