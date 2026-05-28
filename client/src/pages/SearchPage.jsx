import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ProductCard from "../components/common/ProductCard";
import api from "../utils/api";

const STYLES = ["Gold Plated", "Oxidised", "Kundan", "American Diamond", "Temple", "Silver Plated"];
const PRICE_RANGES = [{ label: "Under ₹500", min: 0, max: 500 }, { label: "₹500–₹1000", min: 500, max: 1000 }, { label: "₹1000–₹2000", min: 1000, max: 2000 }, { label: "Above ₹2000", min: 2000, max: 99999 }];
const SORT_OPTIONS = [{ label: "Newest First", value: "newest" }, { label: "Price: Low to High", value: "price-asc" }, { label: "Price: High to Low", value: "price-desc" }, { label: "Top Rated", value: "rating" }];

const MOCK = Array.from({ length: 4 }, (_, i) => ({
  _id: `s${i}`, slug: `product-${i}`, name: ["Kundan Set", "Pearl Earrings", "Gold Bangle", "Temple Ring"][i],
  price: [1299, 699, 899, 499][i], mrp: [1999, 999, 1299, 799][i], discount: 30,
  images: ["https://rubans.in/cdn/shop/files/website_banner_f959ab62-9b47-43fd-8931-81ab5c11dae3.png"],
}));

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState(query);
  const [filters, setFilters] = useState({ style: "", sort: "newest", priceMin: "", priceMax: "" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ style: true, price: true });

  useEffect(() => {
    setInputVal(query);
    if (!query) { setProducts([]); return; }
    const search = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ search: query, limit: 20, sort: filters.sort });
        if (filters.style) params.set("style", filters.style);
        if (filters.priceMin) params.set("minPrice", filters.priceMin);
        if (filters.priceMax) params.set("maxPrice", filters.priceMax);
        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products?.length ? data.products : MOCK);
      } catch (err) { console.error("Search error:", err); setProducts(MOCK); } finally { setLoading(false); }
    };
    search();
  }, [query, filters]);

  const handleSearch = (e) => { e.preventDefault(); setSearchParams({ q: inputVal }); };

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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-2xl mx-auto">
        <div className="flex-1 flex items-center gap-2 border-2 border-brand-gold/40 rounded-xl px-4 focus-within:border-brand-gold transition-colors">
          <FiSearch className="text-brand-gold" size={18} />
          <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Search jewellery, styles, occasions..." className="flex-1 py-3 outline-none bg-transparent text-sm" autoFocus />
        </div>
        <button type="submit" className="bg-brand-gold text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-gold-dark transition-colors">Search</button>
      </form>

      {!query && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-serif text-2xl text-brand-black mb-2">What are you looking for?</h2>
          <p className="text-gray-500">Search for necklaces, earrings, bridal sets and more</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {["Kundan", "Bridal Set", "Earrings", "Gold Plated", "Oxidised"].map(s => (
              <button key={s} onClick={() => setSearchParams({ q: s })} className="border border-brand-gold/40 text-brand-black px-4 py-1.5 rounded-full text-sm hover:bg-brand-gold hover:text-white transition-all">{s}</button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{loading ? "Searching..." : `${products.length} results for "${query}"`}</p>
            <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <FiFilter size={14} /> Filters
            </button>
          </div>

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="font-serif text-2xl text-brand-black mb-2">No results found</h2>
              <p className="text-gray-500 mb-4">We couldn't find anything matching "{query}"</p>
              <p className="text-sm text-gray-400">Try searching for: Kundan, Earrings, Bangles, Bridal</p>
            </div>
          )}

          {products.length > 0 && (
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
              </div>
            </div>
          )}
        </>
      )}

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
