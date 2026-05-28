import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("gjCart")) || []; } catch { return []; }
  });
  const [coupon, setCoupon] = useState(null);

  useEffect(() => { localStorage.setItem("gjCart", JSON.stringify(cartItems)); }, [cartItems]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prev => {
      const key = variant ? `${product._id}-${variant.color}` : product._id;
      const exists = prev.find(i => i.key === key);
      if (exists) return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { key, product, quantity, variant, price: product.price }];
    });
  };

  const removeFromCart = (key) => setCartItems(prev => prev.filter(i => i.key !== key));

  const updateQuantity = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setCartItems(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => { setCartItems([]); setCoupon(null); };

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const discount = coupon?.discountAmount || 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;
  const itemCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, discount, shipping, total, itemCount, coupon, setCoupon }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
