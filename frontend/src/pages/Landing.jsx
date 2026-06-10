/**
 * @file Landing page component for EcoTrack.
 * Hero section with animated stats, feature cards, and call-to-action.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, BarChart3, Calculator, Trophy, Calendar, MessageSquare, ArrowRight, TrendingDown, Users, Globe } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Carbon Dashboard', desc: 'Visualize your emissions with interactive charts and trends.', path: '/dashboard', color: 'emerald' },
  { icon: Calculator, title: 'Smart Calculator', desc: 'Calculate your footprint across transport, food, energy & shopping.', path: '/calculator', color: 'blue' },
  { icon: Trophy, title: 'Eco Challenges', desc: 'Complete challenges, earn points, and build green streaks.', path: '/challenges', color: 'amber' },
  { icon: Calendar, title: 'Green Timeline', desc: 'Track environmental milestones with Google Calendar sync.', path: '/timeline', color: 'purple' },
  { icon: MessageSquare, title: 'AI Eco Assistant', desc: 'Get personalized tips from our Gemini-powered AI assistant.', path: '/assistant', color: 'teal' },
];

const stats = [
  { icon: TrendingDown, value: '4.5t', label: 'Avg Annual Footprint', suffix: 'CO₂/person' },
  { icon: Users, value: '10K+', label: 'Active Trackers', suffix: 'users' },
  { icon: Globe, value: '200+', label: 'Trees Equivalent', suffix: 'to offset you' },
];

const colorClasses = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  teal: 'bg-teal-50 text-teal-600 border-teal-200',
};

const Landing = React.memo(() => {
  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 lg:px-20 pt-20 pb-24 overflow-hidden" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-black mb-8 border border-emerald-500/20 shadow-sm">
                <Leaf size={14} className="text-emerald-600 animate-pulse" aria-hidden="true" />
                <span>POWERED BY GOOGLE GEMINI AI</span>
              </div>
              
              <h2 id="hero-heading" className="text-5xl md:text-6xl lg:text-7.5xl font-extrabold tracking-tight text-slate-900 leading-[1.02] mb-6 font-display">
                Track Your <br />
                <span className="font-serif italic font-normal text-gradient pr-2">Carbon</span>
                <span className="text-gradient-accent">Footprint</span>
              </h2>
              
              <p className="text-xl text-slate-600 max-w-lg mb-10 leading-relaxed mx-auto lg:mx-0">
                Understand your environmental impact, discover personalized reduction strategies, and join a community committed to a greener future.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/calculator" className="btn-primary text-lg !px-10 !py-4 shadow-emerald-600/30">
                  <Calculator size={20} aria-hidden="true" />
                  Calculate Now
                </Link>
                <Link to="/assistant" className="btn-secondary text-lg !px-10 !py-4">
                  <MessageSquare size={20} aria-hidden="true" />
                  Ask AI Assistant
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative max-w-lg w-full rounded-[2.5rem] p-3.5 bg-white/20 backdrop-blur-xl border border-white/50 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img 
                  src="/hero_banner.png" 
                  alt="EcoTrack Carbon Footprint Concept - Forest with footprint-shaped lakes" 
                  className="w-full h-auto object-cover rounded-[2rem] shadow-md transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute bottom-7 left-7 right-7 p-5 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl text-left shadow-lg">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">Challenge 3 Entry</p>
                  <h4 className="text-lg font-black text-white leading-snug">Carbon Footprint Awareness Platform</h4>
                  <p className="text-xs text-slate-300 mt-1">Reducing footprint through simple actions & AI-driven insights.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="px-6 md:px-12 lg:px-20 py-14 bg-white/20 backdrop-blur-xl border-y border-white/30" aria-label="Platform Statistics">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <stat.icon size={22} className="text-emerald-700" aria-hidden="true" />
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-sm text-slate-500 font-bold mt-1">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.suffix}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-12 lg:px-20 py-24" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 id="features-heading" className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Everything You Need to <span className="text-gradient">Go Green</span>
            </h3>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A comprehensive toolkit to understand, measure, and reduce your environmental impact.
            </p>
          </div>

          <div className="bento-grid">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                <Link to={feature.path} className="block premium-card p-8.5 h-full group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                  <div className={`w-14 h-14 rounded-2xl ${colorClasses[feature.color]} border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon size={24} aria-hidden="true" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-800 transition-colors">{feature.title}</h4>
                  <p className="text-slate-500 leading-relaxed mb-6 text-sm">{feature.desc}</p>
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs group-hover:gap-3 transition-all uppercase tracking-wider">
                    <span>Explore Platform</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 lg:px-20 py-24" aria-labelledby="cta-heading">
        <div className="max-w-5xl mx-auto text-center rounded-[3rem] p-12 md:p-16 bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]" />
          
          <h3 id="cta-heading" className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 relative z-10">
            Start Your Green Journey Today
          </h3>
          <p className="text-emerald-200 text-lg mb-10 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
            Every small action counts. Calculate your carbon footprint, take on eco challenges, and make a real difference for our planet.
          </p>
          <div className="relative z-10">
            <Link to="/calculator" className="inline-flex items-center gap-3 px-12 py-5 bg-white text-emerald-900 rounded-2xl font-extrabold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all">
              <Calculator size={22} aria-hidden="true" />
              Get Started Free
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-20 py-12 bg-slate-950 text-slate-500 text-sm text-center border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-emerald-500" />
            <span className="font-bold text-white text-lg tracking-tight">EcoTrack</span>
          </div>
          <p className="text-xs md:text-sm">Built with ❤️ for a greener planet • Powered by Google Gemini AI & Firebase</p>
          <p className="text-xs font-bold text-emerald-500/80 tracking-widest">#BUILDWITHAI #PROMPTWARSVIRTUAL</p>
        </div>
      </footer>
    </article>
  );
});

Landing.displayName = 'Landing';

export default Landing;
