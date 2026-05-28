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
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 lg:pb-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
        <Link to="/" className="hover:text-brand-gold">Home</Link><span>/</span>
        <Link to="/collections" className="hover:text-brand-gold">Collections</Link><span>/</span>
        <Link to={`/collections/${product.category?.slug}`} className="hover:text-brand-gold capitalize">{product.category?.name}</Link><span>/</span>
        <span className="text-brand-black truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-brand-cream rounded-2xl overflow-hidden group">
            <img src={imgs[selectedImg]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow"><FiZoomIn size={18} /></button>
            {product.discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">{product.discount}% OFF</span>}
          </div>
          {imgs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imgs.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)} className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImg ? "border-brand-gold" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-brand-gold text-xs tracking-widest uppercase mb-1">{product.style || product.category?.name}</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-black mb-3 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-amber-400 text-sm">{Array.from({ length: 5 }, (_, i) => <span key={i}>{i < Math.round(product.rating) ? "★" : "☆"}</span>)}</div>
            <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-brand-black">₹{product.price?.toLocaleString()}</span>
            <span className="text-lg text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</span>
            <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-0.5 rounded">{product.discount}% off</span>
          </div>
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Color: <span className="text-brand-gold">{selectedVariant?.color || "Select"}</span></p>
              <div className="flex gap-2">
                {product.variants.map(v => (
                  <button key={v.color} onClick={() => setSelectedVariant(v)} title={v.color}
                    style={{ backgroundColor: v.colorHex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedVariant?.color === v.color ? "border-brand-gold scale-110" : "border-gray-300"}`} />
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-medium">Quantity:</p>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-brand-cream"><FiMinus size={14} /></button>
              <span className="px-4 py-2 font-medium min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock || 10, q + 1))} className="px-4 py-2 hover:bg-brand-cream"><FiPlus size={14} /></button>
            </div>
            <span className="text-xs text-gray-400">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          </div>
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-gold text-brand-gold py-3.5 rounded-xl font-semibold hover:bg-brand-gold hover:text-white transition-all">
              <FiShoppingBag size={18} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-brand-black text-brand-gold py-3.5 rounded-xl font-semibold hover:bg-brand-gold hover:text-white transition-all">Buy Now</button>
            <button onClick={() => toggle(product._id)} className={`p-3.5 rounded-xl border-2 transition-all ${wishlisted ? "bg-red-500 border-red-500 text-white" : "border-gray-300 hover:border-red-400 hover:text-red-400"}`}>
              <FiHeart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
          {/* Share */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            <FiShare2 size={14} /> Share:
            <a href={`https://wa.me/?text=${encodeURIComponent(product.name + " - " + window.location.href)}`} target="_blank" rel="noreferrer" className="text-green-600 hover:scale-110 transition-transform"><FaWhatsapp size={20} /></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:scale-110 transition-transform"><FaFacebook size={20} /></a>
          </div>
          <div className="bg-brand-cream rounded-xl p-4 text-sm text-gray-600 space-y-1">
            <p>✅ Free shipping on orders above ₹999</p>
            <p>↩️ 7-day hassle-free return policy</p>
            <p>🔒 100% secure payment</p>
            <p>📦 Delivered in 5–7 business days</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b mb-6 overflow-x-auto">
          {["description", "reviews"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${tab === t ? "border-brand-gold text-brand-gold" : "border-transparent text-gray-500 hover:text-brand-gold"}`}>{t === "reviews" ? `Reviews (${product.numReviews})` : t}</button>
          ))}
        </div>
        {tab === "description" && (
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            <p>{product.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              {[["Material", "Brass with Gold Plating"], ["Stone", "Kundan & Meenakari"], ["Care", "Avoid water & perfume"], ["Occasion", "Bridal & Festive"], ["Finish", "Antique Gold"], ["Set Includes", "Necklace + Earrings"]].map(([k, v]) => (
                <div key={k} className="bg-brand-cream rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">{k}</p><p className="text-sm font-medium">{v}</p></div>
              ))}
            </div>
          </div>
        )}
        {tab === "reviews" && (
          <div>
            <div className="space-y-4 mb-8">
              {product.reviews?.filter(r => r.isApproved !== false).map(r => (
                <div key={r._id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{r.name}</span>
                    <div className="flex text-amber-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                  {r.adminReply && <div className="mt-2 pl-3 border-l-2 border-brand-gold text-xs text-gray-500"><span className="font-medium text-brand-gold">GeetadhyaJewels: </span>{r.adminReply}</div>}
                </div>
              ))}
            </div>
            {user && (
              <form onSubmit={submitReview} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewRating(s)} className={`text-2xl ${s <= reviewRating ? "text-amber-400" : "text-gray-300"}`}>★</button>
                  ))}
                </div>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={4} required
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-brand-gold resize-none mb-4" />
                <button type="submit" className="bg-brand-gold text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-gold-dark transition-colors">Submit Review</button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Similar */}
      <div>
        <h2 className="font-serif text-2xl text-brand-black mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {similar.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>

      {/* Sticky Add to Cart (mobile) */}
      {stickyVisible && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg p-3 flex gap-3 lg:hidden">
          <div className="flex-1"><p className="font-medium text-sm truncate">{product.name}</p><p className="text-brand-gold font-bold">₹{product.price?.toLocaleString()}</p></div>
          <button onClick={handleAddToCart} className="bg-brand-gold text-white px-5 py-2.5 rounded-xl font-medium text-sm">Add to Cart</button>
        </div>
      )}
    </div>
  );
}
