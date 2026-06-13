import { Link } from "react-router-dom";
import { placeholderImages } from "../../utils/placeholderImages";
import "./ShopByCategory.css";

const categories = [
  { name: "Necklaces", slug: "necklaces", img: placeholderImages.category.necklaces, emoji: "📿" },
  { name: "Earrings", slug: "earrings", img: placeholderImages.category.earrings, emoji: "✨" },
  { name: "Bangles", slug: "bangles", img: placeholderImages.category.bangles, emoji: "⭕" },
  { name: "Rings", slug: "rings", img: placeholderImages.category.rings, emoji: "💍" },
  { name: "Anklets", slug: "anklets", img: placeholderImages.category.anklets, emoji: "🌸" },
  { name: "Bridal Sets", slug: "bridal-sets", img: placeholderImages.category.bridal, emoji: "👑" },
  { name: "Hair Jewellery", slug: "hair-jewellery", img: placeholderImages.category.necklaces, emoji: "🌺" },
  { name: "Bracelets", slug: "bracelets", img: placeholderImages.category.bangles, emoji: "💎" },
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
