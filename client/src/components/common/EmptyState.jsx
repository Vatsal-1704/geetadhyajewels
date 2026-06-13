import React from 'react';
import './EmptyState.css';

export default function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  description = 'This section is empty. Try exploring other areas.',
  action = null,
  variant = 'default'
}) {
  return (
    <div className={`empty-state empty-state-${variant}`}>
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && (
        <button className="empty-state-action">
          {action}
        </button>
      )}
    </div>
  );
}
