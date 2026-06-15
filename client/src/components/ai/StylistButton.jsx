import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import './StylistButton.css';

export default function StylistButton({ onClick, variant = 'floating' }) {
  if (variant === 'header') {
    return (
      <button
        onClick={onClick}
        className="stylist-button stylist-button-header"
        title="Open Style Assistant"
        aria-label="Open AI Style Assistant"
      >
        <FiMessageSquare size={20} />
        <span className="stylist-button-text">Style Assistant</span>
      </button>
    );
  }

  // Floating button variant (default)
  return (
    <button
      onClick={onClick}
      className="stylist-button stylist-button-floating"
      title="Chat with Style Assistant"
      aria-label="Chat with AI Style Assistant"
    >
      <FiMessageSquare size={24} />
      <span className="stylist-button-label">Ask Style</span>
    </button>
  );
}
