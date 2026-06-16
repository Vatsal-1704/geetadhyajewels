import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import "./HomeSearch.css";

const QUICK_LINKS = [
  { label: "Necklaces", slug: "necklaces" },
  { label: "Earrings", slug: "earrings" },
  { label: "Bangles", slug: "bangles" },
  { label: "Rings", slug: "rings" },
  { label: "Bridal Sets", slug: "bridal-sets" },
  { label: "Anklets", slug: "anklets" },
];

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="home-search">
      <div className="home-search__inner">
        <form className="home-search__form" onSubmit={handleSubmit}>
          <span className="home-search__icon"><FiSearch size={20} /></span>
          <input
            className="home-search__input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jewellery, occasions, styles…"
            aria-label="Search products"
          />
          <button type="submit" className="home-search__btn">Search</button>
        </form>
        <div className="home-search__quick">
          <span className="home-search__quick-label">Popular:</span>
          {QUICK_LINKS.map((l) => (
            <button
              key={l.slug}
              className="home-search__chip"
              onClick={() => navigate(`/collections/${l.slug}`)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
