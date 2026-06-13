import React from 'react';
import { FiX } from 'react-icons/fi';
import './FilterBadges.css';

export default function FilterBadges({ filters, onRemoveFilter }) {
  const activeBadges = [];

  // Add price filter
  if (filters.priceMin && filters.priceMax) {
    const min = parseInt(filters.priceMin);
    const max = parseInt(filters.priceMax);
    if (max === 99999) {
      activeBadges.push({
        id: 'price',
        label: `₹${min}+`,
        onRemove: () => onRemoveFilter({ ...filters, priceMin: '', priceMax: '' }),
      });
    } else {
      activeBadges.push({
        id: 'price',
        label: `₹${min}–${max}`,
        onRemove: () => onRemoveFilter({ ...filters, priceMin: '', priceMax: '' }),
      });
    }
  }

  // Add style filters
  (filters.styles || []).forEach(style => {
    activeBadges.push({
      id: `style-${style}`,
      label: style,
      onRemove: () => {
        const updated = (filters.styles || []).filter(s => s !== style);
        onRemoveFilter({ ...filters, styles: updated.length > 0 ? updated : filters.styles });
      },
    });
  });

  // Add material filters
  (filters.materials || []).forEach(material => {
    activeBadges.push({
      id: `material-${material}`,
      label: material,
      onRemove: () => {
        const updated = (filters.materials || []).filter(m => m !== material);
        onRemoveFilter({ ...filters, materials: updated.length > 0 ? updated : filters.materials });
      },
    });
  });

  // Add occasion filters
  (filters.occasions || []).forEach(occasion => {
    activeBadges.push({
      id: `occasion-${occasion}`,
      label: occasion,
      onRemove: () => {
        const updated = (filters.occasions || []).filter(o => o !== occasion);
        onRemoveFilter({ ...filters, occasions: updated.length > 0 ? updated : filters.occasions });
      },
    });
  });

  // Add care level filter
  if (filters.care) {
    const careLabel = {
      easy: 'Easy Care',
      regular: 'Regular Care',
      special: 'Special Care',
    }[filters.care];
    activeBadges.push({
      id: 'care',
      label: careLabel,
      onRemove: () => onRemoveFilter({ ...filters, care: '' }),
    });
  }

  if (activeBadges.length === 0) return null;

  return (
    <div className="filter-badges">
      <span className="filter-badges-label">Active Filters:</span>
      <div className="filter-badges-list">
        {activeBadges.map(badge => (
          <button
            key={badge.id}
            className="filter-badge"
            onClick={badge.onRemove}
            title="Remove filter"
          >
            <span>{badge.label}</span>
            <FiX size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}
