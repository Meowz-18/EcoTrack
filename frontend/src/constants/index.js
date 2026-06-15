/**
 * @file Application-wide constants and configuration.
 * Centralizes all static data, API endpoints, and configuration values
 * to ensure maintainability and single-source-of-truth across the codebase.
 *
 * Emission factors are sourced from:
 * - IPCC AR6 WG3 (2023) — Transport & energy emission intensities
 * - US EPA GHG Equivalencies Calculator — Food & consumer goods factors
 * @see https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator
 */

/** @constant {string} API base URL for the EcoTrack backend */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/** @constant {Object} API endpoint paths */
export const API_ENDPOINTS = Object.freeze({
  ASSISTANT: `${API_BASE_URL}/api/assistant`,
  CALCULATE: `${API_BASE_URL}/api/calculate`,
  HEALTH: `${API_BASE_URL}/api/health`,
});

/** @constant {number} Debounce delay in milliseconds for user input */
export const DEBOUNCE_DELAY_MS = 300;

/** @constant {number} Max character length for assistant queries */
export const MAX_QUERY_LENGTH = 500;

/** @constant {Object} Navigation items for the main layout */
export const NAV_ITEMS = Object.freeze([
  { path: '/', label: 'Home', iconName: 'Home' },
  { path: '/dashboard', label: 'Dashboard', iconName: 'BarChart3' },
  { path: '/calculator', label: 'Calculator', iconName: 'Calculator' },
  { path: '/challenges', label: 'Challenges', iconName: 'Trophy' },
  { path: '/timeline', label: 'Timeline', iconName: 'Calendar' },
  { path: '/assistant', label: 'AI Assistant', iconName: 'MessageSquare', special: true },
]);

/** @constant {Array} Quick-action questions for the AI assistant */
export const QUICK_QUESTIONS = Object.freeze([
  'How can I reduce my carbon footprint?',
  'What is the carbon impact of driving?',
  'How does diet affect emissions?',
  'What are carbon offsets?',
]);

/** @constant {Object} Carbon emission factors (kg CO2 per unit) */
export const EMISSION_FACTORS = Object.freeze({
  car_km: 0.21,
  bus_km: 0.089,
  train_km: 0.041,
  flight_km: 0.255,
  electricity_kwh: 0.42,
  natural_gas_kwh: 0.18,
  beef_kg: 27.0,
  chicken_kg: 6.9,
  vegetables_kg: 2.0,
  dairy_kg: 3.2,
  clothing_item: 10.0,
  electronics_item: 50.0,
});

/** @constant {Array} Carbon calculator categories */
export const CARBON_CATEGORIES = Object.freeze([
  {
    id: 'transport',
    title: 'Transportation',
    icon: 'Car',
    color: 'blue',
    gradient: 'from-blue-500/10 to-sky-500/10',
    fields: [
      { key: 'transport_car_km', label: 'Car (km/week)', unit: 'km', factor: 0.21 },
      { key: 'transport_bus_km', label: 'Bus (km/week)', unit: 'km', factor: 0.089 },
      { key: 'transport_train_km', label: 'Train (km/week)', unit: 'km', factor: 0.041 },
      { key: 'transport_flight_km', label: 'Flights (km/month)', unit: 'km', factor: 0.255 },
    ],
  },
  {
    id: 'energy',
    title: 'Home Energy',
    icon: 'Zap',
    color: 'amber',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    fields: [
      { key: 'energy_electricity_kwh', label: 'Electricity (kWh/month)', unit: 'kWh', factor: 0.42 },
      { key: 'energy_gas_kwh', label: 'Natural Gas (kWh/month)', unit: 'kWh', factor: 0.18 },
    ],
  },
  {
    id: 'food',
    title: 'Food & Diet',
    icon: 'Utensils',
    color: 'emerald',
    gradient: 'from-emerald-500/10 to-green-500/10',
    fields: [
      { key: 'food_beef_kg', label: 'Beef (kg/week)', unit: 'kg', factor: 27.0 },
      { key: 'food_chicken_kg', label: 'Chicken (kg/week)', unit: 'kg', factor: 6.9 },
      { key: 'food_vegetables_kg', label: 'Vegetables (kg/week)', unit: 'kg', factor: 2.0 },
      { key: 'food_dairy_kg', label: 'Dairy (kg/week)', unit: 'kg', factor: 3.2 },
    ],
  },
  {
    id: 'shopping',
    title: 'Shopping',
    icon: 'ShoppingBag',
    color: 'purple',
    gradient: 'from-purple-500/10 to-violet-500/10',
    fields: [
      { key: 'shopping_clothing', label: 'Clothing items/month', unit: 'items', factor: 10.0 },
      { key: 'shopping_electronics', label: 'Electronics/year', unit: 'items', factor: 50.0 },
    ],
  },
]);

