import React from 'react';
import './Skeleton.css';

export default function Skeleton({ type = 'text', width = '100%', height = '16px', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'product-card') {
    return (
      <div className="skeleton-product-card">
        <div className="skeleton-product-image skeleton"></div>
        <div className="skeleton-product-content">
          <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '8px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '14px', width: '80%', marginBottom: '12px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '18px', width: '60%' }}></div>
        </div>
      </div>
    );
  }

  if (type === 'product-detail') {
    return (
      <div className="skeleton-product-detail">
        <div className="skeleton-detail-image skeleton"></div>
        <div className="skeleton-detail-content">
          <div className="skeleton skeleton-text" style={{ height: '28px', marginBottom: '16px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '20px', width: '30%', marginBottom: '24px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '8px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', marginBottom: '8px' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '16px', width: '60%', marginBottom: '24px' }}></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-${type}`}
          style={{ width, height, marginBottom: i < count - 1 ? '12px' : '0' }}
        ></div>
      ))}
    </>
  );
}
