import { Link } from "react-router-dom";
import "../styles/info-pages.css";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Our Story</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-brand-black mb-4">About GeetadhyaJewels</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Crafting elegance, one piece at a time.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="bg-brand-cream rounded-2xl aspect-[4/3] flex items-center justify-center text-8xl">💍</div>
        <div>
          <h2 className="font-serif text-2xl text-brand-black mb-4">Our Journey</h2>
          <p className="text-gray-600 leading-relaxed mb-4">GeetadhyaJewels was born from a simple belief — that every woman deserves to feel like royalty, regardless of budget. We started with a passion for beautiful jewellery and a dream to make premium imitation jewellery accessible to all.</p>
          <p className="text-gray-600 leading-relaxed mb-4">Every piece in our collection is thoughtfully designed, carefully crafted, and quality-tested to ensure it meets our standards of elegance and durability. From everyday wear to bridal grandeur, we have something for every occasion.</p>
          <p className="text-gray-600 leading-relaxed">Today, we've served thousands of happy customers across India, and we continue to grow with one mission: to be your most trusted jewellery destination.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
        {[["10,000+", "Happy Customers"], ["500+", "Designs"], ["7", "Day Returns"], ["100%", "Skin-Safe"]].map(([num, label]) => (
          <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="font-serif text-3xl text-brand-gold font-bold">{num}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-brand-black rounded-2xl p-10 text-center">
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Our Promise</p>
        <h2 className="font-serif text-3xl text-white mb-4">Why Choose GeetadhyaJewels?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {[["💎", "Premium Quality", "Every piece crafted with finest materials, tested for durability"], ["🎨", "Unique Designs", "Curated by skilled artisans, inspired by Indian tradition & modern trends"], ["💰", "Affordable Luxury", "Premium look at prices that won't break the bank — always"]].map(([icon, title, desc]) => (
            <div key={title} className="text-center"><div className="text-4xl mb-3">{icon}</div><h3 className="font-semibold text-white mb-2">{title}</h3><p className="text-gray-400 text-sm">{desc}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}
