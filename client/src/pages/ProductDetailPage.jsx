import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiShoppingBag, FiHeart, FiShare2, FiStar, FiZoomIn, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/common/ProductCard";
import TrustBadges from "../components/common/TrustBadges";
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

const OFFERS = [
  { code: "JEWEL10", desc: "10% OFF on orders above ₹999", min: 999 },
  { code: "FIRST15", desc: "15% OFF on your first order", min: 0 },
  { code: "FREESHIP", desc: "Free shipping on orders above ₹499", min: 499 },
];

const RING_SIZES = ["6", "8", "10", "12", "14", "16", "18", "20"];
const BANGLE_SIZES = ['2.2"', '2.4"', '2.6"', '2.8"'];

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
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [offersOpen, setOffersOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rv_gj") || "[]"); } catch { return []; }
  });
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        if (data && data._id) {
          setProduct(data);
          try {
            const { data: sim } = await api.get(`/products/${data._id}/similar`);
            if (sim && sim.length > 0) setSimilar(sim);
          } catch (err) {
            console.error("Failed to load similar products:", err);
          }
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };
    fetchProduct();
    const h = () => setStickyVisible(window.scrollY > 500);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, [slug]);

  // Track recently viewed (skip mock)
  useEffect(() => {
    if (!product?._id || product._id === "m1") return;
    try {
      const stored = JSON.parse(localStorage.getItem("rv_gj") || "[]");
      const entry = { _id: product._id, slug: product.slug, name: product.name, price: product.price, mrp: product.mrp, images: product.images, discount: product.discount };
      const next = [entry, ...stored.filter(p => p._id !== product._id)].slice(0, 8);
      localStorage.setItem("rv_gj", JSON.stringify(next));
      setRecentlyViewed(stored.filter(p => p._id !== product._id).slice(0, 4));
    } catch {}
  }, [product._id]);

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) return;
    setPincodeStatus("checking");
    setTimeout(() => setPincodeStatus(parseInt(pincode) % 7 === 0 ? "no" : "ok"), 800);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    toast.success(`Code "${code}" copied!`);
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    addToCart(product, qty, selectedVariant);
    toast.success("Added to cart! 🛍️");
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error("This item is out of stock");
      return;
    }
    addToCart(product, qty, selectedVariant);
    window.location.href = "/checkout";
  };
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
          {/* Available Offers */}
          <div className="product-offers-section">
            <button onClick={() => setOffersOpen(o => !o)} className="product-offers-toggle">
              <span>🏷️ Available Offers</span>
              <span className="product-offers-chevron">{offersOpen ? "▲" : "▼"}</span>
            </button>
            {offersOpen && (
              <div className="product-offers-list">
                {OFFERS.map(o => (
                  <div key={o.code} className="product-offer-item">
                    <div>
                      <span className="product-offer-code">{o.code}</span>
                      <p className="product-offer-desc">{o.desc}</p>
                    </div>
                    <button onClick={() => copyCode(o.code)} className="product-offer-copy">Copy</button>
                  </div>
                ))}
              </div>
            )}
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
          {(product.category?.slug === "rings" || product.category?.slug === "bangles") && (
            <div className="product-size-section">
              <div className="product-size-header">
                <p className="product-variant-label">Size: <span className="product-variant-highlight">{selectedSize || "Select"}</span></p>
                <button onClick={() => setSizeGuideOpen(true)} className="product-size-guide-link">Size Guide ↗</button>
              </div>
              <div className="product-size-options">
                {(product.category?.slug === "rings" ? RING_SIZES : BANGLE_SIZES).map(size => (
                  <button
                    key={size}
                    className={`product-size-option${selectedSize === size ? " active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
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

          {/* Pincode Delivery Checker */}
          <div className="product-pincode-section">
            <p className="product-pincode-label">📍 Check delivery to your area</p>
            <div className="product-pincode-row">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeStatus(null); }}
                className="product-pincode-input"
              />
              <button
                onClick={checkPincode}
                disabled={pincode.length !== 6 || pincodeStatus === "checking"}
                className="product-pincode-button"
              >
                {pincodeStatus === "checking" ? "..." : "Check"}
              </button>
            </div>
            {pincodeStatus === "ok" && <p className="product-pincode-ok">✅ Delivery available! Estimated in 5–7 days.</p>}
            {pincodeStatus === "no" && <p className="product-pincode-no">❌ Sorry, delivery not available to this pincode.</p>}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="product-trust-section">
        <h2>Why Choose Our Jewelry</h2>
        <TrustBadges />
      </section>

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
            <div className="product-rating-summary">
              <div className="product-rating-overview">
                <span className="product-rating-big-number">{product.rating?.toFixed(1)}</span>
                <div className="product-rating-big-stars">{"★".repeat(Math.round(product.rating || 0))}{"☆".repeat(5 - Math.round(product.rating || 0))}</div>
                <p className="product-rating-total-label">{product.numReviews} reviews</p>
              </div>
              <div className="product-rating-bars">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = product.reviews?.filter(r => r.rating === star).length || 0;
                  const total = Math.max(product.reviews?.length || 1, 1);
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={star} className="product-rating-bar-row">
                      <span className="product-rating-bar-star">{star}★</span>
                      <div className="product-rating-bar-track">
                        <div className="product-rating-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="product-rating-bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
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

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="product-recently-viewed">
          <h2>Recently Viewed</h2>
          <div className="product-similar-grid">
            {recentlyViewed.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* Sticky Add to Cart (mobile) */}
      {stickyVisible && (
        <div className="product-sticky-bar">
          <div className="product-sticky-info"><p className="product-sticky-name">{product.name}</p><p className="product-sticky-price">₹{product.price?.toLocaleString()}</p></div>
          <button onClick={handleAddToCart} className="product-sticky-button">Add to Cart</button>
        </div>
      )}
      {sizeGuideOpen && (
        <div className="size-guide-overlay" onClick={() => setSizeGuideOpen(false)}>
          <div className="size-guide-modal" onClick={e => e.stopPropagation()}>
            <div className="size-guide-header">
              <h3>Size Guide</h3>
              <button onClick={() => setSizeGuideOpen(false)} className="size-guide-close"><FiX size={20} /></button>
            </div>
            {product.category?.slug === "rings" ? (
              <div className="size-guide-content">
                <p>Measure the inner circumference of your finger in mm to find your size.</p>
                <table className="size-guide-table">
                  <thead><tr><th>Indian Size</th><th>Inner Dia (mm)</th><th>Circumference (mm)</th></tr></thead>
                  <tbody>
                    {[["6","14.1","44.2"],["8","14.5","45.5"],["10","15.3","48.0"],["12","15.9","49.5"],["14","16.4","51.5"],["16","16.9","53.1"],["18","17.5","54.8"],["20","18.1","56.9"]].map(([s,d,c]) => (
                      <tr key={s}><td>{s}</td><td>{d}</td><td>{c}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="size-guide-content">
                <p>Bangle sizes are measured as inner diameter in inches.</p>
                <table className="size-guide-table">
                  <thead><tr><th>Size</th><th>Inner Dia (in)</th><th>Fits Wrist (in)</th></tr></thead>
                  <tbody>
                    {[['2.2"',"2.2","5.5–6.0"],['2.4"',"2.4","6.0–6.5"],['2.6"',"2.6","6.5–7.0"],['2.8"',"2.8","7.0–7.5"]].map(([s,d,w]) => (
                      <tr key={s}><td>{s}</td><td>{d}</td><td>{w}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
