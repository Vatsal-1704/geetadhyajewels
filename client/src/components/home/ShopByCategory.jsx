import { Link } from "react-router-dom";

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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Explore</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-black">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/collections/${cat.slug}`}
              className="group flex flex-col items-center gap-3">
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-brand-cream border-2 border-transparent group-hover:border-brand-gold transition-all duration-300 shadow-sm group-hover:shadow-md">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => { e.target.src = `https://via.placeholder.com/200x200/FAF7F2/C9A84C?text=${cat.emoji}`; }} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-center text-brand-black group-hover:text-brand-gold transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
