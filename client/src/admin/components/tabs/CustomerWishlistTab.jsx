import { FiHeart, FiStar } from "react-icons/fi";

export default function CustomerWishlistTab({ wishlist }) {
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="p-6 text-center py-12">
        <div className="text-4xl mb-3">❤️</div>
        <p className="text-gray-500">No wishlist items</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {wishlist.map((product) => (
        <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
          <div className="flex gap-4 p-4">
            {/* Product Image */}
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
            )}

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h4>

              {/* Price & Rating */}
              <div className="flex items-center gap-3 mt-2">
                <p className="font-bold text-brand-gold">₹{Math.round(product.price)}</p>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={12}
                          fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">({product.rating.toFixed(1)})</span>
                  </div>
                )}
              </div>

              {/* Badge */}
              <p className="text-xs text-gray-500 mt-2">🛍️ In wishlist</p>
            </div>

            {/* Heart Icon */}
            <div className="flex-shrink-0">
              <FiHeart size={20} className="text-brand-gold fill-brand-gold" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
