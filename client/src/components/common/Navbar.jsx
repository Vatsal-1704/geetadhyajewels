import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import "./Navbar.css";

const categories = [
  { name: "Necklaces", slug: "necklaces" }, { name: "Earrings", slug: "earrings" },
  { name: "Bangles", slug: "bangles" }, { name: "Rings", slug: "rings" },
  { name: "Anklets", slug: "anklets" }, { name: "Bridal Sets", slug: "bridal-sets" },
  { name: "Hair Jewellery", slug: "hair-jewellery" }, { name: "Bracelets", slug: "bracelets" },
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
          <Link to="/" className="navbar-logo">
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
            <div className="relative group">
              <button className="navbar-link">
                Shop <FiChevronDown size={14} />
              </button>
              {shopOpen && (
                <div className="navbar-dropdown" style={{ display: 'block' }}>
                  {categories.map(c => (
                    <Link key={c.slug} to={`/collections/${c.slug}`} className="navbar-dropdown-item" onClick={() => setShopOpen(false)}>{c.name}</Link>
                  ))}
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
            <Link to="/wishlist" className="navbar-icon-button">
              <FiHeart size={20} />
              {wishlist.length > 0 && <span className="navbar-icon-badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="navbar-icon-button">
              <FiShoppingBag size={20} />
              {itemCount > 0 && <span className="navbar-icon-badge">{itemCount}</span>}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="navbar-icon-button"><FiUser size={20} /></button>
                <div className="navbar-user-menu">
                  <Link to="/account" className="navbar-user-item">My Account</Link>
                  <Link to="/account/orders" className="navbar-user-item">My Orders</Link>
                  <Link to="/account/wishlist" className="navbar-user-item">Wishlist</Link>
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
              {[{ to: "/", label: "Home" }, { to: "/offers", label: "🔥 Offers" }, { to: "/sales", label: "💎 Sales & Promotions" }, { to: "/about", label: "About Us" }, { to: "/contact", label: "Contact" }, { to: "/track-order", label: "Track Order" }].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="navbar-mobile-link">{l.label}</Link>
              ))}
              <div style={{ paddingTop: "var(--space-2)" }}><p style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-muted)", letterSpacing: "0.05em", padding: "var(--space-3) var(--space-2)", marginBottom: "var(--space-2)" }}>SHOP BY CATEGORY</p>
                {categories.map(c => (
                  <Link key={c.slug} to={`/collections/${c.slug}`} onClick={() => setMenuOpen(false)} className="navbar-mobile-link">{c.name}</Link>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
