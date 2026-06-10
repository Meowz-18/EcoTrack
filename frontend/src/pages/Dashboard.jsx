/**
 * @file Dashboard page component for EcoTrack.
 * Displays personal carbon footprint overview, charts, trends, and comparison to averages.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingDown, TrendingUp, Leaf, Car, Zap, Utensils, ShoppingBag, Target, Award } from 'lucide-react';
import { useCarbon } from '../hooks/useCarbon';
import { formatCO2, getCarbonRating } from '../utils/helpers';
import { CARBON_TIPS } from '../constants';

const CATEGORY_COLORS = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#10b981',
  shopping: '#8b5cf6',
};

const CATEGORY_ICONS = {
  transport: Car,
  energy: Zap,
  food: Utensils,
  shopping: ShoppingBag,
};

const Dashboard = React.memo(() => {
  const { history, getBreakdown } = useCarbon();
  const breakdown = getBreakdown();
  const rating = getCarbonRating(breakdown.total);

  const pieData = [
    { name: 'Transport', value: breakdown.transport, color: CATEGORY_COLORS.transport },
    { name: 'Energy', value: breakdown.energy, color: CATEGORY_COLORS.energy },
    { name: 'Food', value: breakdown.food, color: CATEGORY_COLORS.food },
    { name: 'Shopping', value: breakdown.shopping, color: CATEGORY_COLORS.shopping },
  ].filter(d => d.value > 0);

  const comparisonData = [
    { name: 'You', value: breakdown.total, fill: '#065f46' },
    { name: 'Target', value: 200, fill: '#10b981' },
    { name: 'Global Avg', value: 400, fill: '#f59e0b' },
  ];

  const historyData = history.slice(-6).map((entry, i) => ({
    name: `Entry ${i + 1}`,
    total: entry.total,
  }));

  const ratingColors = {
    'Excellent': 'text-emerald-600 bg-emerald-50 border-emerald-200',
    'Good': 'text-blue-600 bg-blue-50 border-blue-200',
    'Average': 'text-amber-600 bg-amber-50 border-amber-200',
    'High': 'text-red-600 bg-red-50 border-red-200',
  };

  // Select relevant tips
  const topCategory = Object.entries(breakdown)
    .filter(([k]) => k !== 'total')
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'transport';
  const relevantTips = CARBON_TIPS.filter(t => t.category === topCategory).slice(0, 2);

  return (
    <article className="px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Leaf size={28} className="text-brand-primary" aria-hidden="true" />
            <h2 className="text-3xl font-black text-slate-900">Carbon Dashboard</h2>
          </div>
          <p className="text-slate-500 mb-10">Your personal carbon footprint overview and trends.</p>
        </motion.div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Emissions</p>
            <p className="text-3xl font-black text-slate-900">{formatCO2(breakdown.total)}</p>
            <p className="text-xs text-slate-400 mt-1">CO₂ per period</p>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <p className="text-sm text-slate-500 font-medium mb-1">Rating</p>
            <p className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${ratingColors[rating]}`}>
              {rating}
            </p>
            <p className="text-xs text-slate-400 mt-2">Based on monthly average</p>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-sm text-slate-500 font-medium mb-1">vs Global Average</p>
            <div className="flex items-center gap-2">
              {breakdown.total < 400 ? (
                <TrendingDown size={20} className="text-emerald-500" aria-hidden="true" />
              ) : (
                <TrendingUp size={20} className="text-red-500" aria-hidden="true" />
              )}
              <p className="text-2xl font-black text-slate-900">
                {breakdown.total > 0 ? `${Math.round((breakdown.total / 400) * 100)}%` : '—'}
              </p>
            </div>
            <p className="text-xs text-slate-400 mt-1">of 400 kg/month avg</p>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <p className="text-sm text-slate-500 font-medium mb-1">Entries Logged</p>
            <p className="text-3xl font-black text-slate-900">{history.length}</p>
            <p className="text-xs text-slate-400 mt-1">tracking sessions</p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Pie Chart - Category Breakdown */}
          <motion.div className="premium-card p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-lg font-bold text-slate-900 mb-6">Emissions Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} kg CO₂`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Target size={40} className="mb-3" aria-hidden="true" />
                <p className="font-medium">No data yet</p>
                <p className="text-sm">Use the Calculator to log your first entry.</p>
              </div>
            )}
          </motion.div>

          {/* Bar Chart - Comparison */}
          <motion.div className="premium-card p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h3 className="text-lg font-bold text-slate-900 mb-6">How You Compare</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 13, fontWeight: 600 }} />
                <Tooltip formatter={(value) => `${value} kg CO₂`} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                  {comparisonData.map((entry, i) => (
                    <Cell key={`bar-${i}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Category Detail Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
            const Icon = CATEGORY_ICONS[cat];
            return (
              <motion.div
                key={cat}
                className="premium-card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                  <Icon size={22} style={{ color }} aria-hidden="true" />
                </div>
                <p className="text-xs text-slate-500 font-medium capitalize mb-1">{cat}</p>
                <p className="text-xl font-black text-slate-900">{formatCO2(breakdown[cat])}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Personalized Tips */}
        {relevantTips.length > 0 && (
          <motion.section
            className="premium-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            aria-labelledby="tips-heading"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award size={22} className="text-brand-accent" aria-hidden="true" />
              <h3 id="tips-heading" className="text-lg font-bold text-slate-900">Personalized Tips</h3>
            </div>
            <div className="space-y-4">
              {relevantTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <Leaf size={18} className="text-brand-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-slate-700 font-medium">{tip.tip}</p>
                    <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                      tip.impact === 'high' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tip.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </article>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
