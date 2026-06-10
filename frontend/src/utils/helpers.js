/**
 * @file Shared utility functions for the EcoTrack application.
 * Provides reusable helpers for formatting, sanitization, carbon calculations, and performance.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes a string to prevent XSS attacks.
 * @param {string} dirty - The untrusted input string.
 * @returns {string} The sanitized string.
 */
export const sanitizeInput = (dirty) => DOMPurify.sanitize(dirty);

/**
 * Creates a debounced version of a function.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};

/**
 * Formats a date string into a Google Calendar-compatible date range string.
 * @param {string} dateStr - A parseable date string (e.g. "Apr 22, 2025").
 * @returns {string} The formatted date string for gcal URL.
 */
export const formatGoogleCalendarDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T130000Z/${yyyy}${mm}${dd}T235900Z`;
};

/**
 * Opens a Google Calendar event creation page in a new tab.
 * @param {string} title - The event title.
 * @param {string} dates - The gcal-formatted date range string.
 * @param {string} [details=''] - Optional event details/description.
 */
export const openGoogleCalendarEvent = (title, dates, details = '') => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${title} - EcoTrack`,
    dates,
    details,
  });
  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank', 'noopener,noreferrer');
};

/**
 * Generates a human-readable timestamp string.
 * @returns {string} The formatted time (e.g. "10:30 AM").
 */
export const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * Clamps a number between a min and max value.
 * @param {number} value - The number to clamp.
 * @param {number} min - Minimum bound.
 * @param {number} max - Maximum bound.
 * @returns {number} The clamped value.
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Calculates carbon footprint for a single category from activity values.
 * @param {Object} values - Key-value pairs of activity amounts.
 * @param {Object} factors - Emission factors per activity.
 * @returns {number} Total CO2 in kg, rounded to 2 decimals.
 */
export const calculateCarbonFootprint = (values, factors) => {
  const total = Object.entries(values).reduce((sum, [key, amount]) => {
    const factor = factors[key] || 0;
    return sum + (Number(amount) || 0) * factor;
  }, 0);
  return Math.round(total * 100) / 100;
};

/**
 * Formats a CO2 value into a human-readable string.
 * @param {number} kgCO2 - Amount of CO2 in kilograms.
 * @returns {string} Formatted string (e.g. "2.5 tonnes" or "450 kg").
 */
export const formatCO2 = (kgCO2) => {
  if (kgCO2 >= 1000) {
    return `${(kgCO2 / 1000).toFixed(1)} tonnes`;
  }
  return `${Math.round(kgCO2)} kg`;
};

/**
 * Returns a rating label based on monthly CO2 in kg.
 * @param {number} monthlyKg - Monthly CO2 emissions in kg.
 * @returns {string} Rating: 'Excellent', 'Good', 'Average', or 'High'.
 */
export const getCarbonRating = (monthlyKg) => {
  if (monthlyKg <= 150) return 'Excellent';
  if (monthlyKg <= 300) return 'Good';
  if (monthlyKg <= 500) return 'Average';
  return 'High';
};