/** @constant {Array} Eco challenges with points and descriptions */
export const ECO_CHALLENGES = Object.freeze([
  { id: 1, title: 'Meatless Monday', desc: 'Go vegetarian for one full day each week.', points: 50, category: 'food', icon: '🥗', difficulty: 'Easy', co2Saved: '6.5 kg/week' },
  { id: 2, title: 'Bike Commuter', desc: 'Replace car trips with cycling for a week.', points: 80, category: 'transport', icon: '🚲', difficulty: 'Medium', co2Saved: '10.5 kg/week' },
  { id: 3, title: 'Energy Saver', desc: 'Reduce electricity usage by 20% this month.', points: 100, category: 'energy', icon: '💡', difficulty: 'Medium', co2Saved: '25 kg/month' },
  { id: 4, title: 'Zero Waste Week', desc: 'Produce no non-recyclable waste for 7 days.', points: 120, category: 'shopping', icon: '♻️', difficulty: 'Hard', co2Saved: '15 kg/week' },
  { id: 5, title: 'Local Food Hero', desc: 'Buy only locally-sourced food for two weeks.', points: 70, category: 'food', icon: '🌽', difficulty: 'Medium', co2Saved: '8 kg/week' },
  { id: 6, title: 'Public Transit Pro', desc: 'Use only public transport for a month.', points: 150, category: 'transport', icon: '🚌', difficulty: 'Hard', co2Saved: '45 kg/month' },
  { id: 7, title: 'Cold Shower Challenge', desc: 'Take cold showers for one week to save energy.', points: 60, category: 'energy', icon: '🚿', difficulty: 'Easy', co2Saved: '3 kg/week' },
  { id: 8, title: 'Digital Detox', desc: 'Reduce screen time by 50% for a week.', points: 40, category: 'energy', icon: '📵', difficulty: 'Easy', co2Saved: '2 kg/week' },
]);

/** @constant {Array} Environmental timeline milestones */
export const TIMELINE_EVENTS = Object.freeze([
  { date: 'Mar 22, 2025', title: 'World Water Day', type: 'Awareness', status: 'Completed', gradient: 'from-blue-400/5 to-sky-500/5', color: 'blue' },
  { date: 'Apr 22, 2025', title: 'Earth Day', type: 'Global', status: 'Completed', gradient: 'from-emerald-400/5 to-green-500/5', color: 'emerald' },
  { date: 'Jun 05, 2025', title: 'World Environment Day', type: 'Global', status: 'Ongoing', gradient: 'from-brand-primary/10 to-emerald-500/10', color: 'emerald' },
  { date: 'Sep 16, 2025', title: 'International Day for the Preservation of the Ozone Layer', type: 'Science', status: 'Upcoming', gradient: 'from-sky-400/5 to-blue-500/5', color: 'sky' },
  { date: 'Sep 22, 2025', title: 'World Car-Free Day', type: 'Action', status: 'Upcoming', gradient: 'from-purple-400/5 to-violet-500/5', color: 'purple' },
  { date: 'Nov 10, 2025', title: 'COP30 Climate Summit', type: 'Critical', status: 'Upcoming', gradient: 'from-brand-accent/10 to-orange-500/10', color: 'amber' },
  { date: 'Dec 31, 2025', title: 'Year-End Carbon Review', type: 'Personal', status: 'Upcoming', gradient: 'from-rose-400/5 to-pink-500/5', color: 'rose' },
]);

/** @constant {Array} Quiz questions for carbon literacy */
export const QUIZ_QUESTIONS = Object.freeze([
  {
    id: 1,
    question: 'Which food has the highest carbon footprint per kilogram?',
    options: ['Chicken', 'Beef', 'Rice', 'Potatoes'],
    answer: 1,
    explanation: 'Beef produces approximately 27 kg of CO2 per kilogram, making it one of the most carbon-intensive foods.',
  },
  {
    id: 2,
    question: 'What percentage of global emissions comes from transportation?',
    options: ['5%', '16%', '35%', '50%'],
    answer: 1,
    explanation: 'Transportation accounts for about 16% of global greenhouse gas emissions, with road vehicles being the largest contributor.',
  },
  {
    id: 3,
    question: 'How much CO2 does a single transatlantic flight produce per passenger?',
    options: ['100 kg', '500 kg', '1,000 kg', '5,000 kg'],
    answer: 2,
    explanation: 'A round-trip transatlantic flight produces approximately 1,000 kg (1 tonne) of CO2 per passenger.',
  },
  {
    id: 4,
    question: 'Which home action saves the most energy?',
    options: ['Turning off lights', 'Improving insulation', 'Unplugging chargers', 'Using cold water for laundry'],
    answer: 1,
    explanation: 'Improving home insulation can reduce heating energy by up to 45%, making it the most impactful home energy action.',
  },
  {
    id: 5,
    question: 'How many trees does it take to offset one person\'s annual carbon footprint?',
    options: ['5 trees', '15 trees', '50 trees', '200+ trees'],
    answer: 3,
    explanation: 'The average person produces about 4.5 tonnes of CO2 per year. Since a tree absorbs about 22 kg/year, it takes approximately 200+ trees.',
  },
]);

