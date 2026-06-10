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
    <article className="px-6 md:px-12 lg:px-20 pt-12 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-sm">
              <Leaf size={20} className="text-emerald-750" aria-hidden="true" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Carbon Dashboard</h2>
          </div>
          <p className="text-slate-500 font-medium">Your personal carbon footprint overview, history, and tailored reduction recommendations.</p>
        </motion.div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div className="stat-card flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Total Emissions</p>
              <p className="text-4xl font-black text-emerald-900 tracking-tight">{formatCO2(breakdown.total)}</p>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3">CO₂ equivalent per month</p>
          </motion.div>

          <motion.div className="stat-card flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Rating</p>
              <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${ratingColors[rating]}`}>
                {rating}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3">Based on targets and averages</p>
          </motion.div>

          <motion.div className="stat-card flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">vs Global Average</p>
              <div className="flex items-center gap-2">
                {breakdown.total < 400 ? (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-700">
                    <TrendingDown size={18} aria-hidden="true" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-700">
                    <TrendingUp size={18} aria-hidden="true" />
                  </div>
                )}
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                  {breakdown.total > 0 ? `${Math.round((breakdown.total / 400) * 100)}%` : '—'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-3">of 400 kg/month benchmark</p>
          </motion.div>

          <motion.div className="stat-card flex flex-col justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Entries Logged</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">{history.length}</p>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Pie Chart - Category Breakdown */}
          <motion.div className="premium-card p-8 md:p-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Emissions Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} kg CO₂`} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: 15 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Target size={40} className="mb-3 text-slate-300" aria-hidden="true" />
                <p className="font-bold">No data yet</p>
                <p className="text-sm text-center max-w-xs mt-1">Use the calculator page to track your lifestyle emissions.</p>
              </div>
            )}
          </motion.div>

          {/* Bar Chart - Comparison */}
          <motion.div className="premium-card p-8 md:p-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">How You Compare</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={comparisonData} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fontWeight: 500 }} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12, fontWeight: 700 }} />
                <Tooltip formatter={(value) => `${value} kg CO₂`} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={26}>
                  {comparisonData.map((entry, i) => (
                    <Cell key={`bar-${i}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Category Detail Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(CATEGORY_COLORS).map(([cat, color], i) => {
            const Icon = CATEGORY_ICONS[cat];
            return (
              <motion.div
                key={cat}
                className="premium-card p-6.5 text-center relative overflow-hidden group hover:scale-[1.03] transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: color + '15' }}>
                  <Icon size={22} style={{ color }} aria-hidden="true" />
                </div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 capitalize">{cat}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCO2(breakdown[cat])}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Personalized Tips */}
        {relevantTips.length > 0 && (
          <motion.section
            className="premium-card p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            aria-labelledby="tips-heading"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-sm">
                <Award size={20} className="text-amber-700" aria-hidden="true" />
              </div>
              <h3 id="tips-heading" className="text-xl font-black text-slate-800 tracking-tight">Tailored Reduction Tips</h3>
            </div>
            <div className="space-y-4">
              {relevantTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-5 p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 mt-0.5">
                    <Leaf size={16} className="text-emerald-700" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-bold text-base leading-relaxed">{tip.tip}</p>
                    <span className={`inline-flex items-center mt-3 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      tip.impact === 'high' ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-250/20' : 'bg-blue-150/80 text-blue-800 border border-blue-250/20'
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
