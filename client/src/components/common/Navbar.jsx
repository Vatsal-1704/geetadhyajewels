import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

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
      <div className="bg-brand-black text-brand-gold text-xs py-2 overflow-hidden">
        <div className="marquee-text whitespace-nowrap inline-block">
          🚚 FREE SHIPPING on orders above ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; 💎 Use code JEWEL10 for 10% OFF &nbsp;&nbsp;|&nbsp;&nbsp; ✨ New Arrivals Every Week &nbsp;&nbsp;|&nbsp;&nbsp; 📞 WhatsApp Us: +91 XXXXXXXXXX &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 FREE SHIPPING on orders above ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; 💎 Use code JEWEL10 for 10% OFF
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-brand-cream"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Hamburger (mobile) */}
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(true)}>
              <FiMenu size={22} className="text-brand-black" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="text-center">
                <span className="font-serif text-xl font-bold tracking-wide text-brand-black">
                  Geetadhya<span className="text-brand-gold">Jewels</span>
                </span>
                <p className="text-xs text-gray-500 tracking-widest hidden sm:block" style={{ fontSize: "9px" }}>ELEGANT IMITATION JEWELLERY</p>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-brand-black hover:text-brand-gold transition-colors">Home</Link>
              <div className="relative group" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                <button className="flex items-center gap-1 text-sm font-medium text-brand-black hover:text-brand-gold transition-colors">
                  Shop <FiChevronDown size={14} />
                </button>
                {shopOpen && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg p-4 w-64 grid grid-cols-2 gap-2 z-50">
                    {categories.map(c => (
                      <Link key={c.slug} to={`/collections/${c.slug}`} className="text-sm text-gray-700 hover:text-brand-gold py-1 px-2 rounded hover:bg-brand-cream transition-colors" onClick={() => setShopOpen(false)}>{c.name}</Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/offers" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">🔥 Offers</Link>
              <Link to="/sales" className="text-sm font-medium text-brand-gold hover:text-brand-black transition-colors">💎 Sales</Link>
              <Link to="/about" className="text-sm font-medium text-brand-black hover:text-brand-gold transition-colors">About</Link>
              <Link to="/contact" className="text-sm font-medium text-brand-black hover:text-brand-gold transition-colors">Contact</Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => setSearchOpen(true)} className="p-1.5 hover:text-brand-gold transition-colors"><FiSearch size={20} /></button>
              <Link to="/wishlist" className="p-1.5 hover:text-brand-gold transition-colors relative">
                <FiHeart size={20} />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>}
              </Link>
              <Link to="/cart" className="p-1.5 hover:text-brand-gold transition-colors relative">
                <FiShoppingBag size={20} />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>}
              </Link>
              {user ? (
                <div className="relative group">
                  <button className="p-1.5 hover:text-brand-gold transition-colors"><FiUser size={20} /></button>
                  <div className="absolute right-0 top-full hidden group-hover:block bg-white shadow-lg rounded-lg py-2 w-44 z-50">
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-brand-cream hover:text-brand-gold">My Account</Link>
                    <Link to="/account/orders" className="block px-4 py-2 text-sm hover:bg-brand-cream hover:text-brand-gold">My Orders</Link>
                    <Link to="/account/wishlist" className="block px-4 py-2 text-sm hover:bg-brand-cream hover:text-brand-gold">Wishlist</Link>
                    {user.role === "admin" && <Link to="/admin" className="block px-4 py-2 text-sm text-brand-gold font-medium hover:bg-brand-cream">Admin Panel</Link>}
                    <hr className="my-1" />
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="p-1.5 hover:text-brand-gold transition-colors"><FiUser size={20} /></Link>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-0 bg-white z-50 shadow-lg">
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
              <FiSearch size={20} className="text-brand-gold" />
              <form onSubmit={handleSearch} className="flex-1">
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for jewellery, occasions, styles..." className="w-full text-lg outline-none bg-transparent" />
              </form>
              <button onClick={() => setSearchOpen(false)}><FiX size={22} /></button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-serif text-xl font-bold">Geetadhya<span className="text-brand-gold">Jewels</span></span>
              <button onClick={() => setMenuOpen(false)}><FiX size={22} /></button>
            </div>
            <nav className="p-4 space-y-1">
              {[{ to: "/", label: "Home" }, { to: "/offers", label: "🔥 Offers" }, { to: "/sales", label: "💎 Sales & Promotions" }, { to: "/about", label: "About Us" }, { to: "/contact", label: "Contact" }, { to: "/track-order", label: "Track Order" }].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium border-b hover:text-brand-gold hover:bg-brand-cream rounded">{l.label}</Link>
              ))}
              <div className="pt-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Shop by Category</p>
                {categories.map(c => (
                  <Link key={c.slug} to={`/collections/${c.slug}`} onClick={() => setMenuOpen(false)} className="block py-2 px-3 text-sm hover:text-brand-gold hover:bg-brand-cream rounded">{c.name}</Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
