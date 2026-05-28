import { Link } from "react-router-dom";

const styles = [
  { name: "Gold Plated", bg: "from-yellow-800 to-yellow-600", emoji: "✨", desc: "Timeless classics" },
  { name: "Oxidised", bg: "from-gray-700 to-gray-500", emoji: "🌿", desc: "Ethnic & boho" },
  { name: "Kundan", bg: "from-red-900 to-red-700", emoji: "💎", desc: "Royal heritage" },
  { name: "American Diamond", bg: "from-blue-800 to-indigo-600", emoji: "💍", desc: "Sparkling brilliance" },
  { name: "Temple", bg: "from-orange-800 to-orange-600", emoji: "🛕", desc: "Traditional beauty" },
];

export default function ShopByStyle() {
  return (
    <section className="py-16 px-4 bg-brand-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Curated</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-black">Shop by Style</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {styles.map((style) => (
            <Link key={style.name} to={`/collections?style=${encodeURIComponent(style.name)}`}
              className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br ${style.bg} p-6 text-white text-center hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl cursor-pointer`}>
              <div className="text-4xl mb-3">{style.emoji}</div>
              <h3 className="font-serif text-lg font-semibold mb-1">{style.name}</h3>
              <p className="text-xs text-white/70">{style.desc}</p>
              <div className="mt-3 text-xs underline underline-offset-2 opacity-80 group-hover:opacity-100">Shop Now →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
