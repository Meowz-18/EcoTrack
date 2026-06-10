/**
 * @file Unit tests for performance monitoring utilities.
 * Validates that Web Vitals measurement functions exist and behave correctly.
 */

import { describe, it, expect, vi } from 'vitest';
import { measureLCP, measureCLS, measureFCP, measureTTFB, reportWebVitals } from '../utils/performance';

describe('Performance Utilities', () => {
  it('measureLCP is a function that returns a cleanup function', () => {
    const onReport = vi.fn();
    const cleanup = measureLCP(onReport);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('measureCLS is a function that returns a cleanup function', () => {
    const onReport = vi.fn();
    const cleanup = measureCLS(onReport);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('measureFCP is a function that returns a cleanup function', () => {
    const onReport = vi.fn();
    const cleanup = measureFCP(onReport);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('measureTTFB is a function', () => {
    expect(typeof measureTTFB).toBe('function');
  });

  it('reportWebVitals returns a cleanup function', () => {
    const onReport = vi.fn();
    const cleanup = reportWebVitals(onReport);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('reportWebVitals handles non-function argument gracefully', () => {
    const cleanup = reportWebVitals(null);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('reportWebVitals handles undefined argument gracefully', () => {
    const cleanup = reportWebVitals(undefined);
    expect(typeof cleanup).toBe('function');
    cleanup();
  });
});
