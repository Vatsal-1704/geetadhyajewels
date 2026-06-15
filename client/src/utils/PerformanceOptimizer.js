/**
 * Performance Optimizer - Utilities for improving app performance
 */

/**
 * Lazy load images using Intersection Observer
 */
export function setupLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    return; // Fallback for older browsers
  }

  const imageElements = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px',
  });

  imageElements.forEach(img => imageObserver.observe(img));

  return imageObserver;
}

/**
 * Prefetch critical resources
 */
export function prefetchCriticalResources() {
  const criticalUrls = [
    '/api/products?limit=12',
    '/api/categories',
  ];

  criticalUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Preload fonts for better performance
 */
export function preloadFonts() {
  const fonts = [
    { url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap', rel: 'stylesheet' },
    { url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap', rel: 'stylesheet' },
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = font.rel;
    link.href = font.url;
    if (font.rel === 'preload') {
      link.as = 'style';
    }
    document.head.appendChild(link);
  });
}

/**
 * Debounce function for expensive operations
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for frequent operations
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure function execution time
 */
export function measurePerformance(label, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (process.env.NODE_ENV === 'development') {
    console.log(`${label} took ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Request idle callback with fallback
 */
export function scheduleIdleTask(callback) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback);
  }
  // Fallback for browsers that don't support requestIdleCallback
  return setTimeout(callback, 1);
}

/**
 * Optimize bundle splitting
 */
export const lazyLoadComponent = (importFunc) => {
  return lazy(() =>
    importFunc().catch(err => {
      console.error('Failed to load component:', err);
      // Return a fallback component or error boundary
      return { default: () => <div>Component failed to load</div> };
    })
  );
};

/**
 * Cache API responses
 */
const cache = new Map();

export function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function setCachedData(key, data, ttl = 5 * 60 * 1000) { // 5 min default
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function clearCache(key) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Batch DOM updates
 */
export function batchDOMUpdates(updates) {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Monitor memory usage
 */
export function monitorMemory() {
  if (performance.memory && process.env.NODE_ENV === 'development') {
    const memory = performance.memory;
    console.log({
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
  // Setup lazy loading
  setupLazyLoading();

  // Prefetch critical resources
  prefetchCriticalResources();

  // Preload fonts
  preloadFonts();

  // Monitor memory in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(monitorMemory, 30000); // Every 30 seconds
  }
}

/**
 * Measure Core Web Vitals
 */
export function measureCoreWebVitals() {
  const vitals = {
    LCP: null,
    FID: null,
    CLS: null,
  };

  // LCP - Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.debug('LCP observer not supported');
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          vitals.FID = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.debug('FID observer not supported');
    }

    // CLS - Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            vitals.CLS = (vitals.CLS || 0) + entry.value;
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.debug('CLS observer not supported');
    }
  }

  return vitals;
}
