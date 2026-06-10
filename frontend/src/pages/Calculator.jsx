/**
 * @file Calculator page component for EcoTrack.
 * Interactive multi-step carbon footprint calculator with category inputs.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, Zap, Utensils, ShoppingBag, ChevronRight, ChevronLeft, Check, RotateCcw, BarChart3, Save } from 'lucide-react';
import { useCarbon } from '../hooks/useCarbon';
import { CARBON_CATEGORIES } from '../constants';
import { formatCO2 } from '../utils/helpers';

const iconMap = { Car, Zap, Utensils, ShoppingBag };

const CalculatorPage = React.memo(() => {
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { values, updateValue, resetValues, saveToHistory, getBreakdown } = useCarbon();

  const currentCategory = CARBON_CATEGORIES[step];
  const breakdown = getBreakdown();
  const Icon = iconMap[currentCategory?.icon] || Car;

  const handleNext = () => {
    if (step < CARBON_CATEGORIES.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    resetValues();
    setStep(0);
    setShowResults(false);
  };

  const handleSave = () => {
    saveToHistory();
  };

  return (
    <article className="px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-black text-slate-900 mb-2">Carbon Calculator</h2>
          <p className="text-slate-500 mb-10">Calculate your carbon footprint across 4 categories.</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-10" role="progressbar" aria-valuenow={showResults ? 100 : ((step + 1) / CARBON_CATEGORIES.length) * 100} aria-valuemin="0" aria-valuemax="100" aria-label="Calculator progress">
          <div className="flex justify-between text-xs text-slate-500 font-medium mb-2">
            {CARBON_CATEGORIES.map((cat, i) => (
              <span key={cat.id} className={`${i <= step || showResults ? 'text-brand-primary font-bold' : ''}`} aria-current={i === step && !showResults ? 'step' : undefined}>
                {cat.title}
              </span>
            ))}
          </div>
          <div className="eco-progress">
            <div
              className="eco-progress-bar"
              style={{ width: showResults ? '100%' : `${((step + 1) / CARBON_CATEGORIES.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Header */}
              <div className="premium-card p-8 mb-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentCategory.gradient} flex items-center justify-center mb-6`}>
                  <Icon size={28} className="text-slate-700" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentCategory.title}</h3>
                <p className="text-slate-500">Enter your typical usage for this category.</p>

                {/* Input Fields */}
                <div className="mt-8 space-y-6">
                  {currentCategory.fields.map((field) => (
                    <div key={field.key}>
                      <label htmlFor={field.key} className="block text-sm font-bold text-slate-700 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          id={field.key}
                          type="number"
                          min="0"
                          step="any"
                          value={values[field.key] || ''}
                          onChange={(e) => updateValue(field.key, e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/80 text-slate-900 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-slate-300"
                          aria-describedby={`${field.key}-factor`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">{field.unit}</span>
                      </div>
                      <p id={`${field.key}-factor`} className="text-xs text-slate-400 mt-1">
                        Emission factor: {field.factor} kg CO₂/{field.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="btn-secondary !px-6 !py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous category"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                  Back
                </button>
                <span className="text-sm text-slate-400 font-medium">{step + 1} of {CARBON_CATEGORIES.length}</span>
                <button
                  onClick={handleNext}
                  className="btn-primary !px-6 !py-3"
                  aria-label={step < CARBON_CATEGORIES.length - 1 ? 'Next category' : 'See results'}
                >
                  {step < CARBON_CATEGORIES.length - 1 ? 'Next' : 'See Results'}
                  {step < CARBON_CATEGORIES.length - 1 ? <ChevronRight size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {/* Results Card */}
              <div className="premium-card p-8 mb-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-leaf mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                  <Check size={36} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Carbon Footprint</h3>
                <p className="text-5xl font-black text-gradient my-6">{formatCO2(breakdown.total)}</p>
                <p className="text-slate-500">CO₂ emissions per period</p>

                {/* Category Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {[
                    { label: 'Transport', value: breakdown.transport, color: '#3b82f6', icon: Car },
                    { label: 'Energy', value: breakdown.energy, color: '#f59e0b', icon: Zap },
                    { label: 'Food', value: breakdown.food, color: '#10b981', icon: Utensils },
                    { label: 'Shopping', value: breakdown.shopping, color: '#8b5cf6', icon: ShoppingBag },
                  ].map((cat) => (
                    <div key={cat.label} className="p-4 bg-white/60 rounded-xl border border-emerald-100">
                      <cat.icon size={20} className="mx-auto mb-2" style={{ color: cat.color }} aria-hidden="true" />
                      <p className="text-xs text-slate-500 font-medium">{cat.label}</p>
                      <p className="text-lg font-bold text-slate-900">{formatCO2(cat.value)}</p>
                    </div>
                  ))}
                </div>

                {/* Comparison */}
                <div className="mt-8 p-6 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-slate-500 font-medium mb-3">How you compare</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-600">Your footprint</span>
                        <span className="text-brand-primary">{formatCO2(breakdown.total)}</span>
                      </div>
                      <div className="eco-progress !h-2">
                        <div className="eco-progress-bar" style={{ width: `${Math.min((breakdown.total / 600) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-600">Target</span>
                        <span className="text-emerald-500">200 kg</span>
                      </div>
                      <div className="eco-progress !h-2">
                        <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${(200 / 600) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-600">Global Average</span>
                        <span className="text-amber-500">400 kg</span>
                      </div>
                      <div className="eco-progress !h-2">
                        <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{ width: `${(400 / 600) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={handleSave} className="btn-primary !px-6 !py-3">
                  <Save size={18} aria-hidden="true" />
                  Save Entry
                </button>
                <Link to="/dashboard" className="btn-secondary !px-6 !py-3">
                  <BarChart3 size={18} aria-hidden="true" />
                  View Dashboard
                </Link>
                <button onClick={handleReset} className="btn-secondary !px-6 !py-3 !text-slate-500">
                  <RotateCcw size={18} aria-hidden="true" />
                  Recalculate
                </button>
                <button onClick={handleBack} className="btn-secondary !px-6 !py-3 !text-slate-500">
                  <ChevronLeft size={18} aria-hidden="true" />
                  Edit Values
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
});

CalculatorPage.displayName = 'CalculatorPage';

export default CalculatorPage;
