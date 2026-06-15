import React from 'react';
import './TrustBadges.css';

const badges = [
  {
    icon: '💧',
    title: '100% Waterproof',
    subtitle: 'Safe in shower & swimming',
    color: 'trust-green'
  },
  {
    icon: '✨',
    title: 'Anti-Tarnish Guarantee',
    subtitle: '316L Stainless Steel core',
    color: 'trust-green'
  },
  {
    icon: '🌿',
    title: 'Hypoallergenic',
    subtitle: 'Lead-free, nickel-free, skin-friendly',
    color: 'trust-green'
  },
  {
    icon: '♻️',
    title: 'Eco-Conscious',
    subtitle: 'Sustainable sourcing',
    color: 'trust-green'
  },
];

export default function TrustBadges() {
  return (
    <div className="trust-badges-grid">
      {badges.map((badge, idx) => (
        <div key={idx} className={`trust-badge ${badge.color}`}>
          <div className="trust-badge-icon">{badge.icon}</div>
          <h4 className="trust-badge-title">{badge.title}</h4>
          <p className="trust-badge-subtitle">{badge.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
