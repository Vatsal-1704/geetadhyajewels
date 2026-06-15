import React from 'react';
import './Badge.css';

export default function Badge({ label, variant = 'default', size = 'md', icon = null }) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-label">{label}</span>
    </span>
  );
}
