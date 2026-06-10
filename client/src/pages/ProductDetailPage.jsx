import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingBag, FiHeart, FiShare2, FiStar, FiZoomIn, FiMinus, FiPlus } from "react-icons/fi";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/common/ProductCard";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./ProductDetailPage.css";

const MOCK = {
  _id: "m1", slug: "kundan-necklace-set", name: "Kundan Bridal Necklace Set with Earrings", price: 1499, mrp: 2499,
  discount: 40, rating: 4.8, numReviews: 124, style: "Kundan",
  description: "A stunning Kundan bridal necklace set crafted with precision and care. Features intricate Kundan work with meenakari detailing. Comes with matching earrings. Perfect for weddings, receptions, and festive occasions.",
  images: ["https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png"],
  variants: [{ color: "Gold", colorHex: "#C9A84C" }, { color: "Silver", colorHex: "#C0C0C0" }],
  reviews: [{ _id: "r1", name: "Priya S.", rating: 5, comment: "Absolutely stunning! Got so many compliments!", createdAt: new Date().toISOString() }],
  category: { name: "Necklaces", slug: "necklaces" }, stock: 10,
};

const SIMILAR_MOCK = Array.from({ length: 4 }, (_, i) => ({
  _id: `s${i}`, slug: `similar-${i}`, name: ["Temple Necklace", "Pearl Choker", "Gold Plated Set", "AD Necklace"][i],
  price: [999, 1299, 1799, 2199][i], mrp: [1499, 1999, 2499, 2999][i], discount: 30,
  images: ["https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png"],
}));

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(MOCK);
  const [similar, setSimilar] = useState(SIMILAR_MOCK);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [stickyVisible, setStickyVisible] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
        if (data._id) {
          const { data: sim } = await api.get(`/products/${data._id}/similar`);
          if (sim.length) setSimilar(sim);
        }
      } catch {}
    };
    fetchProduct();
    const h = () => setStickyVisible(window.scrollY > 500);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, [slug]);

  const handleAddToCart = () => { addToCart(product, qty, selectedVariant); toast.success("Added to cart! 🛍️"); };
  const handleBuyNow = () => { addToCart(product, qty, selectedVariant); window.location.href = "/checkout"; };
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewText });
      toast.success("Review submitted! Pending approval.");
      setReviewText(""); setReviewRating(5);
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  const imgs = product.images?.length ? product.images : [MOCK.images[0]];
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <nav className="product-detail-breadcrumb">
        <Link to="/" className="product-detail-breadcrumb-link">Home</Link><span>/</span>
        <Link to="/collections" className="product-detail-breadcrumb-link">Collections</Link><span>/</span>
        <Link to={`/collections/${product.category?.slug}`} className="product-detail-breadcrumb-link capitalize">{product.category?.name}</Link><span>/</span>
        <span className="product-detail-breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-detail-grid">
        {/* Images */}
        <div className="product-images-section">
          <div className="product-main-image">
            <img src={imgs[selectedImg]} alt={product.name} />
            <button className="product-zoom-button"><FiZoomIn size={18} /></button>
            {product.discount > 0 && <span className="product-discount-badge">{product.discount}% OFF</span>}
          </div>
          {imgs.length > 1 && (
            <div className="product-thumbnails">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)} className={`product-thumbnail ${i === selectedImg ? "active" : ""}`}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="product-details-section">
          <p className="product-category">{product.style || product.category?.name}</p>
          <h1 className="product-detail-title">{product.name}</h1>
          <div className="product-rating-section">
            <div className="product-stars">{Array.from({ length: 5 }, (_, i) => <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>)}</div>
            <span className="product-reviews-count">({product.numReviews} reviews)</span>
          </div>
          <div className="product-pricing-section">
            <span className="product-current-price">₹{product.price?.toLocaleString()}</span>
            <span className="product-original-price">₹{product.mrp?.toLocaleString()}</span>
            <span className="product-discount-percentage">{product.discount}% off</span>
          </div>
          {product.variants?.length > 0 && (
            <div className="product-variants-section">
              <p className="product-variant-label">Color: <span className="product-variant-highlight">{selectedVariant?.color || "Select"}</span></p>
              <div className="product-color-swatches">
                {product.variants.map(v => (
                  <button key={v.color} onClick={() => setSelectedVariant(v)} title={v.color}
                    style={{ backgroundColor: v.colorHex }}
                    className={`product-color-swatch ${selectedVariant?.color === v.color ? "active" : ""}`} />
                ))}
              </div>
            </div>
          )}
          <div className="product-quantity-section">
            <p className="product-quantity-label">Quantity:</p>
            <div className="product-quantity-controls">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="product-quantity-button"><FiMinus size={14} /></button>
              <span className="product-quantity-display">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock || 10, q + 1))} className="product-quantity-button"><FiPlus size={14} /></button>
            </div>
            <span className="product-stock-status">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>
          <div className="product-action-buttons">
            <button onClick={handleAddToCart} className="product-add-to-cart-button">
              <FiShoppingBag size={18} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="product-buy-now-button">Buy Now</button>
            <button onClick={() => toggle(product._id)} className={`product-wishlist-button ${wishlisted ? "active" : ""}`}>
              <FiHeart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
          {/* Share */}
          <div className="product-share-section">
            <div className="product-share-icon"><FiShare2 size={14} /> Share:</div>
            <div className="product-share-links">
              <a href={`https://wa.me/?text=${encodeURIComponent(product.name + " - " + window.location.href)}`} target="_blank" rel="noreferrer" className="product-share-link" style={{ color: "var(--color-success)" }}><FaWhatsapp size={20} /></a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer" className="product-share-link" style={{ color: "#1877f2" }}><FaFacebook size={20} /></a>
            </div>
          </div>
          <div className="product-info-box">
            <p>✅ Free shipping on orders above ₹999</p>
            <p>↩️ 7-day hassle-free return policy</p>
            <p>🔒 100% secure payment</p>
            <p>📦 Delivered in 5–7 business days</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs">
        <div className="product-tabs-header">
          {["description", "reviews"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`product-tab-button ${tab === t ? "active" : ""}`}>{t === "reviews" ? `Reviews (${product.numReviews})` : t}</button>
          ))}
        </div>
        {tab === "description" && (
          <div>
            <div className="product-description">
              <p>{product.description}</p>
              <div className="product-specs-grid">
                {[["Material", "Brass with Gold Plating"], ["Stone", "Kundan & Meenakari"], ["Care", "Avoid water & perfume"], ["Occasion", "Bridal & Festive"], ["Finish", "Antique Gold"], ["Set Includes", "Necklace + Earrings"]].map(([k, v]) => (
                  <div key={k} className="product-spec-item"><p className="product-spec-label">{k}</p><p className="product-spec-value">{v}</p></div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "reviews" && (
          <div>
            <div className="product-reviews-list">
              {product.reviews?.filter(r => r.isApproved !== false).map(r => (
                <div key={r._id} className="product-review-item">
                  <div className="product-review-header">
                    <span className="product-review-name">{r.name}</span>
                    <div className="product-review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  </div>
                  <p className="product-review-text">{r.comment}</p>
                  {r.adminReply && <div className="product-review-reply"><span className="product-review-reply-brand">GeetadhyaJewels: </span>{r.adminReply}</div>}
                </div>
              ))}
            </div>
            {user && (
              <form onSubmit={submitReview} className="product-review-form">
                <h3>Write a Review</h3>
                <div className="product-review-rating">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewRating(s)} className={`product-review-rating-button ${s <= reviewRating ? "active" : ""}`}>★</button>
                  ))}
                </div>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={4} required
                  className="product-review-textarea" />
                <button type="submit" className="product-review-submit">Submit Review</button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Similar */}
      <div className="product-similar-section">
        <h2>You May Also Like</h2>
        <div className="product-similar-grid">
          {similar.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>

      {/* Sticky Add to Cart (mobile) */}
      {stickyVisible && (
        <div className="product-sticky-bar">
          <div className="product-sticky-info"><p className="product-sticky-name">{product.name}</p><p className="product-sticky-price">₹{product.price?.toLocaleString()}</p></div>
          <button onClick={handleAddToCart} className="product-sticky-button">Add to Cart</button>
        </div>
      )}
    </div>
  );
}
