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
          <h2 className="font-serif text-2xl text-brand-black mb-4">Founder's Story</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <p className="text-yellow-700 text-sm">
              <strong>TODO (Owner Required):</strong> Add your founder story here. Include:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Your name and background</li>
                <li>Why you started GeetadhyaJewels</li>
                <li>Your passion for jewellery</li>
                <li>What makes your brand unique</li>
              </ul>
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-700 text-sm">
              <strong>Default content:</strong> GeetadhyaJewels was born from a simple belief — that every woman deserves to feel like royalty, regardless of budget. We started with a passion for beautiful jewellery and a dream to make premium imitation jewellery accessible to all.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="font-serif text-2xl text-brand-black mb-6 text-center">Our Mission & Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-brand-gold mb-3">Our Mission</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">
                <strong>TODO (Owner Required):</strong> What is GeetadhyaJewels' core mission? Replace this with your mission statement.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-brand-gold mb-3">Our Values</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">
                <strong>TODO (Owner Required):</strong> List 3-5 core values of your brand (e.g., Quality, Affordability, Trust, Innovation, Customer-centric)
              </p>
            </div>
          </div>
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
