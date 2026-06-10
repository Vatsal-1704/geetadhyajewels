import { Link, useLocation } from "react-router-dom";
import { FiHome, FiSearch, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import "./MobileBottomBar.css";

export default function MobileBottomBar() {
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const { pathname } = useLocation();
  const tabs = [
    { icon: FiHome, label: "Home", to: "/" },
    { icon: FiSearch, label: "Search", to: "/search" },
    { icon: FiHeart, label: "Wishlist", to: "/wishlist", badge: wishlist.length },
    { icon: FiShoppingBag, label: "Cart", to: "/cart", badge: itemCount },
    { icon: FiUser, label: "Account", to: "/account" },
  ];
  return (
    <div className="mobile-bottom-bar">
      <div className="mobile-bar-tabs">
        {tabs.map(({ icon: Icon, label, to, badge }) => (
          <Link key={to} to={to} className={`mobile-bar-tab ${pathname === to ? "active" : ""}`}>
            <div className="mobile-bar-tab-icon">
              <Icon size={20} />
              {badge > 0 && <span className="mobile-bar-badge">{badge}</span>}
            </div>
            <span className="mobile-bar-tab-label">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
