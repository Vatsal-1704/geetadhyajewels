import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import OptimizedImage from "../components/common/OptimizedImage";
import "./WishlistPage.css";

export default function WishlistPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggle } = useWishlist();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get("/auth/wishlist")
      .then(r => setItems(r.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (productId) => {
    await toggle(productId);
    setItems(prev => prev.filter(p => p._id !== productId));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleMoveToCart = async (product) => {
    addToCart(product);
    await toggle(product._id);
    setItems(prev => prev.filter(p => p._id !== product._id));
    toast.success("Moved to cart!");
  };

  if (loading) {
    return (
      <div className="wl-loading">
        <div className="wl-spinner" />
      </div>
    );
  }

  return (
    <div className="wl-page">
      {/* Header */}
      <div className="wl-header">
        <div className="wl-header__inner">
          <button className="wl-back" onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} /> Back
          </button>
          <div className="wl-header__title-row">
            <FiHeart size={22} className="wl-header__icon" />
            <h1 className="wl-title">My Wishlist</h1>
            {items.length > 0 && (
              <span className="wl-count">{items.length} {items.length === 1 ? "item" : "items"}</span>
            )}
          </div>
        </div>
      </div>

      <div className="wl-body">
        {items.length === 0 ? (
          /* ── Empty State ── */
          <div className="wl-empty">
            <div className="wl-empty__icon">
              <FiHeart size={48} />
            </div>
            <h2 className="wl-empty__title">Your wishlist is empty</h2>
            <p className="wl-empty__desc">Save items you love by tapping the ♡ on any product.</p>
            <Link to="/collections" className="wl-empty__cta">Browse Collections</Link>
          </div>
        ) : (
          /* ── Grid ── */
          <div className="wl-grid">
            {items.map(product => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
                onMoveToCart={handleMoveToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistCard({ product, onRemove, onMoveToCart }) {
  const img = product.images?.[0] || "";
  const hasDiscount = product.mrp > product.price;
  const discount = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="wl-card">
      {/* Remove button */}
      <button
        className="wl-card__remove"
        onClick={() => onRemove(product._id)}
        aria-label="Remove from wishlist"
      >
        <FiTrash2 size={14} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`} className="wl-card__img-wrap">
        <OptimizedImage
          src={img}
          alt={product.name}
          preset="productCard"
          className="wl-card__img"
        />
        {discount > 0 && (
          <span className="wl-card__badge">{discount}% OFF</span>
        )}
      </Link>

      {/* Info */}
      <div className="wl-card__body">
        <Link to={`/product/${product.slug}`} className="wl-card__name">{product.name}</Link>

        {product.rating > 0 && (
          <div className="wl-card__rating">
            <span className="wl-card__star">★</span>
            <span>{product.rating.toFixed(1)}</span>
            {product.numReviews > 0 && <span className="wl-card__reviews">({product.numReviews})</span>}
          </div>
        )}

        <div className="wl-card__pricing">
          <span className="wl-card__price">₹{product.price.toLocaleString()}</span>
          {hasDiscount && <span className="wl-card__mrp">₹{product.mrp.toLocaleString()}</span>}
        </div>

        {product.stock === 0 ? (
          <p className="wl-card__oos">Out of Stock</p>
        ) : (
          <button className="wl-card__cta" onClick={() => onMoveToCart(product)}>
            <FiShoppingBag size={14} /> Move to Cart
          </button>
        )}
      </div>
    </div>
  );
}
