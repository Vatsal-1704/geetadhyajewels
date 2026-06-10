import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import "../styles/info-pages.css";

export default function SalesPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    fetchSaleBanners();
  }, []);

  const fetchSaleBanners = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/banners");
      // Filter only active sale banners
      const saleBanners = data.filter(b => b.type === "sale" && b.isActive);
      setBanners(saleBanners);
      if (saleBanners.length > 0) {
        setSelectedBanner(saleBanners[0]);
      }
    } catch (err) {
      toast.error("Failed to load sale banners");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-brand-black via-gray-900 to-brand-black text-white py-16 px-4 text-center">
          <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">🔥 Sales & Promotions</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-3">Special Offers</h1>
          <p className="text-gray-300 text-lg">No active sales at the moment</p>
        </div>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">No Active Sales</h2>
          <p className="text-gray-600 mb-8">Check back soon for amazing deals and exclusive offers!</p>
          <Link to="/collections" className="inline-block bg-brand-gold text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-gold-dark transition-colors">
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Selected Banner */}
      {selectedBanner && (
        <div
          className="relative bg-cover bg-center text-white py-20 px-4 text-center"
          style={{
            backgroundImage: selectedBanner.image ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${selectedBanner.image})` : "linear-gradient(to right, #1a1a1a, #2d2d2d)",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">🔥 Limited Time Offer</p>
            <h1 className="font-serif text-5xl sm:text-6xl mb-4 font-bold">{selectedBanner.title}</h1>
            <p className="text-xl text-gray-100 mb-6">{selectedBanner.subtitle}</p>
            {selectedBanner.link && (
              <Link
                to={selectedBanner.link}
                className="inline-block bg-brand-gold text-black px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors text-lg"
              >
                Shop Now →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Sale Banners Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">💰 All Active Sales</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-black mb-8">Explore Our Sales</h2>
        </div>

        {/* Featured Banner (large) */}
        {selectedBanner && (
          <div className="mb-12">
            <div
              className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => selectedBanner.link && window.location.href(selectedBanner.link)}
            >
              {selectedBanner.image && (
                <img
                  src={selectedBanner.image}
                  alt={selectedBanner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              {!selectedBanner.image && (
                <div className="w-full h-full bg-gradient-to-r from-brand-gold to-yellow-400 flex items-center justify-center">
                  <span className="text-3xl">🎉</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center text-white">
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-center mb-2">{selectedBanner.title}</h3>
                <p className="text-lg text-center px-4">{selectedBanner.subtitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* Other Sale Banners Grid */}
        {banners.length > 1 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Other Offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map(banner => (
                <div
                  key={banner._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => setSelectedBanner(banner)}
                >
                  {/* Banner Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-200">
                    {banner.image && (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    {!banner.image && (
                      <div className="w-full h-full bg-gradient-to-br from-brand-gold to-yellow-300 flex items-center justify-center">
                        <span className="text-4xl">🎁</span>
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-brand-black mb-2 line-clamp-2">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{banner.subtitle}</p>
                    {banner.link && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          window.location.href = banner.link;
                        }}
                        className="text-brand-gold font-semibold text-sm hover:text-brand-black transition-colors"
                      >
                        View Deal →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-gold to-yellow-400 text-black py-16 px-4 text-center mt-12">
        <h2 className="font-serif text-3xl sm:text-4xl mb-4">Don't Miss Out!</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Subscribe to our newsletter to get notified about new sales and exclusive offers first.
        </p>
        <form className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none"
            required
          />
          <button type="submit" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
