import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./DealOfTheDay.css";

const MOCK_PRODUCTS = [
  {
    _id: "mock-1",
    name: "Gold Floral Necklace",
    slug: "gold-floral-necklace",
    price: 599,
    mrp: 999,
    images: [""],
  },
  {
    _id: "mock-2",
    name: "Diamond Stud Earrings",
    slug: "diamond-stud-earrings",
    price: 599,
    mrp: 999,
    images: [""],
  },
  {
    _id: "mock-3",
    name: "Pearl Bracelet Set",
    slug: "pearl-bracelet-set",
    price: 599,
    mrp: 999,
    images: [""],
  },
  {
    _id: "mock-4",
    name: "Ruby Drop Earrings",
    slug: "ruby-drop-earrings",
    price: 599,
    mrp: 999,
    images: [""],
  },
];

function getInitialTarget() {
  return Date.now() + 24 * 60 * 60 * 1000;
}

function calcTimeLeft(target) {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  return {
    hh: String(hh).padStart(2, "0"),
    mm: String(mm).padStart(2, "0"),
    ss: String(ss).padStart(2, "0"),
  };
}

function discountPercent(price, mrp) {
  if (!mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

export default function DealOfTheDay() {
  const [target] = useState(getInitialTarget);
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(getInitialTarget()));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(target));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  useEffect(() => {
    api
      .get("/products?isFeatured=true&limit=4")
      .then((res) => {
        const data = res.data?.products || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.slice(0, 4));
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      })
      .catch(() => {
        setProducts(MOCK_PRODUCTS);
      });
  }, []);

  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;

  return (
    <section className="dotd-section">
      <div className="dotd-container">
        {/* Header row */}
        <div className="dotd-header">
          <div className="dotd-title-group">
            <span className="dotd-label">&#9889; Limited Time</span>
            <h2 className="dotd-title">Deal of the Day</h2>
          </div>

          <div className="dotd-countdown">
            <div className="dotd-time-box">
              <span className="dotd-time-number">{timeLeft.hh}</span>
              <span className="dotd-time-label">HRS</span>
            </div>
            <span className="dotd-time-sep">:</span>
            <div className="dotd-time-box">
              <span className="dotd-time-number">{timeLeft.mm}</span>
              <span className="dotd-time-label">MIN</span>
            </div>
            <span className="dotd-time-sep">:</span>
            <div className="dotd-time-box">
              <span className="dotd-time-number">{timeLeft.ss}</span>
              <span className="dotd-time-label">SEC</span>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="dotd-grid">
          {displayProducts.map((product) => {
            const discount = discountPercent(product.price, product.mrp);
            const imageUrl =
              product.images && product.images[0] ? product.images[0] : null;

            return (
              <div className="dotd-card" key={product._id}>
                <div className="dotd-image-wrap">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="dotd-image"
                    />
                  ) : (
                    <div className="dotd-image-placeholder">
                      <span className="dotd-placeholder-icon">&#128141;</span>
                    </div>
                  )}
                  {discount !== null && (
                    <span className="dotd-badge">{discount}% OFF</span>
                  )}
                </div>

                <div className="dotd-card-body">
                  <h3 className="dotd-product-name">{product.name}</h3>
                  <div className="dotd-price-row">
                    <span className="dotd-price">
                      &#8377;{product.price?.toLocaleString("en-IN")}
                    </span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="dotd-mrp">
                        &#8377;{product.mrp?.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/products/${product.slug}`}
                    className="dotd-shop-btn"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer link */}
        <div className="dotd-footer">
          <Link to="/sales" className="dotd-view-all">
            View All Deals &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
