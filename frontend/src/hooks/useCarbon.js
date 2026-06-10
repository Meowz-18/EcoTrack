/**
 * @file Custom hook for managing carbon footprint tracking data.
 * Encapsulates carbon data state management, localStorage persistence,
 * and category breakdown calculations into a reusable hook.
 */

import { useState, useCallback, useEffect } from 'react';
import { EMISSION_FACTORS } from '../constants';
import { calculateCarbonFootprint } from '../utils/helpers';

const STORAGE_KEY = 'ecotrack_carbon_data';

/**
 * Default empty activity values.
 * @returns {Object}
 */
const getDefaultValues = () => ({
  transport_car_km: 0,
  transport_bus_km: 0,
  transport_train_km: 0,
  transport_flight_km: 0,
  energy_electricity_kwh: 0,
  energy_gas_kwh: 0,
  food_beef_kg: 0,
  food_chicken_kg: 0,
  food_vegetables_kg: 0,
  food_dairy_kg: 0,
  shopping_clothing: 0,
  shopping_electronics: 0,
});

/**
 * Loads persisted carbon data from localStorage.
 * @returns {Object} Saved data or defaults.
 */
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        values: { ...getDefaultValues(), ...parsed.values },
        history: Array.isArray(parsed.history) ? parsed.history : [],
      };
    }
  } catch {
    // Ignore corrupt data
  }
  return { values: getDefaultValues(), history: [] };
};

/**
 * Custom hook for the EcoTrack carbon tracking functionality.
 * @returns {Object} Carbon state and handler functions.
 */
export const useCarbon = () => {
  const [values, setValues] = useState(() => loadFromStorage().values);
  const [history, setHistory] = useState(() => loadFromStorage().history);

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ values, history }));
    } catch {
      // Storage full or unavailable
    }
  }, [values, history]);

  /**
   * Updates a single activity value.
   * @param {string} key - The activity key.
   * @param {number} amount - The new amount value.
   */
  const updateValue = useCallback((key, amount) => {
    setValues((prev) => ({
      ...prev,
      [key]: Math.max(0, Number(amount) || 0),
    }));
  }, []);

  /**
   * Resets all values to zero.
   */
  const resetValues = useCallback(() => {
    setValues(getDefaultValues());
  }, []);

  /**
   * Computes the per-category breakdown of CO2 emissions.
   * @returns {Object} Breakdown with transport, energy, food, shopping totals.
   */
  const getBreakdown = useCallback(() => {
    const transport = calculateCarbonFootprint(
      {
        car_km: values.transport_car_km,
        bus_km: values.transport_bus_km,
        train_km: values.transport_train_km,
        flight_km: values.transport_flight_km,
      },
      EMISSION_FACTORS
    );
    const energy = calculateCarbonFootprint(
      {
        electricity_kwh: values.energy_electricity_kwh,
        natural_gas_kwh: values.energy_gas_kwh,
      },
      EMISSION_FACTORS
    );
    const food = calculateCarbonFootprint(
      {
        beef_kg: values.food_beef_kg,
        chicken_kg: values.food_chicken_kg,
        vegetables_kg: values.food_vegetables_kg,
        dairy_kg: values.food_dairy_kg,
      },
      EMISSION_FACTORS
    );
    const shopping = calculateCarbonFootprint(
      {
        clothing_item: values.shopping_clothing,
        electronics_item: values.shopping_electronics,
      },
      EMISSION_FACTORS
    );

    return {
      transport: Math.round(transport * 100) / 100,
      energy: Math.round(energy * 100) / 100,
      food: Math.round(food * 100) / 100,
      shopping: Math.round(shopping * 100) / 100,
      total: Math.round((transport + energy + food + shopping) * 100) / 100,
    };
  }, [values]);

  /**
   * Saves the current values as a historical entry.
   */
  const saveToHistory = useCallback(() => {
    const breakdown = getBreakdown();
    const entry = {
      date: new Date().toISOString(),
      values: { ...values },
      total: breakdown.total,
    };
    setHistory((prev) => [...prev.slice(-11), entry]); // keep last 12 entries
  }, [values, getBreakdown]);

  return {
    values,
    history,
    updateValue,
    resetValues,
    saveToHistory,
    getBreakdown,
  };
};
