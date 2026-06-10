/**
 * @file Unit tests for the constants module.
 * Verifies the structure and integrity of all application-wide static data.
 */

import { describe, it, expect } from 'vitest';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  NAV_ITEMS,
  QUICK_QUESTIONS,
  CARBON_CATEGORIES,
  ECO_CHALLENGES,
  TIMELINE_EVENTS,
  QUIZ_QUESTIONS,
  CARBON_TIPS,
  EMISSION_FACTORS,
  MAX_QUERY_LENGTH,
} from '../constants';

describe('Application Constants', () => {
  describe('API Configuration', () => {
    it('has a valid API base URL', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
    });

    it('has properly formed API endpoints', () => {
      expect(API_ENDPOINTS.ASSISTANT).toContain('/api/assistant');
      expect(API_ENDPOINTS.CALCULATE).toContain('/api/calculate');
      expect(API_ENDPOINTS.HEALTH).toContain('/api/health');
    });

    it('has a reasonable max query length', () => {
      expect(MAX_QUERY_LENGTH).toBeGreaterThan(0);
      expect(MAX_QUERY_LENGTH).toBeLessThanOrEqual(1000);
    });
  });

  describe('Navigation Items', () => {
    it('has at least 5 navigation items', () => {
      expect(NAV_ITEMS.length).toBeGreaterThanOrEqual(5);
    });

    it('each nav item has required properties', () => {
      NAV_ITEMS.forEach((item) => {
        expect(item).toHaveProperty('path');
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('iconName');
        expect(item.path).toMatch(/^\//);
      });
    });

    it('home path is the root route', () => {
      const home = NAV_ITEMS.find((item) => item.label === 'Home');
      expect(home.path).toBe('/');
    });

    it('includes an AI Assistant item', () => {
      const assistant = NAV_ITEMS.find((item) => item.label === 'AI Assistant');
      expect(assistant).toBeDefined();
      expect(assistant.special).toBe(true);
    });
  });

  describe('Carbon Categories', () => {
    it('has exactly 4 categories', () => {
      expect(CARBON_CATEGORIES).toHaveLength(4);
    });

    it('each category has required properties', () => {
      CARBON_CATEGORIES.forEach((cat) => {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('title');
        expect(cat).toHaveProperty('icon');
        expect(cat).toHaveProperty('fields');
        expect(Array.isArray(cat.fields)).toBe(true);
        expect(cat.fields.length).toBeGreaterThan(0);
      });
    });

    it('each field has key, label, unit, and factor', () => {
      CARBON_CATEGORIES.forEach((cat) => {
        cat.fields.forEach((field) => {
          expect(field).toHaveProperty('key');
          expect(field).toHaveProperty('label');
          expect(field).toHaveProperty('unit');
          expect(field).toHaveProperty('factor');
          expect(field.factor).toBeGreaterThan(0);
        });
      });
    });

    it('covers all four emission sectors', () => {
      const ids = CARBON_CATEGORIES.map((c) => c.id);
      expect(ids).toContain('transport');
      expect(ids).toContain('energy');
      expect(ids).toContain('food');
      expect(ids).toContain('shopping');
    });
  });

  describe('Emission Factors', () => {
    it('has at least 10 emission factors', () => {
      expect(Object.keys(EMISSION_FACTORS).length).toBeGreaterThanOrEqual(10);
    });

    it('all factors are positive numbers', () => {
      Object.values(EMISSION_FACTORS).forEach((factor) => {
        expect(factor).toBeGreaterThan(0);
      });
    });
  });

  describe('Eco Challenges', () => {
    it('has at least 6 challenges', () => {
      expect(ECO_CHALLENGES.length).toBeGreaterThanOrEqual(6);
    });

    it('each challenge has required properties', () => {
      ECO_CHALLENGES.forEach((c) => {
        expect(c).toHaveProperty('id');
        expect(c).toHaveProperty('title');
        expect(c).toHaveProperty('desc');
        expect(c).toHaveProperty('points');
        expect(c).toHaveProperty('category');
        expect(c).toHaveProperty('difficulty');
        expect(c).toHaveProperty('co2Saved');
        expect(c.points).toBeGreaterThan(0);
      });
    });

    it('has unique IDs', () => {
      const ids = ECO_CHALLENGES.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('Timeline Events', () => {
    it('has at least 5 events', () => {
      expect(TIMELINE_EVENTS.length).toBeGreaterThanOrEqual(5);
    });

    it('each event has required fields', () => {
      TIMELINE_EVENTS.forEach((event) => {
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('title');
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('status');
        expect(['Completed', 'Ongoing', 'Upcoming']).toContain(event.status);
      });
    });

    it('includes Earth Day', () => {
      const earthDay = TIMELINE_EVENTS.find((e) => e.title === 'Earth Day');
      expect(earthDay).toBeDefined();
    });
  });

  describe('Quiz Questions', () => {
    it('has at least 4 questions', () => {
      expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(4);
    });

    it('each question has exactly 4 options', () => {
      QUIZ_QUESTIONS.forEach((q) => {
        expect(q.options).toHaveLength(4);
      });
    });

    it('answer index is within options range', () => {
      QUIZ_QUESTIONS.forEach((q) => {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      });
    });

    it('each question has an explanation', () => {
      QUIZ_QUESTIONS.forEach((q) => {
        expect(q.explanation).toBeTruthy();
        expect(q.explanation.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Quick Questions', () => {
    it('has at least 3 quick questions', () => {
      expect(QUICK_QUESTIONS.length).toBeGreaterThanOrEqual(3);
    });

    it('each question is a non-empty string', () => {
      QUICK_QUESTIONS.forEach((q) => {
        expect(typeof q).toBe('string');
        expect(q.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Carbon Tips', () => {
    it('has at least 6 tips', () => {
      expect(CARBON_TIPS.length).toBeGreaterThanOrEqual(6);
    });

    it('each tip has category, tip text, and impact', () => {
      CARBON_TIPS.forEach((t) => {
        expect(t).toHaveProperty('category');
        expect(t).toHaveProperty('tip');
        expect(t).toHaveProperty('impact');
        expect(['high', 'medium', 'low']).toContain(t.impact);
      });
    });
  });
});
