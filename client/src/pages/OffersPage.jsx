import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/common/ProductCard";
import api from "../utils/api";

const MOCK = Array.from({ length: 6 }, (_, i) => ({
  _id: `o${i}`, slug: `offer-product-${i}`, name: ["Kundan Necklace", "Bridal Earrings", "Gold Bangle Set", "Temple Pendant", "Pearl Maang Tikka", "Oxidised Anklet"][i],
  price: [999, 1299, 799, 599, 899, 449][i], mrp: [2499, 2999, 1999, 1299, 1799, 999][i], discount: 60,
  images: ["https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png"], isBestSeller: true,
}));

export default function OffersPage() {
  const target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const [time, setTime] = useState({ d: "0", h: "00", m: "00", s: "00" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) return;
      setTime({ d: String(Math.floor(diff / 86400000)), h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"), m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"), s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0") });
    };
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/products?limit=12&sort=rating");
        setProducts(data.products?.length ? data.products : MOCK);
      } catch (err) {
        console.error("Failed to load offers:", err);
        setProducts(MOCK);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-brand-black via-gray-900 to-brand-black text-white py-16 px-4 text-center">
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">🔥 Flash Sale</p>
        <h1 className="font-serif text-4xl sm:text-5xl mb-3">Buy 2 Get 1 FREE</h1>
        <p className="text-gray-300 text-lg mb-8">Add 3 items to your cart — the cheapest one is on us!</p>
        <div className="flex justify-center gap-4 mb-8">
          {[["Days", time.d], ["Hours", time.h], ["Mins", time.m], ["Secs", time.s]].map(([label, val]) => (
            <div key={label} className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 min-w-[70px]">
              <div className="text-brand-gold font-bold text-3xl font-mono">{val}</div>
              <div className="text-gray-400 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-brand-gold/20 border border-brand-gold text-brand-gold px-4 py-2 rounded-full">✅ Auto-applied at checkout</span>
          <span className="bg-white/10 px-4 py-2 rounded-full">📦 Free shipping on ₹999+</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-black">Eligible Products</h2>
          <span className="text-sm text-gray-500">{products.length} products</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /><div className="h-8 bg-gray-100 rounded animate-pulse" /></div>
            </div>
          )) : products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
