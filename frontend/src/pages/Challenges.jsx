/**
 * @file Challenges page component for EcoTrack.
 * Eco challenges with streak tracking, completion badges, and points.
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, Circle, Flame, Star, Leaf, Filter } from 'lucide-react';
import { ECO_CHALLENGES } from '../constants';

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Hard: 'bg-red-100 text-red-700 border-red-200',
};

const Challenges = React.memo(() => {
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem('ecotrack_challenges');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState('all');

  const toggleComplete = useCallback((id) => {
    setCompleted((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      try { localStorage.setItem('ecotrack_challenges', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const totalPoints = completed.reduce((sum, id) => {
    const challenge = ECO_CHALLENGES.find((c) => c.id === id);
    return sum + (challenge?.points || 0);
  }, 0);

  const streak = completed.length;

  const filtered = filter === 'all'
    ? ECO_CHALLENGES
    : filter === 'completed'
    ? ECO_CHALLENGES.filter((c) => completed.includes(c.id))
    : ECO_CHALLENGES.filter((c) => !completed.includes(c.id));

  return (
    <article className="px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-brand-accent" aria-hidden="true" />
            <h2 className="text-3xl font-black text-slate-900">Eco Challenges</h2>
          </div>
          <p className="text-slate-500 mb-10">Complete challenges to earn points and reduce your carbon footprint.</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <motion.div className="stat-card text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Star size={24} className="mx-auto text-brand-accent mb-2" aria-hidden="true" />
            <p className="text-3xl font-black text-slate-900">{totalPoints}</p>
            <p className="text-xs text-slate-500 font-medium">Points Earned</p>
          </motion.div>
          <motion.div className="stat-card text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Flame size={24} className="mx-auto text-orange-500 mb-2" aria-hidden="true" />
            <p className="text-3xl font-black text-slate-900">{streak}</p>
            <p className="text-xs text-slate-500 font-medium">Challenges Done</p>
          </motion.div>
          <motion.div className="stat-card text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Leaf size={24} className="mx-auto text-brand-primary mb-2" aria-hidden="true" />
            <p className="text-3xl font-black text-slate-900">{Math.round(completed.length / ECO_CHALLENGES.length * 100)}%</p>
            <p className="text-xs text-slate-500 font-medium">Completion Rate</p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8" role="tablist" aria-label="Challenge filter">
          <Filter size={16} className="text-slate-400" aria-hidden="true" />
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all focus-ring ${
                filter === f
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-white/60 text-slate-500 hover:bg-emerald-50 border border-emerald-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenge Cards */}
        <div className="space-y-4" role="list" aria-label="Eco challenges">
          {filtered.map((challenge, i) => {
            const done = completed.includes(challenge.id);
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`premium-card p-6 flex items-center gap-6 group cursor-pointer ${done ? 'bg-emerald-50/50 border-emerald-200/60' : ''}`}
                onClick={() => toggleComplete(challenge.id)}
                role="listitem"
                aria-label={`${challenge.title} - ${done ? 'completed' : 'not completed'}`}
              >
                <button
                  className="shrink-0 focus-ring rounded-full"
                  aria-label={done ? `Mark ${challenge.title} as incomplete` : `Mark ${challenge.title} as complete`}
                  aria-checked={done}
                  role="checkbox"
                >
                  {done ? (
                    <CheckCircle2 size={28} className="text-brand-primary" />
                  ) : (
                    <Circle size={28} className="text-slate-300 group-hover:text-brand-primary/50 transition-colors" />
                  )}
                </button>

                <div className="text-3xl shrink-0" aria-hidden="true">{challenge.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h4 className={`text-lg font-bold ${done ? 'text-brand-primary line-through' : 'text-slate-900'}`}>
                      {challenge.title}
                    </h4>
                    <span className={`category-badge ${DIFFICULTY_COLORS[challenge.difficulty]} border`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">{challenge.desc}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-brand-accent" aria-hidden="true" /> {challenge.points} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <Leaf size={12} className="text-brand-primary" aria-hidden="true" /> Saves {challenge.co2Saved}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p className="font-medium">No challenges match this filter.</p>
          </div>
        )}
      </div>
    </article>
  );
});

Challenges.displayName = 'Challenges';

export default Challenges;
