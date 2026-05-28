import { Link, useLocation } from "react-router-dom";
import { FiHome, FiSearch, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

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
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t lg:hidden flex">
      {tabs.map(({ icon: Icon, label, to, badge }) => (
        <Link key={to} to={to} className={`flex-1 flex flex-col items-center py-2 relative ${pathname === to ? "text-brand-gold" : "text-gray-500"}`}>
          <div className="relative">
            <Icon size={20} />
            {badge > 0 && <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center" style={{ fontSize: "9px" }}>{badge}</span>}
          </div>
          <span className="text-xs mt-0.5">{label}</span>
        </Link>
      ))}
    </div>
  );
}