/** @constant {Array} Personalized carbon reduction tips */
export const CARBON_TIPS = Object.freeze([
  { category: 'transport', tip: 'Walking or cycling for trips under 3 km can save up to 0.6 kg CO2 per trip.', impact: 'high' },
  { category: 'transport', tip: 'Carpooling with just one other person halves your per-person transport emissions.', impact: 'high' },
  { category: 'food', tip: 'Replacing beef with chicken just once a week saves about 20 kg CO2 per month.', impact: 'high' },
  { category: 'food', tip: 'Buying seasonal produce reduces food-related emissions by up to 10%.', impact: 'medium' },
  { category: 'energy', tip: 'Switching to LED bulbs reduces lighting energy by up to 80%.', impact: 'medium' },
  { category: 'energy', tip: 'Lowering your thermostat by 1°C saves approximately 300 kg CO2 per year.', impact: 'high' },
  { category: 'shopping', tip: 'Buying second-hand clothing reduces your fashion carbon footprint by up to 82%.', impact: 'high' },
  { category: 'shopping', tip: 'Repairing electronics instead of replacing them saves about 50 kg CO2 per device.', impact: 'medium' },
]);

// ---------------------------------------------------------------------------
// Extracted from page components for single-source-of-truth
// ---------------------------------------------------------------------------

/** @constant {Object} Category color mappings for Dashboard charts */
export const CATEGORY_COLORS = Object.freeze({
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#10b981',
  shopping: '#8b5cf6',
});

/** @constant {Object} Difficulty badge color classes for Challenges page */
export const DIFFICULTY_COLORS = Object.freeze({
  Easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Hard: 'bg-red-100 text-red-700 border-red-200',
});

/** @constant {Object} Tailwind color class mappings for Landing feature cards */
export const FEATURE_COLOR_CLASSES = Object.freeze({
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  teal: 'bg-teal-50 text-teal-600 border-teal-200',
});

/** @constant {Object} Quick-fill preset values for the Carbon Calculator */
export const CALCULATOR_PRESETS = Object.freeze({
  transport_car_km: [
    { label: 'Low (50 km)', value: 50 },
    { label: 'Avg (150 km)', value: 150 },
    { label: 'High (400 km)', value: 400 },
  ],
  transport_bus_km: [
    { label: 'Low (10 km)', value: 10 },
    { label: 'Avg (50 km)', value: 50 },
  ],
  transport_train_km: [
    { label: 'Low (20 km)', value: 20 },
    { label: 'Avg (200 km)', value: 200 },
  ],
  transport_flight_km: [
    { label: 'Short (500 km)', value: 500 },
    { label: 'Long (5000 km)', value: 5000 },
  ],
  energy_electricity_kwh: [
    { label: 'Flat (150 kWh)', value: 150 },
    { label: 'House (450 kWh)', value: 450 },
  ],
  energy_gas_kwh: [
    { label: 'Flat (80 kWh)', value: 80 },
    { label: 'House (300 kWh)', value: 300 },
  ],
  food_beef_kg: [
    { label: 'Low (0.5 kg)', value: 0.5 },
    { label: 'Avg (2 kg)', value: 2 },
  ],
  food_chicken_kg: [
    { label: 'Low (0.5 kg)', value: 0.5 },
    { label: 'Avg (2 kg)', value: 2 },
  ],
  food_vegetables_kg: [
    { label: 'Low (1 kg)', value: 1 },
    { label: 'Avg (4 kg)', value: 4 },
  ],
  food_dairy_kg: [
    { label: 'Low (0.5 kg)', value: 0.5 },
    { label: 'Avg (2 kg)', value: 2 },
  ],
  shopping_clothing: [
    { label: 'Rare (1 item)', value: 1 },
    { label: 'Avg (4 items)', value: 4 },
  ],
  shopping_electronics: [
    { label: 'Rare (1 item)', value: 1 },
    { label: 'Avg (3 items)', value: 3 },
  ],
});
