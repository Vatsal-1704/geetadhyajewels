import { FiInstagram } from "react-icons/fi";

const imgs = Array.from({ length: 6 }, (_, i) =>
  `https://rubans.in/cdn/shop/products/insta-${i + 1}.jpg`
);

export default function InstagramStrip() {
  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Follow Us</p>
          <h2 className="font-serif text-3xl text-brand-black mb-2">@GeetadhyaJewels</h2>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-gold transition-colors">
            <FiInstagram /> Follow on Instagram
          </a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {imgs.map((src, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-lg bg-brand-cream">
              <img src={src} alt={`Instagram ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => { e.target.src = `https://via.placeholder.com/300x300/FAF7F2/C9A84C?text=✨`; }} />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><FiInstagram className="text-white" size={24} /></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
