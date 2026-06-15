/**
 * @file Calculator page component for EcoTrack.
 * Interactive multi-step carbon footprint calculator with category inputs.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Car, Zap, Utensils, ShoppingBag, ChevronRight, ChevronLeft, Check, RotateCcw, BarChart3, Save } from 'lucide-react';
import { useCarbon } from '../hooks/useCarbon';
import { CARBON_CATEGORIES, CALCULATOR_PRESETS } from '../constants';
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
    <article className="px-6 md:px-12 lg:px-20 pt-12 pb-24 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center md:text-left mb-10"
        >
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Carbon Calculator</h2>
          <p className="text-slate-500 font-medium">Measure your environmental impact across key lifestyle categories.</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12" role="progressbar" aria-valuenow={showResults ? 100 : ((step + 1) / CARBON_CATEGORIES.length) * 100} aria-valuemin="0" aria-valuemax="100" aria-label="Calculator progress">
          <div className="flex justify-between text-xs text-slate-500 font-bold mb-3 px-1">
            {CARBON_CATEGORIES.map((cat, i) => (
              <span key={cat.id} className={`${i <= step || showResults ? 'text-emerald-700 font-black' : 'text-slate-400'}`} aria-current={i === step && !showResults ? 'step' : undefined}>
                {cat.title}
              </span>
            ))}
          </div>
          <div className="eco-progress !h-2.5 shadow-inner bg-slate-200/50 backdrop-blur-sm border border-white/20">
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
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Category Header */}
              <div className="premium-card p-8 md:p-10 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentCategory.gradient} flex items-center justify-center mb-6 shadow-md border border-white/30`}>
                  <Icon size={28} className="text-emerald-800" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{currentCategory.title}</h3>
                <p className="text-slate-500 font-medium text-sm">Fill in your monthly consumption details below.</p>

                {/* Input Fields */}
                <div className="mt-8 space-y-6">
                  {currentCategory.fields.map((field) => (
                    <div key={field.key} className="group/field">
                      <label htmlFor={field.key} className="block text-sm font-bold text-slate-700 mb-2 group-hover/field:text-emerald-800 transition-colors">
                        {field.label}
                      </label>
                      <div className="relative rounded-2xl bg-white/40 border border-emerald-200/50 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white transition-all duration-300">
                        <input
                          id={field.key}
                          type="number"
                          min="0"
                          step="any"
                          value={values[field.key] || ''}
                          onChange={(e) => updateValue(field.key, e.target.value)}
                          placeholder="0"
                          className="w-full pl-5 pr-16 py-4 rounded-2xl bg-transparent text-slate-900 font-bold text-lg focus:outline-none placeholder:text-slate-300"
                          aria-describedby={`${field.key}-factor`}
                        />
                      </div>
                      {CALCULATOR_PRESETS[field.key] && (
                        <div className="flex flex-wrap gap-1.5 mt-3 mb-1" role="group" aria-label={`Quick values for ${field.key}`}>
                          {CALCULATOR_PRESETS[field.key].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => updateValue(field.key, preset.value)}
                              className="px-3.5 py-1 text-xs font-black rounded-full bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-800 border border-emerald-500/20 transition-all cursor-pointer focus-ring hover:scale-[1.03]"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <p id={`${field.key}-factor`} className="text-xs text-slate-400 mt-2 ml-1">
                        Emission factor: <span className="font-semibold text-slate-500">{field.factor} kg CO₂</span> per {field.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="btn-secondary !px-7 !py-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Previous category"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                  Back
                </button>
                <span className="text-sm text-slate-400 font-extrabold tracking-wide">{step + 1} / {CARBON_CATEGORIES.length}</span>
                <button
                  onClick={handleNext}
                  className="btn-primary !px-7 !py-3.5 shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
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
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              {/* Results Card */}
              <div className="premium-card p-10 md:p-12 mb-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/25 border border-white/20">
                  <Check size={36} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Your Carbon Footprint</h3>
                <p className="text-slate-500 font-medium text-sm">Estimated carbon emissions based on your inputs</p>
                
                <div className="my-8 relative inline-block">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                  <p className="text-6xl md:text-7xl font-black text-gradient relative z-10 tracking-tight my-2">
                    {formatCO2(breakdown.total)}
                  </p>
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-8">CO₂ equivalent per month</p>

                {/* Category Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Transport', value: breakdown.transport, color: '#3b82f6', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-700', icon: Car },
                    { label: 'Energy', value: breakdown.energy, color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-700', icon: Zap },
                    { label: 'Food', value: breakdown.food, color: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700', icon: Utensils },
                    { label: 'Shopping', value: breakdown.shopping, color: '#8b5cf6', bg: 'bg-purple-500/10 border-purple-500/20 text-purple-700', icon: ShoppingBag },
                  ].map((cat) => (
                    <div key={cat.label} className="p-5 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`w-10 h-10 rounded-xl ${cat.bg} border flex items-center justify-center mx-auto mb-3`}>
                        <cat.icon size={18} aria-hidden="true" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{cat.label}</p>
                      <p className="text-xl font-black text-slate-800 mt-1">{formatCO2(cat.value)}</p>
                    </div>
                  ))}
                </div>

                {/* Comparison */}
                <div className="mt-10 p-6 md:p-8 bg-emerald-500/5 backdrop-blur-md rounded-[2rem] border border-emerald-500/10 text-left">
                  <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 text-center md:text-left">How you compare</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-600">Your Carbon Output</span>
                        <span className="text-emerald-800">{formatCO2(breakdown.total)}</span>
                      </div>
                      <div className="eco-progress !h-2.5 bg-slate-200/50 border border-white/20">
                        <div className="eco-progress-bar" style={{ width: `${Math.min((breakdown.total / 600) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-600">Sustainability Target</span>
                        <span className="text-emerald-600">200 kg CO₂</span>
                      </div>
                      <div className="eco-progress !h-2.5 bg-slate-200/50 border border-white/20">
                        <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(200 / 600) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-600">Global Average Per Person</span>
                        <span className="text-amber-600">400 kg CO₂</span>
                      </div>
                      <div className="eco-progress !h-2.5 bg-slate-200/50 border border-white/20">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${(400 / 600) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={handleSave} className="btn-primary !px-7 !py-4 shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]">
                  <Save size={18} aria-hidden="true" />
                  Save Entry
                </button>
                <Link to="/dashboard" className="btn-secondary !px-7 !py-4 hover:scale-[1.02] active:scale-[0.98]">
                  <BarChart3 size={18} aria-hidden="true" />
                  View Dashboard
                </Link>
                <button onClick={handleReset} className="btn-secondary !px-7 !py-4 !text-slate-500 hover:scale-[1.02] active:scale-[0.98]">
                  <RotateCcw size={18} aria-hidden="true" />
                  Recalculate
                </button>
                <button onClick={handleBack} className="btn-secondary !px-7 !py-4 !text-slate-500 hover:scale-[1.02] active:scale-[0.98]">
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
