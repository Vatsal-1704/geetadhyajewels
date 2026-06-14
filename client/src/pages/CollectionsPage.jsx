import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import ProductCard from "../components/common/ProductCard";
import api from "../utils/api";
import "./CollectionsPage.css";

const CATEGORY_META = {
  "necklaces":      { emoji: "📿", desc: "Chains, pendants & statement sets for every look" },
  "earrings":       { emoji: "✨", desc: "Studs, hoops, jhumkas & drops for every occasion" },
  "bangles":        { emoji: "⭕", desc: "Ethnic & modern bangles in every style & finish" },
  "rings":          { emoji: "💍", desc: "Statement rings & everyday elegance" },
  "anklets":        { emoji: "🌸", desc: "Delicate & bold anklet designs for every vibe" },
  "bridal-sets":    { emoji: "👑", desc: "Complete bridal jewellery for your special day" },
  "hair-jewellery": { emoji: "🌺", desc: "Maang tikkas, juda pins, clips & more" },
  "bracelets":      { emoji: "💎", desc: "Charm bracelets, cuffs & chain sets" },
};

const CATEGORY_CHIPS = {
  "necklaces":      ["Chains", "Pendants", "Sets", "Chokers", "Layered"],
  "earrings":       ["Studs", "Hoops", "Jhumkas", "Drops", "Chandbalis"],
  "bangles":        ["Kadas", "Sets", "Cuffs", "Oxidised", "Gold Plated"],
  "rings":          ["Statement", "Stackable", "Adjustable", "Midi", "Cocktail"],
  "anklets":        ["Beaded", "Chain", "Charms", "Payals", "Bold"],
  "bridal-sets":    ["Necklace Sets", "Full Bridal", "Layered", "Matha Patti"],
  "hair-jewellery": ["Maang Tikka", "Juda Pins", "Hair Clips", "Passa"],
  "bracelets":      ["Charm", "Chain", "Cuffs", "Sets", "Beaded"],
};

