/**
 * @file Unit tests for shared utility functions.
 * Tests sanitization, debounce, calendar formatting, timestamps, clamping,
 * carbon calculations, and CO2 formatting.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sanitizeInput, debounce, formatGoogleCalendarDate, openGoogleCalendarEvent, getTimestamp, clamp, calculateCarbonFootprint, formatCO2, getCarbonRating } from '../utils/helpers';

describe('sanitizeInput', () => {
  it('removes script tags from input', () => {
    const dirty = '<script>alert("xss")</script>Hello';
    expect(sanitizeInput(dirty)).toBe('Hello');
  });

  it('preserves safe text content', () => {
    expect(sanitizeInput('How do I reduce my carbon footprint?')).toBe('How do I reduce my carbon footprint?');
  });

  it('handles empty strings', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('arg1');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('arg1');
  });

  it('resets the timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('first');
    vi.advanceTimersByTime(200);
    debounced('second');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('supports cancel method', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(300);

    expect(fn).not.toHaveBeenCalled();
  });
});

describe('formatGoogleCalendarDate', () => {
  it('formats a date string into gcal format', () => {
    const result = formatGoogleCalendarDate('Apr 22, 2025');
    expect(result).toBe('20250422T130000Z/20250422T235900Z');
  });

  it('handles single-digit months correctly', () => {
    const result = formatGoogleCalendarDate('Jun 05, 2025');
    expect(result).toBe('20250605T130000Z/20250605T235900Z');
  });
});

describe('getTimestamp', () => {
  it('returns a string in HH:MM format', () => {
    const ts = getTimestamp();
    expect(ts).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });
});

describe('clamp', () => {
  it('clamps values below minimum', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it('clamps values above maximum', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('returns value when within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('handles edge case where value equals min', () => {
    expect(clamp(0, 0, 100)).toBe(0);
  });

  it('handles edge case where value equals max', () => {
    expect(clamp(100, 0, 100)).toBe(100);
  });

  it('handles negative ranges', () => {
    expect(clamp(-50, -100, -10)).toBe(-50);
    expect(clamp(-200, -100, -10)).toBe(-100);
    expect(clamp(0, -100, -10)).toBe(-10);
  });
});

describe('openGoogleCalendarEvent', () => {
  let windowOpenSpy;

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('opens a new tab with a google calendar URL', () => {
    openGoogleCalendarEvent('Earth Day', '20250422T130000Z/20250422T235900Z');
    expect(windowOpenSpy).toHaveBeenCalledOnce();
    const [url, target, features] = windowOpenSpy.mock.calls[0];
    expect(url).toContain('calendar.google.com');
    expect(url).toContain('Earth+Day');
    expect(target).toBe('_blank');
    expect(features).toBe('noopener,noreferrer');
  });

  it('appends the EcoTrack suffix to the event title', () => {
    openGoogleCalendarEvent('World Environment Day', '20250605T130000Z/20250605T235900Z');
    const [url] = windowOpenSpy.mock.calls[0];
    expect(url).toContain('EcoTrack');
  });

  it('includes optional details in the URL when provided', () => {
    openGoogleCalendarEvent('Earth Day', '20250422T130000Z/20250422T235900Z', 'Plant a tree!');
    const [url] = windowOpenSpy.mock.calls[0];
    expect(url).toContain('Plant+a+tree');
  });
});

describe('calculateCarbonFootprint', () => {
  it('calculates total emissions from values and factors', () => {
    const values = { car_km: 100, bus_km: 50 };
    const factors = { car_km: 0.21, bus_km: 0.089 };
    const result = calculateCarbonFootprint(values, factors);
    expect(result).toBeCloseTo(100 * 0.21 + 50 * 0.089, 2);
  });

  it('returns 0 for empty values', () => {
    expect(calculateCarbonFootprint({}, {})).toBe(0);
  });

  it('handles missing factors gracefully', () => {
    const values = { unknown_key: 100 };
    const factors = {};
    expect(calculateCarbonFootprint(values, factors)).toBe(0);
  });

  it('handles string values by coercing to number', () => {
    const values = { car_km: '50' };
    const factors = { car_km: 0.21 };
    expect(calculateCarbonFootprint(values, factors)).toBeCloseTo(10.5, 2);
  });
});

describe('formatCO2', () => {
  it('formats small values in kg', () => {
    expect(formatCO2(250)).toBe('250 kg');
  });

  it('formats large values in tonnes', () => {
    expect(formatCO2(1500)).toBe('1.5 tonnes');
  });

  it('formats zero correctly', () => {
    expect(formatCO2(0)).toBe('0 kg');
  });

  it('formats exactly 1000 as tonnes', () => {
    expect(formatCO2(1000)).toBe('1.0 tonnes');
  });
});

describe('getCarbonRating', () => {
  it('returns Excellent for low emissions', () => {
    expect(getCarbonRating(100)).toBe('Excellent');
  });

  it('returns Good for moderate emissions', () => {
    expect(getCarbonRating(250)).toBe('Good');
  });

  it('returns Average for typical emissions', () => {
    expect(getCarbonRating(400)).toBe('Average');
  });

  it('returns High for excessive emissions', () => {
    expect(getCarbonRating(600)).toBe('High');
  });
});
