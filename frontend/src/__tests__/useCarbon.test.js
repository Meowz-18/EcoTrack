/**
 * @file Unit tests for the useCarbon custom hook.
 * Tests carbon data state management, calculations, and localStorage.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCarbon } from '../hooks/useCarbon';

describe('useCarbon Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with zero values', () => {
    const { result } = renderHook(() => useCarbon());
    expect(result.current.values.transport_car_km).toBe(0);
    expect(result.current.values.food_beef_kg).toBe(0);
    expect(result.current.values.energy_electricity_kwh).toBe(0);
  });

  it('initializes with empty history', () => {
    const { result } = renderHook(() => useCarbon());
    expect(result.current.history).toEqual([]);
  });

  it('updates a value correctly', () => {
    const { result } = renderHook(() => useCarbon());
    act(() => {
      result.current.updateValue('transport_car_km', 100);
    });
    expect(result.current.values.transport_car_km).toBe(100);
  });

  it('prevents negative values', () => {
    const { result } = renderHook(() => useCarbon());
    act(() => {
      result.current.updateValue('transport_car_km', -50);
    });
    expect(result.current.values.transport_car_km).toBe(0);
  });

  it('handles string inputs by coercing to number', () => {
    const { result } = renderHook(() => useCarbon());
    act(() => {
      result.current.updateValue('transport_car_km', '75');
    });
    expect(result.current.values.transport_car_km).toBe(75);
  });

  it('resets all values to zero', () => {
    const { result } = renderHook(() => useCarbon());
    act(() => {
      result.current.updateValue('transport_car_km', 100);
      result.current.updateValue('food_beef_kg', 5);
    });
    act(() => {
      result.current.resetValues();
    });
    expect(result.current.values.transport_car_km).toBe(0);
    expect(result.current.values.food_beef_kg).toBe(0);
  });

  it('calculates breakdown correctly', () => {
    const { result } = renderHook(() => useCarbon());
    act(() => {
      result.current.updateValue('transport_car_km', 100);
    });
    const breakdown = result.current.getBreakdown();
    expect(breakdown.transport).toBeCloseTo(100 * 0.21, 1);
    expect(breakdown.total).toBeGreaterThan(0);
  });

  it('returns zero breakdown for empty values', () => {
    const { result } = renderHook(() => useCarbon());
    const breakdown = result.current.getBreakdown();
    expect(breakdown.total).toBe(0);
    expect(breakdown.transport).toBe(0);
    expect(breakdown.energy).toBe(0);
    expect(breakdown.food).toBe(0);
    expect(breakdown.shopping).toBe(0);
  });

  it('saves to history', () => {
    const { result } = renderHook(() => useCarbon());
    act(() => {
      result.current.updateValue('transport_car_km', 50);
    });
    act(() => {
      result.current.saveToHistory();
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].total).toBeGreaterThan(0);
    expect(result.current.history[0].date).toBeDefined();
  });

  it('persists data to localStorage', () => {
    const { result } = renderHook(() => useCarbon());
    act(() => {
      result.current.updateValue('transport_car_km', 100);
    });
    const stored = JSON.parse(localStorage.getItem('ecotrack_carbon_data'));
    expect(stored.values.transport_car_km).toBe(100);
  });

  it('loads data from localStorage on init', () => {
    localStorage.setItem('ecotrack_carbon_data', JSON.stringify({
      values: { transport_car_km: 200 },
      history: [],
    }));
    const { result } = renderHook(() => useCarbon());
    expect(result.current.values.transport_car_km).toBe(200);
  });

  it('handles corrupt localStorage gracefully', () => {
    localStorage.setItem('ecotrack_carbon_data', 'not-json');
    const { result } = renderHook(() => useCarbon());
    expect(result.current.values.transport_car_km).toBe(0);
  });

  it('limits history to 12 entries', () => {
    const { result } = renderHook(() => useCarbon());
    for (let i = 0; i < 15; i++) {
      act(() => {
        result.current.updateValue('transport_car_km', i * 10);
      });
      act(() => {
        result.current.saveToHistory();
      });
    }
    expect(result.current.history.length).toBeLessThanOrEqual(12);
  });
});