const STYLES = ["Gold Plated", "Oxidised", "Kundan", "American Diamond", "Temple", "Silver Plated"];
const SORT_OPTIONS = [
  { label: "Trending", value: "trending" },
  { label: "Popularity", value: "popularity" },
  { label: "Newest First", value: "newest" },
  { label: "Top Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];
const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500–₹1000", min: 500, max: 1000 },
  { label: "₹1000–₹2000", min: 1000, max: 2000 },
  { label: "Above ₹2000", min: 2000, max: 99999 },
];

export default function CollectionsPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState({
    style: searchParams.get("style") || "",
    sort: "newest",
    priceMin: searchParams.get("minPrice") || "",
    priceMax: searchParams.get("maxPrice") || "",
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ style: true, price: true });

  const searchDebounceRef = useCallback((query) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters.style, filters.priceMin, filters.priceMax, filters.sort, slug, searchQuery]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page, limit: 12, sort: filters.sort });
      if (slug) params.set("category", slug);
      if (searchQuery) params.set("search", searchQuery);
      if (filters.style) params.set("style", filters.style);
      if (filters.priceMin) params.set("minPrice", filters.priceMin);
      if (filters.priceMax) params.set("maxPrice", filters.priceMax);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, page, filters, searchQuery]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleSection = (s) => setOpenSections(p => ({ ...p, [s]: !p[s] }));
  const applyStyle = (style) => setFilters(p => ({ ...p, style: p.style === style ? "" : style }));
  const applyPrice = (range) => setFilters(p => ({ ...p, priceMin: String(range.min), priceMax: String(range.max) }));
  const clearFilters = () => setFilters({ style: "", sort: "newest", priceMin: "", priceMax: "" });

  const Sidebar = () => (
    <aside className="collections-sidebar">
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
      <div className="filter-section">
        <button onClick={() => toggleSection("style")} className="filter-section-title">
          Style {openSections.style ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
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
      <div className="filter-section">
        <button onClick={() => toggleSection("price")} className="filter-section-title">
          Price {openSections.price ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.price && (
          <div>
            <div className="price-range-row">
              <input type="number" placeholder="Min ₹" min="0" value={filters.priceMin} onChange={e => setFilters(p => ({ ...p, priceMin: e.target.value }))} className="price-range-input" />
              <span className="price-range-sep">—</span>
              <input type="number" placeholder="Max ₹" min="0" value={filters.priceMax} onChange={e => setFilters(p => ({ ...p, priceMax: e.target.value }))} className="price-range-input" />
            </div>
            <div className="price-presets">
              {PRICE_RANGES.map(r => (
                <button
                  key={r.label}
                  onClick={() => applyPrice(r)}
                  className={`price-preset-btn${filters.priceMin === String(r.min) && filters.priceMax === String(r.max) ? " active" : ""}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
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
        {slug && (
          <>
            <span>/</span>
            <span className="capitalize" style={{ color: "var(--color-text-primary)" }}>
              {slug.replace(/-/g, " ")}
            </span>
          </>
        )}
      </nav>

      {/* Header / Category Banner */}
      {slug ? (
        <div className="category-banner">
          <div className="category-banner-inner">
            <div className="category-banner-left">
              <span className="category-banner-emoji">{CATEGORY_META[slug]?.emoji || "💎"}</span>
              <div>
                <h1 className="category-banner-title">
                  {slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </h1>
                <p className="category-banner-desc">
                  {CATEGORY_META[slug]?.desc || "Explore our exclusive collection"}
                </p>
                <p className="category-banner-count">{total} products</p>
              </div>
            </div>
            <button onClick={() => setFiltersOpen(true)} className="collections-filter-button">
              <FiFilter size={16} /> Filters
            </button>
          </div>
          {CATEGORY_CHIPS[slug] && (
            <div className="category-chips-strip">
              {CATEGORY_CHIPS[slug].map(chip => (
                <button
                  key={chip}
                  className={`category-chip${filters.style === chip ? " active" : ""}`}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    style: prev.style === chip ? "" : chip,
                  }))}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="collections-header">
          <h1 className="collections-title">{filters.style || "All Collections"}</h1>
          <div className="collections-header-controls">
            <span className="collections-product-count">{total} products</span>
            <button onClick={() => setFiltersOpen(true)} className="collections-filter-button">
              <FiFilter size={14} /> Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="collections-search-bar">
        <FiSearch size={18} className="collections-search-icon" />
        <input
          type="text"
          placeholder="Search jewellery, styles, occasions..."
          value={searchQuery}
          onChange={(e) => searchDebounceRef(e.target.value)}
          className="collections-search-input"
        />
        {searchQuery && (
          <button onClick={() => searchDebounceRef("")} className="collections-search-clear">
            <FiX size={16} />
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: "var(--space-4)", backgroundColor: "rgba(224,92,92,0.1)", borderLeft: "4px solid var(--color-error)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-4)" }}>
          <p style={{ color: "var(--color-error)", fontSize: "var(--text-sm)", margin: 0 }}>{error}</p>
        </div>
      )}

      <div className="collections-container">
        <Sidebar />
        <div className="collections-products">
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="product-skeleton">
                  <div className="product-skeleton-image" />
                  <div className="product-skeleton-content">
                    <div className="product-skeleton-line" />
                    <div className="product-skeleton-line" style={{ width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="collections-empty-state">
              <div className="collections-empty-icon">◆</div>
              <h3 className="collections-empty-title">No Products Found</h3>
              <p className="collections-empty-message">
                {searchQuery
                  ? `We couldn't find any jewellery matching "${searchQuery}".`
                  : "Try adjusting your filters or search terms."}
              </p>
              <button onClick={() => { searchDebounceRef(""); clearFilters(); }} className="collections-empty-button">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {total > 12 && (
                <div className="pagination">
                  {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`pagination-button ${page === i + 1 ? "active" : ""}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <>
          <div className="collections-filter-drawer-overlay" onClick={() => setFiltersOpen(false)} />
          <div className="collections-filter-drawer">
            <div className="collections-filter-drawer-header">
              <h3>Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="collections-filter-drawer-close">
                <FiX size={20} />
              </button>
            </div>
            <Sidebar />
            <button onClick={() => setFiltersOpen(false)} className="collections-apply-button">Apply Filters</button>
          </div>
        </>
      )}
    </div>
  );
}
