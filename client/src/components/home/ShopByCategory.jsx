import { Link } from "react-router-dom";
import "./ShopByCategory.css";

const categories = [
  { name: "Necklaces", slug: "necklaces", img: "https://rubans.in/cdn/shop/collections/Necklaces_b5ab2a97-af50-4ff7-aaea-29cb54e21de8_280x.jpg", emoji: "📿" },
  { name: "Earrings", slug: "earrings", img: "https://rubans.in/cdn/shop/collections/Earrings_280x.jpg", emoji: "✨" },
  { name: "Bangles", slug: "bangles", img: "https://rubans.in/cdn/shop/collections/Bangles_280x.jpg", emoji: "⭕" },
  { name: "Rings", slug: "rings", img: "https://rubans.in/cdn/shop/collections/Rings_280x.jpg", emoji: "💍" },
  { name: "Anklets", slug: "anklets", img: "https://rubans.in/cdn/shop/collections/Anklets_280x.jpg", emoji: "🌸" },
  { name: "Bridal Sets", slug: "bridal-sets", img: "https://rubans.in/cdn/shop/collections/Bridal_Sets_280x.jpg", emoji: "👑" },
  { name: "Hair Jewellery", slug: "hair-jewellery", img: "https://rubans.in/cdn/shop/collections/Hair_Accessories_280x.jpg", emoji: "🌺" },
  { name: "Bracelets", slug: "bracelets", img: "https://rubans.in/cdn/shop/collections/Bracelets_280x.jpg", emoji: "💎" },
];

export default function ShopByCategory() {
  return (
    <section className="shop-by-category">
      <div className="shop-by-category-container">
        <div className="shop-by-category-header">
          <p className="shop-by-category-label">Explore</p>
          <h2 className="shop-by-category-title">Shop by Category</h2>
        </div>
        <div className="shop-by-category-grid">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/collections/${cat.slug}`} className="category-card">
              <div className="category-card-image">
                <img
                  src={cat.img}
                  alt={cat.name}
                  onError={e => { e.target.src = `https://via.placeholder.com/200x200/0a0a0a/d4af37?text=${cat.emoji}`; }}
                />
              </div>
              <span className="category-card-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
