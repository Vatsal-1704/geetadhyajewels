import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Navbar.css";

const categories = [
  { name: "Necklaces", slug: "necklaces", emoji: "📿", desc: "Chains, pendants & sets" },
  { name: "Earrings", slug: "earrings", emoji: "✨", desc: "Studs, hoops & jhumkas" },
  { name: "Bangles", slug: "bangles", emoji: "⭕", desc: "Ethnic & modern styles" },
  { name: "Rings", slug: "rings", emoji: "💍", desc: "Statement & daily wear" },
  { name: "Anklets", slug: "anklets", emoji: "🌸", desc: "Delicate & bold designs" },
  { name: "Bridal Sets", slug: "bridal-sets", emoji: "👑", desc: "Complete bridal looks" },
  { name: "Hair Jewellery", slug: "hair-jewellery", emoji: "🌺", desc: "Maang tikkas & clips" },
  { name: "Bracelets", slug: "bracelets", emoji: "💎", desc: "Chains & charm sets" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); setSearchQuery(""); }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="navbar-announcement">
        <div className="navbar-announcement-text">
          🚚 FREE SHIPPING on orders above ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; 💎 Use code JEWEL10 for 10% OFF &nbsp;&nbsp;|&nbsp;&nbsp; ✨ New Arrivals Every Week &nbsp;&nbsp;|&nbsp;&nbsp; 📞 WhatsApp Us: +91 XXXXXXXXXX &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 FREE SHIPPING on orders above ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; 💎 Use code JEWEL10 for 10% OFF
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : "navbar-default"}`}>
        <div className="navbar-inner">
          {/* Hamburger (mobile) */}
          <button className="navbar-hamburger" onClick={() => setMenuOpen(true)}>
            <FiMenu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <div>
              <span className="navbar-logo-text">
                Geetadhya<span className="navbar-logo-gold">Jewels</span>
              </span>
              <p className="navbar-logo-tagline">ELEGANT IMITATION JEWELLERY</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            <div className="navbar-mega-wrapper" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
              <button className="navbar-link">
                Shop <FiChevronDown size={14} />
              </button>
              {shopOpen && (
                <div className="navbar-mega-menu">
                  <div className="navbar-mega-grid">
                    {categories.map(c => (
                      <Link key={c.slug} to={`/collections/${c.slug}`} className="navbar-mega-item" onClick={() => setShopOpen(false)}>
                        <span className="navbar-mega-emoji">{c.emoji}</span>
                        <div>
                          <div className="navbar-mega-name">{c.name}</div>
                          <div className="navbar-mega-desc">{c.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="navbar-mega-footer">
                    <Link to="/collections" className="navbar-mega-all" onClick={() => setShopOpen(false)}>View All Collections →</Link>
                    <Link to="/sales" className="navbar-mega-sale" onClick={() => setShopOpen(false)}>🔥 Sale Items</Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/offers" className="navbar-link navbar-link-special">🔥 Offers</Link>
            <Link to="/sales" className="navbar-link navbar-link-highlight">💎 Sales</Link>
            <Link to="/about" className="navbar-link">About</Link>
            <Link to="/contact" className="navbar-link">Contact</Link>
          </div>

          {/* Icons */}
          <div className="navbar-icons">
            <button onClick={() => setSearchOpen(true)} className="navbar-icon-button"><FiSearch size={20} /></button>
            <button onClick={() => user ? navigate("/account?tab=wishlist") : navigate("/login")} className="navbar-icon-button">
              <FiHeart size={20} />
              {wishlist.length > 0 && <span className="navbar-icon-badge">{wishlist.length}</span>}
            </button>
            <Link to="/cart" className="navbar-icon-button">
              <FiShoppingBag size={20} />
              {itemCount > 0 && <span className="navbar-icon-badge">{itemCount}</span>}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="navbar-icon-button"><FiUser size={20} /></button>
                <div className="navbar-user-menu">
                  <Link to="/account" className="navbar-user-item">My Account</Link>
                  <Link to="/account?tab=orders" className="navbar-user-item">My Orders</Link>
                  <button onClick={() => navigate("/account?tab=wishlist")} className="navbar-user-item" style={{background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: 'var(--space-2) var(--space-3)'}}>Wishlist</button>
                  {user.role === "admin" && <Link to="/admin" className="navbar-user-item" style={{ color: "var(--color-gold)" }}>Admin Panel</Link>}
                  <hr style={{ borderColor: "var(--color-border)", margin: "var(--space-1) 0" }} />
                  <button onClick={logout} className="navbar-user-item navbar-user-item-danger">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="navbar-icon-button"><FiUser size={20} /></Link>
            )}
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="navbar-search-modal" onClick={() => setSearchOpen(false)}>
            <div className="navbar-search-box" onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <FiSearch size={20} style={{ color: "var(--color-gold)" }} />
                <form onSubmit={handleSearch} style={{ flex: 1 }}>
                  <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for jewellery, occasions, styles..." className="navbar-search-input" />
                </form>
                <button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-primary)" }}><FiX size={22} /></button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <div className="navbar-mobile-overlay" onClick={() => setMenuOpen(false)} />
          <div className="navbar-mobile-menu">
            <div className="navbar-mobile-header">
              <span className="navbar-mobile-title">Geetadhya<span className="navbar-logo-gold">Jewels</span></span>
              <button className="navbar-mobile-close" onClick={() => setMenuOpen(false)}><FiX size={22} /></button>
            </div>
            <nav className="navbar-mobile-links">
              {[
                { to: "/", label: "Home" },
                { to: "/offers", label: "🔥 Offers" },
                { to: "/sales", label: "💎 Sales & Promotions" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/track-order", label: "Track Order" },
              ].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="navbar-mobile-link">{l.label}</Link>
              ))}

              <span className="navbar-mobile-section-label">Shop by Category</span>
              <div className="navbar-mobile-categories">
                {categories.map(c => (
                  <Link key={c.slug} to={`/collections/${c.slug}`} onClick={() => setMenuOpen(false)} className="navbar-mobile-cat-link">
                    <span className="navbar-mobile-cat-emoji">{c.emoji}</span>
                    <span className="navbar-mobile-cat-name">{c.name}</span>
                  </Link>
                ))}
                <Link to="/collections" onClick={() => setMenuOpen(false)} className="navbar-mobile-cat-link" style={{ color: "var(--color-gold)", marginTop: "var(--space-1)" }}>
                  <span className="navbar-mobile-cat-emoji">→</span>
                  <span className="navbar-mobile-cat-name">View All Collections</span>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
