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
      <section className="relative px-6 md:px-12 lg:px-20 pt-16 pb-20 overflow-hidden" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-700 text-sm font-bold mb-6 border border-emerald-200/60">
                <Leaf size={16} aria-hidden="true" />
                <span>Powered by Google Gemini AI</span>
              </div>
              
              <h2 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
                Track Your <br />
                <span className="text-gradient">Carbon</span>{' '}
                <span className="text-gradient-accent">Footprint</span>
              </h2>
              
              <p className="text-xl text-slate-500 max-w-lg mb-10 leading-relaxed mx-auto lg:mx-0">
                Understand your environmental impact, discover personalized reduction strategies, and join a community committed to a greener future.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/calculator" className="btn-primary text-lg !px-10 !py-4">
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-200 via-teal-100 to-green-50 animate-pulse-glow" />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-leaf flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <div className="text-center text-white">
                    <Leaf size={64} className="mx-auto mb-3 animate-float" aria-hidden="true" />
                    <p className="text-4xl font-black">EcoTrack</p>
                    <p className="text-emerald-200 text-sm font-medium mt-1">Carbon Awareness</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="px-6 md:px-12 lg:px-20 py-12 bg-white/30 backdrop-blur-md border-y border-emerald-100/40" aria-label="Platform Statistics">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <stat.icon size={28} className="mx-auto text-brand-primary mb-3" aria-hidden="true" />
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.suffix}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-12 lg:px-20 py-20" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 id="features-heading" className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link to={feature.path} className="block premium-card p-8 h-full group">
                  <div className={`w-14 h-14 rounded-2xl ${colorClasses[feature.color]} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon size={24} aria-hidden="true" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                  <p className="text-slate-500 leading-relaxed mb-4">{feature.desc}</p>
                  <div className="flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-12 lg:px-20 py-20 bg-gradient-to-br from-brand-primary to-emerald-800" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h3 id="cta-heading" className="text-3xl md:text-4xl font-black text-white mb-6">
            Start Your Green Journey Today
          </h3>
          <p className="text-emerald-200 text-lg mb-10 max-w-2xl mx-auto">
            Every small action counts. Calculate your carbon footprint, take on eco challenges, and make a real difference for our planet.
          </p>
          <Link to="/calculator" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-brand-primary rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">
            <Calculator size={22} aria-hidden="true" />
            Get Started Free
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-20 py-8 bg-slate-900 text-slate-400 text-sm text-center">
        <p>Built with ❤️ for a greener planet • Powered by Google Gemini AI & Firebase</p>
        <p className="mt-2 text-slate-500">#BuildwithAI #PromptWarsVirtual</p>
      </footer>
    </article>
  );
});

Landing.displayName = 'Landing';

export default Landing;
