import { Link } from "react-router-dom";
import "./ShopByStyle.css";

const styles = [
  { name: "Gold Plated", color: "#c9a84c", emoji: "✨", desc: "Timeless classics" },
  { name: "Oxidised", color: "#6b7280", emoji: "🌿", desc: "Ethnic & boho" },
  { name: "Kundan", color: "#d97706", emoji: "💎", desc: "Royal heritage" },
  { name: "American Diamond", color: "#3b82f6", emoji: "💍", desc: "Sparkling brilliance" },
  { name: "Temple", color: "#ea580c", emoji: "🛕", desc: "Traditional beauty" },
];

export default function ShopByStyle() {
  return (
    <section className="shop-by-style">
      <div className="shop-by-style-container">
        <div className="shop-by-style-header">
          <p className="shop-by-style-label">Curated</p>
          <h2 className="shop-by-style-title">Shop by Style</h2>
        </div>
        <div className="shop-by-style-grid">
          {styles.map((style) => (
            <Link
              key={style.name}
              to={`/collections?style=${encodeURIComponent(style.name)}`}
              className="style-card"
              style={{ '--style-color': style.color }}
            >
              <div className="style-card-emoji">{style.emoji}</div>
              <h3 className="style-card-name">{style.name}</h3>
              <p className="style-card-desc">{style.desc}</p>
              <div className="style-card-cta">Shop Now →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
