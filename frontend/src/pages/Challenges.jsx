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
      try { 
        localStorage.setItem('ecotrack_challenges', JSON.stringify(next)); 
      } catch (e) {
        console.warn('Could not save challenge completion state:', e);
      }
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
    <article className="px-6 md:px-12 lg:px-20 pt-12 pb-24 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-sm">
              <Trophy size={20} className="text-amber-700 animate-pulse" aria-hidden="true" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Eco Challenges</h2>
          </div>
          <p className="text-slate-500 font-medium">Earn points, build streaks, and verify your positive environmental actions.</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <motion.div className="stat-card text-center flex flex-col items-center justify-center py-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
              <Star size={18} className="text-amber-700" aria-hidden="true" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{totalPoints}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Points Earned</p>
          </motion.div>
          
          <motion.div className="stat-card text-center flex flex-col items-center justify-center py-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
              <Flame size={18} className="text-orange-600" aria-hidden="true" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{streak}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Challenges Done</p>
          </motion.div>
          
          <motion.div className="stat-card text-center flex flex-col items-center justify-center py-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
              <Leaf size={18} className="text-emerald-700" aria-hidden="true" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{Math.round(completed.length / ECO_CHALLENGES.length * 100)}%</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Completion Rate</p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white/30 backdrop-blur-md border border-white/50 rounded-full w-fit mb-10 shadow-sm" role="tablist" aria-label="Challenge filter">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all focus-ring ${
                filter === f
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-emerald-800'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Challenge Cards */}
        <div className="space-y-5" role="list" aria-label="Eco challenges">
          {filtered.map((challenge, i) => {
            const done = completed.includes(challenge.id);
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className={`premium-card p-6 md:p-8 flex items-start gap-5 group cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ${done ? 'bg-emerald-500/5 border-emerald-500/20' : ''}`}
                onClick={() => toggleComplete(challenge.id)}
                role="listitem"
                aria-label={`${challenge.title} - ${done ? 'completed' : 'not completed'}`}
              >
                <button
                  className="shrink-0 focus-ring rounded-full mt-1.5 transition-transform group-hover:scale-105"
                  aria-label={done ? `Mark ${challenge.title} as incomplete` : `Mark ${challenge.title} as complete`}
                  aria-checked={done}
                  role="checkbox"
                >
                  {done ? (
                    <CheckCircle2 size={26} className="text-emerald-600" />
                  ) : (
                    <Circle size={26} className="text-slate-300 group-hover:text-emerald-500/50 transition-colors" />
                  )}
                </button>

                <div className="text-3xl shrink-0 p-3 bg-white/50 backdrop-blur-sm border border-emerald-100/55 rounded-2xl shadow-sm transition-transform group-hover:scale-110" aria-hidden="true">{challenge.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <h3 className={`text-lg font-black tracking-tight transition-colors ${done ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-emerald-800'}`}>
                      {challenge.title}
                    </h3>
                    <span className={`category-badge text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[challenge.difficulty]} border`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{challenge.desc}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Star size={13} className="text-amber-500 fill-amber-500" aria-hidden="true" /> {challenge.points} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <Leaf size={13} className="text-emerald-600" aria-hidden="true" /> Saves {challenge.co2Saved}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white/30 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-sm max-w-md mx-auto">
            <Trophy size={48} className="mx-auto mb-4 text-slate-350" aria-hidden="true" />
            <p className="font-black text-slate-700">No challenges match this filter.</p>
            <p className="text-sm text-slate-400 mt-1 px-6">Try toggling different filter states above to see more challenges.</p>
          </div>
        )}
      </div>
    </article>
  );
});

Challenges.displayName = 'Challenges';

export default Challenges;
