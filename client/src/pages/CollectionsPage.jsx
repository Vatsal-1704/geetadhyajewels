import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ProductCard from "../components/common/ProductCard";
import api from "../utils/api";

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
      const params = new URLSearchParams({ page, limit: 12, sort: filters.sort });
      if (slug) params.set("category", slug);
      if (filters.style) params.set("style", filters.style);
      if (filters.priceMin) params.set("minPrice", filters.priceMin);
      if (filters.priceMax) params.set("maxPrice", filters.priceMax);
      const { data } = await api.get(`/products?${params}`);
      if (data.products?.length) { setProducts(data.products); setTotal(data.total); }
    } catch (err) { console.error("Fetch error:", err); } finally { setLoading(false); }
  }, [slug, page, filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleSection = (s) => setOpenSections(p => ({ ...p, [s]: !p[s] }));
  const applyStyle = (style) => setFilters(p => ({ ...p, style: p.style === style ? "" : style }));
  const applyPrice = (range) => setFilters(p => ({ ...p, priceMin: String(range.min), priceMax: String(range.max) }));
  const clearFilters = () => setFilters({ style: "", sort: "newest", priceMin: "", priceMax: "" });

  const Sidebar = () => (
    <aside className="space-y-6 min-w-[220px]">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-widest text-gray-500 mb-3">Sort By</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map(o => (
            <label key={o.value} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="sort" value={o.value} checked={filters.sort === o.value} onChange={() => setFilters(p => ({ ...p, sort: o.value }))} className="accent-brand-gold" />
              <span className="text-sm">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Style */}
      <div>
        <button onClick={() => toggleSection("style")} className="w-full flex justify-between items-center font-semibold text-sm uppercase tracking-widest text-gray-500 mb-3">Style {openSections.style ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}</button>
        {openSections.style && (
          <div className="space-y-2">
            {STYLES.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filters.style === s} onChange={() => applyStyle(s)} className="accent-brand-gold" />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {/* Price */}
      <div>
        <button onClick={() => toggleSection("price")} className="w-full flex justify-between items-center font-semibold text-sm uppercase tracking-widest text-gray-500 mb-3">Price {openSections.price ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}</button>
        {openSections.price && (
          <div className="space-y-2">
            {PRICE_RANGES.map(r => (
              <label key={r.label} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="price" checked={filters.priceMin === String(r.min) && filters.priceMax === String(r.max)} onChange={() => applyPrice(r)} className="accent-brand-gold" />
                <span className="text-sm">{r.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {(filters.style || filters.priceMin) && (
        <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">✕ Clear All Filters</button>
      )}
    </aside>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
        <Link to="/" className="hover:text-brand-gold">Home</Link>
        <span>/</span>
        <Link to="/collections" className="hover:text-brand-gold">Collections</Link>
        {slug && <><span>/</span><span className="capitalize text-brand-black">{slug.replace(/-/g, " ")}</span></>}
      </nav>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl text-brand-black capitalize">{slug ? slug.replace(/-/g, " ") : "All Collections"}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{total} products</span>
          <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block"><Sidebar /></div>
        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {loading ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                <div className="p-3 space-y-2"><div className="h-4 bg-gray-100 rounded animate-pulse" /><div className="h-8 bg-gray-100 rounded animate-pulse" /></div>
              </div>
            )) : products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          {total > 12 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-full text-sm font-medium ${page === i + 1 ? "bg-brand-gold text-white" : "border border-gray-300 hover:border-brand-gold"}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}><FiX size={20} /></button>
            </div>
            <Sidebar />
            <button onClick={() => setFiltersOpen(false)} className="w-full mt-6 bg-brand-gold text-white py-3 rounded-xl font-medium">Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
}
