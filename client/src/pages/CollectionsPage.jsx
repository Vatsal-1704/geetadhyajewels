import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";
import ProductCard from "../components/common/ProductCard";
import ProductFilters from "../components/collections/ProductFilters";
import FilterBadges from "../components/collections/FilterBadges";
import SearchBar from "../components/collections/SearchBar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";
import api from "../utils/api";
import "./CollectionsPage.css";

// Popular search suggestions
const POPULAR_SEARCHES = [
  "Necklace",
  "Earrings",
  "Bangles",
  "Rings",
  "Gold Plated",
  "Wedding",
  "Kundan",
  "Oxidised",
];

export default function CollectionsPage() {
  const { slug } = useParams();

  // Filter state
  const [filters, setFilters] = useState({
    sort: "trending",
    styles: [],
    materials: [],
    occasions: [],
    care: "",
    priceMin: "",
    priceMax: "",
  });

  // Search and UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Data state
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Debounce search
  const searchDebounceTimer = useCallback(() => {
    let timer;
    return (query) => {
      clearTimeout(timer);
      setPage(1);
      timer = setTimeout(() => {
        setSearchQuery(query);
        // Generate suggestions based on query
        if (query.length > 0) {
          const matches = POPULAR_SEARCHES.filter(s =>
            s.toLowerCase().includes(query.toLowerCase())
          );
          setSearchSuggestions(matches);
          setShowSearchSuggestions(true);
        } else {
          setSearchSuggestions([]);
        }
      }, 300);
    };
  }, []);

  const debouncedSearch = useMemo(() => searchDebounceTimer(), [searchDebounceTimer]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, searchQuery, slug]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page,
        limit: 12,
        sort: filters.sort,
      });

      if (slug) params.set("category", slug);
      if (searchQuery) params.set("search", searchQuery);
      if (filters.styles?.length) params.set("styles", filters.styles.join(","));
      if (filters.materials?.length) params.set("materials", filters.materials.join(","));
      if (filters.occasions?.length) params.set("occasions", filters.occasions.join(","));
      if (filters.care) params.set("care", filters.care);
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setFilters({
      sort: "trending",
      styles: [],
      materials: [],
      occasions: [],
      care: "",
      priceMin: "",
      priceMax: "",
    });
    setSearchQuery("");
    setPage(1);
  };

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
            <span className="capitalize">{slug.replace(/-/g, " ")}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="collections-header">
        <div>
          <h1 className="collections-title">
            {slug ? slug.replace(/-/g, " ").charAt(0).toUpperCase() + slug.replace(/-/g, " ").slice(1) : "All Collections"}
          </h1>
          <p className="collections-subtitle">{total} products available</p>
        </div>
        <button onClick={() => setFiltersOpen(true)} className="collections-filter-button">
          <FiFilter size={16} /> Filters
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={debouncedSearch}
        suggestions={searchSuggestions}
        onSuggestionClick={(suggestion) => {
          setSearchQuery(suggestion);
          setShowSearchSuggestions(false);
        }}
      />

      {/* Active Filters Badges */}
      {(filters.styles?.length > 0 ||
        filters.materials?.length > 0 ||
        filters.occasions?.length > 0 ||
        filters.care ||
        filters.priceMin) && (
        <FilterBadges
          filters={filters}
          onRemoveFilter={setFilters}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="collections-error">
          <p>{error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      )}

      {/* Main Content */}
      <div className="collections-container">
        {/* Desktop Sidebar */}
        <aside className="collections-sidebar">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
            isMobile={false}
          />
        </aside>

        {/* Products Grid */}
        <div className="collections-products">
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} type="product-card" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon="◆"
              title="No Products Found"
              description={
                searchQuery
                  ? `We couldn't find any jewellery matching "${searchQuery}".`
                  : "Try adjusting your filters or search terms."
              }
              action="Clear Filters"
              variant="default"
            />
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {total > 12 && (
                <div className="collections-pagination">
                  {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`pagination-button ${page === i + 1 ? "active" : ""}`}
                      aria-label={`Go to page ${i + 1}`}
                      aria-current={page === i + 1 ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <>
          <div
            className="collections-filter-drawer-overlay"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="collections-filter-drawer">
            <div className="collections-filter-drawer-header">
              <h3>Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="collections-filter-drawer-close"
                aria-label="Close filters"
              >
                <FiX size={20} />
              </button>
            </div>
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              isMobile={true}
            />
            <button
              onClick={() => setFiltersOpen(false)}
              className="collections-apply-button"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
