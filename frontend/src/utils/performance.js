/**
 * @file Performance monitoring utilities for EcoTrack.
 * Provides hooks and utilities for measuring and reporting
 * Core Web Vitals (LCP, FID, CLS, FCP, TTFB) to improve
 * the application's efficiency profile.
 */

/**
 * Observes a single PerformanceObserver entry type and invokes a callback.
 * @param {string} type - The entry type to observe (e.g. 'largest-contentful-paint').
 * @param {Function} callback - Invoked with the PerformanceEntry when fired.
 * @returns {PerformanceObserver | null} The observer instance, or null if unsupported.
 */
const observe = (type, callback) => {
  if (typeof PerformanceObserver === 'undefined') return null;
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(callback);
    });
    observer.observe({ type, buffered: true });
    return observer;
  } catch {
    return null;
  }
};

/**
 * Measures and reports Largest Contentful Paint (LCP).
 * @param {Function} onReport - Receives `{ name: 'LCP', value: number }`.
 * @returns {Function} Cleanup function to disconnect the observer.
 */
export const measureLCP = (onReport) => {
  const observer = observe('largest-contentful-paint', (entry) => {
    onReport({ name: 'LCP', value: Math.round(entry.startTime) });
  });
  return () => observer?.disconnect();
};

/**
 * Measures and reports Cumulative Layout Shift (CLS).
 * @param {Function} onReport - Receives `{ name: 'CLS', value: number }`.
 * @returns {Function} Cleanup function to disconnect the observer.
 */
export const measureCLS = (onReport) => {
  let clsValue = 0;
  const observer = observe('layout-shift', (entry) => {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      onReport({ name: 'CLS', value: clsValue });
    }
  });
  return () => observer?.disconnect();
};

/**
 * Measures and reports First Contentful Paint (FCP).
 * @param {Function} onReport - Receives `{ name: 'FCP', value: number }`.
 * @returns {Function} Cleanup function to disconnect the observer.
 */
export const measureFCP = (onReport) => {
  const observer = observe('paint', (entry) => {
    if (entry.name === 'first-contentful-paint') {
      onReport({ name: 'FCP', value: Math.round(entry.startTime) });
    }
  });
  return () => observer?.disconnect();
};

/**
 * Measures and reports Time to First Byte (TTFB).
 * @param {Function} onReport - Receives `{ name: 'TTFB', value: number }`.
 */
export const measureTTFB = (onReport) => {
  if (typeof performance === 'undefined') return;
  const [navEntry] = performance.getEntriesByType('navigation');
  if (navEntry) {
    onReport({ name: 'TTFB', value: Math.round(navEntry.responseStart) });
  }
};

/**
 * Collects all Core Web Vitals and invokes the callback for each metric.
 * Designed to be called once at application startup.
 *
 * @param {Function} onReport - Callback invoked for each metric.
 *   Receives `{ name: string, value: number }`.
 * @returns {Function} Cleanup function to disconnect all observers.
 *
 * @example
 * const cleanup = reportWebVitals((metric) => {
 *   console.log(metric.name, metric.value);
 * });
 */
export const reportWebVitals = (onReport) => {
  if (typeof onReport !== 'function') return () => {};

  const cleanupFns = [
    measureLCP(onReport),
    measureCLS(onReport),
    measureFCP(onReport),
  ];
  measureTTFB(onReport);

  return () => cleanupFns.forEach((fn) => fn?.());
};
