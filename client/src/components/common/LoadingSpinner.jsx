import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const spinner = (
    <div className={`loading-spinner loading-spinner-${size}`}>
      <div className="spinner-circle"></div>
      <div className="spinner-circle"></div>
      <div className="spinner-circle"></div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="loading-fullpage-overlay"></div>
        <div className="loading-fullpage-content">
          {spinner}
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
