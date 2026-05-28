import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiEye } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useState } from "react";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [imgLoaded, setImgLoaded] = useState(false);

  const wishlisted = isWishlisted(product._id);
  const img = product.images?.[0] || "https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png";

  return (
    <div className="product-card group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="block relative overflow-hidden">
        {/* Image */}
        <div className="aspect-[3/4] bg-brand-cream overflow-hidden">
          {!imgLoaded && <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />}
          <img src={img} alt={product.name} loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
            onLoad={() => setImgLoaded(true)} />
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{product.discount}% OFF</span>}
          {product.isNewArrival && <span className="bg-brand-gold text-white text-xs px-2 py-0.5 rounded-full">New</span>}
          {product.isBestSeller && <span className="bg-brand-black text-brand-gold text-xs px-2 py-0.5 rounded-full">Best Seller</span>}
        </div>
        {/* Overlay actions */}
        <div className="product-overlay absolute inset-0 bg-black/20 opacity-0 flex items-center justify-center gap-2">
          {onQuickView && (
            <button onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="bg-white text-brand-black rounded-full p-2 shadow hover:bg-brand-gold hover:text-white transition-all">
              <FiEye size={16} />
            </button>
          )}
        </div>
      </Link>

      {/* Wishlist btn */}
      <button onClick={() => toggle(product._id)}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow ${wishlisted ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-50"} transition-all`}>
        <FiHeart size={14} fill={wishlisted ? "currentColor" : "none"} />
      </button>

      {/* Info */}
      <div className="p-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm text-brand-black line-clamp-2 hover:text-brand-gold transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5 mb-3">
          <span className="font-semibold text-brand-black">₹{product.price.toLocaleString()}</span>
          {product.mrp > product.price && <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>}
          {product.rating > 0 && <span className="ml-auto text-xs text-amber-500">★ {product.rating.toFixed(1)}</span>}
        </div>
        <button onClick={() => addToCart(product)}
          className="w-full bg-brand-black text-brand-gold text-xs font-medium py-2 rounded-lg hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center gap-1.5">
          <FiShoppingBag size={13} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
