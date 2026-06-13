import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './NotificationBanner.css';

export default function NotificationBanner({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  action
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className={`notification-banner notification-banner-${type}`}>
      <div className="notification-banner-content">
        <span className="notification-banner-icon">{icons[type]}</span>
        <p className="notification-banner-message">{message}</p>
        {action && (
          <button className="notification-banner-action">
            {action}
          </button>
        )}
      </div>
      <button
        onClick={handleClose}
        className="notification-banner-close"
        aria-label="Close notification"
      >
        <FiX size={18} />
      </button>
    </div>
  );
}
