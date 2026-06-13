import { Link } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiEye } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useState } from "react";
import OptimizedImage from "./OptimizedImage";
import { imagePresets } from "../../utils/cloudinary";
import "./ProductCard.css";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [imgLoaded, setImgLoaded] = useState(false);

  const wishlisted = isWishlisted(product._id);
  const img = product.images?.[0] || "https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png";

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        {/* Image - Optimized with Cloudinary */}
        <div className="product-image-container">
          <OptimizedImage
            src={img}
            alt={product.name}
            preset="productCard"
            className="product-image"
            onLoad={() => setImgLoaded(true)}
          />
        </div>
        {/* Badges */}
        <div className="product-badges">
          {product.discount > 0 && <span className="product-badge product-badge-discount">{product.discount}% OFF</span>}
          {product.isNewArrival && <span className="product-badge product-badge-new">New</span>}
          {product.isBestSeller && <span className="product-badge product-badge-bestseller">Best Seller</span>}
        </div>
        {/* Overlay actions */}
        <div className="product-overlay">
          {onQuickView && (
            <button onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="product-overlay-button">
              <FiEye size={16} />
            </button>
          )}
        </div>
      </Link>

      {/* Wishlist btn */}
      <button onClick={() => toggle(product._id)}
        className={`product-wishlist-button ${wishlisted ? "wishlisted" : ""}`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>
        <FiHeart size={14} fill={wishlisted ? "currentColor" : "none"} />
      </button>

      {/* Info */}
      <div className="product-info">
        <Link to={`/product/${product.slug}`} className="product-name">{product.name}</Link>
        <div className="product-pricing">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {product.mrp > product.price && <span className="product-mrp">₹{product.mrp.toLocaleString()}</span>}
          {product.rating > 0 && <span className="product-rating">★ {product.rating.toFixed(1)}</span>}
        </div>
        <button onClick={() => addToCart(product)}
          className="product-add-to-cart">
          <FiShoppingBag size={13} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
