import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import api from "../../utils/api";
import "./FeaturedProducts.css";

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
    <section className="featured-products">
      <div className="featured-products-container">
        <div className="featured-products-header">
          <div>
            <p className="featured-products-label">✦ Curated</p>
            <h2 className="featured-products-title">{title}</h2>
          </div>
          <Link to="/collections" className="featured-products-link-desktop">View All →</Link>
        </div>

        <div className="featured-products-grid">
          {loading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-skeleton">
              <div className="product-skeleton-image" />
              <div className="product-skeleton-content">
                <div className="product-skeleton-line" />
                <div className="product-skeleton-line product-skeleton-line-short" />
              </div>
            </div>
          )) : products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>

        <div className="featured-products-footer">
          <Link to="/collections" className="featured-products-cta">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
