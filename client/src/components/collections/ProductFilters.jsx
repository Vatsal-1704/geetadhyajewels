import React from 'react';
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import './ProductFilters.css';

const SORT_OPTIONS = [
  { label: 'Trending', value: 'trending' },
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500–₹1000', min: 500, max: 1000 },
  { label: '₹1000–₹2000', min: 1000, max: 2000 },
  { label: 'Above ₹2000', min: 2000, max: 99999 },
];

const STYLES = [
  'Gold Plated',
  'Oxidised',
  'Kundan',
  'American Diamond',
  'Temple',
  'Silver Plated',
];

const MATERIALS = [
  'Brass',
  '316L Stainless Steel',
  'Alloy',
  'Sterling Silver',
  'Gold Plated',
];

const OCCASIONS = [
  'Casual',
  'Festive',
  'Wedding',
  'Party',
  'Office',
  'Bridal',
];

const CARE_LEVELS = [
  { label: 'Easy Care', value: 'easy' },
  { label: 'Regular Care', value: 'regular' },
  { label: 'Special Care', value: 'special' },
];

export default function ProductFilters({ filters, onFilterChange, onClearFilters, isMobile = false }) {
  const [openSections, setOpenSections] = React.useState({
    sort: true,
    style: true,
    price: true,
    material: false,
    occasion: false,
    care: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = filters.styles?.length > 0 ||
    filters.materials?.length > 0 ||
    filters.occasions?.length > 0 ||
    filters.care ||
    (filters.priceMin && filters.priceMax);

  const handleStyleChange = (style) => {
    const styles = filters.styles || [];
    const updated = styles.includes(style)
      ? styles.filter(s => s !== style)
      : [...styles, style];
    onFilterChange({ ...filters, styles: updated });
  };

  const handleMaterialChange = (material) => {
    const materials = filters.materials || [];
    const updated = materials.includes(material)
      ? materials.filter(m => m !== material)
      : [...materials, material];
    onFilterChange({ ...filters, materials: updated });
  };

  const handleOccasionChange = (occasion) => {
    const occasions = filters.occasions || [];
    const updated = occasions.includes(occasion)
      ? occasions.filter(o => o !== occasion)
      : [...occasions, occasion];
    onFilterChange({ ...filters, occasions: updated });
  };

  return (
    <div className={`product-filters ${isMobile ? 'mobile' : ''}`}>
      {/* Sort */}
      <div className="filter-section">
        <button
          onClick={() => toggleSection('sort')}
          className="filter-section-title"
        >
          Sort By
          {openSections.sort ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.sort && (
          <div className="filter-options">
            {SORT_OPTIONS.map(option => (
              <label key={option.value} className="filter-option">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={filters.sort === option.value}
                  onChange={() => onFilterChange({ ...filters, sort: option.value })}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="filter-section">
        <button
          onClick={() => toggleSection('price')}
          className="filter-section-title"
        >
          Price
          {openSections.price ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.price && (
          <div className="filter-options">
            {PRICE_RANGES.map(range => (
              <label key={range.label} className="filter-option">
                <input
                  type="radio"
                  name="price"
                  checked={filters.priceMin === String(range.min) && filters.priceMax === String(range.max)}
                  onChange={() =>
                    onFilterChange({
                      ...filters,
                      priceMin: String(range.min),
                      priceMax: String(range.max),
                    })
                  }
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Style */}
      <div className="filter-section">
        <button
          onClick={() => toggleSection('style')}
          className="filter-section-title"
        >
          Style
          {openSections.style ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.style && (
          <div className="filter-options">
            {STYLES.map(style => (
              <label key={style} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters.styles || []).includes(style)}
                  onChange={() => handleStyleChange(style)}
                />
                <span>{style}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material */}
      <div className="filter-section">
        <button
          onClick={() => toggleSection('material')}
          className="filter-section-title"
        >
          Material
          {openSections.material ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.material && (
          <div className="filter-options">
            {MATERIALS.map(material => (
              <label key={material} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters.materials || []).includes(material)}
                  onChange={() => handleMaterialChange(material)}
                />
                <span>{material}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Occasion */}
      <div className="filter-section">
        <button
          onClick={() => toggleSection('occasion')}
          className="filter-section-title"
        >
          Occasion
          {openSections.occasion ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.occasion && (
          <div className="filter-options">
            {OCCASIONS.map(occasion => (
              <label key={occasion} className="filter-option">
                <input
                  type="checkbox"
                  checked={(filters.occasions || []).includes(occasion)}
                  onChange={() => handleOccasionChange(occasion)}
                />
                <span>{occasion}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Care Level */}
      <div className="filter-section">
        <button
          onClick={() => toggleSection('care')}
          className="filter-section-title"
        >
          Care Level
          {openSections.care ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {openSections.care && (
          <div className="filter-options">
            {CARE_LEVELS.map(level => (
              <label key={level.value} className="filter-option">
                <input
                  type="radio"
                  name="care"
                  checked={filters.care === level.value}
                  onChange={() => onFilterChange({ ...filters, care: level.value })}
                />
                <span>{level.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button onClick={onClearFilters} className="filter-clear-button">
          <FiX size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );
}
