import { useEffect } from 'react';

/**
 * PagePerformanceMonitor - Tracks and reports page performance metrics
 * Integrates with Google Analytics and sends custom events
 */
export default function PagePerformanceMonitor({ pageName }) {
  useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_path: window.location.pathname,
        page_location: window.location.href,
      });
    }

    // Measure Core Web Vitals
    if ('web-vital' in window) {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (window.gtag) {
          window.gtag('event', 'LCP', {
            value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
            event_category: 'web_vitals',
            event_label: pageName,
          });
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.debug('LCP observer not supported');
      }

      return () => observer.disconnect();
    }
  }, [pageName]);

  // Track navigation timing
  useEffect(() => {
    const handleLoad = () => {
      const navTiming = performance.getEntriesByType('navigation')[0];
      if (navTiming && window.gtag) {
        window.gtag('event', 'page_load_time', {
          value: Math.round(navTiming.loadEventEnd - navTiming.fetchStart),
          event_category: 'performance',
          event_label: pageName,
        });
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [pageName]);

  return null; // Non-rendering component
}

/**
 * Custom event tracking utility
 */
export function trackEvent(eventName, eventData = {}) {
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
}

/**
 * Track user interactions
 */
export function trackInteraction(action, label, category = 'engagement') {
  trackEvent(action, {
    event_category: category,
    event_label: label,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track e-commerce events
 */
export function trackAddToCart(product) {
  trackEvent('add_to_cart', {
    value: product.price,
    currency: 'INR',
    items: [
      {
        item_id: product._id,
        item_name: product.name,
        price: product.price,
        quantity: 1,
      },
    ],
  });
}

export function trackPurchase(orderData) {
  trackEvent('purchase', {
    transaction_id: orderData.orderId,
    value: orderData.total,
    currency: 'INR',
    tax: orderData.tax || 0,
    shipping: orderData.shipping || 0,
    items: orderData.items?.map(item => ({
      item_id: item.productId,
      item_name: item.productName,
      price: item.price,
      quantity: item.quantity,
    })) || [],
  });
}

export function trackSearch(searchQuery, resultsCount) {
  trackEvent('search', {
    search_term: searchQuery,
    number_of_results: resultsCount,
    event_category: 'engagement',
  });
}
