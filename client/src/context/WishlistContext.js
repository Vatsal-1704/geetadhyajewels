import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist([]);
  }, [user]);

  const fetchWishlist = async () => {
    try { const { data } = await api.get("/auth/wishlist"); setWishlist(data.map(p => p._id || p)); }
    catch { setWishlist([]); }
  };

  const toggle = async (productId) => {
    if (!user) return;
    try {
      await api.post(`/auth/wishlist/${productId}`);
      setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    } catch {}
  };

  const isWishlisted = (id) => wishlist.includes(id);

  return <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted, fetchWishlist }}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
