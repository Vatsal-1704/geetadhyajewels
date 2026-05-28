import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import WhatsAppButton from "./components/common/WhatsAppButton";
import BackToTop from "./components/common/BackToTop";
import MobileBottomBar from "./components/common/MobileBottomBar";
import NewsletterPopup from "./components/common/NewsletterPopup";
import CookieBanner from "./components/common/CookieBanner";

// Customer pages
import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import SearchPage from "./pages/SearchPage";
import OffersPage from "./pages/OffersPage";
import SalesPage from "./pages/SalesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ShippingPolicy, ReturnPolicy, PrivacyPolicy, TermsPage } from "./pages/PolicyPages";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";
import AdminCoupons from "./admin/AdminCoupons";
import AdminBanners from "./admin/AdminBanners";
import AdminCategories from "./admin/AdminCategories";
import AdminReviews from "./admin/AdminReviews";
import AdminInventory from "./admin/AdminInventory";
import AdminReports from "./admin/AdminReports";
import AdminSettings from "./admin/AdminSettings";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
  </div>
);

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <MobileBottomBar />
      <NewsletterPopup />
      <CookieBanner />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="light" toastStyle={{ fontFamily: "Poppins, sans-serif" }} />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
            <Route path="/collections" element={<CustomerLayout><CollectionsPage /></CustomerLayout>} />
            <Route path="/collections/:slug" element={<CustomerLayout><CollectionsPage /></CustomerLayout>} />
            <Route path="/product/:slug" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
            <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
            <Route path="/order-confirmation/:orderId" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/account" element={<CustomerLayout><AccountPage /></CustomerLayout>} />
            <Route path="/account/*" element={<CustomerLayout><AccountPage /></CustomerLayout>} />
            <Route path="/track-order" element={<CustomerLayout><TrackOrderPage /></CustomerLayout>} />
            <Route path="/search" element={<CustomerLayout><SearchPage /></CustomerLayout>} />
            <Route path="/offers" element={<CustomerLayout><OffersPage /></CustomerLayout>} />
            <Route path="/sales" element={<CustomerLayout><SalesPage /></CustomerLayout>} />
            <Route path="/promotions" element={<CustomerLayout><SalesPage /></CustomerLayout>} />
            <Route path="/wishlist" element={<CustomerLayout><AccountPage /></CustomerLayout>} />
            <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
            <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
            <Route path="/faq" element={<CustomerLayout><FAQPage /></CustomerLayout>} />
            <Route path="/shipping-policy" element={<CustomerLayout><ShippingPolicy /></CustomerLayout>} />
            <Route path="/return-policy" element={<CustomerLayout><ReturnPolicy /></CustomerLayout>} />
            <Route path="/privacy-policy" element={<CustomerLayout><PrivacyPolicy /></CustomerLayout>} />
            <Route path="/terms" element={<CustomerLayout><TermsPage /></CustomerLayout>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
            <Route path="/admin/customers" element={<AdminLayout><AdminCustomers /></AdminLayout>} />
            <Route path="/admin/coupons" element={<AdminLayout><AdminCoupons /></AdminLayout>} />
            <Route path="/admin/banners" element={<AdminLayout><AdminBanners /></AdminLayout>} />
            <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
            <Route path="/admin/reviews" element={<AdminLayout><AdminReviews /></AdminLayout>} />
            <Route path="/admin/inventory" element={<AdminLayout><AdminInventory /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

            <Route path="*" element={<CustomerLayout><NotFoundPage /></CustomerLayout>} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
