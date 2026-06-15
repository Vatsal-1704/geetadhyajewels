import React, { useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search jewellery, styles, occasions...',
  suggestions = [],
  onSuggestionClick,
  isLoading = false,
}) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onSuggestionClick?.(suggestion);
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <div className="search-bar">
        <FiSearch className="search-bar-icon" size={18} />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-bar-input"
        />
        {isLoading && <div className="search-bar-loading" />}
        {value && !isLoading && (
          <button
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
            }}
            className="search-bar-clear"
            aria-label="Clear search"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="search-suggestion-item"
            >
              <FiSearch size={14} />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && value && suggestions.length === 0 && !isLoading && (
        <div className="search-no-results">
          <p>No suggestions found</p>
        </div>
      )}
    </div>
  );
}
