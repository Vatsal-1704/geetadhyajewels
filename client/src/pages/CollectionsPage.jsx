import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ProductCard from "../components/common/ProductCard";
import api from "../utils/api";
import "./CollectionsPage.css";

const STYLES = ["Gold Plated", "Oxidised", "Kundan", "American Diamond", "Temple", "Silver Plated"];
const SORT_OPTIONS = [{ label: "Newest First", value: "newest" }, { label: "Price: Low to High", value: "price-asc" }, { label: "Price: High to Low", value: "price-desc" }, { label: "Top Rated", value: "rating" }];
const PRICE_RANGES = [{ label: "Under ₹500", min: 0, max: 500 }, { label: "₹500–₹1000", min: 500, max: 1000 }, { label: "₹1000–₹2000", min: 1000, max: 2000 }, { label: "Above ₹2000", min: 2000, max: 99999 }];

const MOCK_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  _id: `mock-${i}`, slug: `product-${i + 1}`, name: ["Kundan Necklace", "Pearl Earrings", "Oxidised Bangle", "Temple Ring", "Bridal Choker", "AD Tikka", "Gold Anklet", "Ethnic Jhumka", "Silver Bracelet", "Floral Maang Tikka", "Layered Necklace", "Emerald Earrings"][i],
  price: [999, 599, 799, 449, 2499, 1299, 399, 699, 549, 899, 1199, 749][i],
  mrp: [1499, 899, 1199, 699, 3999, 1999, 599, 999, 799, 1299, 1799, 1099][i], discount: 30,
  images: ["https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png"], rating: 4 + Math.random(),
}));

export default function CollectionsPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [total, setTotal] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ style: searchParams.get("style") || "", sort: "newest", priceMin: "", priceMax: "" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ style: true, price: true });

  // Reset page to 1 when filters change (but not when page changes)
  useEffect(() => {
    setPage(1);
  }, [filters.style, filters.priceMin, filters.priceMax, filters.sort, slug]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page, limit: 12, sort: filters.sort });
      if (slug) params.set("category", slug);
      if (filters.style) params.set("style", filters.style);
      if (filters.priceMin) params.set("minPrice", filters.priceMin);
      if (filters.priceMax) params.set("maxPrice", filters.priceMax);
      const { data } = await api.get(`/products?${params}`);
      if (data.products?.length) { setProducts(data.products); setTotal(data.total); }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load products. Using cached data.");
    } finally {
      setLoading(false);
    }
  }, [slug, page, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleSection = (s) => setOpenSections(p => ({ ...p, [s]: !p[s] }));
  const applyStyle = (style) => setFilters(p => ({ ...p, style: p.style === style ? "" : style }));
  const applyPrice = (range) => setFilters(p => ({ ...p, priceMin: String(range.min), priceMax: String(range.max) }));
  const clearFilters = () => setFilters({ style: "", sort: "newest", priceMin: "", priceMax: "" });

  const Sidebar = () => (
    <aside className="collections-sidebar">
      {/* Sort */}
      <div className="filter-section">
        <h3 className="filter-section-title">Sort By</h3>
        <div className="filter-options">
          {SORT_OPTIONS.map(o => (
            <label key={o.value} className="filter-option">
              <input type="radio" name="sort" value={o.value} checked={filters.sort === o.value} onChange={() => setFilters(p => ({ ...p, sort: o.value }))} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Style */}
      <div className="filter-section">
        <button onClick={() => toggleSection("style")} className="filter-section-title">Style {openSections.style ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}</button>
        {openSections.style && (
          <div className="filter-options">
            {STYLES.map(s => (
              <label key={s} className="filter-option">
                <input type="checkbox" checked={filters.style === s} onChange={() => applyStyle(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Price */}
      <div className="filter-section">
        <button onClick={() => toggleSection("price")} className="filter-section-title">Price {openSections.price ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}</button>
        {openSections.price && (
          <div className="filter-options">
            {PRICE_RANGES.map(r => (
              <label key={r.label} className="filter-option">
                <input type="radio" name="price" checked={filters.priceMin === String(r.min) && filters.priceMax === String(r.max)} onChange={() => applyPrice(r)} />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {(filters.style || filters.priceMin) && (
        <button onClick={clearFilters} className="filter-clear-button">✕ Clear All Filters</button>
      )}
    </aside>
  );

  return (
    <div className="collections-page">
      {/* Breadcrumb */}
      <nav className="collections-breadcrumb">
        <Link to="/" className="collections-breadcrumb-link">Home</Link>
        <span>/</span>
        <Link to="/collections" className="collections-breadcrumb-link">Collections</Link>
        {slug && <><span>/</span><span className="capitalize" style={{ color: "var(--color-text-primary)" }}>{slug.replace(/-/g, " ")}</span></>}
      </nav>
      <div className="collections-header">
        <h1 className="collections-title">{slug ? slug.replace(/-/g, " ") : "All Collections"}</h1>
        <div className="collections-header-controls">
          <span className="collections-product-count">{total} products</span>
          <button onClick={() => setFiltersOpen(true)} className="collections-filter-button">
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "var(--space-4)", backgroundColor: "#fef3c7", borderLeft: "4px solid #f59e0b", borderRadius: "var(--rounded-lg)", margin: "0 var(--space-4) var(--space-4)" }}>
          <p style={{ color: "#92400e", fontSize: "var(--text-sm)" }}>{error}</p>
        </div>
      )}
      <div className="collections-container">
        {/* Desktop Sidebar */}
        <Sidebar />
        {/* Products Grid */}
        <div className="collections-products">
          <div className="products-grid">
            {loading ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="product-skeleton">
                <div className="product-skeleton-image" />
                <div className="product-skeleton-content"><div className="product-skeleton-line" /><div className="product-skeleton-line" style={{ width: "60%" }} /></div>
              </div>
            )) : products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          {total > 12 && (
            <div className="pagination">
              {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`pagination-button ${page === i + 1 ? "active" : ""}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <>
          <div className="collections-filter-drawer-overlay" onClick={() => setFiltersOpen(false)} />
          <div className="collections-filter-drawer">
            <div className="collections-filter-drawer-header">
              <h3>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="collections-filter-drawer-close"><FiX size={20} /></button>
            </div>
            <Sidebar />
            <button onClick={() => setFiltersOpen(false)} className="collections-apply-button">Apply Filters</button>
          </div>
        </>
      )}
    </div>
  );
}
