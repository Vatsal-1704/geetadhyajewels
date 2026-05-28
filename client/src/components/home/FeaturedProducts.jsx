import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import api from "../../utils/api";

const MOCK_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  _id: `mock-${i}`, name: ["Kundan Necklace Set", "Pearl Drop Earrings", "Oxidised Bangles", "Temple Ring", "Bridal Choker", "American Diamond Maang Tikka", "Gold Plated Anklet", "Ethnic Jhumkas"][i],
  slug: `product-${i + 1}`, price: [999, 599, 799, 449, 2499, 1299, 399, 699][i], mrp: [1499, 899, 1199, 699, 3999, 1999, 599, 999][i],
  discount: 30, images: [`https://rubans.in/cdn/shop/products/product-${(i % 5) + 1}.jpg`],
  rating: 4.5, isNewArrival: i < 3, isBestSeller: i >= 4 && i < 7,
}));

export default function FeaturedProducts({ type = "bestsellers", title = "Best Sellers" }) {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const params = type === "new" ? "isNewArrival=true" : type === "featured" ? "isFeatured=true" : "isBestSeller=true";
        const { data } = await api.get(`/products?${params}&limit=8`);
        if (data.products?.length) setProducts(data.products);
      } catch { } finally { setLoading(false); }
    };
    fetch();
  }, [type]);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-gold text-sm tracking-widest uppercase mb-1">✦ Curated</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-black">{title}</h2>
          </div>
          <Link to="/collections" className="text-sm text-brand-gold hover:underline hidden sm:block">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
              <div className="p-3 space-y-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></div>
            </div>
          )) : products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/collections" className="inline-flex items-center gap-2 border-2 border-brand-gold text-brand-gold px-8 py-3 rounded-full font-medium hover:bg-brand-gold hover:text-white transition-all">View All Products →</Link>
        </div>
      </div>
    </section>
  );
}
